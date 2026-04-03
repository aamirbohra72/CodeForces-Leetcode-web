import Link from 'next/link';
import { AppNavbar } from '@/components/AppNavbar';
import styles from './billing.module.css';

type SideLink = {
  label: string;
  href: string;
  hasChevron?: boolean;
};

const sideMenu: SideLink[] = [
  { label: 'Roadmaps', href: '#' },
  { label: 'DSA Sheet', href: '#' },
  { label: 'Project Ideas', href: '/projects' },
  { label: 'Write a Blog', href: '/blog', hasChevron: true },
  { label: 'Playground', href: '#' },
  { label: 'Gift a course', href: '/gift' },
  { label: 'Become Affiliate', href: '#' },
  { label: 'Certificates', href: '/certificates' },
  { label: 'Billing', href: '/billing' },
  { label: 'Feedback', href: '#' },
  { label: 'Need Help', href: '#' },
];

export default function BillingPage() {
  return (
    <div className={styles.shell}>
      <AppNavbar className="sticky top-0 z-50 shrink-0" />

      <div className={styles.page}>
        <aside className={styles.sidebar}>
          <div className={styles.brandRow}>
            <button type="button" className={styles.iconBtn} aria-label="Collapse">
              ⟪
            </button>
            <Link href="/" className={styles.brand}>
              <span className={styles.logoMark}>N</span>
              <span className={styles.brandText}>NamasteDev.com</span>
            </Link>
          </div>

          <nav className={styles.sideNav} aria-label="Billing side navigation">
            {sideMenu.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={
                  item.label === 'Billing' ? `${styles.sideItem} ${styles.active}` : styles.sideItem
                }
              >
                <span className={styles.sideIcon}>◦</span>
                <span>{item.label}</span>
                {item.hasChevron ? <span className={styles.chev}>⌄</span> : null}
              </Link>
            ))}
          </nav>
        </aside>

        <section className={styles.main}>
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
    </div>
  );
}
