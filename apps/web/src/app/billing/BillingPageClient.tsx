'use client';

import Link from 'next/link';
import { DashboardShell } from '@/components/DashboardShell';
import styles from './billing.module.css';

export function BillingPageClient() {
  return (
    <DashboardShell mainClassName="relative min-h-0 flex flex-1 flex-col overflow-hidden p-0">
      <div className={styles.billingRoot}>
        <section className={styles.billingMain}>
          <main className={styles.content}>
            <h1>Billing History</h1>
            <p>
              Your journey starts here! With no billing history, you have a clean slate to discover our courses and gain
              new skills.
            </p>
            <Link href="/learn" className={styles.cta}>
              Start Learning
            </Link>
          </main>

          <button type="button" className={styles.whatsapp} aria-label="WhatsApp help">
            💬
          </button>
        </section>
      </div>
    </DashboardShell>
  );
}
