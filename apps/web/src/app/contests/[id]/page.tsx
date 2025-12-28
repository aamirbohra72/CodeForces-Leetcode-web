'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Navbar } from '@/components/Navbar';
import type { Contest, Challenge } from '@codeforces/types';

export default function ContestDetailPage() {
  const params = useParams();
  const contestId = params.id as string;
  const [contest, setContest] = useState<Contest | null>(null);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (contestId) {
      fetchContest();
      fetchChallenges();
    }
  }, [contestId]);

  const fetchContest = async () => {
    try {
      const data = await api.get<Contest>(`/contests/${contestId}`);
      setContest(data);
    } catch (error) {
      console.error('Failed to fetch contest:', error);
    }
  };

  const fetchChallenges = async () => {
    try {
      const data = await api.get<Challenge[]>(`/contests/${contestId}/challenges`);
      setChallenges(data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch challenges:', error);
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

  if (!contest) {
    return (
      <>
        <Navbar />
        <div className="container">Contest not found</div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container">
        <Link href="/contests" style={{ marginBottom: '1rem', display: 'inline-block' }}>
          ← Back to Contests
        </Link>
        <h1>{contest.name}</h1>
        {contest.description && <p style={{ marginTop: '1rem', marginBottom: '2rem' }}>{contest.description}</p>}

        <div style={{ marginBottom: '2rem', display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <div>
            <div>Start: {new Date(contest.startTime).toLocaleString()}</div>
            <div>End: {new Date(contest.endTime).toLocaleString()}</div>
            <div>Status: {contest.status}</div>
          </div>
          {(contest.status === 'LIVE' || contest.status === 'ENDED') && (
            <Link href={`/contests/${contestId}/leaderboard`} className="btn btn-primary">
              View Leaderboard
            </Link>
          )}
        </div>

        <h2 style={{ marginTop: '2rem', marginBottom: '1rem' }}>Challenges</h2>
        {challenges.length === 0 ? (
          <p>No challenges available</p>
        ) : (
          <div>
            {challenges.map((challenge) => (
              <div key={challenge.id} className="card">
                <Link href={`/challenges/${challenge.id}`}>
                  <h3 style={{ marginBottom: '0.5rem' }}>{challenge.title}</h3>
                </Link>
                <p style={{ marginBottom: '0.5rem' }}>Difficulty: {challenge.difficulty}</p>
                <p style={{ fontSize: '0.9rem', color: '#666' }}>{challenge.description.substring(0, 200)}...</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

