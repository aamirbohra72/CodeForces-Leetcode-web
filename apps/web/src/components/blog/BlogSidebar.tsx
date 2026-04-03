import Link from 'next/link';
import type { BlogTopic } from '@/data/blog';
import { BlogSectionTitle } from '@/components/blog/BlogSectionTitle';
import { cn } from '@/lib/cn';

type BlogSidebarProps = {
  topics: BlogTopic[];
  className?: string;
};

export function BlogSidebar({ topics, className }: BlogSidebarProps) {
  return (
    <aside className={cn('flex flex-col gap-10', className)}>
      {topics.map((topic) => (
        <div key={topic.id}>
          <BlogSectionTitle className="mb-4">{topic.label}</BlogSectionTitle>
          <ul className="space-y-0 divide-y divide-white/[0.06] rounded-lg border border-white/[0.08] bg-[#242424]">
            {topic.items.map((item) => (
              <li key={item.id}>
                <span className="block px-4 py-3 text-sm leading-snug text-white/75">{item.title}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}

      <div className="rounded-xl border border-white/[0.08] bg-gradient-to-b from-[#2a2a2a] to-[#1f1f1f] p-6">
        <BlogSectionTitle className="mb-3 text-white/70">Newsletter</BlogSectionTitle>
        <p className="text-sm leading-relaxed text-white/55">
          Weekly notes on algorithms, system design, and contest patterns. No spam.
        </p>
        <form
          className="mt-4 space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <label htmlFor="blog-newsletter-email" className="sr-only">
            Email
          </label>
          <input
            id="blog-newsletter-email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            className="w-full rounded-md border border-white/10 bg-[#1a1a1a] px-3 py-2.5 text-sm text-white placeholder:text-white/35 focus:border-green-500/40 focus:outline-none focus:ring-2 focus:ring-green-500/30"
          />
          <button
            type="submit"
            className="w-full rounded-md bg-green-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-green-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#1f1f1f]"
          >
            Subscribe
          </button>
        </form>
        <p className="mt-4 text-center text-xs text-white/35">
          Prefer to code?{' '}
          <Link href="/practice" className="text-green-400 hover:text-green-300">
            Practice
          </Link>{' '}
          or{' '}
          <Link href="/learn" className="text-green-400 hover:text-green-300">
            Courses
          </Link>
          .
        </p>
      </div>
    </aside>
  );
}
