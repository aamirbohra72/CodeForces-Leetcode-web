import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { DashboardShell } from '@/components/DashboardShell';
import { BlogTagList } from '@/components/blog/BlogTagList';
import { getBlogPostById, getBlogStaticParams, postDisplayDate } from '@/data/blog';

type Props = { params: { id: string } };

export function generateStaticParams() {
  return getBlogStaticParams();
}

export function generateMetadata({ params }: Props): Metadata {
  const post = getBlogPostById(params.id);
  if (!post) return { title: 'Post | Blog' };
  return {
    title: `${post.title} | Blog`,
    description: post.excerpt,
  };
}

export default function BlogPostPage({ params }: Props) {
  const post = getBlogPostById(params.id);
  if (!post) notFound();

  return (
    <DashboardShell mainClassName="min-h-0 overflow-y-auto p-0">
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
          </div>
          <h1 className="mt-4 font-nav-brand text-3xl font-bold leading-tight text-white sm:text-4xl">{post.title}</h1>
          <BlogTagList tags={post.tags} className="mt-4" />
        </header>
        <div className="mt-10 space-y-6">
          <p className="text-lg leading-relaxed text-white/70">{post.excerpt}</p>
          <p className="leading-relaxed text-white/55">
            Full article content can be loaded from your CMS or MDX. This route is wired for static generation from the
            shared <code className="rounded bg-white/10 px-1.5 py-0.5 text-sm text-white/80">blog</code> data module so
            links from the index never 404.
          </p>
        </div>
      </article>
    </DashboardShell>
  );
}
