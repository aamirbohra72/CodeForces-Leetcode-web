'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { BlogTagList } from '@/components/blog/BlogTagList';
import { api } from '@/lib/api';
import type { BlogPost } from '@/data/blog';
import { postDisplayDate } from '@/data/blog';
import type { BlogLivePost } from '@/types/blog-hub';

type Props = {
  postId: string;
  initialPost: BlogPost | null;
};

export function BlogPostView({ postId, initialPost }: Props) {
  const [post, setPost] = useState<BlogPost | null>(initialPost);
  const [loading, setLoading] = useState(!initialPost);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialPost) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError('');
      try {
        const live = await api.get<BlogLivePost>(`/blog/${encodeURIComponent(postId)}`);
        if (cancelled) return;
        setPost({
          id: live.id,
          title: live.title,
          author: live.author,
          date: live.date,
          excerpt: live.excerpt,
          readMinutes: live.readMinutes,
          tags: live.tags,
          featured: live.featured,
          body: live.body,
          source: 'mistral',
          category: live.category,
        });
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : 'Post not found');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [initialPost, postId]);

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center text-white/55">
        <div className="mx-auto mb-3 h-7 w-7 animate-spin rounded-full border-2 border-white/15 border-t-emerald-400" />
        Loading article…
      </div>
    );
  }

  if (!post) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <p className="text-red-400">{error || 'Post not found'}</p>
        <Link href="/blog" className="mt-4 inline-block text-sm text-green-400 hover:text-green-300">
          ← Back to blog
        </Link>
      </div>
    );
  }

  return (
    <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <Link
        href="/blog"
        className="text-sm font-medium text-green-400/90 hover:text-green-300 focus:outline-none focus-visible:underline"
      >
        ← All posts
      </Link>
      <header className="mt-6 border-b border-white/[0.08] pb-8">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-white/50">
          <time dateTime={post.date}>{postDisplayDate(post)}</time>
          <span className="text-white/25">·</span>
          <span>{post.readMinutes} min read</span>
          <span className="text-white/25">·</span>
          <span className="text-green-400/90">By {post.author}</span>
          {post.source === 'mistral' ? (
            <>
              <span className="text-white/25">·</span>
              <span className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-cyan-300">
                Live · Mistral
              </span>
            </>
          ) : null}
        </div>
        <h1 className="mt-4 font-nav-brand text-3xl font-bold leading-tight text-white sm:text-4xl">
          {post.title}
        </h1>
        <BlogTagList tags={post.tags} className="mt-4" />
      </header>
      <div className="mt-10 space-y-6">
        <p className="text-lg leading-relaxed text-white/70">{post.excerpt}</p>
        {post.body && post.body.length > 0 ? (
          post.body.map((para, i) => (
            <p key={i} className="leading-relaxed text-white/60">
              {para}
            </p>
          ))
        ) : (
          <p className="leading-relaxed text-white/55">
            Full article content can be loaded from your CMS or MDX. This route is wired for static
            generation from the shared{' '}
            <code className="rounded bg-white/10 px-1.5 py-0.5 text-sm text-white/80">blog</code>{' '}
            data module so links from the index never 404.
          </p>
        )}
      </div>
    </article>
  );
}
