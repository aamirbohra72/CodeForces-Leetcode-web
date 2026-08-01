'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { SignedIn, SignedOut, SignInButton, UserButton, useClerk } from '@clerk/nextjs';
import { getUser, isAdmin } from '@/lib/auth';
import { clearLocalAuth } from '@/components/ClerkApiBridge';
import { cn } from '@/lib/cn';
import { SidebarTrigger } from '@/components/SidebarTrigger';

export type AppNavbarProps = {
  className?: string;
  activeHref?: string;
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
  { href: '/affiliate', label: 'Affiliate' },
  { href: '/referral', label: 'Referral' },
] as const;

function linkIsActive(pathname: string, href: string, override?: string) {
  if (override) {
    return override === href || (href !== '/' && override.startsWith(href));
  }
  if (pathname === href) return true;
  if (
    href === '/leaderboard' ||
    href === '/blog' ||
    href === '/projects' ||
    href === '/billing' ||
    href === '/affiliate' ||
    href === '/referral'
  ) {
    return pathname === href;
  }
  return pathname.startsWith(`${href}/`);
}

export function AppNavbar({ className, activeHref, activePage }: AppNavbarProps) {
  const pathname = usePathname() ?? '';
  const resolvedActive = activeHref ?? activePage;
  const { signOut } = useClerk();
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
    const onAuth = () => refreshUser();
    window.addEventListener('auth-changed', onAuth);
    window.addEventListener('storage', onAuth);
    return () => {
      window.removeEventListener('auth-changed', onAuth);
      window.removeEventListener('storage', onAuth);
    };
  }, [refreshUser]);

  const handleLogout = async () => {
    clearLocalAuth();
    await signOut({ redirectUrl: '/' });
    refreshUser();
  };

  return (
    <nav
      role="navigation"
      aria-label="Main"
      className={cn('border-b border-nav-border bg-nav-bg text-white', className)}
    >
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:gap-4 sm:px-6 lg:px-8">
        <div className="relative z-10 flex shrink-0 items-center gap-2 bg-nav-bg sm:gap-3">
          <SidebarTrigger />
          <Link
            href="/"
            className="font-nav-brand truncate text-xl font-bold tracking-tight text-white transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#121212]"
          >
            Codeforces
          </Link>
        </div>

        <div className="hidden min-w-0 flex-1 items-center overflow-x-auto md:flex [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex items-center gap-x-0.5 lg:gap-x-1">
            {PRIMARY_LINKS.map(({ href, label }) => {
              const active = linkIsActive(pathname, href, resolvedActive);
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    'whitespace-nowrap rounded-md px-2 py-1.5 text-sm font-medium text-white/90 transition-colors hover:bg-white/5 hover:text-white lg:px-2.5',
                    active && 'bg-white/10 text-green-400',
                  )}
                  aria-current={active ? 'page' : undefined}
                >
                  {label}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="relative z-10 ml-auto flex shrink-0 items-center gap-x-1 bg-nav-bg sm:gap-x-3">
          <SignedIn>
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
            {user && (
              <Link
                href={`/${user.username}`}
                className="flex items-center gap-2 rounded-full bg-white/10 py-1 pl-1 pr-3 text-sm text-white transition-colors hover:bg-white/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-green-600 text-xs font-bold text-white">
                  {user.username.charAt(0).toUpperCase()}
                </span>
                <span className="hidden max-w-[120px] truncate sm:inline">{user.username}</span>
              </Link>
            )}
            <UserButton afterSignOutUrl="/" />
            <button
              type="button"
              onClick={() => void handleLogout()}
              className="rounded-md border border-white/20 bg-transparent px-3 py-1.5 text-sm font-medium text-white/90 transition-colors hover:bg-white/10"
            >
              Logout
            </button>
          </SignedIn>
          <SignedOut>
            <SignInButton mode="modal">
              <button
                type="button"
                className="rounded-md bg-emerald-500 px-3 py-1.5 text-sm font-semibold text-white hover:bg-emerald-600"
              >
                Login
              </button>
            </SignInButton>
            <Link
              href="/sign-up"
              className="rounded-md px-2.5 py-1.5 text-sm font-medium text-white/90 hover:bg-white/5"
            >
              Sign up
            </Link>
          </SignedOut>
        </div>
      </div>
    </nav>
  );
}
