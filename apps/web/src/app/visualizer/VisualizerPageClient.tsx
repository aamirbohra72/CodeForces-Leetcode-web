'use client';

import { AppNavbar } from '@/components/AppNavbar';
import { VisualizerLanding } from '@/components/visualizer/VisualizerLanding';

export function VisualizerPageClient() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-[#0d0d0d]">
      <AppNavbar className="sticky top-0 z-50 shrink-0 border-b border-[#2a2a2a] bg-[#0d0d0d]/95 backdrop-blur" />
      <VisualizerLanding />
    </div>
  );
}
