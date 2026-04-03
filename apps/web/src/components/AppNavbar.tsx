'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { getUser, isAdmin, logout } from '@/lib/auth';
import { cn } from '@/lib/cn';

export type AppNavbarProps = {
  /** Extra classes on the outer `<nav>` (e.g. sticky top-0 z-50). */
  className?: string;
  /**
   * When set, highlights this href instead of inferring from the current pathname.
   * Use for special layouts or Storybook.
   */
  activeHref?: string;
  /** Same as `activeHref` (alternative prop name). */
  activePage?: string;
};

const PRIMARY_LINKS = [
  { href: '/practice', label: 'Practice' },
  { href: '/learn', label: 'Courses' },
  { href: '/contests', label: 'Contests' },
  { href: '/leaderboard', label: 'Leaderboard' },
  { href: '/projects', label: 'Projects' },
  { href: '/blog', label: 'Blog' },
  { href: '/billing', label: 'Billing' },
] as const;

/** Match route segment: exact for leaderboard, prefix for nested routes. */
function linkIsActive(pathname: string, href: string, override?: string) {
  if (override) {
    return override === href || (href !== '/' && override.startsWith(href));
  }
  if (pathname === href) return true;
  if (href === '/leaderboard' || href === '/blog' || href === '/projects' || href === '/billing') {
    return pathname === href;
  }
  return pathname.startsWith(`${href}/`);
}

export function AppNavbar({ className, activeHref, activePage }: AppNavbarProps) {
  const pathname = usePathname() ?? '';
  const resolvedActive = activeHref ?? activePage;
  const [user, setUser] = useState<ReturnType<typeof getUser>>(null);
  const [isAdminUser, setIsAdminUser] = useState(false);
  const [streak, setStreak] = useState(0);

  const refreshUser = useCallback(() => {
    setUser(getUser());
    setIsAdminUser(isAdmin());
    const raw = typeof window !== 'undefined' ? localStorage.getItem('streak') : null;
    setStreak(parseInt(raw ?? '0', 10) || 0);
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'streak' || e.key === null) refreshUser();
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [refreshUser]);

  const handleLogout = () => {
    logout();
    refreshUser();
  };

  return (
    <nav
      role="navigation"
      aria-label="Main"
      className={cn('border-b border-nav-border bg-nav-bg text-white', className)}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="font-nav-brand text-xl font-bold tracking-tight text-white transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#121212]"
        >
          Codeforces
        </Link>

        <div className="flex flex-wrap items-center justify-end gap-x-1 gap-y-2 sm:gap-x-3">
          {PRIMARY_LINKS.map(({ href, label }) => {
            const active = linkIsActive(pathname, href, resolvedActive);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'rounded-md px-2.5 py-1.5 text-sm font-medium text-white/90 transition-colors hover:bg-white/5 hover:text-white',
                  active && 'bg-white/10 text-green-400',
                )}
                aria-current={active ? 'page' : undefined}
              >
                {label}
              </Link>
            );
          })}

          {user ? (
            <>
              {isAdminUser && (
                <Link
                  href="/admin/dashboard"
                  className={cn(
                    'rounded-md px-2.5 py-1.5 text-sm font-medium text-white/90 hover:bg-white/5 hover:text-white',
                    pathname.startsWith('/admin') && 'bg-white/10 text-green-400',
                  )}
                >
                  Admin
                </Link>
              )}
              <Link
                href="/submissions"
                className={cn(
                  'rounded-md px-2.5 py-1.5 text-sm font-medium text-white/90 hover:bg-white/5 hover:text-white',
                  pathname.startsWith('/submissions') && 'bg-white/10 text-green-400',
                )}
              >
                Submissions
              </Link>
              <div
                className="hidden items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-amber-400 sm:flex"
                title="Streak"
              >
                <span className="text-base" aria-hidden>
                  🔥
                </span>
                <span className="text-xs font-semibold">{streak} Day Streak</span>
              </div>
              <Link
                href={`/${user.username}`}
                className="flex items-center gap-2 rounded-full bg-white/10 py-1 pl-1 pr-3 text-sm text-white transition-colors hover:bg-white/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-green-600 text-xs font-bold text-white">
                  {user.username.charAt(0).toUpperCase()}
                </span>
                <span className="hidden max-w-[120px] truncate sm:inline">{user.username}</span>
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-md border border-white/20 bg-transparent px-3 py-1.5 text-sm font-medium text-white/90 transition-colors hover:bg-white/10"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className={cn(
                'rounded-md px-2.5 py-1.5 text-sm font-medium text-white/90 transition-colors hover:bg-white/5 hover:text-white',
                pathname.startsWith('/login') && 'bg-white/10 text-green-400',
              )}
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
