'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { isAuthenticated } from '@/lib/auth';
import { Navbar } from '@/components/Navbar';
import type { Submission, SubmissionStatus } from '@codeforces/types';

interface SubmissionWithDetails extends Submission {
  challenge: {
    id: string;
    title: string;
    slug?: string | null;
    contest: {
      id: string;
      name: string;
    };
  };
}

function getStatusColor(status: SubmissionStatus) {
  switch (status) {
    case 'ACCEPTED':
      return '#16a34a';
    case 'WRONG_ANSWER':
      return '#dc2626';
    case 'PENDING':
      return '#d97706';
    default:
      return '#6b7280';
  }
}

export default function SubmissionsClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const challengeId = searchParams.get('challengeId') || undefined;
  const [submissions, setSubmissions] = useState<SubmissionWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const query = useMemo(() => {
    const params = new URLSearchParams();
    if (challengeId) params.set('challengeId', challengeId);
    params.set('pageSize', '50');
    return params.toString();
  }, [challengeId]);

  const fetchSubmissions = async () => {
    try {
      const response = await api.get<{ data: SubmissionWithDetails[] }>(`/submissions?${query}`);
      setSubmissions(response.data);
    } catch (error) {
      console.error('Failed to fetch submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }
    void fetchSubmissions();
  }, [router, query]);

  useEffect(() => {
    const hasPending = submissions.some((s) => s.status === 'PENDING');
    if (!hasPending) return;
    const id = window.setInterval(() => {
      void fetchSubmissions();
    }, 2000);
    return () => window.clearInterval(id);
  }, [submissions, query]);

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
        {challengeId && (
          <p style={{ marginTop: '0.5rem' }}>
            <Link href={`/practice/${challengeId}`}>Back to problem</Link>
          </p>
        )}
        {submissions.length === 0 ? (
          <p style={{ marginTop: '2rem' }}>No submissions yet</p>
        ) : (
          <div style={{ marginTop: '2rem' }}>
            {submissions.map((submission) => {
              const expanded = expandedId === submission.id;
              let parsed: {
                feedback?: string;
                cases?: Array<{ name: string; passed: boolean; message?: string }>;
              } | null = null;
              if (submission.resultJson) {
                try {
                  parsed = JSON.parse(submission.resultJson);
                } catch {
                  parsed = null;
                }
              }
              return (
                <div key={submission.id} className="card">
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'start',
                      gap: '1rem',
                    }}
                  >
                    <div>
                      <Link href={`/practice/${submission.challenge.id}`}>
                        <h3 style={{ marginBottom: '0.5rem' }}>{submission.challenge.title}</h3>
                      </Link>
                      <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '0.5rem' }}>
                        Contest: {submission.challenge.contest.name}
                      </p>
                      <div style={{ fontSize: '0.9rem', color: '#666' }}>
                        <div>Language: {submission.language}</div>
                        <div>Score: {submission.score ?? 0}</div>
                        <div>Submitted: {new Date(submission.submittedAt).toLocaleString()}</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end' }}>
                      <span
                        style={{
                          padding: '0.25rem 0.75rem',
                          borderRadius: 4,
                          background: getStatusColor(submission.status),
                          color: '#fff',
                          fontWeight: 'bold',
                        }}
                      >
                        {submission.status}
                      </span>
                      <button
                        type="button"
                        onClick={() => setExpandedId(expanded ? null : submission.id)}
                        style={{ fontSize: '0.85rem' }}
                      >
                        {expanded ? 'Hide details' : 'Show details'}
                      </button>
                    </div>
                  </div>
                  {expanded && (
                    <div style={{ marginTop: '1rem', borderTop: '1px solid #eee', paddingTop: '0.75rem' }}>
                      <pre style={{ whiteSpace: 'pre-wrap', fontSize: '0.85rem' }}>
                        {submission.aiResponse || parsed?.feedback || 'No feedback yet'}
                      </pre>
                      {submission.hintText && (
                        <p style={{ marginTop: '0.75rem', color: '#b45309' }}>
                          <strong>Hint:</strong> {submission.hintText}
                        </p>
                      )}
                      {parsed?.cases && (
                        <ul style={{ marginTop: '0.75rem' }}>
                          {parsed.cases.map((c, idx) => (
                            <li key={`${c.name}-${idx}`}>
                              {c.passed ? 'PASS' : 'FAIL'} — {c.name}
                              {c.message ? `: ${c.message}` : ''}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
