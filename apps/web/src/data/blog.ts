export type BlogPost = {
  id: string;
  title: string;
  author: string;
  date: string;
  excerpt: string;
  readMinutes: number;
  tags: string[];
  featured?: boolean;
};

export const BLOG_FEATURED: BlogPost[] = [
  {
    id: '1',
    title: 'From Lag to Lightning-Fast: API Transformation',
    author: 'akshay',
    date: '2026-03-31',
    excerpt:
      'Sometimes the simplest solutions are the most effective—whether you are debugging latency in production or tightening contracts between services.',
    readMinutes: 8,
    tags: ['Backend', 'Performance'],
    featured: true,
  },
  {
    id: '2',
    title: 'Building Highly Available Applications with Multi-Region Deployment',
    author: 'Himanshi Rana',
    date: '2026-03-31',
    excerpt: 'Failover, quotas, and data locality—practical notes for shipping resilient systems without heroics.',
    readMinutes: 12,
    tags: ['System Design', 'Infra'],
  },
  {
    id: '3',
    title: 'Implementing Zero-Downtime Deployments in Modern Web Apps',
    author: 'Neha Bansal',
    date: '2026-03-31',
    excerpt: 'Blue-green, canaries, and health checks that actually catch broken builds before users do.',
    readMinutes: 10,
    tags: ['DevOps', 'Frontend'],
  },
  {
    id: '4',
    title: 'Understanding Eventual Consistency in Distributed Systems',
    author: 'Neha Bansal',
    date: '2026-03-31',
    excerpt: 'When “strong enough” consistency is the right trade-off—and how to document it for your team.',
    readMinutes: 14,
    tags: ['Distributed Systems'],
  },
  {
    id: '5',
    title: 'Efficient Caching Techniques for Data-Heavy Web Apps',
    author: 'Avi Agarwal',
    date: '2026-03-31',
    excerpt: 'CDN, edge, and application caches: a concise playbook for fewer round-trips and happier databases.',
    readMinutes: 9,
    tags: ['Performance', 'Web'],
  },
];

export const BLOG_RECENT: BlogPost[] = [
  {
    id: 'r1',
    title: 'Optimizing React App Startup Time with Code Splitting',
    author: 'Harshvardhan Yadav',
    date: '2026-03-30',
    excerpt: 'Route-level and component-level splits that keep TTFP predictable on slow networks.',
    readMinutes: 7,
    tags: ['React', 'Performance'],
    featured: true,
  },
  {
    id: 'r2',
    title: 'Automating Code Quality Checks with GitHub Actions',
    author: 'Tanishq Kulkarni',
    date: '2026-03-30',
    excerpt: 'Lint, typecheck, and test gates that scale with your monorepo.',
    readMinutes: 6,
    tags: ['CI', 'DX'],
  },
  {
    id: 'r3',
    title: 'Applying SOLID Principles in Frontend Architecture',
    author: 'Atharva Phadke',
    date: '2026-03-30',
    excerpt: 'Boundaries, composition, and when not to over-engineer your UI layer.',
    readMinutes: 11,
    tags: ['Architecture', 'React'],
  },
  {
    id: 'r4',
    title: 'Securing Web Applications Against Common Vulnerabilities',
    author: 'Manika Dhingra',
    date: '2026-03-30',
    excerpt: 'OWASP-minded checklists tailored for React and Node stacks.',
    readMinutes: 13,
    tags: ['Security'],
  },
  {
    id: 'r5',
    title: 'Integrating TypeScript for Safer JavaScript Development',
    author: 'Riddhi Bhatt',
    date: '2026-03-30',
    excerpt: 'Incremental adoption, strictness ramps, and keeping builds fast.',
    readMinutes: 8,
    tags: ['TypeScript'],
  },
];

export type BlogTopic = { id: string; label: string; items: { id: string; title: string }[] };

export const BLOG_TOPICS: BlogTopic[] = [
  {
    id: 'interview',
    label: 'Interview experiences',
    items: [
      { id: 'i1', title: 'Interview Experience | SDE | lessons learned' },
      { id: 'i2', title: 'Closures in JavaScript — interview essentials' },
      { id: 'i3', title: 'Introduction to stacks and queues' },
      { id: 'i4', title: 'Time and space complexity cheat sheet' },
    ],
  },
  {
    id: 'work',
    label: 'Work & career',
    items: [
      { id: 'w1', title: 'Navigating the job market and work-life balance' },
      { id: 'w2', title: 'Remote collaboration at scale' },
      { id: 'w3', title: 'From services to product: one engineer’s path' },
    ],
  },
];

const POST_BY_ID: Map<string, BlogPost> = new Map();
for (const p of [...BLOG_FEATURED, ...BLOG_RECENT]) {
  POST_BY_ID.set(p.id, p);
}

export function getAllBlogPosts(): BlogPost[] {
  return [...BLOG_FEATURED, ...BLOG_RECENT];
}

export function getBlogPostById(id: string): BlogPost | undefined {
  return POST_BY_ID.get(id);
}

export function getBlogStaticParams(): { id: string }[] {
  return getAllBlogPosts().map((p) => ({ id: p.id }));
}

function formatDate(iso: string) {
  try {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export function postDisplayDate(post: BlogPost): string {
  return formatDate(post.date);
}
