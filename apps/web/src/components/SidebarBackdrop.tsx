'use client';

import { useDashboardSidebar } from '@/contexts/DashboardSidebarContext';

/**
 * Dimmed overlay when the sidebar is open on mobile; clicking closes the sidebar.
 */
export function SidebarBackdrop() {
  const { isOpen, isMobile, setOpen } = useDashboardSidebar();

  if (!isMobile || !isOpen) return null;

  return (
    <button
      type="button"
      aria-label="Close sidebar"
      className="fixed inset-0 z-[35] bg-black/60 backdrop-blur-[1px] lg:hidden"
      onClick={() => setOpen(false)}
    />
  );
}
