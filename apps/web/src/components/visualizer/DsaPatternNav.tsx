'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  categoriesWithPatterns,
  DSA_PATTERN_CATEGORIES,
  getDsaPatternStats,
  searchDsaPatterns,
  type DsaPattern,
} from '@/data/dsa-pattern-catalog';
import { getTrack } from '@/data/visualizer-tracks';
import { cn } from '@/lib/cn';

type DsaPatternNavProps = {
  activePatternId: string;
  onSelect: (pattern: DsaPattern) => void;
  className?: string;
};

const DIFFICULTY_DOT: Record<string, string> = {
  Easy: 'bg-emerald-400',
  Medium: 'bg-amber-400',
  Hard: 'bg-rose-400',
};

export function DsaPatternNav({ activePatternId, onSelect, className }: DsaPatternNavProps) {
  const trackMeta = getTrack('dsa');
  const stats = getDsaPatternStats();
  const [query, setQuery] = useState('');
  const [openCategories, setOpenCategories] = useState<Set<string>>(() => {
    const active = DSA_PATTERN_CATEGORIES.find((c) =>
      c.patterns.some((p) => p.id === activePatternId),
    );
    return new Set(active ? [active.id] : [DSA_PATTERN_CATEGORIES[0]?.id].filter(Boolean));
  });

  const filteredIds = useMemo(() => {
    if (!query.trim()) return null;
    return new Set(searchDsaPatterns(query).map((p) => p.id));
  }, [query]);

  const visibleCategories = useMemo(
    () => categoriesWithPatterns(filteredIds),
    [filteredIds],
  );

  const toggleCategory = (id: string) => {
    setOpenCategories((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <aside
      className={cn(
        'flex w-[220px] shrink-0 flex-col border-r border-[#3a3a3a] bg-[#161616] lg:w-[260px]',
        className,
      )}
    >
      <div className="shrink-0 border-b border-[#3a3a3a] px-3 py-3">
        <Link
          href="/visualizer"
          className="mb-2 inline-flex items-center gap-1 text-[11px] text-white/40 transition hover:text-white/70"
        >
          ← All tracks
        </Link>
        <div className="text-sm font-semibold text-white">
          <span className="text-emerald-400">DSA</span> Visual
        </div>
        <p className="mt-0.5 text-[11px] text-white/40">
          {stats.animated} animated · {stats.total} patterns
        </p>
        <div className="relative mt-3">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search patterns…"
            className="w-full rounded-lg border border-[#3a3a3a] bg-[#0d0d0d] py-2 pl-3 pr-8 text-xs text-white placeholder:text-white/30 outline-none focus:border-emerald-500/40"
          />
          <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-white/25">
            ⌘K
          </span>
        </div>
      </div>

      <nav
        className="min-h-0 flex-1 overflow-y-auto px-2 py-2"
        aria-label={trackMeta?.subtitle ?? 'DSA patterns'}
      >
        {visibleCategories.length === 0 ? (
          <p className="px-2 py-4 text-center text-xs text-white/35">No patterns match</p>
        ) : (
          visibleCategories.map((category) => {
            const isOpen = openCategories.has(category.id) || Boolean(query.trim());
            return (
              <div key={category.id} className="mb-1">
                <button
                  type="button"
                  onClick={() => toggleCategory(category.id)}
                  className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-[11px] font-semibold uppercase tracking-[0.1em] text-white/40 transition hover:bg-white/5 hover:text-white/60"
                >
                  <span
                    className={cn(
                      'text-[10px] transition-transform',
                      isOpen && 'rotate-90 text-emerald-400',
                    )}
                  >
                    ▸
                  </span>
                  <span className="min-w-0 flex-1 truncate">{category.title}</span>
                  <span className="shrink-0 tabular-nums text-white/25">
                    {category.patterns.length}
                  </span>
                </button>
                {isOpen ? (
                  <ul className="mb-2 space-y-0.5 pl-1">
                    {category.patterns.map((pattern) => {
                      const active = pattern.id === activePatternId;
                      return (
                        <li key={pattern.id}>
                          <button
                            type="button"
                            onClick={() => onSelect(pattern)}
                            className={cn(
                              'flex w-full items-start gap-2 rounded-lg px-2 py-1.5 text-left text-[13px] transition',
                              active
                                ? 'bg-emerald-500/20 font-medium text-emerald-200'
                                : 'text-white/55 hover:bg-white/5 hover:text-white',
                            )}
                          >
                            <span
                              className={cn(
                                'mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full',
                                DIFFICULTY_DOT[pattern.difficulty],
                              )}
                              aria-hidden
                            />
                            <span className="min-w-0 flex-1 leading-snug">{pattern.title}</span>
                            {pattern.visualScriptId ? (
                              <span
                                className="mt-0.5 shrink-0 text-[9px] font-bold uppercase text-emerald-400"
                                title="Animated"
                              >
                                ▶
                              </span>
                            ) : null}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                ) : null}
              </div>
            );
          })
        )}
      </nav>
    </aside>
  );
}
