'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { isAuthenticated } from '@/lib/auth';
import { Navbar } from '@/components/Navbar';
import type { Challenge } from '@codeforces/types';

export default function ChallengePage() {
  const params = useParams();
  const router = useRouter();
  const challengeId = params.id as string;
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [language, setLanguage] = useState('javascript');
  const [sourceCode, setSourceCode] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (challengeId) {
      fetchChallenge();
    }
  }, [challengeId]);

  const fetchChallenge = async () => {
    try {
      const data = await api.get<Challenge & { contest: { id: string; name: string } }>(
        `/challenges/${challengeId}`
      );
      setChallenge(data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch challenge:', error);
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }

    if (!sourceCode.trim()) {
      setError('Source code is required');
      return;
    }

    setSubmitting(true);
    try {
      await api.post(`/submissions`, {
        challengeId,
        language,
        sourceCode,
      });
      router.push('/submissions');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Submission failed');
    } finally {
      setSubmitting(false);
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

  if (!challenge) {
    return (
      <>
        <Navbar />
        <div className="container">Challenge not found</div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container">
        <h1>{challenge.title}</h1>
        <p style={{ marginTop: '0.5rem', marginBottom: '1rem' }}>
          Difficulty: {challenge.difficulty} | Contest: {challenge.contest?.name || 'N/A'}
        </p>

        <div className="card" style={{ marginBottom: '2rem' }}>
          <h2>Description</h2>
          <p style={{ whiteSpace: 'pre-wrap', marginTop: '1rem' }}>{challenge.description}</p>

          <h3 style={{ marginTop: '2rem' }}>Input Format</h3>
          <pre style={{ background: '#f5f5f5', padding: '1rem', borderRadius: '4px', marginTop: '0.5rem' }}>
            {challenge.inputFormat}
          </pre>

          <h3 style={{ marginTop: '1.5rem' }}>Output Format</h3>
          <pre style={{ background: '#f5f5f5', padding: '1rem', borderRadius: '4px', marginTop: '0.5rem' }}>
            {challenge.outputFormat}
          </pre>

          <h3 style={{ marginTop: '1.5rem' }}>Constraints</h3>
          <pre style={{ background: '#f5f5f5', padding: '1rem', borderRadius: '4px', marginTop: '0.5rem' }}>
            {challenge.constraints}
          </pre>

          <h3 style={{ marginTop: '1.5rem' }}>Sample Input</h3>
          <pre style={{ background: '#f5f5f5', padding: '1rem', borderRadius: '4px', marginTop: '0.5rem' }}>
            {challenge.sampleInput || 'N/A'}
          </pre>

          <h3 style={{ marginTop: '1.5rem' }}>Sample Output</h3>
          <pre style={{ background: '#f5f5f5', padding: '1rem', borderRadius: '4px', marginTop: '0.5rem' }}>
            {challenge.sampleOutput || 'N/A'}
          </pre>
        </div>

        <div className="card">
          <h2>Submit Solution</h2>
          {error && <div style={{ color: 'red', marginTop: '1rem' }}>{error}</div>}
          <form onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
            <div className="form-group">
              <label htmlFor="language">Language</label>
              <select
                id="language"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                required
              >
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="java">Java</option>
                <option value="cpp">C++</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="sourceCode">Source Code</label>
              <textarea
                id="sourceCode"
                value={sourceCode}
                onChange={(e) => setSourceCode(e.target.value)}
                required
                rows={15}
                style={{ fontFamily: 'monospace' }}
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}


