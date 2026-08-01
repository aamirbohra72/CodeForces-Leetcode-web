'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { DashboardShell } from '@/components/DashboardShell';
import { api } from '@/lib/api';
import { getToken } from '@/lib/auth';
import {
  COURSE_PRODUCT_IDS,
  learnPathForProduct,
  markLocalEnrollment,
} from '@/lib/enrollment';
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

const PRODUCT_UI: Record<
  string,
  { badge: string; accent: string; features: string[] }
> = {
  '1': {
    badge: 'DSA',
    accent: '#f59e0b',
    features: ['Full syllabus access', 'Tutorials & assignments', 'Lifetime course updates'],
  },
  '2': {
    badge: 'Backend',
    accent: '#38bdf8',
    features: ['Node.js path', 'API & DB modules', 'Project-ready patterns'],
  },
  '3': {
    badge: 'Frontend',
    accent: '#a78bfa',
    features: ['React curriculum', 'Hooks & architecture', 'Interview-ready drills'],
  },
  '5': {
    badge: 'System Design',
    accent: '#22d3ee',
    features: ['Scalability playbooks', 'Interview frameworks', 'Case study walkthroughs'],
  },
  'ai-generate': {
    badge: 'AI Credit',
    accent: '#34d399',
    features: ['1 AI course generation', 'Custom notebook outline', 'Works with Create Own Course'],
  },
};

function formatInr(paise: number) {
  return `₹${(paise / 100).toFixed(0)}`;
}

export function BillingPageClient() {
  const [payments, setPayments] = useState<PaymentRow[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [enrolled, setEnrolled] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [payingId, setPayingId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [lastUnlocked, setLastUnlocked] = useState<string | null>(null);

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
        const ids = enrollments.enrollments.map((e) => e.productId);
        setEnrolled(new Set(ids));
        for (const id of ids) {
          if (COURSE_PRODUCT_IDS.has(id)) markLocalEnrollment(id);
        }
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
    setLastUnlocked(null);
    try {
      const result = await startRazorpayCheckout(productId);
      markLocalEnrollment(result.productId);
      setEnrolled((prev) => new Set(prev).add(result.productId));
      setLastUnlocked(result.productId);
      setMessage(
        COURSE_PRODUCT_IDS.has(result.productId)
          ? 'Payment successful! Course unlocked on Courses.'
          : 'Payment successful! Access unlocked.',
      );
      await refresh();
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Payment failed';
      if (msg !== 'Payment cancelled') setError(msg);
    } finally {
      setPayingId(null);
    }
  };

  const unlockedHref = lastUnlocked ? learnPathForProduct(lastUnlocked) : null;

  return (
    <DashboardShell mainClassName="relative min-h-0 flex flex-1 flex-col overflow-y-auto p-0">
      <div className={styles.billingRoot}>
        <section className={styles.billingMain}>
          <main className={styles.content}>
            <header className={styles.hero}>
              <p className={styles.eyebrow}>Razorpay · Test mode</p>
              <h1>Billing</h1>
              <p className={styles.lead}>
                Unlock premium courses or AI generation credits. Purchases sync instantly to your
                Courses library.
              </p>
            </header>

            {error ? <p className={`${styles.banner} ${styles.bannerError}`}>{error}</p> : null}
            {message ? (
              <p className={`${styles.banner} ${styles.bannerOk}`}>
                {message}
                {unlockedHref ? (
                  <>
                    {' '}
                    <Link href={unlockedHref}>Open course</Link>
                    {' · '}
                    <Link href="/learn">View all courses</Link>
                  </>
                ) : null}
              </p>
            ) : null}

            <h2 className={styles.sectionTitle}>Available products</h2>
            {loading ? (
              <p className={styles.muted}>Loading catalog…</p>
            ) : (
              <div className={styles.grid}>
                {products.map((p) => {
                  const owned = enrolled.has(p.productId);
                  const ui = PRODUCT_UI[p.productId] || {
                    badge: 'Product',
                    accent: '#22c55e',
                    features: [p.description],
                  };
                  const courseHref = learnPathForProduct(p.productId);

                  return (
                    <article
                      key={p.productId}
                      className={`${styles.card} ${owned ? styles.cardOwned : ''}`}
                      style={{ ['--accent' as string]: ui.accent }}
                    >
                      <div className={styles.cardAccent} />
                      <div className={styles.cardBody}>
                        <div className={styles.badgeRow}>
                          <span className={styles.badge}>{ui.badge}</span>
                          {COURSE_PRODUCT_IDS.has(p.productId) ? (
                            <span className={styles.badgeMuted}>Course</span>
                          ) : (
                            <span className={styles.badgeMuted}>Credit</span>
                          )}
                          {owned ? <span className={styles.ownedPill}>Owned</span> : null}
                        </div>
                        <h3 className={styles.cardTitle}>{p.title}</h3>
                        <p className={styles.cardDesc}>{p.description}</p>
                        <ul className={styles.features}>
                          {ui.features.map((f) => (
                            <li key={f}>{f}</li>
                          ))}
                        </ul>
                        <div className={styles.priceRow}>
                          <span className={styles.price}>{formatInr(p.amountPaise)}</span>
                          <span className={styles.priceNote}>one-time</span>
                        </div>
                        {owned && courseHref ? (
                          <Link href={courseHref} className={`${styles.cta} ${styles.ctaSecondary}`}>
                            Open in Courses
                          </Link>
                        ) : (
                          <button
                            type="button"
                            disabled={owned || payingId === p.productId}
                            className={styles.cta}
                            onClick={() => void handlePay(p.productId)}
                          >
                            {owned
                              ? 'Owned'
                              : payingId === p.productId
                                ? 'Opening checkout…'
                                : 'Pay with Razorpay'}
                          </button>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            )}

            <h2 className={styles.sectionTitle}>Payment history</h2>
            {!getToken() ? (
              <p className={styles.muted}>
                <Link href="/sign-in">Sign in</Link> to view billing history.
              </p>
            ) : payments.length === 0 ? (
              <p className={styles.muted}>No payments yet.</p>
            ) : (
              <ul className={styles.history}>
                {payments.map((pay) => (
                  <li key={pay.id} className={styles.historyItem}>
                    <div>
                      <div className={styles.historyTitle}>{pay.productTitle}</div>
                      <div className={styles.historyMeta}>
                        {new Date(pay.createdAt).toLocaleString()} ·{' '}
                        <span className={pay.status === 'PAID' ? styles.statusPaid : undefined}>
                          {pay.status}
                        </span>
                      </div>
                    </div>
                    <div className={styles.historyAmount}>{formatInr(pay.amountPaise)}</div>
                  </li>
                ))}
              </ul>
            )}

            <Link href="/learn" className={`${styles.cta} ${styles.ctaGhost}`}>
              Back to Courses
            </Link>
          </main>
        </section>
      </div>
    </DashboardShell>
  );
}
