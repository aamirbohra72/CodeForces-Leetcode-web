'use client';

import type { ReactNode } from 'react';
import { AppNavbar } from '@/components/AppNavbar';
import { Sidebar } from '@/components/Sidebar';
import { cn } from '@/lib/cn';

export type DashboardShellProps = {
  children: ReactNode;
  /** Classes merged onto the scrollable `<main>` region (padding, flex, etc.). */
  mainClassName?: string;
  /** Classes for the outer `<nav>` from AppNavbar (e.g. sticky). */
  navClassName?: string;
};

/**
 * Shared layout: dark AppNavbar + fixed sidebar + main content area.
 * Matches the `/learn` dashboard chrome (theme from product screenshots).
 */
export function DashboardShell({ children, mainClassName, navClassName }: DashboardShellProps) {
  return (
    <>
      <AppNavbar className={cn('shrink-0', navClassName)} />
      <div className="flex w-full min-h-[calc(100vh-3.5rem)]">
        <Sidebar />
        <main
          className={cn(
            'ml-[240px] min-h-[calc(100vh-3.5rem)] flex-1 bg-[#1a1a1a] text-white antialiased',
            mainClassName,
          )}
        >
          {children}
        </main>
      </div>
    </>
  );
}
