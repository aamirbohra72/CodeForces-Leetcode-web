'use client';

import Link from 'next/link';
import { visualizerTracks } from '@/data/visualizer-tracks';
import { cn } from '@/lib/cn';

const STATUS_STYLES: Record<string, string> = {
  live: 'border-emerald-500/40 bg-emerald-500/15 text-emerald-300',
  bonus: 'border-amber-500/40 bg-amber-500/15 text-amber-300',
  new: 'border-sky-500/40 bg-sky-500/15 text-sky-300',
  'coming-soon': 'border-white/15 bg-white/5 text-white/45',
};

function HeroPreview() {
  const cells = [2, 7, 11, 15, 20, 25];
  return (
    <div className="rounded-2xl border border-[#3a3a3a] bg-[#121212] p-5 shadow-2xl">
      <div className="mb-3 flex items-center justify-between text-[10px] uppercase tracking-wider text-white/40">
        <span>two pointers · target 26</span>
        <span className="text-emerald-400">live</span>
      </div>
      <div className="flex items-end justify-center gap-2">
        {cells.map((v, i) => {
          const hot = i === 0 || i === 5;
          return (
            <div key={i} className="flex flex-col items-center gap-1">
              <div
                className={cn(
                  'flex h-11 w-11 items-center justify-center rounded-lg border text-sm font-semibold',
                  hot
                    ? 'border-emerald-400/60 bg-emerald-500/15 text-white'
                    : 'border-white/10 bg-[#1a1a1a] text-white/70',
                )}
              >
                {v}
              </div>
              <span className="text-[10px] text-white/30">[{i}]</span>
            </div>
          );
        })}
      </div>
      <div className="mt-4 flex justify-between px-2 text-xs">
        <span className="text-emerald-300">▲ left</span>
        <span className="text-sky-300">▲ right</span>
      </div>
      <p className="mt-3 rounded-lg border border-[#3a3a3a] bg-[#0d0d0d] px-3 py-2 text-center text-sm text-white/65">
        2 + 25 = 27 &gt; 26 — move right inward
      </p>
    </div>
  );
}

function ApproachPreview() {
  return (
    <div className="rounded-2xl border border-[#3a3a3a] bg-[#121212] p-5">
      <div className="mb-4 flex gap-4 text-sm">
        <span className="text-white/40">Brute force</span>
        <span className="border-b-2 border-emerald-400 pb-0.5 font-medium text-white">
          Optimized
        </span>
      </div>
      <div className="space-y-3">
        <div>
          <div className="mb-1 flex justify-between text-xs text-white/45">
            <span>time</span>
            <span className="font-mono">O(n²) → O(n)</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-white/10">
            <div className="h-full w-[28%] rounded-full bg-white/25" />
          </div>
        </div>
        <div>
          <div className="mb-1 flex justify-between text-xs text-white/45">
            <span>space</span>
            <span className="font-mono">O(1)</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-white/10">
            <div className="h-full w-full rounded-full bg-emerald-500/60" />
          </div>
        </div>
      </div>
      <p className="mt-4 text-xs text-white/45">
        Tap an approach to leap — the cost falls as you go.
      </p>
    </div>
  );
}

function TrackCard({
  track,
}: {
  track: (typeof visualizerTracks)[number];
}) {
  const playable = Boolean(track.href);
  const statusLabel =
    track.status === 'live'
      ? 'LIVE'
      : track.status === 'bonus'
        ? 'BONUS'
        : track.status === 'new'
          ? 'NEW'
          : 'SOON';

  const inner = (
    <article
      className={cn(
        'group flex h-full flex-col rounded-2xl border border-[#3a3a3a] bg-[#141414] p-5 transition',
        playable && 'hover:border-emerald-500/30 hover:bg-[#161616]',
      )}
    >
      <div className="mb-3 flex items-start justify-between gap-2">
        <div>
          <h3 className="text-lg font-semibold text-white">{track.title}</h3>
          <p className="text-sm text-white/45">{track.subtitle}</p>
        </div>
        <span
          className={cn(
            'shrink-0 rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide',
            STATUS_STYLES[track.status],
          )}
        >
          {statusLabel}
        </span>
      </div>
      <p className="mb-4 text-sm leading-relaxed text-white/55">{track.description}</p>
      <div className="mb-4 flex flex-wrap gap-1.5">
        {track.tags.slice(0, 8).map((tag) => (
          <span
            key={tag}
            className="rounded-md border border-[#3a3a3a] bg-[#1a1a1a] px-2 py-0.5 text-[11px] text-white/40"
          >
            {tag}
          </span>
        ))}
        {track.tags.length > 8 ? (
          <span className="px-1 text-[11px] text-white/30">+more</span>
        ) : null}
      </div>
      <div className="mt-auto flex items-center justify-between border-t border-[#3a3a3a] pt-3 text-sm">
        <span className="text-white/35">{track.stats}</span>
        {playable ? (
          <span className="font-medium text-emerald-300 group-hover:text-emerald-200">
            Enter →
          </span>
        ) : (
          <span className="text-white/30">Coming soon</span>
        )}
      </div>
    </article>
  );

  if (playable && track.href) {
    return (
      <Link href={track.href} className="block h-full">
        {inner}
      </Link>
    );
  }

  return inner;
}

export function VisualizerLanding() {
  return (
    <div className="min-h-screen w-full bg-[#0d0d0d] text-white">
      {/* Hero */}
      <section className="border-b border-[#2a2a2a]">
        <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 py-14 lg:grid-cols-2 lg:items-center lg:py-20">
          <div className="space-y-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400/80">
              Watch the algorithm think
            </p>
            <h1 className="text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Algorithms you can{' '}
              <span className="text-emerald-400">see.</span>
            </h1>
            <p className="max-w-xl text-base leading-relaxed text-white/55 sm:text-lg">
              Every pattern, stepped through one frame at a time — pointers gliding,
              trees recursing, DP tables filling in. Press play and watch the idea unfold.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/visualizer/dsa"
                className="rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-500"
              >
                Start with DSA →
              </Link>
              <a
                href="#tracks"
                className="rounded-full border border-white/20 px-5 py-2.5 text-sm font-medium text-white/80 transition hover:border-white/40 hover:text-white"
              >
                Choose a track
              </a>
            </div>
          </div>
          <HeroPreview />
        </div>
      </section>

      {/* Compare approaches */}
      <section className="border-b border-[#2a2a2a]">
        <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 py-14 lg:grid-cols-2 lg:items-center">
          <ApproachPreview />
          <div className="space-y-4">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Never stop at the{' '}
              <span className="text-emerald-400">first</span> answer.
            </h2>
            <p className="text-base leading-relaxed text-white/55">
              Every problem carries its approaches side by side — the obvious brute force
              and the sharp optimization. Jump between them in a tap and watch the time and
              space complexity fall, so you learn the why, not just the trick.
            </p>
            <Link
              href="/visualizer/dsa"
              className="text-sm font-medium text-emerald-300 hover:text-emerald-200"
            >
              See it on a real problem →
            </Link>
          </div>
        </div>
      </section>

      {/* Pick a track */}
      <section id="tracks" className="py-14 sm:py-16">
        <div className="mx-auto w-full max-w-6xl px-6">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Pick a track
            </h2>
            <p className="mt-2 text-white/45">
              Codeforces Visual teaches each topic the same way — by animating it. Jump
              straight in.
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            {visualizerTracks.map((track) => (
              <TrackCard key={track.id} track={track} />
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-[#2a2a2a] py-8 text-center text-xs text-white/30">
        Codeforces Visual · step-by-step pattern animations
      </footer>
    </div>
  );
}
