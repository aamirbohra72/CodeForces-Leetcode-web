'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Navbar } from '@/components/Navbar';

interface LeaderboardEntry {
  rank: number;
  userId: string;
  username: string;
  email: string;
  score: number;
}

export default function LeaderboardPage() {
  const params = useParams();
  const contestId = params.id as string;
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [status, setStatus] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (contestId) {
      fetchLeaderboard();
    }
  }, [contestId]);

  const fetchLeaderboard = async () => {
    try {
      const data = await api.get<{ leaderboard: LeaderboardEntry[]; status: string }>(
        `/leaderboard/contest/${contestId}`
      );
      setLeaderboard(data.leaderboard);
      setStatus(data.status);
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error);
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
        <Link href={`/contests/${contestId}`} style={{ marginBottom: '1rem', display: 'inline-block' }}>
          ← Back to Contest
        </Link>
        <h1>Leaderboard</h1>
        <p style={{ marginTop: '0.5rem', marginBottom: '2rem' }}>
          Status: <strong>{status}</strong>
        </p>

        {leaderboard.length === 0 ? (
          <p>No leaderboard data available yet.</p>
        ) : (
          <div className="card">
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #ccc' }}>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>Rank</th>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>Username</th>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>Email</th>
                  <th style={{ padding: '1rem', textAlign: 'right' }}>Score</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((entry) => (
                  <tr key={entry.userId} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '1rem', fontWeight: 'bold' }}>#{entry.rank}</td>
                    <td style={{ padding: '1rem' }}>{entry.username}</td>
                    <td style={{ padding: '1rem', color: '#666' }}>{entry.email}</td>
                    <td style={{ padding: '1rem', textAlign: 'right', fontWeight: 'bold' }}>
                      {entry.score}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}


