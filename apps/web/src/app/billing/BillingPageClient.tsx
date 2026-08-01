'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { DashboardShell } from '@/components/DashboardShell';
import { api } from '@/lib/api';
import { getToken } from '@/lib/auth';
import { startRazorpayCheckout } from '@/lib/razorpayCheckout';
import styles from './billing.module.css';

type PaymentRow = {
  id: string;
  productId: string;
  productTitle: string;
  amountPaise: number;
  currency: string;
  status: string;
  createdAt: string;
};

type Product = {
  productId: string;
  title: string;
  description: string;
  amountPaise: number;
  currency: string;
};

export function BillingPageClient() {
  const [payments, setPayments] = useState<PaymentRow[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [enrolled, setEnrolled] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [payingId, setPayingId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const refresh = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const catalog = await api.get<{ products: Product[] }>('/payments/products');
      setProducts(catalog.products);

      if (getToken()) {
        const [history, enrollments] = await Promise.all([
          api.get<{ payments: PaymentRow[] }>('/payments/history'),
          api.get<{ enrollments: Array<{ productId: string }> }>('/payments/enrollments'),
        ]);
        setPayments(history.payments);
        setEnrolled(new Set(enrollments.enrollments.map((e) => e.productId)));
      } else {
        setPayments([]);
        setEnrolled(new Set());
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load billing');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const handlePay = async (productId: string) => {
    if (!getToken()) {
      window.location.href = '/sign-in?redirect_url=/billing';
      return;
    }
    setPayingId(productId);
    setError('');
    setMessage('');
    try {
      await startRazorpayCheckout(productId);
      setMessage('Payment successful! Access unlocked.');
      await refresh();
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Payment failed';
      if (msg !== 'Payment cancelled') setError(msg);
    } finally {
      setPayingId(null);
    }
  };

  return (
    <DashboardShell mainClassName="relative min-h-0 flex flex-1 flex-col overflow-y-auto p-0">
      <div className={styles.billingRoot}>
        <section className={styles.billingMain}>
          <main className={styles.content}>
            <h1>Billing</h1>
            <p>Purchase premium courses or AI generation credits with Razorpay (test mode).</p>

            {error && <p style={{ color: '#f87171', marginTop: '1rem' }}>{error}</p>}
            {message && <p style={{ color: '#4ade80', marginTop: '1rem' }}>{message}</p>}

            <h2 style={{ marginTop: '2rem', fontSize: '1.25rem' }}>Available products</h2>
            {loading ? (
              <p style={{ color: '#9ca3af' }}>Loading…</p>
            ) : (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                  gap: '1rem',
                  marginTop: '1rem',
                }}
              >
                {products.map((p) => {
                  const owned = enrolled.has(p.productId);
                  return (
                    <div
                      key={p.productId}
                      style={{
                        border: '1px solid #3a3a3a',
                        borderRadius: 12,
                        padding: '1rem',
                        background: '#1a1a1a',
                      }}
                    >
                      <h3 style={{ margin: 0 }}>{p.title}</h3>
                      <p style={{ color: '#9ca3af', fontSize: 14 }}>{p.description}</p>
                      <p style={{ fontWeight: 700, margin: '0.75rem 0' }}>
                        ₹{(p.amountPaise / 100).toFixed(0)}
                      </p>
                      <button
                        type="button"
                        disabled={owned || payingId === p.productId}
                        className={styles.cta}
                        style={{
                          opacity: owned ? 0.6 : 1,
                          cursor: owned ? 'default' : 'pointer',
                          border: 'none',
                          width: '100%',
                        }}
                        onClick={() => void handlePay(p.productId)}
                      >
                        {owned
                          ? 'Owned'
                          : payingId === p.productId
                            ? 'Opening checkout…'
                            : 'Pay with Razorpay'}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            <h2 style={{ marginTop: '2.5rem', fontSize: '1.25rem' }}>Payment history</h2>
            {!getToken() ? (
              <p style={{ color: '#9ca3af' }}>
                <Link href="/sign-in" className={styles.cta}>
                  Sign in
                </Link>{' '}
                to view billing history.
              </p>
            ) : payments.length === 0 ? (
              <p style={{ color: '#9ca3af' }}>No payments yet.</p>
            ) : (
              <ul style={{ listStyle: 'none', padding: 0, marginTop: '1rem' }}>
                {payments.map((pay) => (
                  <li
                    key={pay.id}
                    style={{
                      borderBottom: '1px solid #2a2a2a',
                      padding: '0.75rem 0',
                      display: 'flex',
                      justifyContent: 'space-between',
                      gap: '1rem',
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 600 }}>{pay.productTitle}</div>
                      <div style={{ color: '#9ca3af', fontSize: 13 }}>
                        {new Date(pay.createdAt).toLocaleString()} · {pay.status}
                      </div>
                    </div>
                    <div style={{ fontWeight: 600 }}>₹{(pay.amountPaise / 100).toFixed(0)}</div>
                  </li>
                ))}
              </ul>
            )}

            <Link href="/learn" className={styles.cta} style={{ display: 'inline-block', marginTop: '2rem' }}>
              Back to Courses
            </Link>
          </main>
        </section>
      </div>
    </DashboardShell>
  );
}
