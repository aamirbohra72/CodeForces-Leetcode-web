import { z } from 'zod';
import { mistralChatJson } from './mistralInterviewService';
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
});

const profileSchema = z.object({
  name: z.string(),
  role: z.string(),
  experience: z.string(),
  intent: z.string(),
  remoteOk: z.boolean(),
  preferredLocations: z.array(z.string()).min(2),
});

const hubSchema = z.object({
  source: z.literal('llm').default('llm'),
  generatedAt: z.string().optional(),
  profile: profileSchema,
  jobs: z.array(jobSchema).min(6).max(16),
});

export type CareersHubPack = z.infer<typeof hubSchema>;

const memoryCache = new Map<string, { expiresAt: number; pack: CareersHubPack }>();
const CACHE_KEY = 'careers-hub:llm:v1';

const FALLBACK_PACK: CareersHubPack = {
  source: 'llm',
  generatedAt: new Date().toISOString(),
  profile: {
    name: 'Aamir Bohra',
    role: 'Frontend Engineer',
    experience: '3 yrs 2 months',
    intent: 'Looking for a job',
    remoteOk: true,
    preferredLocations: ['Remote', 'Bangalore', 'Pune', 'Hyderabad', 'Mumbai'],
  },
  jobs: [
    {
      id: 'job-1',
      title: 'MERN Stack Developer',
      company: 'IQ-Line',
      companyInitials: 'IQ',
      postedAgo: 'Posted 3d ago',
      location: 'Bangalore',
      experience: '3y-5y',
      ctc: '₹14L - ₹15L',
      noticePeriod: '30 days',
      status: 'eligible',
      preferred: true,
      tags: ['React', 'Node'],
      description: 'Build and ship full-stack product features with React and Node.',
    },
    {
      id: 'job-2',
      title: 'React Frontend Engineer',
      company: 'PixelForge',
      companyInitials: 'PF',
      postedAgo: 'Posted 1d ago',
      location: 'Remote',
      experience: '2y-4y',
      ctc: '₹12L - ₹18L',
      noticePeriod: '45 days',
      status: 'pending',
      pendingSteps: 2,
      preferred: true,
      tags: ['React', 'TypeScript'],
      description: 'Own customer-facing UI and design-system components.',
    },
    {
      id: 'job-3',
      title: 'Full Stack Engineer',
      company: 'NovaTech',
      companyInitials: 'NT',
      postedAgo: 'Posted 5d ago',
      location: 'Pune',
      experience: '1y-3y',
      ctc: '₹10L - ₹14L',
      noticePeriod: '15 days',
      status: 'eligible',
      preferred: true,
      tags: ['Next.js', 'Postgres'],
      description: 'End-to-end feature ownership across web and APIs.',
    },
    {
      id: 'job-4',
      title: 'Node.js Backend Developer',
      company: 'CloudSpan',
      companyInitials: 'CS',
      postedAgo: 'Posted 2d ago',
      location: 'Hyderabad',
      experience: '3y-6y',
      ctc: '₹16L - ₹22L',
      noticePeriod: '60 days',
      status: 'eligible',
      preferred: false,
      tags: ['Node', 'AWS'],
      description: 'Scale APIs and improve reliability for high-traffic services.',
    },
    {
      id: 'job-5',
      title: 'JavaScript Engineer',
      company: 'BrightApps',
      companyInitials: 'BA',
      postedAgo: 'Posted 4d ago',
      location: 'Mumbai',
      experience: '2y-5y',
      ctc: '₹11L - ₹16L',
      noticePeriod: '30 days',
      status: 'pending',
      pendingSteps: 1,
      preferred: false,
      tags: ['JavaScript', 'Vue'],
      description: 'Ship performant SPA experiences and mentoring support.',
    },
    {
      id: 'job-6',
      title: 'Senior Frontend Developer',
      company: 'Orbit Labs',
      companyInitials: 'OL',
      postedAgo: 'Posted 6d ago',
      location: 'Bangalore',
      experience: '4y-7y',
      ctc: '₹20L - ₹28L',
      noticePeriod: '90 days',
      status: 'eligible',
      preferred: false,
      tags: ['React', 'Performance'],
      description: 'Lead frontend architecture and mentorship for a growth product.',
    },
    {
      id: 'job-7',
      title: 'TypeScript Developer',
      company: 'StackMint',
      companyInitials: 'SM',
      postedAgo: 'Posted 1d ago',
      location: 'Remote',
      experience: '2y-4y',
      ctc: '₹13L - ₹17L',
      noticePeriod: '30 days',
      status: 'eligible',
      preferred: false,
      tags: ['TypeScript', 'React'],
      description: 'Build typed UI modules and shared libraries.',
    },
    {
      id: 'job-8',
      title: 'SDE - Web Platform',
      company: 'FinEdge',
      companyInitials: 'FE',
      postedAgo: 'Posted 7d ago',
      location: 'Gurgaon',
      experience: '1y-3y',
      ctc: '₹9L - ₹13L',
      noticePeriod: '15 days',
      status: 'eligible',
      preferred: false,
      tags: ['React', 'GraphQL'],
      description: 'Contribute to dashboard and reporting experiences.',
    },
    {
      id: 'job-9',
      title: 'UI Engineer',
      company: 'DesignOps Co',
      companyInitials: 'DO',
      postedAgo: 'Posted 3d ago',
      location: 'Chennai',
      experience: '3y-5y',
      ctc: '₹14L - ₹19L',
      noticePeriod: '45 days',
      status: 'pending',
      pendingSteps: 3,
      preferred: false,
      tags: ['CSS', 'Accessibility'],
      description: 'Craft accessible component libraries and design tokens.',
    },
    {
      id: 'job-10',
      title: 'Fullstack JS Developer',
      company: 'LaunchPad',
      companyInitials: 'LP',
      postedAgo: 'Posted 2d ago',
      location: 'Indore',
      experience: '2y-4y',
      ctc: '₹10L - ₹15L',
      noticePeriod: '30 days',
      status: 'eligible',
      preferred: true,
      tags: ['MERN'],
      description: 'Own features from API contracts to polished UI.',
    },
  ],
};

function extractJsonObject(raw: string): string {
  const t = raw.trim();
  const m = /^```(?:json)?\s*([\s\S]*?)```$/m.exec(t);
  if (m) return m[1].trim();
  return t;
}

async function generateCareersHub(): Promise<CareersHubPack> {
  if (!process.env.MISTRAL_API_KEY?.trim()) {
    return { ...FALLBACK_PACK, generatedAt: new Date().toISOString() };
  }

  const system = `You are a careers marketplace data generator for an EdTech coding platform in India.
Return STRICT JSON only. Create realistic software engineering / frontend / fullstack / backend roles.
Companies can be fictional but plausible. Keep CTC in INR LPA format like "₹12L - ₹18L".`;

  const user = `Generate a Careers Hub pack JSON:
{
  "source": "llm",
  "profile": {
    "name": "Aamir Bohra",
    "role": "Frontend Engineer",
    "experience": "3 yrs 2 months",
    "intent": "Looking for a job",
    "remoteOk": true,
    "preferredLocations": ["Remote", "Bangalore", "Pune", "Hyderabad", "Mumbai"]
  },
  "jobs": [
    {
      "id": "job-1",
      "title": "React Developer",
      "company": "NovaTech",
      "companyInitials": "NT",
      "postedAgo": "Posted 2d ago",
      "location": "Bangalore",
      "experience": "2y-4y",
      "ctc": "₹12L - ₹18L",
      "noticePeriod": "30 days",
      "status": "eligible",
      "pendingSteps": 0,
      "preferred": true,
      "tags": ["React", "TypeScript"],
      "description": "Build product UI..."
    }
  ]
}

Requirements:
- Exactly 10 jobs
- Mix of preferred true/false
- At least 3 preferred jobs
- Mix locations including Remote and Indian cities
- Mix status: mostly eligible, 2-3 pending with pendingSteps 1-3
- Roles focused on JS/TS/React/Node/Fullstack software roles
- Unique ids job-1..job-10`;

  try {
    const raw = await mistralChatJson(system, user);
    const parsed = hubSchema.parse(JSON.parse(extractJsonObject(raw)));
    return {
      ...parsed,
      source: 'llm',
      generatedAt: new Date().toISOString(),
    };
  } catch {
    return { ...FALLBACK_PACK, generatedAt: new Date().toISOString() };
  }
}

export async function getCareersHub(opts: { refresh?: boolean } = {}): Promise<CareersHubPack> {
  const now = Date.now();
  if (!opts.refresh) {
    const mem = memoryCache.get(CACHE_KEY);
    if (mem && mem.expiresAt > now) return mem.pack;
    const cached = await cacheGet(CACHE_KEY);
    if (cached) {
      const pack = hubSchema.parse(JSON.parse(cached));
      memoryCache.set(CACHE_KEY, { pack, expiresAt: now + 60 * 60 * 1000 });
      return pack;
    }
  }

  const pack = await generateCareersHub();
  memoryCache.set(CACHE_KEY, { pack, expiresAt: now + 60 * 60 * 1000 });
  await cacheSet(CACHE_KEY, JSON.stringify(pack), 60 * 60 * 12);
  return pack;
}

export async function invalidateCareersHub(): Promise<void> {
  memoryCache.delete(CACHE_KEY);
  await cacheDel(CACHE_KEY);
}
