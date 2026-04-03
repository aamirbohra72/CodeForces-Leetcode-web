'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useState,
} from 'react';

const STORAGE_KEY = 'codeforces-dashboard-sidebar-open';

export const SIDEBAR_WIDTH_PX = 240;
export const SIDEBAR_BREAKPOINT = '(max-width: 1023px)';

type DashboardSidebarContextValue = {
  /** Sidebar panel is visible (not off-screen). */
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  toggle: () => void;
  /** Viewport matches mobile breakpoint (sidebar overlays). */
  isMobile: boolean;
  /** Stable id for `aria-controls` on the toggle. */
  sidebarId: string;
};

const DashboardSidebarContext = createContext<DashboardSidebarContextValue | null>(null);

function readInitialOpen(isMobileViewport: boolean): boolean {
  if (typeof window === 'undefined') return true;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === '0') return false;
    if (raw === '1') return true;
  } catch {
    /* ignore */
  }
  return !isMobileViewport;
}

export function DashboardSidebarProvider({ children }: { children: React.ReactNode }) {
  const sidebarId = useId().replace(/:/g, '');
  const [isMobile, setIsMobile] = useState(false);
  const [isOpen, setOpenState] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia(SIDEBAR_BREAKPOINT);
    const onChange = () => setIsMobile(mq.matches);
    onChange();
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  /** Initialise + sync open state when crossing mobile/desktop (respect saved preference). */
  useEffect(() => {
    setOpenState(readInitialOpen(isMobile));
  }, [isMobile]);

  const persist = useCallback((open: boolean) => {
    try {
      localStorage.setItem(STORAGE_KEY, open ? '1' : '0');
    } catch {
      /* ignore */
    }
  }, []);

  const setOpen = useCallback(
    (open: boolean) => {
      setOpenState(open);
      persist(open);
    },
    [persist],
  );

  const toggle = useCallback(() => {
    setOpenState((prev) => {
      const next = !prev;
      persist(next);
      return next;
    });
  }, [persist]);

  const value = useMemo(
    () => ({
      isOpen,
      setOpen,
      toggle,
      isMobile,
      sidebarId,
    }),
    [isOpen, isMobile, setOpen, sidebarId, toggle],
  );

  /** Trap scroll on mobile while the overlay sidebar is open. */
  useEffect(() => {
    if (!isMobile || !isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isMobile, isOpen]);

  /** Close sidebar with Escape (focus management is handled by the toggle button). */
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, setOpen]);

  return (
    <DashboardSidebarContext.Provider value={value}>{children}</DashboardSidebarContext.Provider>
  );
}

/** Use inside `DashboardSidebarProvider` only. */
export function useDashboardSidebar() {
  const ctx = useContext(DashboardSidebarContext);
  if (!ctx) {
    throw new Error('useDashboardSidebar must be used within DashboardSidebarProvider');
  }
  return ctx;
}

/**
 * Optional sidebar context (e.g. `AppNavbar` when used outside dashboard).
 * Returns `null` if no provider — caller should render nothing.
 */
export function useOptionalDashboardSidebar() {
  return useContext(DashboardSidebarContext);
}
