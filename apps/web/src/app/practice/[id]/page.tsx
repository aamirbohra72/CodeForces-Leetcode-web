'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { isAuthenticated } from '@/lib/auth';
import { DashboardShell } from '@/components/DashboardShell';
import { CodeEditor } from '@/components/CodeEditor';
import type { Challenge, Submission, SubmissionResultCase } from '@codeforces/types';

type JudgeResult = {
  status: string;
  score: number;
  feedback: string;
  passed: number;
  total: number;
  cases?: SubmissionResultCase[];
};

function parseResult(json: string | null | undefined): JudgeResult | null {
  if (!json) return null;
  try {
    return JSON.parse(json) as JudgeResult;
  } catch {
    return null;
  }
}

export default function PracticeProblemPage() {
  const params = useParams();
  const router = useRouter();
  const problemId = params.id as string;
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [running, setRunning] = useState(false);
  const [language, setLanguage] = useState('javascript');
  const [sourceCode, setSourceCode] = useState('');
  const [activeTab, setActiveTab] = useState<'problem' | 'solution' | 'submissions'>('problem');
  const [error, setError] = useState('');
  const [verdict, setVerdict] = useState<JudgeResult | null>(null);
  const [verdictSource, setVerdictSource] = useState<'run' | 'submit' | null>(null);
  const [hintText, setHintText] = useState<string | null>(null);
  const [panelMessage, setPanelMessage] = useState<string | null>(null);

  const allowedLanguages = useMemo(
    () => (challenge?.allowedLanguages?.length ? challenge.allowedLanguages : ['javascript']),
    [challenge],
  );

  const fetchChallenge = useCallback(async () => {
    try {
      const data = await api.get<Challenge>(`/challenges/${problemId}`);
      setChallenge(data);
      const langs = data.allowedLanguages?.length ? data.allowedLanguages : ['javascript'];
      setLanguage(langs[0]);
      setSourceCode(data.starterCode || '');
    } catch (err) {
      console.error('Failed to fetch challenge:', err);
      setError('Failed to load challenge');
    } finally {
      setLoading(false);
    }
  }, [problemId]);

  useEffect(() => {
    if (problemId) void fetchChallenge();
  }, [problemId, fetchChallenge]);

  const pollSubmission = async (submissionId: string) => {
    for (let i = 0; i < 60; i += 1) {
      const submission = await api.get<Submission>(`/submissions/${submissionId}`);
      if (submission.status !== 'PENDING') {
        return submission;
      }
      await new Promise((r) => setTimeout(r, 1000));
    }
    throw new Error('Timed out waiting for judge result');
  };

  const handleRun = async () => {
    if (!sourceCode.trim()) {
      setError('Please write some code first');
      return;
    }
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }
    if (!challenge?.judgeReady) {
      setError('Judging is not ready for this challenge yet.');
      return;
    }

    setRunning(true);
    setError('');
    setPanelMessage('Running sample tests…');
    setVerdict(null);
    setHintText(null);

    try {
      const response = await api.post<{
        success: boolean;
        status: string;
        score: number;
        output: string;
        error: string | null;
        result: JudgeResult;
        hintText?: string | null;
      }>('/execute/execute', {
        code: sourceCode,
        language,
        challengeId: problemId,
        timeout: 5000,
      });

      setVerdict(response.result);
      setVerdictSource('run');
      setHintText(response.hintText ?? null);
      setPanelMessage(response.output || (response.success ? 'Sample tests passed' : 'Sample tests failed'));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Execution failed';
      if (/judge unavailable|docker/i.test(msg)) {
        setError('Judge unavailable: start Docker Desktop and build image codeforces-judge:1');
      } else {
        setError(msg);
      }
      setPanelMessage(msg);
    } finally {
      setRunning(false);
    }
  };

  const handleSubmit = async () => {
    setError('');
    setPanelMessage(null);
    setVerdict(null);
    setHintText(null);

    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }
    if (!sourceCode.trim()) {
      setError('Source code is required');
      return;
    }
    if (!challenge?.judgeReady) {
      setError('Judging is not ready for this challenge yet.');
      return;
    }

    setSubmitting(true);
    setPanelMessage('Submitting…');
    try {
      const created = await api.post<Submission>(`/submissions`, {
        challengeId: problemId,
        language,
        sourceCode,
      });

      setPanelMessage('Judging against all test cases…');
      const finalSubmission = await pollSubmission(created.id);
      const result = parseResult(finalSubmission.resultJson);
      setVerdict(
        result ?? {
          status: finalSubmission.status,
          score: finalSubmission.score ?? 0,
          feedback: finalSubmission.aiResponse || finalSubmission.status,
          passed: 0,
          total: 0,
        },
      );
      setVerdictSource('submit');
      setHintText(finalSubmission.hintText ?? null);
      setPanelMessage(finalSubmission.aiResponse || finalSubmission.status);
    } catch (err: any) {
      const errorMessage = err?.response?.data?.error || err?.message || 'Submission failed';
      setError(errorMessage);
      setPanelMessage(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <DashboardShell mainClassName="p-8">
        <div className="text-center">Loading...</div>
      </DashboardShell>
    );
  }

  if (!challenge) {
    return (
      <DashboardShell mainClassName="p-8">
        <div>{error || 'Challenge not found'}</div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell mainClassName="flex h-[calc(100vh-3.5rem)] max-h-[calc(100vh-3.5rem)] flex-col overflow-hidden p-0">
      <div style={{ display: 'flex', flex: 1, minHeight: 0, overflow: 'hidden' }}>
        <div
          className="problem-statement-scroll"
          style={{
            width: '40%',
            height: '100%',
            overflowY: 'scroll',
            background: '#ffffff',
            color: '#111827',
            borderRight: '1px solid #e5e7eb',
            padding: '1.5rem',
          }}
        >
          <div style={{ marginBottom: '1.5rem' }}>
            <h1 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: '#111827' }}>
              {challenge.title}
            </h1>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <span
                style={{
                  padding: '0.25rem 0.75rem',
                  borderRadius: '12px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  background:
                    challenge.difficulty.toLowerCase() === 'easy'
                      ? '#22c55e'
                      : challenge.difficulty.toLowerCase() === 'medium'
                        ? '#f59e0b'
                        : '#ef4444',
                  color: 'white',
                }}
              >
                {challenge.difficulty}
              </span>
              <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                {challenge.practiceLanguage || 'Algorithm'}
              </span>
              <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                Mode: {challenge.judgeMode || 'STDIN'}
              </span>
              {!challenge.judgeReady && (
                <span style={{ color: '#b45309', fontSize: '0.875rem' }}>Judge setup pending</span>
              )}
              {challenge.testCaseSummary && (
                <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                  Tests: {challenge.testCaseSummary.totalCount} ({challenge.testCaseSummary.hiddenCount}{' '}
                  hidden)
                </span>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid #e5e7eb' }}>
            {(['problem', 'solution', 'submissions'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: '0.5rem 1rem',
                  border: 'none',
                  background: 'none',
                  borderBottom: activeTab === tab ? '2px solid #0070f3' : '2px solid transparent',
                  cursor: 'pointer',
                  textTransform: 'capitalize',
                  color: activeTab === tab ? '#0070f3' : '#6b7280',
                  fontWeight: activeTab === tab ? 600 : 400,
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          {activeTab === 'problem' && (
            <div>
              <div style={{ marginBottom: '1.5rem', lineHeight: 1.6 }}>
                <p style={{ whiteSpace: 'pre-wrap', color: '#374151' }}>{challenge.description}</p>
              </div>

              {[
                ['Input Format', challenge.inputFormat],
                ['Output Format', challenge.outputFormat],
                ['Constraints', challenge.constraints],
              ].map(([label, value]) => (
                <div key={label} style={{ marginBottom: '1.5rem' }}>
                  <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem', fontWeight: 600, color: '#111827' }}>
                    {label}
                  </h3>
                  <pre
                    style={{
                      background: '#f9fafb',
                      color: '#1f2937',
                      padding: '1rem',
                      borderRadius: 6,
                      fontSize: '0.875rem',
                      overflow: 'auto',
                      border: '1px solid #e5e7eb',
                      whiteSpace: 'pre-wrap',
                    }}
                  >
                    {value}
                  </pre>
                </div>
              ))}

              {challenge.sampleInput !== undefined && challenge.sampleInput !== null && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem', fontWeight: 600, color: '#111827' }}>
                    Sample Input
                  </h3>
                  <pre
                    style={{
                      background: '#f9fafb',
                      color: '#1f2937',
                      padding: '1rem',
                      borderRadius: 6,
                      fontSize: '0.875rem',
                      overflow: 'auto',
                      border: '1px solid #e5e7eb',
                      whiteSpace: 'pre-wrap',
                    }}
                  >
                    {challenge.sampleInput || '(empty)'}
                  </pre>
                </div>
              )}

              {challenge.sampleOutput && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem', fontWeight: 600, color: '#111827' }}>
                    Sample Output
                  </h3>
                  <pre
                    style={{
                      background: '#f9fafb',
                      color: '#1f2937',
                      padding: '1rem',
                      borderRadius: 6,
                      fontSize: '0.875rem',
                      overflow: 'auto',
                      border: '1px solid #e5e7eb',
                      whiteSpace: 'pre-wrap',
                    }}
                  >
                    {challenge.sampleOutput}
                  </pre>
                </div>
              )}

              {challenge.sampleTestCases && challenge.sampleTestCases.length > 1 && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem', fontWeight: 600, color: '#111827' }}>
                    Sample Cases
                  </h3>
                  {challenge.sampleTestCases.map((tc) => (
                    <div key={tc.id} style={{ marginBottom: '0.75rem' }}>
                      <div style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: 4 }}>{tc.name}</div>
                      <pre
                        style={{
                          background: '#f9fafb',
                          color: '#1f2937',
                          padding: '0.75rem',
                          borderRadius: 6,
                          fontSize: '0.8rem',
                          border: '1px solid #e5e7eb',
                          whiteSpace: 'pre-wrap',
                        }}
                      >
                        {`Input:\n${tc.input || '(empty)'}\n\nOutput:\n${tc.expectedOutput}`}
                      </pre>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'solution' && (
            <div style={{ color: '#6b7280', textAlign: 'center', padding: '2rem' }}>
              Official solutions unlock after you get an Accepted verdict.
            </div>
          )}

          {activeTab === 'submissions' && (
            <div style={{ color: '#6b7280', textAlign: 'center', padding: '2rem' }}>
              <p>View your submission history</p>
              <button
                onClick={() => router.push(`/submissions?challengeId=${problemId}`)}
                className="btn btn-primary"
                style={{ marginTop: '1rem' }}
              >
                Go to Submissions
              </button>
            </div>
          )}
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#1e1e1e' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '0.75rem 1rem',
              background: '#252526',
              borderBottom: '1px solid #3e3e42',
              gap: '0.5rem',
              flexWrap: 'wrap',
            }}
          >
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              style={{
                padding: '0.5rem',
                background: '#3c3c3c',
                color: 'white',
                border: '1px solid #555',
                borderRadius: 4,
              }}
            >
              {allowedLanguages.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={() => setSourceCode(challenge.starterCode || '')}
                style={{
                  padding: '0.5rem 1rem',
                  background: '#3c3c3c',
                  color: 'white',
                  border: 'none',
                  borderRadius: 4,
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                }}
              >
                Reset
              </button>
              <button
                onClick={() => void handleRun()}
                disabled={running || submitting}
                style={{
                  padding: '0.5rem 1rem',
                  background: running ? '#555' : '#0e639c',
                  color: 'white',
                  border: 'none',
                  borderRadius: 4,
                  cursor: running ? 'not-allowed' : 'pointer',
                  fontSize: '0.875rem',
                }}
              >
                {running ? 'Running…' : 'Run samples'}
              </button>
              <button
                onClick={() => void handleSubmit()}
                disabled={submitting || running}
                style={{
                  padding: '0.5rem 1rem',
                  background: submitting ? '#555' : '#22c55e',
                  color: 'white',
                  border: 'none',
                  borderRadius: 4,
                  cursor: submitting ? 'not-allowed' : 'pointer',
                  fontSize: '0.875rem',
                }}
              >
                {submitting ? 'Judging…' : 'Submit'}
              </button>
            </div>
          </div>

          <div style={{ flex: 1, overflow: 'hidden' }}>
            <CodeEditor language={language} value={sourceCode} onChange={setSourceCode} height="100%" />
          </div>

          <div
            style={{
              minHeight: 220,
              maxHeight: 320,
              background: '#1e1e1e',
              borderTop: '1px solid #3e3e42',
              padding: '1rem',
              overflow: 'auto',
              color: '#cccccc',
              fontSize: '0.875rem',
              fontFamily: 'monospace',
            }}
          >
            {error && <div style={{ color: '#f48771', marginBottom: 8 }}>Error: {error}</div>}
            {panelMessage && <div style={{ marginBottom: 8 }}>{panelMessage}</div>}
            {verdict && (
              <div style={{ marginBottom: 8 }}>
                <div
                  style={{
                    color: verdict.status === 'ACCEPTED' ? '#4ec9b0' : '#f48771',
                    fontWeight: 700,
                    marginBottom: 4,
                  }}
                >
                  {verdictSource === 'run' ? 'SAMPLE RUN: ' : ''}
                  {verdict.status} — score {verdict.score}/100 ({verdict.passed}/{verdict.total} passed)
                </div>
                {verdictSource === 'run' && (
                  <div style={{ color: '#d7ba7d', marginBottom: 6 }}>
                    Sample run only — this is not recorded in your submissions. Click Submit to run all
                    test cases and save the result.
                  </div>
                )}
                {verdictSource === 'submit' && (
                  <div style={{ marginBottom: 6 }}>
                    <a
                      href={`/submissions?challengeId=${problemId}`}
                      style={{ color: '#3794ff', textDecoration: 'underline' }}
                    >
                      View this submission in your history →
                    </a>
                  </div>
                )}
                <div style={{ whiteSpace: 'pre-wrap' }}>{verdict.feedback}</div>
                {verdict.cases && verdict.cases.length > 0 && (
                  <ul style={{ marginTop: 8, paddingLeft: 18 }}>
                    {verdict.cases.map((c) => (
                      <li key={`${c.order}-${c.name}`} style={{ marginBottom: 4 }}>
                        <span style={{ color: c.passed ? '#4ec9b0' : '#f48771' }}>
                          {c.passed ? 'PASS' : 'FAIL'}
                        </span>{' '}
                        {c.name}
                        {!c.passed && c.message ? ` — ${c.message}` : ''}
                        {!c.passed && !c.isHidden && c.expected != null ? (
                          <div style={{ opacity: 0.85 }}>
                            expected: {c.expected}
                            {c.actual != null ? `\nactual: ${c.actual}` : ''}
                          </div>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
            {hintText && (
              <div
                style={{
                  marginTop: 8,
                  borderLeft: '3px solid #f59e0b',
                  paddingLeft: 10,
                  color: '#fbbf24',
                  whiteSpace: 'pre-wrap',
                }}
              >
                Hint: {hintText}
              </div>
            )}
            {!panelMessage && !verdict && !error && (
              <div style={{ color: '#6b7280' }}>Run sample tests or submit to see results here.</div>
            )}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
