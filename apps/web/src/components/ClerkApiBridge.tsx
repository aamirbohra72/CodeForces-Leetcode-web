'use client';

import { useAuth } from '@clerk/nextjs';
import { useEffect, useRef } from 'react';
import { setToken, setUser, removeToken, removeUser } from '@/lib/auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3001/api';

export function clearLocalAuth() {
  removeToken();
  removeUser();
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('auth-changed'));
  }
}

/**
 * Clerk is the only UI auth. After sign-in we exchange for our API JWT
 * so Express routes (leaderboard, courses, payments, etc.) keep working.
 */
export function ClerkApiBridge() {
  const { isSignedIn, isLoaded, getToken } = useAuth();
  const exchanging = useRef(false);
  const lastSignedIn = useRef<boolean | null>(null);

  useEffect(() => {
    if (!isLoaded) return;

    // Signed out → drop legacy JWT/user from localStorage
    if (!isSignedIn) {
      if (lastSignedIn.current === true) {
        clearLocalAuth();
      }
      lastSignedIn.current = false;
      return;
    }

    lastSignedIn.current = true;
    if (exchanging.current) return;
    exchanging.current = true;

    (async () => {
      try {
        const clerkToken = await getToken();
        if (!clerkToken) return;

        const res = await fetch(`${API_URL}/auth/clerk-exchange`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${clerkToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (!res.ok) {
          const body = (await res.json().catch(() => ({}))) as { error?: string };
          console.error('[ClerkApiBridge]', body.error || res.statusText);
          return;
        }

        const data = (await res.json()) as {
          token: string;
          user: { id: string; email: string; username: string; role: 'ADMIN' | 'USER' };
        };
        setToken(data.token);
        setUser(data.user);
        window.dispatchEvent(new Event('auth-changed'));
      } catch (err) {
        console.error('[ClerkApiBridge] exchange failed', err);
      } finally {
        exchanging.current = false;
      }
    })();
  }, [isLoaded, isSignedIn, getToken]);

  return null;
}
