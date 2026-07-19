'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { DashboardShell } from '@/components/DashboardShell';
import { getToken } from '@/lib/auth';
import { acquireInterviewMedia } from '@/lib/interviewMedia';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

type SessionStatus = 'IN_PROGRESS' | 'COMPLETED' | 'ABANDONED';

interface SessionState {
  id: string;
  template: string;
  status: SessionStatus;
  startedAt: string;
  endsAt: string;
  serverNow: string;
  timeExpired: boolean;
  currentQuestionIndex: number;
  totalQuestions: number;
  currentQuestion: string | null;
  verdict: 'SELECT' | 'REJECT' | 'BORDERLINE' | null;
  overallScore: number | null;
  summaryJson: string | null;
  reportDetail: string | null;
}

interface SubmitAnswerResponse extends SessionState {
  lastTurn?: {
    score: number;
    feedback: string;
    keyPointsMissing: string[];
  };
  completed: boolean;
}

type Phase = 'intro' | 'connecting' | 'live' | 'uploading' | 'done' | 'error';

function pickRecorderMime(): string | undefined {
  if (typeof MediaRecorder === 'undefined') return undefined;
  const candidates = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4'];
  for (const t of candidates) {
    if (MediaRecorder.isTypeSupported(t)) return t;
  }
  return undefined;
}

export default function InterviewPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const lastSpokenQuestionRef = useRef<string | null>(null);

  const [phase, setPhase] = useState<Phase>('intro');
  const [error, setError] = useState<string | null>(null);
  const [session, setSession] = useState<SessionState | null>(null);
  const [remainingSec, setRemainingSec] = useState<number>(0);
  const [isRecording, setIsRecording] = useState(false);
  const [lastFeedback, setLastFeedback] = useState<string | null>(null);
  const [textAnswer, setTextAnswer] = useState('');
  const [summaryParsed, setSummaryParsed] = useState<Record<string, unknown> | null>(null);
  const [hasVideoTrack, setHasVideoTrack] = useState(false);
  const [mediaNotices, setMediaNotices] = useState<string[]>([]);
  /** True when API returned 401 — show login link. */
  const [needRelogin, setNeedRelogin] = useState(false);
  /** Avoid hydration mismatch: `getToken()` is always null on the server. */
  const [hasMounted, setHasMounted] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [speechSupported, setSpeechSupported] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showQuestionText, setShowQuestionText] = useState(false);

  const syncTimer = useCallback((endsAt: string) => {
    const end = new Date(endsAt).getTime();
    setRemainingSec(Math.max(0, Math.floor((end - Date.now()) / 1000)));
  }, []);

  useEffect(() => {
    if (!session || session.status !== 'IN_PROGRESS') return;
    const tick = () => syncTimer(session.endsAt);
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [session, syncTimer]);

  useEffect(() => {
    setHasMounted(true);
    setSpeechSupported('speechSynthesis' in window && 'SpeechSynthesisUtterance' in window);
  }, []);

  useEffect(() => {
    return () => {
      mediaStreamRef.current?.getTracks().forEach((t) => t.stop());
      window.speechSynthesis?.cancel();
    };
  }, []);

  const speakQuestion = useCallback(
    (question: string, force = false) => {
      if ((!voiceEnabled && !force) || !question) return;
      if (!('speechSynthesis' in window) || !('SpeechSynthesisUtterance' in window)) {
        setSpeechSupported(false);
        setShowQuestionText(true);
        return;
      }

      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(question);
      utterance.lang = 'en-US';
      utterance.rate = 0.95;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => {
        setIsSpeaking(false);
        setShowQuestionText(true);
      };
      lastSpokenQuestionRef.current = question;
      window.speechSynthesis.speak(utterance);
    },
    [voiceEnabled],
  );

  useEffect(() => {
    const question = session?.currentQuestion;
    if (
      phase === 'live' &&
      voiceEnabled &&
      question &&
      lastSpokenQuestionRef.current !== question
    ) {
      speakQuestion(question);
    }
  }, [phase, session?.currentQuestion, speakQuestion, voiceEnabled]);

  useEffect(() => {
    const v = videoRef.current;
    const stream = mediaStreamRef.current;
    if (!v || !stream || (phase !== 'live' && phase !== 'uploading')) return;
    if (stream.getVideoTracks().length > 0) {
      v.srcObject = stream;
      void v.play().catch(() => undefined);
    } else {
      v.srcObject = null;
    }
  }, [phase, session?.id, hasVideoTrack]);

  const stopMedia = () => {
    mediaStreamRef.current?.getTracks().forEach((t) => t.stop());
    mediaStreamRef.current = null;
    window.speechSynthesis?.cancel();
    setIsSpeaking(false);
    if (videoRef.current) videoRef.current.srcObject = null;
  };

  const startInterview = async () => {
    setError(null);
    setNeedRelogin(false);
    const token = getToken();
    if (!token) {
      setNeedRelogin(true);
      setError('You are not logged in.');
      setPhase('error');
      return;
    }

    setPhase('connecting');
    setMediaNotices([]);
    try {
      // Validate JWT with the API before asking for mic/camera (clearer errors, no wasted prompts).
      const res = await fetch(`${API_URL}/interview/sessions`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });

      const data = (await res.json().catch(() => ({}))) as SessionState & { error?: string };

      if (res.status === 401) {
        setNeedRelogin(true);
        throw new Error(
          'Your session is invalid or expired. Log in again. If you recently changed JWT_SECRET in apps/api/.env, old tokens no longer work.',
        );
      }

      if (!res.ok) {
        throw new Error(data.error || `Could not start session (${res.status})`);
      }

      const { stream, hasVideo, notices } = await acquireInterviewMedia();
      mediaStreamRef.current = stream;
      setHasVideoTrack(hasVideo);
      setMediaNotices(notices);

      setSession(data);
      syncTimer(data.endsAt);
      setPhase('live');
      setLastFeedback(null);
      setTextAnswer('');
      setShowQuestionText(false);
      lastSpokenQuestionRef.current = null;
    } catch (e) {
      stopMedia();
      setHasVideoTrack(false);
      setMediaNotices([]);
      const msg = e instanceof Error ? e.message : 'Failed to start interview';
      setError(msg);
      setPhase('error');
    }
  };

  const startRecording = () => {
    const stream = mediaStreamRef.current;
    if (!stream) return;

    window.speechSynthesis?.cancel();
    setIsSpeaking(false);
    const audioOnly = new MediaStream(stream.getAudioTracks());
    chunksRef.current = [];
    const mime = pickRecorderMime();
    const rec = mime
      ? new MediaRecorder(audioOnly, { mimeType: mime })
      : new MediaRecorder(audioOnly);

    rec.ondataavailable = (ev) => {
      if (ev.data.size > 0) chunksRef.current.push(ev.data);
    };

    recorderRef.current = rec;
    rec.start(200);
    setIsRecording(true);
  };

  const stopRecording = (): Promise<Blob | null> => {
    const rec = recorderRef.current;
    recorderRef.current = null;
    if (!rec || rec.state === 'inactive') {
      setIsRecording(false);
      return Promise.resolve(null);
    }

    return new Promise((resolve) => {
      rec.onstop = () => {
        setIsRecording(false);
        const blob = new Blob(chunksRef.current, { type: rec.mimeType || 'audio/webm' });
        chunksRef.current = [];
        resolve(blob.size > 0 ? blob : null);
      };
      rec.stop();
    });
  };

  const submitAnswer = async () => {
    const token = getToken();
    if (!token || !session?.id) return;

    setPhase('uploading');
    setError(null);

    try {
      const blob = await stopRecording();

      const trimmed = textAnswer.trim();
      if ((!blob || blob.size === 0) && !trimmed) {
        setPhase('live');
        setError('Record an answer or type a transcript below.');
        return;
      }

      const formData = new FormData();
      if (blob && blob.size > 0) {
        const ext = blob.type.includes('mp4') ? 'm4a' : 'webm';
        formData.append('audio', blob, `answer.${ext}`);
      }
      if (trimmed) {
        formData.append('transcript', trimmed);
      }

      const res = await fetch(`${API_URL}/interview/sessions/${session.id}/answers`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = (await res.json().catch(() => ({}))) as SubmitAnswerResponse & { error?: string };
      if (res.status === 401) {
        setNeedRelogin(true);
        setError(
          'Your session expired. Log in again — you will need to start a new interview session.',
        );
        setPhase('live');
        return;
      }
      if (!res.ok) {
        throw new Error(data.error || res.statusText);
      }

      setSession(data);
      setTextAnswer('');
      if (data.lastTurn) {
        setLastFeedback(`${data.lastTurn.feedback} (score ${data.lastTurn.score}/10)`);
      }

      if (data.completed || data.status === 'COMPLETED') {
        stopMedia();
        if (data.summaryJson) {
          try {
            setSummaryParsed(JSON.parse(data.summaryJson) as Record<string, unknown>);
          } catch {
            setSummaryParsed(null);
          }
        }
        setPhase('done');
      } else {
        syncTimer(data.endsAt);
        setPhase('live');
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Upload failed';
      setError(msg);
      setPhase('live');
    }
  };

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const copyReportToClipboard = async () => {
    if (!session?.reportDetail && !session?.summaryJson) return;
    const parts: string[] = [];
    if (session.summaryJson) {
      parts.push('Summary (JSON):\n' + session.summaryJson);
    }
    if (session.reportDetail) {
      parts.push('\n---\n\n' + session.reportDetail);
    }
    try {
      await navigator.clipboard.writeText(parts.join('\n'));
    } catch {
      /* ignore */
    }
  };

  if (phase === 'done' && session?.status === 'COMPLETED') {
    return (
      <DashboardShell mainClassName="p-6 md:p-10 max-w-3xl mx-auto">
        <Link
          href="/learn"
          className="text-sm text-[#22c55e] hover:underline mb-6 inline-block"
        >
          Back to dashboard
        </Link>
        <div className="mb-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => void copyReportToClipboard()}
            className="rounded-lg border border-[#3a3a3a] bg-[#2a2a2a] px-3 py-1.5 text-sm text-white hover:bg-[#333]"
          >
            Copy report to clipboard
          </button>
        </div>
        <h1 className="text-2xl font-semibold text-white mb-2">Interview complete</h1>
        <p className="text-[#b0b0b0] mb-6">
          Verdict:{' '}
          <span className="text-white font-medium">{session.verdict ?? '—'}</span>
          {session.overallScore != null && (
            <span className="ml-2">Overall score: {session.overallScore}/100</span>
          )}
        </p>

        {summaryParsed && (
          <div className="rounded-lg border border-[#3a3a3a] bg-[#252525] p-4 mb-6 text-[#e5e5e5] text-sm space-y-3">
            {Array.isArray(summaryParsed.strengths) && summaryParsed.strengths.length > 0 && (
              <div>
                <div className="font-semibold text-[#22c55e] mb-1">Strengths</div>
                <ul className="list-disc pl-5">
                  {(summaryParsed.strengths as string[]).map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              </div>
            )}
            {Array.isArray(summaryParsed.weakTopics) && summaryParsed.weakTopics.length > 0 && (
              <div>
                <div className="font-semibold text-amber-400 mb-1">Topics to strengthen</div>
                <ul className="list-disc pl-5">
                  {(summaryParsed.weakTopics as string[]).map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              </div>
            )}
            {Array.isArray(summaryParsed.improvementPlan) && summaryParsed.improvementPlan.length > 0 && (
              <div>
                <div className="font-semibold text-sky-400 mb-1">Improvement plan</div>
                <ul className="list-disc pl-5">
                  {(summaryParsed.improvementPlan as string[]).map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {session.reportDetail && (
          <div>
            <h2 className="text-lg font-medium text-white mb-2">Detailed report</h2>
            <div className="rounded-lg border border-[#3a3a3a] bg-[#1f1f1f] p-4 text-[#d4d4d4] text-sm whitespace-pre-wrap">
              {session.reportDetail}
            </div>
          </div>
        )}
      </DashboardShell>
    );
  }

  return (
    <DashboardShell mainClassName="p-6 md:p-10 max-w-3xl mx-auto">
      <Link href="/learn" className="text-sm text-[#22c55e] hover:underline mb-6 inline-block">
        Back to dashboard
      </Link>

      <h1 className="text-2xl font-semibold text-white mb-2">
        Adaptive audio problem session (10 min)
      </h1>
      <p className="text-[#b0b0b0] text-sm mb-6">
        Each problem is spoken aloud. Answer by microphone and the next question will adapt to your
        response. The camera is optional and stays in your browser; no video is uploaded.
      </p>

      {(phase === 'live' || phase === 'uploading') && (
        <>
          {hasVideoTrack ? (
            <video
              ref={videoRef}
              className="mb-4 w-full max-w-md rounded-lg border border-[#3a3a3a] bg-black aspect-video object-cover"
              muted
              playsInline
            />
          ) : (
            <div
              className="mb-4 flex w-full max-w-md aspect-video items-center justify-center rounded-lg border border-dashed border-[#3a3a3a] bg-[#141414] px-4 text-center text-sm text-[#888]"
              role="status"
            >
              Audio-only mode: microphone is active. Camera was skipped or unavailable.
            </div>
          )}
        </>
      )}
      {hasMounted && phase === 'intro' && !getToken() && (
        <div className="mb-4 rounded-lg border border-amber-900/40 bg-amber-950/20 px-3 py-2 text-sm text-amber-100">
          You must be logged in.{' '}
          <Link href="/login?from=%2Finterview" className="font-medium text-[#22c55e] underline">
            Go to login
          </Link>
        </div>
      )}

      {phase === 'intro' && (
        <div className="space-y-4">
          <button
            type="button"
            onClick={() => void startInterview()}
            className="rounded-lg bg-[#22c55e] px-4 py-2.5 text-sm font-medium text-black hover:bg-[#1ea34a]"
          >
            Start audio session
          </button>
        </div>
      )}

      {(phase === 'connecting' || phase === 'uploading') && (
        <p className="text-[#b0b0b0]">{phase === 'connecting' ? 'Connecting…' : 'Submitting answer…'}</p>
      )}

      {phase === 'live' && session && (
        <div className="space-y-4">
          {mediaNotices.length > 0 && (
            <div
              className="rounded-lg border border-amber-900/40 bg-amber-950/25 px-3 py-2 text-sm text-amber-100"
              role="status"
            >
              {mediaNotices.map((n) => (
                <p key={n} className="mb-1 last:mb-0">
                  {n}
                </p>
              ))}
            </div>
          )}
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <span
              className={
                remainingSec <= 60 ? 'text-red-400 font-semibold' : 'text-[#e5e5e5]'
              }
            >
              Time left: {formatTime(remainingSec)}
            </span>
            <span className="text-[#888]">
              Question {session.currentQuestionIndex + 1} / {session.totalQuestions}
            </span>
          </div>

          {session.timeExpired && (
            <p className="text-amber-400 text-sm">Time is up — you cannot submit more answers.</p>
          )}

          <div className="rounded-lg border border-[#3a3a3a] bg-[#252525] p-4">
            <div className="flex flex-wrap items-center gap-2">
              <div
                className="flex min-h-10 flex-1 items-center gap-3 text-sm text-white"
                role="status"
                aria-label={isSpeaking ? 'Problem is being spoken' : 'Audio problem ready'}
              >
                <span
                  className={`inline-block h-3 w-3 rounded-full ${
                    isSpeaking ? 'animate-pulse bg-[#22c55e]' : 'bg-[#666]'
                  }`}
                />
                {isSpeaking ? 'Playing problem…' : 'Audio problem ready'}
              </div>
              <button
                type="button"
                onClick={() => session.currentQuestion && speakQuestion(session.currentQuestion, true)}
                disabled={!session.currentQuestion || !speechSupported}
                className="rounded-md border border-[#4a4a4a] px-3 py-1.5 text-xs text-white hover:bg-[#333] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Replay
              </button>
              <button
                type="button"
                onClick={() => {
                  const enabled = !voiceEnabled;
                  setVoiceEnabled(enabled);
                  if (!enabled) {
                    window.speechSynthesis?.cancel();
                    setIsSpeaking(false);
                  } else if (session.currentQuestion) {
                    speakQuestion(session.currentQuestion, true);
                  }
                }}
                className="rounded-md border border-[#4a4a4a] px-3 py-1.5 text-xs text-white hover:bg-[#333]"
              >
                Voice {voiceEnabled ? 'on' : 'off'}
              </button>
              <button
                type="button"
                onClick={() => setShowQuestionText((shown) => !shown)}
                className="rounded-md border border-[#4a4a4a] px-3 py-1.5 text-xs text-white hover:bg-[#333]"
              >
                {showQuestionText ? 'Hide' : 'Show'} transcript
              </button>
            </div>
            {(!speechSupported || showQuestionText) && (
              <p className="mt-3 border-t border-[#3a3a3a] pt-3 text-sm leading-relaxed text-white">
                {session.currentQuestion}
              </p>
            )}
            {!speechSupported && (
              <p className="mt-2 text-xs text-amber-300">
                Speech playback is unavailable in this browser, so the transcript is shown.
              </p>
            )}
          </div>

          {lastFeedback && (
            <p className="text-xs text-[#a3a3a3] border-l-2 border-[#22c55e] pl-2">Previous: {lastFeedback}</p>
          )}

          <div className="flex flex-wrap gap-2">
            {!session.timeExpired && (
              <>
                {!isRecording ? (
                  <button
                    type="button"
                    onClick={startRecording}
                    className="rounded-lg bg-[#3a3a3a] px-4 py-2 text-sm text-white hover:bg-[#4a4a4a]"
                  >
                    Record answer
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => void submitAnswer()}
                    className="rounded-lg bg-[#22c55e] px-4 py-2 text-sm font-medium text-black hover:bg-[#1ea34a]"
                  >
                    Stop & submit
                  </button>
                )}
              </>
            )}
          </div>

          <div>
            <label htmlFor="interview-transcript" className="block text-xs text-[#888] mb-1">
              Optional: type transcript instead (or to supplement audio)
            </label>
            <textarea
              id="interview-transcript"
              value={textAnswer}
              onChange={(e) => setTextAnswer(e.target.value)}
              disabled={session.timeExpired}
              rows={4}
              className="w-full rounded border border-[#3a3a3a] bg-[#1a1a1a] px-3 py-2 text-sm text-white placeholder:text-[#666]"
              placeholder="If you prefer not to use the mic, paste your answer here and submit."
            />
            {!session.timeExpired && !isRecording && textAnswer.trim() && (
              <button
                type="button"
                onClick={() => void submitAnswer()}
                className="mt-2 rounded-lg bg-[#22c55e] px-4 py-2 text-sm font-medium text-black hover:bg-[#1ea34a]"
              >
                Submit typed answer
              </button>
            )}
          </div>
        </div>
      )}

      {phase === 'error' && (
        <div className="rounded-lg border border-red-900/50 bg-red-950/30 p-4 text-sm text-red-200">
          {error || 'Something went wrong.'}
          {needRelogin && (
            <div className="mt-3 space-y-2 text-[#e5e5e5]">
              <Link
                href="/login?from=%2Finterview"
                className="inline-block rounded-lg bg-[#22c55e] px-3 py-1.5 text-sm font-medium text-black hover:bg-[#1ea34a]"
              >
                Log in again
              </Link>
              <p className="text-xs text-[#aaa]">
                Use the same API URL as this app (<code className="text-[#ccc]">NEXT_PUBLIC_API_URL</code>
                ). Mismatched API or changed <code className="text-[#ccc]">JWT_SECRET</code> also causes this
                error until you log in again.
              </p>
            </div>
          )}
          <div className="mt-3">
            <button
              type="button"
              onClick={() => {
                setPhase('intro');
                setError(null);
                setNeedRelogin(false);
              }}
              className="text-[#22c55e] underline"
            >
              Try again
            </button>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
