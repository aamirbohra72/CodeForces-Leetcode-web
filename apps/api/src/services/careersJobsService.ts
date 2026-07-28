import { z } from 'zod';
import { cacheDel, cacheGet, cacheSet } from './redisService';

const jobSchema = z.object({
  id: z.string(),
  title: z.string(),
  company: z.string(),
  companyInitials: z.string().optional(),
  postedAgo: z.string(),
  location: z.string(),
  experience: z.string(),
  ctc: z.string(),
  noticePeriod: z.string(),
  status: z.enum(['eligible', 'pending', 'closed']).default('eligible'),
  pendingSteps: z.number().optional(),
  preferred: z.boolean().default(false),
  tags: z.array(z.string()).optional(),
  description: z.string().optional(),
  applyUrl: z.string().url().optional(),
  sourceProvider: z.string().optional(),
});

const profileSchema = z.object({
  name: z.string(),
  role: z.string(),
  experience: z.string(),
  intent: z.string(),
  remoteOk: z.boolean(),
  preferredLocations: z.array(z.string()).min(1),
});

const hubSchema = z.object({
  source: z.literal('live').default('live'),
  generatedAt: z.string().optional(),
  profile: profileSchema,
  jobs: z.array(jobSchema).min(1).max(24),
});

export type CareersHubPack = z.infer<typeof hubSchema>;

const memoryCache = new Map<string, { expiresAt: number; pack: CareersHubPack }>();
const CACHE_KEY = 'careers-hub:live:v1';
const MEMORY_TTL_MS = 30 * 60 * 1000;
const REDIS_TTL_SEC = 60 * 60;

const DEFAULT_PROFILE: CareersHubPack['profile'] = {
  name: 'Aamir Bohra',
  role: 'Frontend Engineer',
  experience: '3 yrs 2 months',
  intent: 'Looking for a job',
  remoteOk: true,
  preferredLocations: ['Remote', 'Bangalore', 'Pune', 'Hyderabad', 'Mumbai'],
};

const TECH_KEYWORDS = [
  'software',
  'engineer',
  'developer',
  'frontend',
  'front-end',
  'backend',
  'back-end',
  'fullstack',
  'full-stack',
  'full stack',
  'react',
  'typescript',
  'javascript',
  'node',
  'next.js',
  'web',
  'sde',
  'devops',
  'platform',
];

type RawJob = {
  id: string;
  title: string;
  company: string;
  location: string;
  publishedAt?: string | number;
  salary?: string;
  seniority?: string;
  tags?: string[];
  description?: string;
  applyUrl?: string;
  sourceProvider: string;
};

function initials(company: string): string {
  const parts = company.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'CO';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

function stripHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

function truncate(text: string, max = 280): string {
  if (text.length <= max) return text;
  return `${text.slice(0, max - 1).trimEnd()}…`;
}

function postedAgoFrom(raw?: string | number): string {
  if (raw == null || raw === '') return 'Posted recently';
  let t: number;
  if (typeof raw === 'number') {
    // Himalayas uses unix seconds; millis if already large
    t = raw < 1e12 ? raw * 1000 : raw;
  } else {
    const trimmed = raw.trim();
    if (/^\d+$/.test(trimmed)) {
      const n = Number(trimmed);
      t = n < 1e12 ? n * 1000 : n;
    } else {
      t = Date.parse(trimmed);
    }
  }
  if (Number.isNaN(t)) return 'Posted recently';
  const days = Math.max(0, Math.floor((Date.now() - t) / (24 * 60 * 60 * 1000)));
  if (days === 0) return 'Posted today';
  if (days === 1) return 'Posted 1d ago';
  if (days < 30) return `Posted ${days}d ago`;
  const months = Math.floor(days / 30);
  return months === 1 ? 'Posted 1mo ago' : `Posted ${months}mo ago`;
}

function formatSalary(raw?: string, min?: number | null, max?: number | null, currency?: string): string {
  if (raw?.trim()) return raw.trim();
  if (min == null && max == null) return 'Not disclosed';
  const cur = (currency || 'USD').toUpperCase();
  const fmt = (n: number) => {
    if (cur === 'INR' || cur === '₹') {
      if (n >= 100000) return `₹${(n / 100000).toFixed(n % 100000 === 0 ? 0 : 1)}L`;
      return `₹${n.toLocaleString('en-IN')}`;
    }
    if (n >= 1000) return `$${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}k`;
    return `$${n}`;
  };
  if (min != null && max != null) return `${fmt(min)} - ${fmt(max)}`;
  if (min != null) return `From ${fmt(min)}`;
  return `Up to ${fmt(max!)}`;
}

function experienceFrom(seniority?: string): string {
  const s = (seniority || '').toLowerCase();
  if (!s) return 'Not specified';
  if (s.includes('intern') || s.includes('entry') || s.includes('junior')) return '0y-2y';
  if (s.includes('mid')) return '2y-5y';
  if (s.includes('senior') || s.includes('staff') || s.includes('principal')) return '4y-8y';
  if (s.includes('lead') || s.includes('manager')) return '5y+';
  return seniority!;
}

function isTechRole(title: string, tags: string[] = [], categories: string[] = []): boolean {
  const hay = `${title} ${tags.join(' ')} ${categories.join(' ')}`.toLowerCase();
  return TECH_KEYWORDS.some((k) => hay.includes(k));
}

function isPreferred(job: RawJob, profile: CareersHubPack['profile']): boolean {
  const loc = job.location.toLowerCase();
  const title = job.title.toLowerCase();
  const preferredLocHit = profile.preferredLocations.some((p) => {
    const pl = p.toLowerCase();
    if (pl === 'remote') return loc.includes('remote') || loc.includes('worldwide') || loc.includes('anywhere');
    return loc.includes(pl);
  });
  const roleHit =
    title.includes('frontend') ||
    title.includes('front-end') ||
    title.includes('react') ||
    title.includes('fullstack') ||
    title.includes('full-stack') ||
    title.includes('full stack') ||
    title.includes('typescript') ||
    title.includes('javascript');
  if (profile.remoteOk && (loc.includes('remote') || loc.includes('worldwide'))) return true;
  return preferredLocHit || roleHit;
}

function toCareerJob(raw: RawJob, profile: CareersHubPack['profile']) {
  return {
    id: raw.id,
    title: raw.title,
    company: raw.company,
    companyInitials: initials(raw.company),
    postedAgo: postedAgoFrom(raw.publishedAt),
    location: raw.location || 'Remote',
    experience: experienceFrom(raw.seniority),
    ctc: raw.salary?.trim() || 'Not disclosed',
    noticePeriod: 'Not specified',
    status: 'eligible' as const,
    preferred: isPreferred(raw, profile),
    tags: raw.tags?.slice(0, 8),
    description: raw.description ? truncate(raw.description, 320) : undefined,
    applyUrl: raw.applyUrl,
    sourceProvider: raw.sourceProvider,
  };
}

async function fetchJson(url: string, timeoutMs = 12000): Promise<unknown> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      signal: ctrl.signal,
      headers: {
        Accept: 'application/json',
        'User-Agent': 'CareerHub/1.0 (EdTech placement support)',
      },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
    return await res.json();
  } finally {
    clearTimeout(timer);
  }
}

async function fetchHimalayas(): Promise<RawJob[]> {
  const queries = ['software engineer', 'frontend react', 'fullstack typescript'];
  const results = await Promise.allSettled(
    queries.map((q) =>
      fetchJson(
        `https://himalayas.app/jobs/api/search?q=${encodeURIComponent(q)}&limit=12`,
      ),
    ),
  );

  const out: RawJob[] = [];
  const seen = new Set<string>();

  for (const result of results) {
    if (result.status !== 'fulfilled') continue;
    const body = result.value as {
      jobs?: Array<{
        title?: string;
        companyName?: string;
        excerpt?: string;
        description?: string;
        minSalary?: number | null;
        maxSalary?: number | null;
        currency?: string;
        seniority?: string | string[];
        locationRestrictions?: string[];
        categories?: string[];
        parentCategories?: string[];
        pubDate?: string | number;
        applicationLink?: string;
        guid?: string;
      }>;
    };

    for (const job of body.jobs ?? []) {
      const title = (job.title || '').trim();
      const company = (job.companyName || '').trim();
      if (!title || !company) continue;
      const cats = [...(job.categories ?? []), ...(job.parentCategories ?? [])];
      if (!isTechRole(title, [], cats)) continue;

      const id = `him-${job.guid || `${company}-${title}`.toLowerCase().replace(/\W+/g, '-').slice(0, 64)}`;
      if (seen.has(id)) continue;
      seen.add(id);

      const locs = job.locationRestrictions?.filter(Boolean) ?? [];
      const location = locs.length ? locs.slice(0, 3).join(', ') : 'Remote / Worldwide';
      const seniority = Array.isArray(job.seniority) ? job.seniority[0] : job.seniority;
      const desc = stripHtml(job.excerpt || job.description || '');

      out.push({
        id,
        title,
        company,
        location,
        publishedAt: job.pubDate,
        salary: formatSalary(undefined, job.minSalary, job.maxSalary, job.currency),
        seniority,
        tags: cats.slice(0, 6).map((c) => c.replace(/-/g, ' ')),
        description: desc || undefined,
        applyUrl: job.applicationLink,
        sourceProvider: 'himalayas',
      });
    }
  }

  return out;
}

async function fetchRemotive(): Promise<RawJob[]> {
  const body = (await fetchJson('https://remotive.com/api/remote-jobs?limit=50')) as {
    jobs?: Array<{
      id?: number | string;
      title?: string;
      company_name?: string;
      candidate_required_location?: string;
      publication_date?: string;
      salary?: string;
      tags?: string[];
      category?: string;
      description?: string;
      url?: string;
      job_type?: string;
    }>;
  };

  const out: RawJob[] = [];
  for (const job of body.jobs ?? []) {
    const title = (job.title || '').trim();
    const company = (job.company_name || '').trim();
    if (!title || !company) continue;
    const tags = job.tags ?? [];
    const cats = job.category ? [job.category] : [];
    if (!isTechRole(title, tags, cats) && job.category !== 'Software Development') continue;

    out.push({
      id: `rem-${job.id ?? `${company}-${title}`.toLowerCase().replace(/\W+/g, '-').slice(0, 64)}`,
      title,
      company,
      location: (job.candidate_required_location || 'Remote').trim(),
      publishedAt: job.publication_date,
      salary: formatSalary(job.salary),
      tags: tags.slice(0, 6),
      description: job.description ? truncate(stripHtml(job.description), 320) : undefined,
      applyUrl: job.url,
      sourceProvider: 'remotive',
    });
  }
  return out;
}

function dedupeAndRank(jobs: RawJob[], profile: CareersHubPack['profile']): RawJob[] {
  const seen = new Set<string>();
  const unique: RawJob[] = [];
  for (const job of jobs) {
    const key = `${job.title.toLowerCase()}|${job.company.toLowerCase()}`;
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push(job);
  }

  unique.sort((a, b) => {
    const ap = isPreferred(a, profile) ? 1 : 0;
    const bp = isPreferred(b, profile) ? 1 : 0;
    if (bp !== ap) return bp - ap;
    const at = typeof a.publishedAt === 'number'
      ? (a.publishedAt < 1e12 ? a.publishedAt * 1000 : a.publishedAt)
      : a.publishedAt
        ? Date.parse(String(a.publishedAt)) || 0
        : 0;
    const bt = typeof b.publishedAt === 'number'
      ? (b.publishedAt < 1e12 ? b.publishedAt * 1000 : b.publishedAt)
      : b.publishedAt
        ? Date.parse(String(b.publishedAt)) || 0
        : 0;
    return bt - at;
  });

  return unique.slice(0, 16);
}

async function fetchLiveJobs(): Promise<CareersHubPack> {
  const profile = DEFAULT_PROFILE;
  const settled = await Promise.allSettled([fetchHimalayas(), fetchRemotive()]);

  const raw: RawJob[] = [];
  for (const result of settled) {
    if (result.status === 'fulfilled') raw.push(...result.value);
  }

  if (raw.length === 0) {
    const errors = settled
      .filter((r): r is PromiseRejectedResult => r.status === 'rejected')
      .map((r) => (r.reason instanceof Error ? r.reason.message : String(r.reason)));
    throw new Error(
      errors.length
        ? `Live job APIs unavailable: ${errors.join('; ')}`
        : 'Live job APIs returned no listings',
    );
  }

  const ranked = dedupeAndRank(raw, profile);
  const jobs = ranked.map((j) => toCareerJob(j, profile));

  // Ensure Preferred Jobs tab has a usable shortlist
  let preferredCount = jobs.filter((j) => j.preferred).length;
  for (const job of jobs) {
    if (preferredCount >= 3) break;
    if (!job.preferred) {
      job.preferred = true;
      preferredCount += 1;
    }
  }

  return hubSchema.parse({
    source: 'live',
    generatedAt: new Date().toISOString(),
    profile,
    jobs,
  });
}

export async function getCareersHub(opts: { refresh?: boolean } = {}): Promise<CareersHubPack> {
  const now = Date.now();
  if (!opts.refresh) {
    const mem = memoryCache.get(CACHE_KEY);
    if (mem && mem.expiresAt > now) return mem.pack;
    const cached = await cacheGet(CACHE_KEY);
    if (cached) {
      const pack = hubSchema.parse(JSON.parse(cached));
      memoryCache.set(CACHE_KEY, { pack, expiresAt: now + MEMORY_TTL_MS });
      return pack;
    }
  }

  const pack = await fetchLiveJobs();
  memoryCache.set(CACHE_KEY, { pack, expiresAt: now + MEMORY_TTL_MS });
  await cacheSet(CACHE_KEY, JSON.stringify(pack), REDIS_TTL_SEC);
  return pack;
}

export async function invalidateCareersHub(): Promise<void> {
  memoryCache.delete(CACHE_KEY);
  await cacheDel(CACHE_KEY);
}
