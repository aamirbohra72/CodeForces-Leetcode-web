'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { isAdmin } from '@/lib/auth';
import { Navbar } from '@/components/Navbar';
import type { Contest } from '@codeforces/types';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [contests, setContests] = useState<Contest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAdmin()) {
      router.push('/');
      return;
    }
    fetchContests();
  }, [router]);

  const fetchContests = async () => {
    try {
      const response = await api.get<{ data: Contest[] }>('/contests');
      setContests(response.data);
    } catch (error) {
      console.error('Failed to fetch contests:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="container">Loading...</div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h1>Admin Dashboard</h1>
          <Link href="/admin/contest/create" className="btn btn-primary">
            Create Contest
          </Link>
        </div>

        <h2>Contests</h2>
        {contests.length === 0 ? (
          <p>No contests found</p>
        ) : (
          <div>
            {contests.map((contest) => (
              <div key={contest.id} className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <div>
                    <Link href={`/contests/${contest.id}`}>
                      <h3 style={{ marginBottom: '0.5rem' }}>{contest.name}</h3>
                    </Link>
                    {contest.description && <p style={{ marginBottom: '1rem' }}>{contest.description}</p>}
                    <div style={{ fontSize: '0.9rem', color: '#666' }}>
                      <div>Start: {new Date(contest.startTime).toLocaleString()}</div>
                      <div>End: {new Date(contest.endTime).toLocaleString()}</div>
                      <div>Status: {contest.status}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}


