'use client';

import Link from 'next/link';
import { DashboardShell } from '@/components/DashboardShell';
import styles from './blog.module.css';

const featuredPosts = [
  { title: 'From Lag to Lightning-Fast: API Transformation', author: 'akshay', date: 'March 31, 2026' },
  { title: 'Building Highly Available Applications with Multi-Region Deployment', author: 'Himanshi Rana', date: 'March 31, 2026' },
  { title: 'Implementing Zero-Downtime Deployments in Modern Web Apps', author: 'Neha Bansal', date: 'March 31, 2026' },
  { title: 'Understanding Eventual Consistency in Distributed Systems', author: 'Neha Bansal', date: 'March 31, 2026' },
  { title: 'Efficient Caching Techniques for Data-Heavy Web Apps', author: 'Avi Agarwal', date: 'March 31, 2026' },
];

const recentPosts = [
  { title: 'Optimizing React App Startup Time with Code Splitting', author: 'Harshvardhan Yadav', date: 'March 30, 2026', highlight: true },
  { title: 'Automating Code Quality Checks with GitHub Actions', author: 'Tanishq Kulkarni', date: 'March 30, 2026' },
  { title: 'Applying SOLID Principles in Frontend Architecture', author: 'Atharva Phadke', date: 'March 30, 2026' },
  { title: 'Securing Web Applications Against Common Vulnerabilities', author: 'Manika Dhingra', date: 'March 30, 2026' },
  { title: 'Integrating TypeScript for Safer JavaScript Development', author: 'Riddhi Bhatt', date: 'March 30, 2026' },
];

const interviewExperiences = [
  'Interview Experience | test | sde | test | Rejected',
  'Closures in Javascript - important for Interviews',
  'Introduction to Stack and Queues',
  'Time/Space Complexity',
];

const workExperiences = [
  'Jayant ka blog hai, this blog is by Jayant',
  'A Developer’s Experience: Navigating the Job Market and Work-Life',
  'Remote Team Collaboration at Scale',
  'How I Switched from Service to Product Company',
];

export function BlogPageClient() {
  return (
    <DashboardShell mainClassName="min-h-0 overflow-y-auto p-0">
      <div className={styles.page}>
        <header className={styles.topStrip}>
          <div className={styles.maxWrap}>
            <p>Explore the coolest frontend learning platform !</p>
            <button type="button">VISIT NAMASTEDEV</button>
            <nav>
              <Link href="/">React Js</Link>
              <Link href="/">Frontend System Design</Link>
              <Link href="/">Namaste Javascript</Link>
              <Link href="/">Interview Practice</Link>
            </nav>
          </div>
        </header>

        <section className={styles.brandBar}>
          <div className={styles.maxWrap}>
            <div className={styles.socials}>
              <span>in</span>
              <span>▶</span>
              <span>𝕏</span>
              <span>◎</span>
              <span>◈</span>
            </div>
            <h1 className={styles.logo}>NamasteDev.com</h1>
            <button type="button" className={styles.themeBtn} aria-label="Theme">
              ☾
            </button>
          </div>
        </section>

        <section className={styles.navBar}>
          <div className={styles.maxWrap}>
            <p>Friday, April 3</p>
            <nav>
              <Link href="/">Experience</Link>
              <Link href="/">Technology &amp; Development</Link>
              <Link href="/learn">Start Learning</Link>
              <Link href="/">Write a Blog</Link>
              <Link href="/">AppsAirPush</Link>
            </nav>
            <div className={styles.navIcons}>
              <span>🔍</span>
              <span>☰</span>
            </div>
          </div>
        </section>

        <section className={styles.hero}>
          <div className={styles.maxWrap}>
            <div className={styles.heroText}>
              <h2>One-stop solution to gain expertise in frontend development.</h2>
              <p>Trusted by over 12,00,000 students.</p>
              <div className={styles.heroUrl}>http://www.namastedev.com</div>
            </div>
            <div className={styles.heroImage} />
          </div>
        </section>

        <section className={styles.headingRow}>
          <div className={styles.maxWrap}>
            <h2>Unlock Your Software Potential with NamasteDev | Build, Master &amp; Succeed</h2>
            <aside>
              <p>Search</p>
              <div className={styles.search}>
                <input type="search" />
                <button type="button">SEARCH</button>
              </div>
            </aside>
          </div>
        </section>

        <main className={styles.content}>
          <div className={styles.maxWrapGrid}>
            <section>
              <h3>NAMASTEDEV&apos;S FEATURED POST</h3>
              <article className={styles.featureCard}>
                <h4>{featuredPosts[0].title}</h4>
                <p className={styles.meta}>By {featuredPosts[0].author}</p>
                <div className={styles.imageStub} />
                <p>Sometimes, the simplest solutions are the most effective. This applies to everyday life problems as well as technical ones...</p>
                <button type="button">READ MORE</button>
              </article>
            </section>

            <section>
              <h3>RECENT POSTS</h3>
              <ul className={styles.postList}>
                {featuredPosts.slice(1).map((p) => (
                  <li key={p.title}>
                    <p>{p.title}</p>
                    <span>
                      By {p.author} — {p.date}
                    </span>
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h3>RECENT POSTS</h3>
              <ul className={styles.postList}>
                {recentPosts.map((p) => (
                  <li key={p.title}>
                    <p className={p.highlight ? styles.highlight : ''}>{p.title}</p>
                    <span>
                      By {p.author} — {p.date}
                    </span>
                  </li>
                ))}
              </ul>
            </section>

            <aside className={styles.rightRail}>
              <h3>RECENT POSTS</h3>
              <ul className={styles.postList}>
                {featuredPosts.map((p) => (
                  <li key={`${p.title}-rail`}>
                    <p>{p.title}</p>
                    <span>{p.date}</span>
                  </li>
                ))}
              </ul>
              <h3>LATEST POSTS</h3>
            </aside>
          </div>
        </main>

        <section className={styles.bottomRows}>
          <div className={styles.maxWrapGridBottom}>
            <section>
              <h3>RECENT POSTS</h3>
              <ul className={styles.postList}>
                {recentPosts.map((p) => (
                  <li key={`${p.title}-row2`}>
                    <p>{p.title}</p>
                    <span>
                      By {p.author} — {p.date}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
            <section>
              <h3>RECENT POSTS</h3>
              <ul className={styles.postList}>
                {featuredPosts.map((p) => (
                  <li key={`${p.title}-row3`}>
                    <p>{p.title}</p>
                    <span>
                      By {p.author} — {p.date}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
            <section>
              <h3>INTERVIEW EXPERIENCES</h3>
              <ul className={styles.postList}>
                {interviewExperiences.map((p) => (
                  <li key={p}>
                    <p>{p}</p>
                  </li>
                ))}
              </ul>
            </section>
            <section>
              <h3>WORK EXPERIENCES</h3>
              <ul className={styles.postList}>
                {workExperiences.map((p) => (
                  <li key={p}>
                    <p>{p}</p>
                  </li>
                ))}
              </ul>
            </section>
            <aside className={styles.sideWidgets}>
              <div className={styles.subscribeCard}>
                <h4>Subscribe to Stay Updated</h4>
                <p>Stay ahead in the world of tech with our exclusive newsletter!</p>
                <input type="email" placeholder="Email" />
                <button type="button">SUBSCRIBE</button>
              </div>
              <div className={styles.upskill}>
                <h4>UPSKILL YOURSELF</h4>
                <a href="/learn">Explore</a>
                <div className={styles.banner}>NAMASTE REACT from Zero to Hero</div>
              </div>
            </aside>
          </div>
        </section>

        <footer className={styles.footer}>
          <div className={styles.maxWrapFooter}>
            <div className={styles.footerTop}>
              <h3>NamasteDev.com</h3>
              <div>
                <span>▶</span>
                <span>in</span>
                <span>𝕏</span>
                <span>◎</span>
                <span>◈</span>
              </div>
            </div>
            <div className={styles.footerCols}>
              <div>
                <h4>COURSES</h4>
                <p>Namaste DSA</p>
                <p>Namaste React</p>
                <p>Namaste Frontend System Design</p>
                <p>Namaste Javascript</p>
                <p>Crack Frontend Interview</p>
              </div>
              <div>
                <h4>COMMUNITY</h4>
                <p>YouTube</p>
                <p>LinkedIn</p>
                <p>Discord</p>
                <p>Instagram</p>
                <p>Twitter</p>
              </div>
              <div>
                <h4>CONTACT US</h4>
                <p>Support@namastedev.com</p>
              </div>
              <div>
                <h4>Subscribe to Stay Updated</h4>
                <p>Stay ahead in the world of tech with our exclusive newsletter!</p>
                <input type="email" placeholder="Email" />
                <button type="button">SUBSCRIBE</button>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </DashboardShell>
  );
}
