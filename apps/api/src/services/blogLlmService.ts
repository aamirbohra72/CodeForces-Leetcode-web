import { z } from 'zod';
import { mistralChat } from './mistralInterviewService';
import { cacheDel, cacheGet, cacheSet } from './redisService';

const CACHE_KEY = 'blog-hub:live:v1';
const CACHE_TTL_SECONDS = 60 * 60; // 1 hour
const memoryCache = new Map<string, { expiresAt: number; pack: BlogHub }>();

const categorySchema = z
  .string()
  .transform((v) => {
    const n = v.toLowerCase().replace(/\s+/g, '-');
    if (n.includes('system')) return 'system-design';
    if (n.includes('chain') || n.includes('solana') || n.includes('crypto') || n.includes('web3')) {
      return 'blockchain';
    }
    if (n.includes('career') || n.includes('interview') || n.includes('job')) return 'careers';
    if (n.includes('contest') || n.includes('compet')) return 'contest';
    if (n.includes('algo') || n.includes('dsa')) return 'algorithms';
    if (n.includes('genai') || n.includes('gen-ai') || n.includes('agent') || n === 'ai' || n.startsWith('ai-')) {
      return 'genai';
    }
    if (n.includes('gen')) return 'genai';
    return 'algorithms';
  });

const postSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(3),
  author: z.union([z.string().min(1), z.null()]).optional().transform((v) => v || 'Editorial'),
  date: z
    .union([z.string(), z.null()])
    .optional()
    .transform((v) => (v && String(v).length >= 4 ? String(v) : new Date().toISOString().slice(0, 10))),
  excerpt: z.string().min(8),
  readMinutes: z.coerce.number().int().min(2).max(30).catch(6),
  tags: z
    .array(z.string())
    .optional()
    .transform((t) => (t && t.length ? t.slice(0, 5) : ['Engineering'])),
  category: categorySchema.catch('algorithms'),
  featured: z.boolean().optional().default(false),
  body: z
    .union([z.array(z.string()), z.string()])
    .optional()
    .transform((b) => {
      if (Array.isArray(b)) return b.map((x) => String(x).trim()).filter((x) => x.length >= 8).slice(0, 10);
      if (typeof b === 'string' && b.trim()) {
        return b
          .split(/\n\n+/)
          .map((x) => x.trim())
          .filter((x) => x.length >= 8)
          .slice(0, 10);
      }
      return [] as string[];
    }),
});

const hubSchema = z.object({
  generatedAt: z.string(),
  source: z.literal('mistral'),
  headline: z.string().default('Live engineering notes'),
  summary: z.string().default('Fresh articles generated for builders.'),
  posts: z.array(z.unknown()).min(1),
});

export type BlogLivePost = z.infer<typeof postSchema> & { source: 'mistral' };
export type BlogHub = Omit<z.infer<typeof hubSchema>, 'posts'> & {
  posts: BlogLivePost[];
};

function extractJsonObject(raw: string): string {
  const t = raw.trim();
  const m = /^```(?:json)?\s*([\s\S]*?)```$/m.exec(t);
  if (m) return m[1].trim();
  return t;
}

const SYSTEM = `You are a technical editor for a competitive programming and software engineering platform.
Write crisp, practical blog posts. Output ONLY valid JSON. No markdown fences.`;

const USER_PROMPT = `Generate a fresh engineering blog pack for builders who practice DSA, ship systems, and join hackathons.

Themes to cover across the pack (mix them):
- Algorithms / contest strategy
- System design
- GenAI / Agentic AI / AI agents
- Blockchain / Solana Colosseum style builder notes
- Careers / interview prep

Schema:
{
  "generatedAt": ISO string,
  "source": "mistral",
  "headline": string,
  "summary": string,
  "posts": [
    {
      "id": string (slug like "ai-rag-eval-playbook"),
      "title": string,
      "author": string (realistic first+last or handle),
      "date": "YYYY-MM-DD",
      "excerpt": string (1-2 sentences),
      "readMinutes": number,
      "tags": string[],
      "category": "algorithms"|"system-design"|"genai"|"blockchain"|"careers"|"contest",
      "featured": boolean,
      "body": string[] (3-8 short paragraphs, plain text, actionable, no markdown headings)
    }
  ]
}

Rules:
- Generate 8 posts.
- Mark exactly 2 as featured: true.
- Vary categories; include at least one genai, one blockchain, one algorithms/contest, one careers.
- IDs must be unique kebab-case and start with "ai-".
- Body paragraphs should teach something concrete (patterns, tradeoffs, checklists).
- date should be recent (within the last 14 days of **2026-08-01**).
- generatedAt must be current ISO time.`;

async function generateHubWithLlm(): Promise<BlogHub> {
  if (!process.env.MISTRAL_API_KEY?.trim()) {
    throw new Error('MISTRAL_API_KEY is not configured');
  }

  const raw = await mistralChat(SYSTEM, USER_PROMPT, {
    model: process.env.MISTRAL_CHAT_MODEL?.trim() || 'mistral-small-latest',
    jsonMode: true,
  });

  const parsed: unknown = JSON.parse(extractJsonObject(raw));
  const hub = hubSchema.parse({
    ...(parsed as object),
    generatedAt: new Date().toISOString(),
    source: 'mistral',
  });

  const seen = new Set<string>();
  const posts: BlogLivePost[] = [];
  for (const rawPost of hub.posts) {
    const result = postSchema.safeParse(rawPost);
    if (!result.success) continue;
    const p = result.data;
    let id = p.id.startsWith('ai-') ? p.id : `ai-${p.id}`;
    id = id.replace(/[^a-z0-9-]/gi, '-').toLowerCase();
    if (seen.has(id)) continue;
    seen.add(id);
    const body =
      p.body.length >= 2
        ? p.body
        : [
            p.excerpt,
            'Key takeaway: ship a small, measurable improvement first, then expand coverage with tests and metrics.',
            'Next step: pick one pattern from this note and apply it in your next practice session or hackathon sprint.',
          ];
    posts.push({
      id,
      title: p.title,
      author: p.author,
      date: p.date,
      excerpt: p.excerpt,
      readMinutes: p.readMinutes,
      tags: p.tags,
      category: p.category as BlogLivePost['category'],
      featured: Boolean(p.featured),
      body,
      source: 'mistral',
    });
  }

  if (posts.length < 3) {
    throw new Error(`Mistral returned too few valid blog posts (${posts.length})`);
  }

  // Ensure at least one featured highlight
  if (!posts.some((p) => p.featured)) {
    posts[0].featured = true;
    if (posts[1]) posts[1].featured = true;
  }

  return { ...hub, posts };
}

export async function getBlogHub(options?: { refresh?: boolean }): Promise<BlogHub> {
  const refresh = Boolean(options?.refresh);

  if (!refresh) {
    const mem = memoryCache.get(CACHE_KEY);
    if (mem && mem.expiresAt > Date.now()) {
      return mem.pack;
    }
    const cached = await cacheGet(CACHE_KEY);
    if (cached) {
      try {
        const raw = JSON.parse(cached) as BlogHub;
        const posts = (raw.posts || [])
          .map((p) => {
            const result = postSchema.safeParse(p);
            if (!result.success) return null;
            return { ...result.data, source: 'mistral' as const };
          })
          .filter((p): p is BlogLivePost => Boolean(p));
        if (posts.length < 4) throw new Error('stale cache');
        const pack: BlogHub = {
          generatedAt: raw.generatedAt || new Date().toISOString(),
          source: 'mistral',
          headline: raw.headline || 'Live engineering notes',
          summary: raw.summary || 'Fresh articles generated for builders.',
          posts,
        };
        memoryCache.set(CACHE_KEY, {
          expiresAt: Date.now() + CACHE_TTL_SECONDS * 1000,
          pack,
        });
        return pack;
      } catch {
        /* regenerate */
      }
    }
  }

  const pack = await generateHubWithLlm();
  memoryCache.set(CACHE_KEY, {
    expiresAt: Date.now() + CACHE_TTL_SECONDS * 1000,
    pack,
  });
  await cacheSet(CACHE_KEY, JSON.stringify(pack), CACHE_TTL_SECONDS);
  return pack;
}

export async function getBlogPostFromHub(id: string): Promise<BlogLivePost | undefined> {
  const hub = await getBlogHub();
  return hub.posts.find((p) => p.id === id);
}

export async function invalidateBlogHub(): Promise<void> {
  memoryCache.delete(CACHE_KEY);
  await cacheDel(CACHE_KEY);
}
