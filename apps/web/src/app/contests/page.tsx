'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Navbar } from '@/components/Navbar';
import type { Contest, ContestStatus } from '@codeforces/types';

export default function ContestsPage() {
  const [contests, setContests] = useState<Contest[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<ContestStatus | ''>('');

  useEffect(() => {
    fetchContests();
  }, [statusFilter]);

  const fetchContests = async () => {
    try {
      setLoading(true);
      const params = statusFilter ? `?status=${statusFilter}` : '';
      const response = await api.get<{ data: Contest[] }>(`/contests${params}`);
      setContests(response.data);
    } catch (error) {
      console.error('Failed to fetch contests:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: ContestStatus) => {
    switch (status) {
      case 'UPCOMING':
        return '#ffa500';
      case 'LIVE':
        return '#00ff00';
      case 'ENDED':
        return '#888';
      default:
        return '#000';
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
          <h1>Contests</h1>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as ContestStatus | '')}
            style={{ padding: '0.5rem' }}
          >
            <option value="">All Status</option>
            <option value="UPCOMING">Upcoming</option>
            <option value="LIVE">Live</option>
            <option value="ENDED">Ended</option>
          </select>
        </div>

        {contests.length === 0 ? (
          <p>No contests found</p>
        ) : (
          <div>
            {contests.map((contest) => (
              <div key={contest.id} className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <div>
                    <Link href={`/contests/${contest.id}`}>
                      <h2 style={{ marginBottom: '0.5rem' }}>{contest.name}</h2>
                    </Link>
                    {contest.description && <p style={{ marginBottom: '1rem' }}>{contest.description}</p>}
                    <div style={{ fontSize: '0.9rem', color: '#666' }}>
                      <div>Start: {new Date(contest.startTime).toLocaleString()}</div>
                      <div>End: {new Date(contest.endTime).toLocaleString()}</div>
                    </div>
                  </div>
                  <span
                    style={{
                      padding: '0.25rem 0.75rem',
                      borderRadius: '4px',
                      background: getStatusColor(contest.status),
                      color: contest.status === 'LIVE' ? '#000' : '#fff',
                      fontWeight: 'bold',
                    }}
                  >
                    {contest.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}


