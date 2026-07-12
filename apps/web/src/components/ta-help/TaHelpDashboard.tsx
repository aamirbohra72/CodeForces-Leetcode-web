'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { DashboardShell } from '@/components/DashboardShell';
import { TaHelpCreateModal, type TaHelpCreatePayload } from '@/components/ta-help/TaHelpCreateModal';
import { TaHelpRequestCard } from '@/components/ta-help/TaHelpRequestCard';
import { cn } from '@/lib/cn';
import {
  TA_HELP_TABS,
  type TaHelpRequest,
  type TaHelpStatus,
  countByStatus,
  createTaHelpRequest,
  loadTaHelpRequests,
  saveTaHelpRequests,
} from '@/data/ta-help';

export function TaHelpDashboard() {
  const [requests, setRequests] = useState<TaHelpRequest[]>([]);
  const [tab, setTab] = useState<TaHelpStatus>('resolved');
  const [createOpen, setCreateOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [topicFilter, setTopicFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    setRequests(loadTaHelpRequests());
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(null), 2800);
    return () => window.clearTimeout(t);
  }, [toast]);

  const persist = useCallback((next: TaHelpRequest[]) => {
    setRequests(next);
    saveTaHelpRequests(next);
  }, []);

  const counts = useMemo(() => countByStatus(requests), [requests]);

  const filtered = useMemo(() => {
    return requests.filter((r) => {
      if (r.status !== tab) return false;
      if (topicFilter !== 'all' && r.topic !== topicFilter) return false;
      if (typeFilter !== 'all' && r.type !== typeFilter) return false;
      return true;
    });
  }, [requests, tab, topicFilter, typeFilter]);

  const topics = useMemo(() => {
    const set = new Set(requests.map((r) => r.topic));
    return Array.from(set).sort();
  }, [requests]);

  const onCreate = useCallback(
    (payload: TaHelpCreatePayload) => {
      const next = [createTaHelpRequest(payload), ...requests];
      persist(next);
      setCreateOpen(false);
      setTab('waiting');
      setToast('Help request submitted. A TA will pick it up soon.');
    },
    [persist, requests],
  );

  const onSatisfied = useCallback(
    (id: string, satisfied: boolean) => {
      persist(
        requests.map((r) =>
          r.id === id ? { ...r, satisfied, rating: satisfied ? r.rating ?? 5 : r.rating } : r,
        ),
      );
      setToast(satisfied ? 'Thanks for the feedback.' : 'We noted your feedback.');
    },
    [persist, requests],
  );

  const onRate = useCallback(
    (id: string, rating: number) => {
      persist(requests.map((r) => (r.id === id ? { ...r, rating, satisfied: true } : r)));
      setToast('Rating saved. Thanks!');
    },
    [persist, requests],
  );

  return (
    <DashboardShell mainClassName="relative min-h-0 overflow-y-auto p-4 pb-20 md:p-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-bold text-white md:text-3xl">TA Help</h1>
              <span className="rounded-full bg-emerald-600/90 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                Course active
              </span>
            </div>
            <p className="mt-2 text-sm text-[#a0a0a0]">
              Raise text or video help requests and track TA replies in one place.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setCreateOpen(true)}
            className="shrink-0 rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600"
          >
            Ask Support
          </button>
        </header>

        {/* Status tabs */}
        <nav
          className="flex gap-1 overflow-x-auto border-b border-[#3a3a3a]"
          aria-label="Request status"
        >
          {TA_HELP_TABS.map((t) => {
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={cn(
                  'whitespace-nowrap border-b-2 px-3 py-3 text-sm font-medium transition',
                  active
                    ? 'border-sky-500 text-sky-400'
                    : 'border-transparent text-[#888] hover:text-[#c4c4c4]',
                )}
              >
                {t.label} ({counts[t.id]})
              </button>
            );
          })}
        </nav>

        <div
          className="flex items-start gap-3 rounded-lg border border-violet-500/25 bg-violet-500/10 px-4 py-3 text-sm text-[#c4b5fd]"
          role="note"
        >
          <span className="mt-0.5 shrink-0" aria-hidden>
            ⏱️
          </span>
          <p>
            Requests will be marked resolved if you don&apos;t take any action. Check the time frame
            of a request for accurate details.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setShowFilters((v) => !v)}
            className="inline-flex items-center gap-2 text-sm font-semibold text-sky-400 hover:text-sky-300"
          >
            <span aria-hidden>⚙️</span>
            {showFilters ? 'Hide filters' : 'See all filters'}
          </button>
          <p className="text-xs text-[#777]">
            Showing {filtered.length} of {counts[tab]} in this tab
          </p>
        </div>

        {showFilters && (
          <div className="flex flex-wrap gap-3 rounded-xl border border-[#3a3a3a] bg-[#2a2a2a] p-4">
            <label className="text-xs text-[#a0a0a0]">
              Topic
              <select
                value={topicFilter}
                onChange={(e) => setTopicFilter(e.target.value)}
                className="mt-1 block rounded-lg border border-[#3a3a3a] bg-[#1a1a1a] px-3 py-2 text-sm text-white outline-none focus:border-emerald-500/60"
              >
                <option value="all">All topics</option>
                {topics.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-xs text-[#a0a0a0]">
              Type
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="mt-1 block rounded-lg border border-[#3a3a3a] bg-[#1a1a1a] px-3 py-2 text-sm text-white outline-none focus:border-emerald-500/60"
              >
                <option value="all">All types</option>
                <option value="text">Text HR</option>
                <option value="video">Video call HR</option>
              </select>
            </label>
            {(topicFilter !== 'all' || typeFilter !== 'all') && (
              <button
                type="button"
                onClick={() => {
                  setTopicFilter('all');
                  setTypeFilter('all');
                }}
                className="self-end text-xs font-semibold text-[#888] hover:text-white"
              >
                Clear filters
              </button>
            )}
          </div>
        )}

        <div className="space-y-4">
          {filtered.length === 0 ? (
            <div className="rounded-xl border border-dashed border-[#3a3a3a] bg-[#222] px-6 py-12 text-center">
              <p className="text-sm font-medium text-[#c4c4c4]">No requests in this tab</p>
              <p className="mt-1 text-xs text-[#777]">
                Raise a new help request or switch tabs to see other statuses.
              </p>
              <button
                type="button"
                onClick={() => setCreateOpen(true)}
                className="mt-4 rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600"
              >
                Ask Support
              </button>
            </div>
          ) : (
            filtered.map((req) => (
              <TaHelpRequestCard
                key={req.id}
                request={req}
                onSatisfied={onSatisfied}
                onRate={onRate}
              />
            ))
          )}
        </div>
      </div>

      {/* Floating new request */}
      <button
        type="button"
        onClick={() => setCreateOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-sky-600 text-2xl text-white shadow-lg shadow-black/40 transition hover:bg-sky-500"
        aria-label="New help request"
        title="New help request"
      >
        📝
      </button>

      <TaHelpCreateModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSubmit={onCreate}
      />

      {toast && (
        <div
          role="status"
          className="fixed bottom-24 right-6 z-[1100] max-w-sm rounded-lg bg-emerald-700 px-4 py-3 text-sm font-medium text-white shadow-lg"
        >
          {toast}
        </div>
      )}
    </DashboardShell>
  );
}
