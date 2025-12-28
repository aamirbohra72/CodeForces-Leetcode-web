'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getUser, logout, isAdmin } from '@/lib/auth';

export function Navbar() {
  const [user, setUser] = useState<ReturnType<typeof getUser>>(null);
  const [isAdminUser, setIsAdminUser] = useState(false);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const currentUser = getUser();
    setUser(currentUser);
    setIsAdminUser(isAdmin());
    // Get streak from localStorage or API
    const savedStreak = localStorage.getItem('streak') || '0';
    setStreak(parseInt(savedStreak, 10));
  }, []);

  const handleLogout = () => {
    logout();
  };

  return (
    <nav
      style={{
        background: '#1a1a1a',
        color: 'white',
        padding: '1rem',
        marginBottom: '2rem',
      }}
    >
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
          Codeforces
        </Link>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <Link href="/practice">Practice</Link>
          <Link href="/learn">Courses</Link>
          <Link href="/contests">Contests</Link>
          {user ? (
            <>
              {isAdminUser && <Link href="/admin/dashboard">Admin</Link>}
              <Link href="/submissions">Submissions</Link>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fbbf24' }}>
                <span style={{ fontSize: '1.2rem' }}>🔥</span>
                <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>{streak} Day Streak</span>
              </div>
              <Link
                href={`/${user.username}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  background: '#2a2a2a',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '20px',
                  cursor: 'pointer',
                  textDecoration: 'none',
                  color: 'white',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#3a3a3a';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#2a2a2a';
                }}
              >
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: '#22c55e',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '0.9rem',
                  }}
                >
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <span style={{ fontSize: '0.9rem' }}>{user.username}</span>
              </Link>
              <button onClick={handleLogout} className="btn btn-secondary" style={{ fontSize: '0.875rem' }}>
                Logout
              </button>
            </>
          ) : (
            <Link href="/login">Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
}

