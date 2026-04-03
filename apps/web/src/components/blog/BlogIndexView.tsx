'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  BLOG_FEATURED,
  BLOG_RECENT,
  BLOG_TOPICS,
  type BlogPost,
} from '@/data/blog';
import { BlogFeaturedCard } from '@/components/blog/BlogFeaturedCard';
import { BlogPostCompactCard } from '@/components/blog/BlogPostCompactCard';
import { BlogSidebar } from '@/components/blog/BlogSidebar';
import { BlogSectionTitle } from '@/components/blog/BlogSectionTitle';

function normalize(s: string) {
  return s.toLowerCase().trim();
}

function matchesQuery(post: BlogPost, q: string) {
  if (!q) return true;
  const n = normalize(q);
  return (
    normalize(post.title).includes(n) ||
    normalize(post.author).includes(n) ||
    post.tags.some((t) => normalize(t).includes(n))
  );
}

export function BlogIndexView() {
  const [query, setQuery] = useState('');

  const featuredLead = BLOG_FEATURED[0];
  const featuredRest = BLOG_FEATURED.slice(1);

  const filteredFeaturedRest = useMemo(
    () => featuredRest.filter((p) => matchesQuery(p, query)),
    [featuredRest, query],
  );
  const filteredRecent = useMemo(() => BLOG_RECENT.filter((p) => matchesQuery(p, query)), [query]);

  const showFeaturedLead = matchesQuery(featuredLead, query);
  const hasAny =
    showFeaturedLead || filteredFeaturedRest.length > 0 || filteredRecent.length > 0;

  return (
    <div className="min-h-full">
      <div className="border-b border-white/[0.06] bg-[#161616]">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-green-400/90">Engineering blog</p>
          <h1 className="mt-3 font-nav-brand text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
            Build faster. Think deeper.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/60">
            Tutorials, contest strategy, and system design notes—same dark workspace as your practice and courses.
          </p>
          <div className="mt-8 flex max-w-xl flex-col gap-3 sm:flex-row sm:items-center">
            <label htmlFor="blog-search" className="sr-only">
              Search articles
            </label>
            <input
              id="blog-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by title, author, or tag…"
              className="w-full flex-1 rounded-lg border border-white/10 bg-[#1a1a1a] px-4 py-3 text-sm text-white placeholder:text-white/35 focus:border-green-500/35 focus:outline-none focus:ring-2 focus:ring-green-500/25"
            />
            <Link
              href="/blog/write"
              className="inline-flex shrink-0 items-center justify-center rounded-lg border border-white/15 bg-white/5 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
            >
              Write a post
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        {!hasAny ? (
          <p className="rounded-lg border border-white/10 bg-[#242424] px-6 py-12 text-center text-white/60">
            No articles match “{query}”. Try another keyword or{' '}
            <button
              type="button"
              className="text-green-400 underline decoration-green-500/40 hover:text-green-300"
              onClick={() => setQuery('')}
            >
              clear search
            </button>
            .
          </p>
        ) : (
          <div className="grid gap-10 lg:grid-cols-[1fr_320px] lg:gap-12">
            <div className="min-w-0 space-y-12">
              {showFeaturedLead ? (
                <section aria-labelledby="featured-heading">
                  <BlogSectionTitle id="featured-heading" className="mb-6">
                    Featured
                  </BlogSectionTitle>
                  <BlogFeaturedCard post={featuredLead} />
                </section>
              ) : null}

              {filteredFeaturedRest.length > 0 ? (
                <section aria-labelledby="editorial-heading">
                  <BlogSectionTitle id="editorial-heading" className="mb-6">
                    Editorial picks
                  </BlogSectionTitle>
                  <div className="grid gap-5 sm:grid-cols-2">
                    {filteredFeaturedRest.map((post) => (
                      <BlogPostCompactCard key={post.id} post={post} />
                    ))}
                  </div>
                </section>
              ) : null}

              {filteredRecent.length > 0 ? (
                <section aria-labelledby="recent-heading">
                  <BlogSectionTitle id="recent-heading" className="mb-6">
                    Recent
                  </BlogSectionTitle>
                  <div className="grid gap-5 sm:grid-cols-2">
                    {filteredRecent.map((post) => (
                      <BlogPostCompactCard
                        key={post.id}
                        post={post}
                        highlight={post.featured === true}
                      />
                    ))}
                  </div>
                </section>
              ) : null}
            </div>

            <BlogSidebar topics={BLOG_TOPICS} className="lg:sticky lg:top-24 lg:self-start" />
          </div>
        )}

        <footer className="mt-16 border-t border-white/[0.06] pt-10 text-center text-sm text-white/45">
          <p>
            © {new Date().getFullYear()} Codeforces Platform —{' '}
            <Link href="/learn" className="text-green-400/90 hover:text-green-300">
              Learn
            </Link>
            {' · '}
            <Link href="/practice" className="text-green-400/90 hover:text-green-300">
              Practice
            </Link>
            {' · '}
            <Link href="/leaderboard" className="text-green-400/90 hover:text-green-300">
              Leaderboard
            </Link>
          </p>
        </footer>
      </div>
    </div>
  );
}
