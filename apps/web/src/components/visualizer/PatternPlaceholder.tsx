'use client';

import type { DsaPattern } from '@/data/dsa-pattern-catalog';
import { cn } from '@/lib/cn';

type PatternPlaceholderProps = {
  pattern: DsaPattern;
  className?: string;
};

const DIFFICULTY_STYLES: Record<string, string> = {
  Easy: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300',
  Medium: 'border-amber-500/30 bg-amber-500/10 text-amber-300',
  Hard: 'border-rose-500/30 bg-rose-500/10 text-rose-300',
};

export function PatternPlaceholder({ pattern, className }: PatternPlaceholderProps) {
  return (
    <div
      className={cn(
        'flex min-h-0 flex-1 flex-col items-center justify-center overflow-auto p-8 text-center',
        className,
      )}
    >
      <div className="max-w-md space-y-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/40">
          {pattern.categoryTitle}
        </p>
        <h2 className="text-2xl font-semibold text-white">{pattern.title}</h2>
        <span
          className={cn(
            'inline-block rounded-md border px-2 py-0.5 text-[10px] font-semibold uppercase',
            DIFFICULTY_STYLES[pattern.difficulty],
          )}
        >
          {pattern.difficulty}
        </span>
        <p className="text-sm leading-relaxed text-white/50">
          Step-by-step animation for this pattern is on the way. Pick a problem marked with{' '}
          <span className="text-emerald-400">▶</span> in the sidebar to watch a live walkthrough.
        </p>
        <div className="rounded-xl border border-dashed border-[#3a3a3a] bg-[#141414] px-4 py-6">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full border border-[#3a3a3a] bg-[#1a1a1a] text-xl text-white/30">
            ▶
          </div>
          <p className="text-xs text-white/35">
            Visualizer rolling out pattern by pattern — Two Pointers, Sliding Window, Trees, Graphs,
            DP, and more.
          </p>
        </div>
      </div>
    </div>
  );
}
