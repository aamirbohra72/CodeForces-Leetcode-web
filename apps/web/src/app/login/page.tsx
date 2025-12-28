'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { setToken, setUser } from '@/lib/auth';
import { Navbar } from '@/components/Navbar';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [username, setUsername] = useState('');
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleRequestOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      await api.post('/auth/request-otp', { email });
      setMessage('OTP sent to your email! Check your inbox.');
      setStep('otp');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post<{ user: unknown; token: string }>('/auth/verify-otp', {
        email,
        code: otp,
        username: username || undefined,
      });

      setToken(response.token);
      setUser(response.user as { id: string; email: string; username: string; role: string });
      router.push('/contests');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container" style={{ maxWidth: '400px', marginTop: '2rem' }}>
        <h1>Login with OTP</h1>
        {error && <div style={{ color: 'red', marginTop: '1rem' }}>{error}</div>}
        {message && <div style={{ color: 'green', marginTop: '1rem' }}>{message}</div>}

        {step === 'email' ? (
          <form onSubmit={handleRequestOTP} style={{ marginTop: '2rem' }}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Sending OTP...' : 'Send OTP'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOTP} style={{ marginTop: '2rem' }}>
            <div className="form-group">
              <label htmlFor="otp">Enter OTP</label>
              <input
                type="text"
                id="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                required
                maxLength={6}
                placeholder="000000"
                style={{ letterSpacing: '0.5rem', textAlign: 'center', fontSize: '1.5rem' }}
              />
              <small style={{ display: 'block', marginTop: '0.5rem', color: '#666' }}>
                Check your email for the 6-digit code
              </small>
            </div>
            <div className="form-group">
              <label htmlFor="username">Username (only for new users)</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                minLength={3}
                maxLength={30}
                placeholder="Leave empty if you already have an account"
              />
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Verifying...' : 'Verify OTP'}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setStep('email');
                  setOtp('');
                  setError('');
                  setMessage('');
                }}
              >
                Back
              </button>
            </div>
          </form>
        )}
      </div>
    </>
  );
}
