'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { isAuthenticated } from '@/lib/auth';
import { Navbar } from '@/components/Navbar';
import type { Submission, SubmissionStatus } from '@codeforces/types';

interface SubmissionWithDetails extends Submission {
  challenge: {
    id: string;
    title: string;
    contest: {
      id: string;
      name: string;
    };
  };
}

export default function SubmissionsPage() {
  const router = useRouter();
  const [submissions, setSubmissions] = useState<SubmissionWithDetails[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }
    fetchSubmissions();
  }, [router]);

  const fetchSubmissions = async () => {
    try {
      const response = await api.get<{ data: SubmissionWithDetails[] }>('/submissions');
      setSubmissions(response.data);
    } catch (error) {
      console.error('Failed to fetch submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: SubmissionStatus) => {
    switch (status) {
      case 'ACCEPTED':
        return '#00ff00';
      case 'WRONG_ANSWER':
        return '#ff0000';
      case 'PENDING':
        return '#ffa500';
      default:
        return '#888';
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
        <h1>My Submissions</h1>
        {submissions.length === 0 ? (
          <p style={{ marginTop: '2rem' }}>No submissions yet</p>
        ) : (
          <div style={{ marginTop: '2rem' }}>
            {submissions.map((submission) => (
              <div key={submission.id} className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <div>
                    <Link href={`/challenges/${submission.challenge.id}`}>
                      <h3 style={{ marginBottom: '0.5rem' }}>{submission.challenge.title}</h3>
                    </Link>
                    <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '0.5rem' }}>
                      Contest: {submission.challenge.contest.name}
                    </p>
                    <div style={{ fontSize: '0.9rem', color: '#666' }}>
                      <div>Language: {submission.language}</div>
                      <div>Submitted: {new Date(submission.submittedAt).toLocaleString()}</div>
                    </div>
                  </div>
                  <span
                    style={{
                      padding: '0.25rem 0.75rem',
                      borderRadius: '4px',
                      background: getStatusColor(submission.status),
                      color: submission.status === 'ACCEPTED' ? '#000' : '#fff',
                      fontWeight: 'bold',
                    }}
                  >
                    {submission.status}
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


