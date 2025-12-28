'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { isAuthenticated } from '@/lib/auth';
import { Navbar } from '@/components/Navbar';
import { CodeEditor } from '@/components/CodeEditor';
import type { Challenge } from '@codeforces/types';

export default function PracticeProblemPage() {
  const params = useParams();
  const router = useRouter();
  const problemId = params.id as string;
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [running, setRunning] = useState(false);
  const [language, setLanguage] = useState('javascript');
  const [sourceCode, setSourceCode] = useState('');
  const [output, setOutput] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [activeTab, setActiveTab] = useState<'problem' | 'solution' | 'submissions'>('problem');
  const [error, setError] = useState('');

  useEffect(() => {
    if (problemId) {
      fetchChallenge();
    }
  }, [problemId]);

  const fetchChallenge = async () => {
    try {
      const data = await api.get<Challenge & { contest?: { id: string; name: string } }>(
        `/challenges/${problemId}`
      );
      setChallenge(data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch challenge:', error);
      setLoading(false);
    }
  };

  const handleRun = async () => {
    if (!sourceCode.trim()) {
      setOutput({ type: 'error', message: 'Please write some code first' });
      return;
    }

    setRunning(true);
    setOutput(null);
    try {
      // For now, we'll do a simple client-side execution for JavaScript
      // In production, this should call your backend execution service
      if (language === 'javascript') {
        try {
          // Create a safe execution environment
          const result = eval(`(function() { ${sourceCode} })()`);
          setOutput({ type: 'success', message: String(result) || 'Code executed successfully' });
        } catch (err) {
          setOutput({ type: 'error', message: err instanceof Error ? err.message : 'Runtime error' });
        }
      } else {
        setOutput({ type: 'error', message: 'Code execution is only available for JavaScript in this demo' });
      }
    } catch (err) {
      setOutput({ type: 'error', message: err instanceof Error ? err.message : 'Execution failed' });
    } finally {
      setRunning(false);
    }
  };

  const handleSubmit = async () => {
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
        challengeId: problemId,
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
        <div className="container" style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>
      </>
    );
  }

  if (!challenge) {
    return (
      <>
        <Navbar />
        <div className="container" style={{ padding: '2rem' }}>Challenge not found</div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div style={{ display: 'flex', height: 'calc(100vh - 60px)', overflow: 'hidden' }}>
        {/* Left Panel - Problem Description */}
        <div
          style={{
            width: '40%',
            overflowY: 'auto',
            background: '#ffffff',
            borderRight: '1px solid #e5e7eb',
            padding: '1.5rem',
          }}
        >
          <div style={{ marginBottom: '1.5rem' }}>
            <h1 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{challenge.title}</h1>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '1rem' }}>
              <span
                style={{
                  padding: '0.25rem 0.75rem',
                  borderRadius: '12px',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  background:
                    challenge.difficulty.toLowerCase() === 'easy'
                      ? '#22c55e'
                      : challenge.difficulty.toLowerCase() === 'medium'
                      ? '#f59e0b'
                      : '#ef4444',
                  color: 'white',
                }}
              >
                {challenge.difficulty}
              </span>
              <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>React.js</span>
            </div>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid #e5e7eb' }}>
            {(['problem', 'solution', 'submissions'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: '0.5rem 1rem',
                  border: 'none',
                  background: 'none',
                  borderBottom: activeTab === tab ? '2px solid #0070f3' : '2px solid transparent',
                  cursor: 'pointer',
                  textTransform: 'capitalize',
                  color: activeTab === tab ? '#0070f3' : '#6b7280',
                  fontWeight: activeTab === tab ? '600' : '400',
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Problem Content */}
          {activeTab === 'problem' && (
            <div>
              <div style={{ marginBottom: '1.5rem', lineHeight: '1.6' }}>
                <p style={{ whiteSpace: 'pre-wrap', color: '#374151' }}>{challenge.description}</p>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem', fontWeight: '600' }}>Input Format</h3>
                <pre
                  style={{
                    background: '#f9fafb',
                    padding: '1rem',
                    borderRadius: '6px',
                    fontSize: '0.875rem',
                    overflow: 'auto',
                    border: '1px solid #e5e7eb',
                  }}
                >
                  {challenge.inputFormat}
                </pre>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem', fontWeight: '600' }}>Output Format</h3>
                <pre
                  style={{
                    background: '#f9fafb',
                    padding: '1rem',
                    borderRadius: '6px',
                    fontSize: '0.875rem',
                    overflow: 'auto',
                    border: '1px solid #e5e7eb',
                  }}
                >
                  {challenge.outputFormat}
                </pre>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem', fontWeight: '600' }}>Constraints</h3>
                <pre
                  style={{
                    background: '#f9fafb',
                    padding: '1rem',
                    borderRadius: '6px',
                    fontSize: '0.875rem',
                    overflow: 'auto',
                    border: '1px solid #e5e7eb',
                  }}
                >
                  {challenge.constraints}
                </pre>
              </div>

              {challenge.sampleInput && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem', fontWeight: '600' }}>Sample Input</h3>
                  <pre
                    style={{
                      background: '#f9fafb',
                      padding: '1rem',
                      borderRadius: '6px',
                      fontSize: '0.875rem',
                      overflow: 'auto',
                      border: '1px solid #e5e7eb',
                    }}
                  >
                    {challenge.sampleInput}
                  </pre>
                </div>
              )}

              {challenge.sampleOutput && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem', fontWeight: '600' }}>Sample Output</h3>
                  <pre
                    style={{
                      background: '#f9fafb',
                      padding: '1rem',
                      borderRadius: '6px',
                      fontSize: '0.875rem',
                      overflow: 'auto',
                      border: '1px solid #e5e7eb',
                    }}
                  >
                    {challenge.sampleOutput}
                  </pre>
                </div>
              )}
            </div>
          )}

          {activeTab === 'solution' && (
            <div style={{ color: '#6b7280', textAlign: 'center', padding: '2rem' }}>
              Solutions will be available after you solve this problem
            </div>
          )}

          {activeTab === 'submissions' && (
            <div style={{ color: '#6b7280', textAlign: 'center', padding: '2rem' }}>
              <p>View your submissions</p>
              <button
                onClick={() => router.push('/submissions')}
                className="btn btn-primary"
                style={{ marginTop: '1rem' }}
              >
                Go to Submissions
              </button>
            </div>
          )}
        </div>

        {/* Right Panel - Code Editor & Output */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#1e1e1e' }}>
          {/* Editor Toolbar */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '0.75rem 1rem',
              background: '#252526',
              borderBottom: '1px solid #3e3e42',
            }}
          >
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              style={{
                padding: '0.5rem',
                background: '#3c3c3c',
                color: 'white',
                border: '1px solid #555',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="java">Java</option>
              <option value="cpp">C++</option>
            </select>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={handleRun}
                disabled={running}
                style={{
                  padding: '0.5rem 1rem',
                  background: running ? '#555' : '#0e639c',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: running ? 'not-allowed' : 'pointer',
                  fontSize: '0.875rem',
                }}
              >
                {running ? 'Running...' : 'Run'}
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                style={{
                  padding: '0.5rem 1rem',
                  background: submitting ? '#555' : '#22c55e',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: submitting ? 'not-allowed' : 'pointer',
                  fontSize: '0.875rem',
                }}
              >
                {submitting ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </div>

          {/* Code Editor */}
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <CodeEditor language={language} value={sourceCode} onChange={setSourceCode} height="100%" />
          </div>

          {/* Output Panel */}
          <div
            style={{
              height: '200px',
              background: '#1e1e1e',
              borderTop: '1px solid #3e3e42',
              padding: '1rem',
              overflow: 'auto',
            }}
          >
            <div style={{ color: '#cccccc', fontSize: '0.875rem', fontFamily: 'monospace' }}>
              {output ? (
                <div style={{ color: output.type === 'error' ? '#f48771' : '#4ec9b0' }}>
                  {output.message}
                </div>
              ) : (
                <div style={{ color: '#6b7280' }}>Output will appear here...</div>
              )}
              {error && <div style={{ color: '#f48771', marginTop: '0.5rem' }}>Error: {error}</div>}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}


