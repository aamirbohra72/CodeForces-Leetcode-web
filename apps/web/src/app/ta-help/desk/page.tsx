'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { DashboardShell } from '@/components/DashboardShell';
import { getToken, getUser, isAdmin } from '@/lib/auth';
import {
  claimTaHelpRequest,
  fetchTaQueue,
  replyTaHelpRequest,
  updateTaHelpStatusApi,
} from '@/lib/taHelpApi';
import { formatRelativeTime, type TaHelpRequest } from '@/data/ta-help';
import { cn } from '@/lib/cn';

export default function TaHelpDeskPage() {
  const [requests, setRequests] = useState<TaHelpRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [replyDrafts, setReplyDrafts] = useState<Record<string, string>>({});
  const [busyId, setBusyId] = useState<string | null>(null);
  const staff = isAdmin() || getUser()?.role === 'TA';

  const refresh = useCallback(async () => {
    if (!getToken()) {
      setError('Sign in required');
      setLoading(false);
      return;
    }
    if (!staff) {
      setError('TA or admin access required');
      setLoading(false);
      return;
    }
    setLoading(true);
    setError('');
    try {
      const data = await fetchTaQueue();
      setRequests(data.requests);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load queue');
    } finally {
      setLoading(false);
    }
  }, [staff]);

  useEffect(() => {
    void refresh();
    const onUpdate = () => void refresh();
    window.addEventListener('ta-help:updated', onUpdate);
    return () => window.removeEventListener('ta-help:updated', onUpdate);
  }, [refresh]);

  const onClaim = async (id: string) => {
    setBusyId(id);
    try {
      await claimTaHelpRequest(id);
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Claim failed');
    } finally {
      setBusyId(null);
    }
  };

  const onReply = async (id: string) => {
    const body = (replyDrafts[id] || '').trim();
    if (!body) return;
    setBusyId(id);
    try {
      await replyTaHelpRequest(id, body);
      setReplyDrafts((prev) => ({ ...prev, [id]: '' }));
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Reply failed');
    } finally {
      setBusyId(null);
    }
  };

  const onResolve = async (id: string) => {
    setBusyId(id);
    try {
      await updateTaHelpStatusApi(id, 'RESOLVED');
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to resolve');
    } finally {
      setBusyId(null);
    }
  };

  const onOpenPool = async (id: string) => {
    setBusyId(id);
    try {
      await updateTaHelpStatusApi(id, 'OPEN_POOL');
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to move to pool');
    } finally {
      setBusyId(null);
    }
  };

  return (
    <DashboardShell mainClassName="min-h-0 overflow-y-auto p-4 md:p-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <header className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-sky-400">Staff</p>
            <h1 className="mt-1 text-2xl font-bold text-white md:text-3xl">TA Desk</h1>
            <p className="mt-2 text-sm text-white/55">
              Claim waiting requests, reply to learners, and resolve tickets.
            </p>
          </div>
          <Link href="/ta-help" className="text-sm font-semibold text-sky-400 hover:text-sky-300">
            ← Learner view
          </Link>
        </header>

        {error ? (
          <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </p>
        ) : null}

        {loading ? (
          <p className="text-sm text-white/50">Loading queue…</p>
        ) : requests.length === 0 ? (
          <div className="rounded-xl border border-dashed border-white/10 px-6 py-12 text-center text-sm text-white/50">
            Queue is empty. New Companion / TA Help requests will show up here.
          </div>
        ) : (
          <div className="space-y-4">
              {requests.map((req) => (
              <article
                key={req.id}
                className="rounded-xl border border-white/10 bg-[#1c1c1c] p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-lg font-bold text-white">{req.title}</h2>
                      <span
                        className={cn(
                          'rounded-full px-2 py-0.5 text-[10px] font-bold uppercase',
                          req.type === 'video'
                            ? 'bg-amber-500/15 text-amber-300'
                            : 'bg-sky-500/15 text-sky-300',
                        )}
                      >
                        {req.type}
                      </span>
                      <span className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] font-semibold uppercase text-white/55">
                        {req.dbStatus || req.status}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-white/45">
                      {req.learnerUsername || req.learnerEmail || 'Learner'} · {req.topic} ·{' '}
                      {formatRelativeTime(req.createdAt)}
                      {req.preferredSlot ? ` · Slot: ${req.preferredSlot}` : ''}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(req.dbStatus === 'WAITING' || req.dbStatus === 'OPEN_POOL') && (
                      <button
                        type="button"
                        disabled={busyId === req.id}
                        onClick={() => void onClaim(req.id)}
                        className="rounded-lg bg-sky-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-sky-400 disabled:opacity-50"
                      >
                        Claim
                      </button>
                    )}
                    {req.dbStatus === 'CLAIMED' || req.dbStatus === 'REPLIED' ? (
                      <>
                        <button
                          type="button"
                          disabled={busyId === req.id}
                          onClick={() => void onResolve(req.id)}
                          className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-500 disabled:opacity-50"
                        >
                          Resolve
                        </button>
                        <button
                          type="button"
                          disabled={busyId === req.id}
                          onClick={() => void onOpenPool(req.id)}
                          className="rounded-lg border border-white/15 px-3 py-1.5 text-xs font-semibold text-white/70 hover:bg-white/5 disabled:opacity-50"
                        >
                          Open pool
                        </button>
                      </>
                    ) : null}
                  </div>
                </div>

                <p className="mt-3 text-sm text-white/70">{req.description}</p>
                <p className="mt-2 text-xs text-white/40">
                  Problem: {req.problem} · Language: {req.language} · Assigned:{' '}
                  {req.assignedTo || '—'}
                </p>

                {(req.replies?.length ?? 0) > 0 ? (
                  <div className="mt-3 space-y-2 rounded-lg border border-white/5 bg-black/20 p-3">
                    {req.replies!.map((reply) => (
                      <div key={reply.id}>
                        <p className="text-[11px] text-white/40">
                          {reply.authorName} · {reply.authorRole}
                        </p>
                        <p className="text-sm text-white/75">{reply.body}</p>
                      </div>
                    ))}
                  </div>
                ) : null}

                <div className="mt-4 flex gap-2">
                  <input
                    value={replyDrafts[req.id] || ''}
                    onChange={(e) =>
                      setReplyDrafts((prev) => ({ ...prev, [req.id]: e.target.value }))
                    }
                    placeholder="Write a TA reply…"
                    className="flex-1 rounded-lg border border-white/10 bg-[#121212] px-3 py-2 text-sm text-white placeholder:text-white/35 focus:border-sky-400/40 focus:outline-none"
                  />
                  <button
                    type="button"
                    disabled={busyId === req.id || !(replyDrafts[req.id] || '').trim()}
                    onClick={() => void onReply(req.id)}
                    className="rounded-lg bg-violet-600 px-3 py-2 text-xs font-semibold text-white hover:bg-violet-500 disabled:opacity-50"
                  >
                    Reply
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
