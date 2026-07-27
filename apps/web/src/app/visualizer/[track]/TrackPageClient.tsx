'use client';

import { AppNavbar } from '@/components/AppNavbar';
import { Visualizer } from '@/components/visualizer';
import type { PlayableTrackId } from '@/data/visualizer-tracks';

export function TrackPageClient({ track }: { track: PlayableTrackId }) {
  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-[#1a1a1a]">
      <AppNavbar className="z-50 shrink-0 border-b border-[#3a3a3a] bg-[#1a1a1a]" />
      <Visualizer track={track} className="min-h-0 flex-1" />
    </div>
  );
}
