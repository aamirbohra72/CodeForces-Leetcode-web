'use client';

import { Fragment, useEffect, useMemo, useState } from 'react';
import { AppNavbar } from '@/components/AppNavbar';
import styles from './projects.module.css';

type Difficulty = 'Easy' | 'Medium' | 'Hard';

interface DetailSubsection {
  title: string;
  items: string[];
}

interface DetailBlock {
  heading: string;
  paragraphs?: string[];
  items?: string[];
  subsections?: DetailSubsection[];
}

interface ResourceLink {
  title: string;
  url: string;
}

interface Project {
  id: string;
  title: string;
  difficulty: Difficulty;
  shortDesc: string;
  domains: string[];
  technologies: string[];
  author: string;
  likes: number;
  overviewParagraphs?: string[];
  detailBlocks: DetailBlock[];
  resources?: ResourceLink[];
}

function parseInline(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className={styles.em}>
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <Fragment key={i}>{part}</Fragment>;
  });
}

const PROJECTS: Project[] = [
  {
    id: '1',
    title: 'Peer-to-Peer Learning & Mentorship Platform',
    difficulty: 'Hard',
    shortDesc: 'A MERN full-stack platform where users exchange skills in a barter-like system.',
    domains: ['Edtech', 'Productivity'],
    technologies: ['Web', 'React', 'Nodejs', 'Fullstack'],
    author: 'NamasteDev',
    likes: 33,
    overviewParagraphs: [
      'A MERN full-stack platform where users exchange skills in a barter-like system.',
      '**Example:** A developer can teach coding in exchange for learning guitar.',
      'It creates a global **peer-to-peer skill-sharing ecosystem** with gamification and community features.',
    ],
    detailBlocks: [
      {
        heading: 'Tech Stack (MERN)',
        items: [
          '**Frontend:** React.js, Redux Toolkit/Zustand, TailwindCSS.',
          '**Backend:** Node.js, Express.js.',
          '**Database:** MongoDB (users, skills, credits, ratings).',
          '**Auth:** JWT & OAuth (Google, GitHub).',
          '**Real-time:** WebRTC + Socket.IO for video/chat.',
          '**AI:** OpenAI API for recommendations, chatbots.',
          '**Cloud:** AWS S3/Cloudinary for media uploads.',
          '**Payments:** Stripe/Razorpay for credit purchases.',
          '**Deployment:** Vercel (frontend) + Render/AWS/Heroku (backend).',
        ],
      },
      {
        heading: 'Core Features (MVP)',
        subsections: [
          {
            title: 'User Profiles & Dashboard',
            items: [
              'Showcase skills users can teach.',
              'List skills they want to learn.',
              'Profile completeness score.',
            ],
          },
          {
            title: 'Skill Credits System',
            items: [
              'Earn credits by teaching.',
              'Spend credits to book learning sessions.',
              'Option to buy credits with money.',
            ],
          },
          {
            title: 'Matching Algorithm',
            items: [
              '**AI/ML-based skill matchmaking.**',
              'Suggest best possible mentors/learners.',
              'Filter by rating, location, availability.',
            ],
          },
          {
            title: 'Video & Chat Sessions',
            items: [
              'Real-time video calls (WebRTC, Agora, Twilio).',
              'In-app chat with file sharing.',
              'Screen sharing for technical skills.',
            ],
          },
          {
            title: 'Feedback & Ratings',
            items: [
              'Learners rate mentors after each session.',
              'Reputation system for trust.',
              'Skill endorsement badges.',
            ],
          },
        ],
      },
      {
        heading: 'Advanced Features (Scalable Ideas)',
        subsections: [
          {
            title: 'Gamification & Achievements',
            items: [
              'Badges for “Top Mentor,” “Quick Learner,” etc.',
              'Daily/weekly streak rewards.',
              'Leaderboards across skill categories.',
            ],
          },
          {
            title: 'Skill Challenges & Hackathons',
            items: [
              'Weekly challenges (coding, design, fitness).',
              'Community voting & recognition.',
              'Real/virtual hackathons with team collaboration.',
            ],
          },
          {
            title: 'AI-Powered Mentor Bot',
            items: [
              'AI suggests learning paths.',
              'Recommends practice resources (blogs, YouTube, GitHub repos).',
              'AI-assisted chat for quick Q&A.',
            ],
          },
          {
            title: 'Global Marketplace for Learning',
            items: [
              'Sell premium workshops, masterclasses, or eBooks.',
              'Hybrid barter + paid system.',
              'Group learning sessions.',
            ],
          },
          {
            title: 'Collaboration Hub',
            items: [
              'Users form teams to work on side projects.',
              'Showcase project portfolios.',
              'GitHub/GitLab integration for developers.',
            ],
          },
          {
            title: 'Cross-Language Support',
            items: [
              'AI translation in real time.',
              'Subtitles during video calls.',
              'Breaks geographical barriers.',
            ],
          },
          {
            title: 'Certification System',
            items: [
              'Issue digital certificates after completing X number of sessions.',
              'NFT/blockchain-based certificates for authenticity.',
            ],
          },
          {
            title: 'Offline & Mobile App',
            items: [
              'React Native app for mobile learning.',
              'Download recorded sessions.',
              'Offline PDF & resource access.',
            ],
          },
          {
            title: 'Smart Calendar & Notifications',
            items: [
              'Sync sessions with Google/Outlook Calendar.',
              'Push notifications & reminders.',
              'Time zone auto-adjustment.',
            ],
          },
          {
            title: 'Community Spaces',
            items: [
              'Skill-specific communities (coding, design, art, languages).',
              'Resource sharing (docs, videos, GitHub repos).',
              'Peer support groups.',
            ],
          },
        ],
      },
      {
        heading: 'Why Unique?',
        items: [
          'Combines **edtech**, **social networking**, and **gamification**.',
          'Focuses on **peer-to-peer knowledge exchange** instead of only paid courses.',
          'Encourages **community-driven growth** & global collaboration.',
          'Flexible: can scale into a full edtech startup like **Skillshare + Duolingo + Meetup**.',
        ],
      },
    ],
    resources: [
      {
        title: 'Step-by-step tutorial: Building a MERN stack application from scratch (Medium)',
        url: 'https://medium.com/@sriram.se21/step-by-step-tutorial-building-a-mern-stack-application-from-scratch-d281010715e4',
      },
      {
        title: 'MDN — Express.js routing fundamentals',
        url: 'https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs',
      },
      {
        title: 'Stripe Docs — Accept a payment',
        url: 'https://stripe.com/docs/payments/accept-a-payment',
      },
    ],
  },
  {
    id: '2',
    title: 'Cart Saver & Auto-Fill - Smart Shopping Extension',
    difficulty: 'Easy',
    shortDesc: 'Browser extension that remembers carts and helps checkout faster across stores.',
    domains: ['Productivity', 'E-commerce'],
    technologies: ['Chrome Extension', 'JavaScript', 'Web'],
    author: 'NamasteDev',
    likes: 18,
    detailBlocks: [
      {
        heading: 'Tech Stack',
        items: [
          'Manifest V3 extension.',
          'Content scripts + background service worker.',
          'Local storage for cart snapshots.',
        ],
      },
    ],
  },
  {
    id: '3',
    title: 'Hotel & Airbnb Price Comparator Chrome Extension',
    difficulty: 'Easy',
    shortDesc: 'Compare nightly rates across hotel and short-stay sites in one glance.',
    domains: ['Travel', 'Productivity'],
    technologies: ['Chrome Extension', 'React', 'Nodejs'],
    author: 'NamasteDev',
    likes: 24,
    detailBlocks: [
      {
        heading: 'Overview',
        items: [
          'Overlay UI on supported booking pages.',
          'Lightweight scraping with user-approved permissions.',
          'Simple charts for price history (optional phase 2).',
        ],
      },
    ],
  },
  {
    id: '4',
    title: 'Live Sports Fantasy League Analytics Dashboard',
    difficulty: 'Medium',
    shortDesc: 'Real-time scoring, player props, and league insights for fantasy managers.',
    domains: ['Sports', 'Gaming'],
    technologies: ['React', 'Nodejs', 'WebSocket', 'Postgres'],
    author: 'NamasteDev',
    likes: 41,
    overviewParagraphs: [
      'Aggregate feeds from public APIs, normalize stats, and surface **start/sit** recommendations.',
    ],
    detailBlocks: [
      {
        heading: 'Core modules',
        subsections: [
          {
            title: 'Data ingestion',
            items: ['Scheduled jobs for box scores.', 'Idempotent writes.', 'Rate-limit aware polling.'],
          },
          {
            title: 'Dashboard',
            items: ['Team view + matchup view.', 'Shareable snapshots (PNG/PDF).', 'Dark mode.'],
          },
        ],
      },
    ],
  },
  {
    id: '5',
    title: 'AR Room Layout — Furniture Preview App',
    difficulty: 'Hard',
    shortDesc: 'Place 3D furniture in your room using mobile AR and save layouts.',
    domains: ['Interior', 'Mobile'],
    technologies: ['React Native', 'ARCore', 'Three.js'],
    author: 'NamasteDev',
    likes: 56,
    detailBlocks: [
      {
        heading: 'Highlights',
        items: [
          'Plane detection and occlusion.',
          'Product catalog with GLB assets.',
          'Wishlist + affiliate checkout deep links.',
        ],
      },
    ],
  },
  {
    id: '6',
    title: 'Micro-SaaS — Invoice & Time Tracker for Freelancers',
    difficulty: 'Medium',
    shortDesc: 'Track time, generate expense reports, and email branded PDF invoices.',
    domains: ['Productivity', 'Finance'],
    technologies: ['Next.js', 'Prisma', 'Stripe'],
    author: 'NamasteDev',
    likes: 29,
    detailBlocks: [
      {
        heading: 'MVP scope',
        items: [
          'Clients, projects, hourly rates.',
          'Timer + manual entries.',
          'PDF export + payment links.',
        ],
      },
    ],
  },
  {
    id: '7',
    title: 'Community Recipe API + Mobile PWA',
    difficulty: 'Easy',
    shortDesc: 'Share recipes, nutritional estimates, and pantry substitutions with moderation.',
    domains: ['Community', 'Health'],
    technologies: ['React', 'Express', 'MongoDB'],
    author: 'NamasteDev',
    likes: 12,
    detailBlocks: [
      {
        heading: 'Ideas',
        items: [
          'Ingredient parser from photos (phase 2).',
          'Allergen flags and portion scaling.',
          'Moderation queue for new submissions.',
        ],
      },
    ],
  },
];

function diffClass(d: Difficulty) {
  switch (d) {
    case 'Easy':
      return styles.diffEasy;
    case 'Medium':
      return styles.diffMedium;
    default:
      return styles.diffHard;
  }
}

export default function ProjectsPage() {
  const [selectedId, setSelectedId] = useState(PROJECTS[0].id);
  const [difficulty, setDifficulty] = useState<string>('All');
  const [domain, setDomain] = useState<string>('All');
  const [tech, setTech] = useState<string>('All');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    return PROJECTS.filter((p) => {
      if (difficulty !== 'All' && p.difficulty !== difficulty) return false;
      if (domain !== 'All' && !p.domains.includes(domain)) return false;
      if (tech !== 'All' && !p.technologies.includes(tech)) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        if (
          !p.title.toLowerCase().includes(q) &&
          !p.shortDesc.toLowerCase().includes(q)
        ) {
          return false;
        }
      }
      return true;
    });
  }, [difficulty, domain, tech, search]);

  useEffect(() => {
    if (filtered.length === 0) return;
    if (!filtered.some((p) => p.id === selectedId)) {
      setSelectedId(filtered[0].id);
    }
  }, [filtered, selectedId]);

  const selected =
    filtered.find((p) => p.id === selectedId) ?? filtered[0] ?? PROJECTS[0];
  const domainOptions = Array.from(new Set(PROJECTS.flatMap((p) => p.domains)));
  const techOptions = Array.from(new Set(PROJECTS.flatMap((p) => p.technologies)));

  const resetFilters = () => {
    setDifficulty('All');
    setDomain('All');
    setTech('All');
    setSearch('');
  };

  return (
    <div className={styles.page}>
      <AppNavbar className="shrink-0" />

      <div className={styles.toolbar}>
        <div className={styles.toolbarInner}>
          <h1 className={styles.toolbarTitle}>All Projects</h1>
          <div className={styles.filtersRow}>
            <select className={styles.select} value={difficulty} onChange={(e) => setDifficulty(e.target.value)} aria-label="Difficulty">
              <option value="All">All Difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
            <select className={styles.select} value={domain} onChange={(e) => setDomain(e.target.value)} aria-label="Domain">
              <option value="All">All Domains</option>
              {domainOptions.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
            <select className={styles.select} value={tech} onChange={(e) => setTech(e.target.value)} aria-label="Technology">
              <option value="All">All Technologies</option>
              {techOptions.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            <div className={styles.searchWrap}>
              <span className={styles.searchIcon}>🔍</span>
              <input
                type="search"
                placeholder="Search project ideas..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="Search projects"
              />
            </div>
            <div className={styles.spacer} />
            <button type="button" className={styles.iconBtn} onClick={resetFilters} aria-label="Reset filters">
              ↻
            </button>
            <button type="button" className={styles.pillBtn}>
              ♡ Liked
            </button>
            <button type="button" className={styles.pillBtn}>
              🔖 Bookmarked
            </button>
          </div>
        </div>
      </div>

      <div className={styles.layout}>
        <div className={styles.listCol} role="list">
          {filtered.length === 0 ? (
            <p style={{ padding: '1rem', color: '#6b7280' }}>No projects match your filters.</p>
          ) : (
            filtered.map((p) => (
              <button
                key={p.id}
                type="button"
                role="listitem"
                className={`${styles.card} ${p.id === selectedId ? styles.cardSelected : ''}`}
                onClick={() => setSelectedId(p.id)}
              >
                <div className={styles.cardTop}>
                  <h2 className={styles.cardTitle}>{p.title}</h2>
                  <span className={`${styles.diffBadge} ${diffClass(p.difficulty)}`}>{p.difficulty}</span>
                </div>
                <p className={styles.cardDesc}>{p.shortDesc}</p>
                <div className={styles.tagRow}>
                  {p.domains.map((t) => (
                    <span key={t} className={styles.tagDomain}>
                      {t}
                    </span>
                  ))}
                </div>
                <div className={styles.tagRow} style={{ marginTop: 6 }}>
                  {p.technologies.map((t) => (
                    <span key={t} className={styles.tagTech}>
                      {t}
                    </span>
                  ))}
                </div>
              </button>
            ))
          )}
        </div>

        <article className={styles.detail}>
          {filtered.length === 0 ? (
            <p style={{ margin: 0, color: '#6b7280' }}>No project selected. Adjust filters to see ideas.</p>
          ) : (
            <>
              <div className={styles.detailHeader}>
                <h2 className={styles.detailTitle}>{selected.title}</h2>
                <div className={styles.detailActions}>
                  <button type="button" className={styles.iconBtn} aria-label="Like">
                    ♡
                  </button>
                  <button type="button" className={styles.iconBtn} aria-label="Bookmark">
                    🔖
                  </button>
                  <button type="button" className={styles.iconBtn} aria-label="Share">
                    ↗
                  </button>
                </div>
              </div>
              <div className={styles.detailMeta}>
                <span className={styles.metaItem}>👤 {selected.author}</span>
                <span className={styles.metaItem}>♥ {selected.likes} Likes</span>
                <span className={`${styles.diffBadge} ${diffClass(selected.difficulty)}`}>{selected.difficulty}</span>
              </div>
              <p className={styles.detailIntro}>{selected.shortDesc}</p>
              {selected.overviewParagraphs?.map((para) => (
                <p key={para} className={styles.detailIntro}>
                  {parseInline(para)}
                </p>
              ))}

              <div className={styles.boxes}>
                <div className={`${styles.box} ${styles.boxDomains}`}>
                  <h4>◆ Domains</h4>
                  <div className={styles.tagRow}>
                    {selected.domains.map((t) => (
                      <span key={t} className={styles.tagDomain}>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                <div className={`${styles.box} ${styles.boxTech}`}>
                  <h4>
                    <span aria-hidden>&lt;/&gt;</span> Technologies
                  </h4>
                  <div className={styles.tagRow}>
                    {selected.technologies.map((t) => (
                      <span key={t} className={styles.tagTech}>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className={styles.detailsSection}>
                <h3>📄 Project Details</h3>
                {selected.detailBlocks.map((block) => (
                  <div key={block.heading}>
                    <h4>{block.heading}</h4>
                    {block.paragraphs?.map((p) => (
                      <p key={p} className={styles.blockParagraphs}>
                        {parseInline(p)}
                      </p>
                    ))}
                    {block.subsections?.map((sub) => (
                      <div key={sub.title}>
                        <div className={styles.subheading}>{sub.title}</div>
                        <ul>
                          {sub.items.map((item) => (
                            <li key={item}>{parseInline(item)}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                    {block.items && !block.subsections ? (
                      <ul>
                        {block.items.map((item) => (
                          <li key={item}>{parseInline(item)}</li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                ))}

                {selected.resources && selected.resources.length > 0 ? (
                  <>
                    <h4>Resources ({selected.resources.length})</h4>
                    <ul className={styles.resourceList}>
                      {selected.resources.map((r) => (
                        <li key={r.url}>
                          <a href={r.url} target="_blank" rel="noopener noreferrer">
                            {r.title}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : null}
              </div>
            </>
          )}
        </article>
      </div>
    </div>
  );
}
