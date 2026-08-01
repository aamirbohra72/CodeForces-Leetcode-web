'use client';

import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { cn } from '@/lib/cn';
import {
  TaHelpCreateModal,
  type TaHelpCreatePayload,
} from '@/components/ta-help/TaHelpCreateModal';
import {
  appendTaHelpRequest,
  loadTaHelpRequests,
  type TaHelpType,
} from '@/data/ta-help';

type CompanionAction = {
  type: 'link' | 'ta_help' | 'ta_call';
  label: string;
  href: string;
};

type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
  actions?: CompanionAction[];
};

type CompanionReply = {
  reply: string;
  intent?: string;
  escalateToTa?: boolean;
  actions?: CompanionAction[];
};

const QUICK_PROMPTS = [
  { label: 'Jobs & careers', text: 'I have questions about jobs and interview prep on this platform.' },
  { label: 'Courses', text: 'Help me find and manage my courses.' },
  { label: 'Pause course', text: 'How do I pause my course?' },
  { label: 'Restart course', text: 'How do I restart or resume a paused course?' },
  { label: 'Talk to TA', text: 'I want to connect with a teaching assistant for a video call.' },
] as const;

function formatStamp(iso: string) {
  try {
    return new Intl.DateTimeFormat(undefined, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: 'numeric',
      minute: '2-digit',
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

function RobotIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="5" y="8" width="14" height="11" rx="3" fill="currentColor" opacity="0.95" />
      <circle cx="9.2" cy="13" r="1.4" fill="#0f172a" />
      <circle cx="14.8" cy="13" r="1.4" fill="#0f172a" />
      <path d="M12 4v3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="12" cy="3.2" r="1.1" fill="currentColor" />
      <path d="M8 19.5v1.2M16 19.5v1.2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function buildWelcome(): ChatMessage {
  return {
    id: `welcome-${Date.now()}`,
    role: 'assistant',
    content:
      'Hi! I am Support Companion. Ask me about jobs, courses, pausing or restarting a course, billing, or anything on the platform. Tap Request a Call and I will open a live TA video-call request for you.',
    createdAt: new Date().toISOString(),
    actions: [
      { type: 'ta_call', label: 'Request a Call', href: '/ta-help' },
      { type: 'ta_help', label: 'Text a TA', href: '/ta-help' },
      { type: 'link', label: 'Browse Courses', href: '/learn' },
    ],
  };
}

type SupportCompanionProps = {
  className?: string;
};

export function SupportCompanion({ className }: SupportCompanionProps) {
  const panelId = useId();
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>(() => [buildWelcome()]);
  const [callModalOpen, setCallModalOpen] = useState(false);
  const [callModalType, setCallModalType] = useState<TaHelpType>('video');
  const [waitingCalls, setWaitingCalls] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const refreshQueueStats = useCallback(() => {
    const all = loadTaHelpRequests();
    setWaitingCalls(all.filter((r) => r.status === 'waiting' && r.type === 'video').length);
  }, []);

  useEffect(() => {
    refreshQueueStats();
    const onUpdate = () => refreshQueueStats();
    window.addEventListener('ta-help:updated', onUpdate);
    return () => window.removeEventListener('ta-help:updated', onUpdate);
  }, [refreshQueueStats]);

  useEffect(() => {
    if (!open) return;
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (!callModalOpen) inputRef.current?.focus();
  }, [open, messages, sending, callModalOpen]);

  const lastUserContext = useMemo(() => {
    const users = messages.filter((m) => m.role === 'user');
    return users[users.length - 1]?.content || '';
  }, [messages]);

  const openTaRequest = useCallback((type: TaHelpType) => {
    setCallModalType(type);
    setCallModalOpen(true);
  }, []);

  const handleAction = useCallback(
    (action: CompanionAction) => {
      if (action.type === 'ta_call') {
        openTaRequest('video');
        return;
      }
      if (action.type === 'ta_help') {
        openTaRequest('text');
        return;
      }
      window.location.href = action.href;
    },
    [openTaRequest],
  );

  const onCallSubmit = useCallback(
    (payload: TaHelpCreatePayload) => {
      const created = appendTaHelpRequest(payload);
      setCallModalOpen(false);
      refreshQueueStats();

      const slotNote = payload.preferredSlot ? ` Preferred slot: ${payload.preferredSlot}.` : '';
      setMessages((prev) => [
        ...prev,
        {
          id: `u-call-${created.id}`,
          role: 'user',
          content:
            payload.type === 'video'
              ? `Please request a TA video call: ${payload.title}`
              : `Please raise a TA text request: ${payload.title}`,
          createdAt: new Date().toISOString(),
        },
        {
          id: `a-call-${created.id}`,
          role: 'assistant',
          content:
            payload.type === 'video'
              ? `Done — your video call request is in the TA queue (id ${created.id}).${slotNote} Status is Waiting on TA. A teaching assistant will pick it up next.`
              : `Done — your text help request is in the TA queue (id ${created.id}). Status is Waiting on TA.`,
          createdAt: new Date().toISOString(),
          actions: [
            { type: 'link', label: 'View in TA Help', href: '/ta-help' },
            { type: 'ta_call', label: 'Request another Call', href: '/ta-help' },
          ],
        },
      ]);
    },
    [refreshQueueStats],
  );

  const resetChat = useCallback(() => {
    setMessages([buildWelcome()]);
    setError('');
    setInput('');
  }, []);

  const send = useCallback(
    async (raw: string) => {
      const text = raw.trim();
      if (!text || sending) return;

      const userMsg: ChatMessage = {
        id: `u-${Date.now()}`,
        role: 'user',
        content: text,
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, userMsg]);
      setInput('');
      setSending(true);
      setError('');

      // Local intent shortcuts — open call flow immediately for clear ask
      if (/\b(request (a )?call|video call|call (a )?ta|talk to (a )?ta|human agent)\b/i.test(text)) {
        setSending(false);
        setMessages((prev) => [
          ...prev,
          {
            id: `a-shortcut-${Date.now()}`,
            role: 'assistant',
            content:
              'I can connect you with a Teaching Assistant now. Choose a slot and submit the call request — it will show under Waiting on TA.',
            createdAt: new Date().toISOString(),
            actions: [
              { type: 'ta_call', label: 'Request a Call', href: '/ta-help' },
              { type: 'ta_help', label: 'Prefer text help', href: '/ta-help' },
            ],
          },
        ]);
        openTaRequest('video');
        return;
      }

      try {
        const history = [...messages, userMsg]
          .filter((m) => !m.id.startsWith('welcome'))
          .slice(-12)
          .map((m) => ({ role: m.role, content: m.content }));

        const data = await api.post<CompanionReply>('/companion/chat', {
          message: text,
          history: history.slice(0, -1),
        });

        const actions = [...(data.actions || [])];
        if (data.escalateToTa && !actions.some((a) => a.type === 'ta_call' || a.type === 'ta_help')) {
          actions.unshift({ type: 'ta_call', label: 'Request a Call', href: '/ta-help' });
        }

        setMessages((prev) => [
          ...prev,
          {
            id: `a-${Date.now()}`,
            role: 'assistant',
            content: data.reply,
            createdAt: new Date().toISOString(),
            actions,
          },
        ]);

        if (data.escalateToTa || data.intent === 'ta_help') {
          // Soft prompt only — user still clicks Request a Call
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to reach Support Companion');
        setMessages((prev) => [
          ...prev,
          {
            id: `a-err-${Date.now()}`,
            role: 'assistant',
            content:
              'I could not reach the AI right now. You can still raise a TA video or text request below.',
            createdAt: new Date().toISOString(),
            actions: [
              { type: 'ta_call', label: 'Request a Call', href: '/ta-help' },
              { type: 'ta_help', label: 'Open TA Help', href: '/ta-help' },
            ],
          },
        ]);
      } finally {
        setSending(false);
      }
    },
    [messages, sending, openTaRequest],
  );

  return (
    <div className={cn('relative', className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={panelId}
        className={cn(
          'inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-500/10 px-3 py-1.5 text-sm font-semibold text-sky-100 transition hover:bg-sky-500/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400',
          open && 'bg-sky-500/25',
        )}
      >
        <RobotIcon className="h-4 w-4 text-sky-300" />
        <span className="hidden sm:inline">Ask Support</span>
        {waitingCalls > 0 ? (
          <span className="rounded-full bg-orange-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
            {waitingCalls}
          </span>
        ) : null}
      </button>

      {open ? (
        <div
          id={panelId}
          role="dialog"
          aria-label="Support Companion"
          className={cn(
            'fixed z-[80] flex flex-col overflow-hidden border border-white/10 bg-[#161616] shadow-2xl shadow-black/50',
            expanded
              ? 'inset-3 rounded-2xl sm:inset-6'
              : 'bottom-3 right-3 top-auto h-[min(640px,calc(100vh-5.5rem))] w-[min(420px,calc(100vw-1.5rem))] rounded-2xl sm:bottom-4 sm:right-4',
          )}
        >
          <header className="flex items-center gap-2 border-b border-white/10 bg-[#1c1c1c] px-3 py-2.5">
            <RobotIcon className="h-5 w-5 text-sky-400" />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h2 className="truncate text-sm font-bold text-white">Support Companion</h2>
                <span className="rounded-full bg-emerald-500/15 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-300">
                  beta
                </span>
              </div>
              <p className="truncate text-[11px] text-white/45">
                {waitingCalls > 0
                  ? `${waitingCalls} video call request${waitingCalls === 1 ? '' : 's'} waiting`
                  : 'Jobs · Courses · Pause/Restart · Live TA calls'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => openTaRequest('video')}
              className="hidden rounded-md bg-sky-500 px-2 py-1 text-[11px] font-semibold text-white hover:bg-sky-400 sm:inline-flex"
            >
              Call
            </button>
            <button
              type="button"
              onClick={resetChat}
              className="rounded-md p-1.5 text-white/55 hover:bg-white/5 hover:text-white"
              title="New chat"
              aria-label="New chat"
            >
              <svg viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor" aria-hidden>
                <path d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              className="rounded-md p-1.5 text-white/55 hover:bg-white/5 hover:text-white"
              title={expanded ? 'Shrink' : 'Expand'}
              aria-label={expanded ? 'Shrink' : 'Expand'}
            >
              <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
                {expanded ? (
                  <path d="M7 3H3v4M13 3h4v4M7 17H3v-4M13 17h4v-4" strokeLinecap="round" />
                ) : (
                  <path d="M3 7V3h4M17 7V3h-4M3 13v4h4M17 13v4h-4" strokeLinecap="round" />
                )}
              </svg>
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-md p-1.5 text-white/55 hover:bg-white/5 hover:text-white"
              aria-label="Close"
            >
              <svg viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor" aria-hidden>
                <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
              </svg>
            </button>
          </header>

          <div className="flex flex-wrap gap-1.5 border-b border-white/5 bg-[#141414] px-3 py-2">
            {QUICK_PROMPTS.map((q) => (
              <button
                key={q.label}
                type="button"
                disabled={sending}
                onClick={() => void send(q.text)}
                className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[11px] font-medium text-white/70 transition hover:border-sky-400/30 hover:text-sky-200 disabled:opacity-50"
              >
                {q.label}
              </button>
            ))}
            <button
              type="button"
              onClick={() => openTaRequest('video')}
              className="rounded-full border border-sky-400/40 bg-sky-500/15 px-2.5 py-1 text-[11px] font-semibold text-sky-200 hover:bg-sky-500/25"
            >
              Request a Call
            </button>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto px-3 py-4">
            {messages.map((m) => (
              <div
                key={m.id}
                className={cn('flex gap-2', m.role === 'user' ? 'justify-end' : 'justify-start')}
              >
                {m.role === 'assistant' ? (
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sky-500/20 text-sky-300">
                    <RobotIcon className="h-4 w-4" />
                  </div>
                ) : null}
                <div className={cn('max-w-[85%]', m.role === 'user' && 'text-right')}>
                  <div
                    className={cn(
                      'rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed',
                      m.role === 'user'
                        ? 'rounded-br-md bg-violet-500/25 text-violet-50'
                        : 'rounded-bl-md bg-[#242424] text-white/85',
                    )}
                  >
                    {m.content}
                  </div>
                  {m.actions && m.actions.length > 0 ? (
                    <div className="mt-2 flex flex-col gap-1.5">
                      {m.actions.map((a) =>
                        a.type === 'link' ? (
                          <Link
                            key={`${m.id}-${a.label}`}
                            href={a.href}
                            className="inline-flex items-center justify-center rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white/80 transition hover:bg-white/10"
                          >
                            {a.label}
                          </Link>
                        ) : (
                          <button
                            key={`${m.id}-${a.label}`}
                            type="button"
                            onClick={() => handleAction(a)}
                            className="inline-flex items-center justify-center rounded-lg bg-sky-500 px-3 py-2 text-xs font-semibold text-white transition hover:bg-sky-400"
                          >
                            {a.label}
                          </button>
                        ),
                      )}
                    </div>
                  ) : null}
                  <div className="mt-1 text-[10px] text-white/35">{formatStamp(m.createdAt)}</div>
                </div>
                {m.role === 'user' ? (
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-500/25 text-xs font-bold text-amber-200">
                    You
                  </div>
                ) : null}
              </div>
            ))}
            {sending ? (
              <div className="flex items-center gap-2 text-xs text-white/45">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/15 border-t-sky-400" />
                Companion is typing…
              </div>
            ) : null}
            {error ? <p className="text-xs text-red-400">{error}</p> : null}
            <div ref={bottomRef} />
          </div>

          <form
            className="border-t border-white/10 bg-[#1c1c1c] p-3"
            onSubmit={(e) => {
              e.preventDefault();
              void send(input);
            }}
          >
            <div className="mb-2 flex gap-2">
              <button
                type="button"
                onClick={() => openTaRequest('video')}
                className="flex-1 rounded-lg bg-sky-500 px-3 py-2 text-xs font-semibold text-white hover:bg-sky-400"
              >
                Request a Call
              </button>
              <button
                type="button"
                onClick={() => openTaRequest('text')}
                className="flex-1 rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-xs font-semibold text-white/80 hover:bg-white/10"
              >
                Text a TA
              </button>
            </div>
            <div className="flex items-end gap-2">
              <textarea
                ref={inputRef}
                rows={2}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    void send(input);
                  }
                }}
                placeholder="Ask about jobs, courses, pause/restart…"
                className="min-h-[44px] flex-1 resize-none rounded-xl border border-white/10 bg-[#121212] px-3 py-2.5 text-sm text-white placeholder:text-white/35 focus:border-sky-400/40 focus:outline-none focus:ring-2 focus:ring-sky-500/25"
              />
              <button
                type="submit"
                disabled={sending || !input.trim()}
                className="rounded-xl bg-emerald-500 px-3.5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-400 disabled:opacity-50"
              >
                Send
              </button>
            </div>
            <p className="mt-2 text-center text-[10px] text-white/35">
              Calls land in{' '}
              <Link href="/ta-help" className="text-sky-300 hover:text-sky-200">
                TA Help → Waiting on TA
              </Link>
            </p>
          </form>
        </div>
      ) : null}

      <TaHelpCreateModal
        open={callModalOpen}
        onClose={() => setCallModalOpen(false)}
        onSubmit={onCallSubmit}
        defaultType={callModalType}
        heading={callModalType === 'video' ? 'Request a TA video call' : 'Ask a Teaching Assistant'}
        defaults={{
          title:
            callModalType === 'video'
              ? 'Companion: Request a TA video call'
              : 'Companion: Text help from a TA',
          problem: 'Support Companion',
          topic: 'Other',
          language: 'N/A',
          description:
            lastUserContext.trim().length >= 20
              ? lastUserContext.trim()
              : callModalType === 'video'
                ? 'I need a live TA video call for course / platform support. Please call me when available.'
                : 'I need text help from a TA about my course or platform question.',
        }}
      />
    </div>
  );
}
