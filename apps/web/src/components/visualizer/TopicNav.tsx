'use client';

import Link from 'next/link';
import { visualScripts } from '@/data/visual-scripts';
import type { VisualScript } from '@/types/visual-script';
import type { PlayableTrackId } from '@/data/visualizer-tracks';
import { getTrack } from '@/data/visualizer-tracks';
import { cn } from '@/lib/cn';

type TopicNavProps = {
  track: PlayableTrackId;
  activeId: string;
  onSelect: (script: VisualScript) => void;
  className?: string;
};

export function TopicNav({ track, activeId, onSelect, className }: TopicNavProps) {
  const trackMeta = getTrack(track);
  const items = visualScripts.filter((s) => s.type === track);

  return (
    <aside
      className={cn(
        'flex w-[168px] shrink-0 flex-col border-r border-[#3a3a3a] bg-[#161616] sm:w-[200px]',
        className,
      )}
    >
      <div className="border-b border-[#3a3a3a] px-3 py-3">
        <Link
          href="/visualizer"
          className="mb-2 inline-flex items-center gap-1 text-[11px] text-white/40 transition hover:text-white/70"
        >
          ← All tracks
        </Link>
        <div className="text-sm font-semibold text-white">
          <span className="text-emerald-400">{trackMeta?.title.split(' ')[0]}</span>{' '}
          {trackMeta?.title.split(' ').slice(1).join(' ') ?? 'Visual'}
        </div>
        <p className="mt-0.5 text-[11px] text-white/40">step-by-step animations</p>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 py-3" aria-label="Visualizer topics">
        <div className="px-2 pb-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/35">
          {trackMeta?.subtitle ?? track}
        </div>
        <ul className="space-y-0.5">
          {items.map((script) => {
            const active = script.id === activeId;
            return (
              <li key={script.id}>
                <button
                  type="button"
                  onClick={() => onSelect(script)}
                  className={cn(
                    'w-full rounded-lg px-2.5 py-2 text-left text-sm transition',
                    active
                      ? 'bg-emerald-500/20 font-medium text-emerald-200'
                      : 'text-white/55 hover:bg-white/5 hover:text-white',
                  )}
                >
                  <div>{script.title}</div>
                  <div className="mt-0.5 text-[10px] text-white/35">{script.meta.section}</div>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
