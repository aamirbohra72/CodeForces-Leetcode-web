'use client';

import { useState } from 'react';
import { cn } from '@/lib/cn';
import {
  type TaHelpRequest,
  formatRelativeTime,
} from '@/data/ta-help';

type TaHelpRequestCardProps = {
  request: TaHelpRequest;
  onSatisfied: (id: string, satisfied: boolean) => void;
  onRate: (id: string, rating: number) => void;
};

export function TaHelpRequestCard({ request, onSatisfied, onRate }: TaHelpRequestCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [showDetail, setShowDetail] = useState(false);

  const typeLabel = request.type === 'video' ? 'VIDEO CALL HR' : 'TEXT HR';
  const typeClass =
    request.type === 'video'
      ? 'border-amber-500/40 bg-amber-500/15 text-amber-300'
      : 'border-sky-500/40 bg-sky-500/15 text-sky-300';

  return (
    <article className="rounded-xl border border-[#3a3a3a] bg-[#2a2a2a] p-5 transition hover:border-[#4a4a4a]">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base font-bold uppercase tracking-wide text-white md:text-lg">
              {request.title}
            </h3>
            <span
              className={cn(
                'rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide',
                typeClass,
              )}
            >
              {typeLabel}
            </span>
            <button
              type="button"
              onClick={() => setShowDetail((v) => !v)}
              className="text-xs font-semibold text-sky-400 hover:text-sky-300"
            >
              {showDetail ? 'Hide details' : 'Quick view'}
            </button>
          </div>

          <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-[#888]">Assigned to</dt>
              <dd className="font-medium text-[#e5e5e5]">
                {request.assignedTo ?? 'Unassigned'}
              </dd>
            </div>
            <div>
              <dt className="text-[#888]">Created</dt>
              <dd className="font-medium text-[#e5e5e5]">
                {formatRelativeTime(request.createdAt)}
              </dd>
            </div>
            <div>
              <dt className="text-[#888]">Problem</dt>
              <dd className="font-medium text-[#e5e5e5]">{request.problem}</dd>
            </div>
            <div>
              <dt className="text-[#888]">Topic</dt>
              <dd className="font-medium text-[#e5e5e5]">{request.topic}</dd>
            </div>
          </dl>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-[#3a3a3a] bg-[#1a1a1a] px-2.5 py-1 text-xs text-[#b0b0b0]">
              {request.language}
            </span>
            <span className="text-xs text-[#777]">
              Raised {formatRelativeTime(request.createdAt).toLowerCase()}
            </span>
          </div>

          {(showDetail || expanded) && (
            <p className="mt-3 text-sm leading-relaxed text-[#a0a0a0]">
              {request.description}
            </p>
          )}
          {!showDetail && !expanded && request.description.length > 120 && (
            <button
              type="button"
              onClick={() => setExpanded(true)}
              className="mt-2 text-xs font-semibold text-sky-400 hover:text-sky-300"
            >
              View more
            </button>
          )}
        </div>

        <div className="flex w-full shrink-0 flex-col gap-3 lg:w-56">
          <div className="flex items-center justify-between gap-2 text-sm text-[#b0b0b0] lg:justify-end">
            <span className="inline-flex items-center gap-1.5">
              <span aria-hidden>💬</span>
              View comments
              {request.commentCount > 0 && (
                <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-emerald-600 px-1.5 text-[10px] font-bold text-white">
                  {request.commentCount}
                </span>
              )}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setShowDetail(true)}
            className="rounded-full bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-500"
          >
            {request.type === 'video' && request.hasRecording ? 'View recording' : 'View request'}
          </button>

          {request.status === 'resolved' && (
            <div className="rounded-lg border border-[#3a3a3a] bg-[#1a1a1a] p-3">
              {request.satisfied == null ? (
                <>
                  <p className="text-xs font-medium text-[#c4c4c4]">Satisfied with the solution?</p>
                  <div className="mt-2 flex gap-2">
                    <button
                      type="button"
                      onClick={() => onSatisfied(request.id, true)}
                      className="flex-1 rounded-full border border-emerald-500/50 bg-emerald-500/15 px-3 py-1.5 text-xs font-semibold text-emerald-300 hover:bg-emerald-500/25"
                    >
                      Yes
                    </button>
                    <button
                      type="button"
                      onClick={() => onSatisfied(request.id, false)}
                      className="flex-1 rounded-full border border-red-500/50 bg-red-500/15 px-3 py-1.5 text-xs font-semibold text-red-300 hover:bg-red-500/25"
                    >
                      No
                    </button>
                  </div>
                  <p className="mt-2 text-[10px] text-[#777]">Your rating helps your TA improve.</p>
                </>
              ) : (
                <>
                  <p className="text-xs font-medium text-[#c4c4c4]">Your rating to the TA</p>
                  <div className="mt-2 flex gap-1" role="group" aria-label="Rate TA">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => onRate(request.id, star)}
                        className={cn(
                          'text-lg leading-none transition',
                          (request.rating ?? 0) >= star ? 'text-emerald-400' : 'text-[#3a3a3a] hover:text-[#666]',
                        )}
                        aria-label={`${star} star${star > 1 ? 's' : ''}`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                  {request.satisfied && (
                    <p className="mt-1 text-[10px] text-emerald-400/80">Marked satisfied</p>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
