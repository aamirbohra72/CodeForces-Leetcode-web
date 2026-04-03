import Link from 'next/link';
import styles from './billing.module.css';

const sideMenu = [
  'Roadmaps',
  'DSA Sheet',
  'Project Ideas',
  'Write a Blog',
  'Playground',
  'Gift a course',
  'Become Affiliate',
  'Certificates',
  'Billing',
  'Feedback',
  'Need Help',
];

export default function BillingPage() {
  return (
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
            <a
              key={item}
              href="#"
              className={item === 'Billing' ? `${styles.sideItem} ${styles.active}` : styles.sideItem}
            >
              <span className={styles.sideIcon}>◦</span>
              <span>{item}</span>
              {item === 'Write a Blog' ? <span className={styles.chev}>⌄</span> : null}
            </a>
          ))}
        </nav>
      </aside>

      <section className={styles.main}>
        <header className={styles.topbar}>
          <nav className={styles.topLinks} aria-label="Top links">
            <Link href="/">Interview Practice</Link>
            <span className={styles.badge}>New</span>
            <Link href="/learn">Courses</Link>
            <Link href="/">Resources</Link>
          </nav>

          <div className={styles.topActions}>
            <button type="button" className={styles.streakBtn}>
              🔥 0 Day Streak
            </button>
            <button type="button" className={styles.profileBtn} aria-label="Profile">
              a
            </button>
          </div>
        </header>

        <main className={styles.content}>
          <h1>Billing History</h1>
          <p>
            Your journey starts here! With no billing history, you have a clean slate to discover our courses and gain
            new skills.
          </p>
          <button type="button" className={styles.cta}>
            Start Learning
          </button>
        </main>

        <button type="button" className={styles.whatsapp} aria-label="WhatsApp help">
          💬
        </button>
      </section>
    </div>
  );
}
