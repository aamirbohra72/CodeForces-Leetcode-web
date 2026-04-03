import Link from 'next/link';
import type { BlogPost } from '@/data/blog';
import { postDisplayDate } from '@/data/blog';
import { BlogTagList } from '@/components/blog/BlogTagList';
import { cn } from '@/lib/cn';

type BlogFeaturedCardProps = {
  post: BlogPost;
  className?: string;
};

export function BlogFeaturedCard({ post, className }: BlogFeaturedCardProps) {
  return (
    <article
      className={cn(
        'group overflow-hidden rounded-xl border border-white/[0.08] bg-[#2a2a2a] shadow-lg shadow-black/20 transition-colors hover:border-green-500/25',
        className,
      )}
    >
      <div className="aspect-[21/9] bg-gradient-to-br from-[#0f2918] via-[#1a3d28] to-[#121212] sm:aspect-[2.4/1]" />
      <div className="p-6 sm:p-8">
        <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-white/50">
          <time dateTime={post.date}>{postDisplayDate(post)}</time>
          <span aria-hidden className="text-white/25">
            ·
          </span>
          <span>{post.readMinutes} min read</span>
          <span aria-hidden className="text-white/25">
            ·
          </span>
          <span className="text-green-400/90">By {post.author}</span>
        </div>
        <h3 className="font-nav-brand text-2xl font-bold leading-snug text-white transition-colors group-hover:text-green-400 sm:text-3xl">
          <Link href={`/blog/${post.id}`} className="focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#2a2a2a]">
            {post.title}
          </Link>
        </h3>
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-white/65">{post.excerpt}</p>
        <BlogTagList tags={post.tags} className="mt-4" />
        <div className="mt-6">
          <Link
            href={`/blog/${post.id}`}
            className="inline-flex items-center gap-2 text-sm font-semibold text-green-400 transition-colors hover:text-green-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#2a2a2a]"
          >
            Read article
            <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
              →
            </span>
          </Link>
        </div>
      </div>
    </article>
  );
}
