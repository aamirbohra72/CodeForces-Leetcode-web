'use client';

import type { DsaTopic } from '@/data/dsa-sheet';
import { countCompletedForTopic } from '@/data/dsa-sheet';
import { DsaProblemTable } from '@/components/dsa-sheet/DsaProblemTable';
import { cn } from '@/lib/cn';

type DsaTopicAccordionProps = {
  topic: DsaTopic;
  isOpen: boolean;
  onToggle: () => void;
  completedIds: Set<string>;
  onToggleProblem: (problemId: string, completed: boolean) => void;
};

export function DsaTopicAccordion({
  topic,
  isOpen,
  onToggle,
  completedIds,
  onToggleProblem,
}: DsaTopicAccordionProps) {
  const total = topic.problems.length;
  const done = countCompletedForTopic(topic, completedIds);
  const pct = total === 0 ? 0 : Math.min(100, Math.round((done / total) * 100));

  return (
    <div className="overflow-hidden rounded-xl border border-white/[0.08] bg-[#2a2a2a] shadow-sm shadow-black/20">
      <button
        type="button"
        id={`dsa-topic-${topic.id}`}
        aria-expanded={isOpen}
        aria-controls={`dsa-panel-${topic.id}`}
        onClick={onToggle}
        className={cn(
          'flex w-full items-center gap-3 px-4 py-4 text-left transition-colors',
          'hover:bg-white/[0.04] focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-inset',
        )}
      >
        <span
          className={cn(
            'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 text-white/60 transition-transform',
            isOpen && 'rotate-90 text-green-400 border-green-500/30',
          )}
          aria-hidden
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <span className="font-nav-brand text-base font-semibold text-white sm:text-lg">
          {topic.order}. {topic.title}
        </span>
        <span className="ml-auto shrink-0 text-right text-sm text-white/45">
          <span className="tabular-nums">
            {done}/{total} completed
          </span>{' '}
          <span className="ml-2 font-semibold text-amber-400 tabular-nums">{pct}%</span>
        </span>
      </button>
      <div id={`dsa-panel-${topic.id}`} role="region" aria-labelledby={`dsa-topic-${topic.id}`} hidden={!isOpen}>
        <div className="border-t border-white/[0.08] bg-[#1a1a1a] p-4 sm:p-5">
          <DsaProblemTable problems={topic.problems} completedIds={completedIds} onToggleComplete={onToggleProblem} />
        </div>
      </div>
    </div>
  );
}
