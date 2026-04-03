import Link from 'next/link';
import { DashboardShell } from '@/components/DashboardShell';

export default function BlogWritePage() {
  return (
    <DashboardShell mainClassName="min-h-0 overflow-y-auto p-8">
      <div className="mx-auto max-w-lg text-center">
        <h1 className="font-nav-brand text-2xl font-bold text-white">Write a blog post</h1>
        <p className="mt-4 text-white/60">
          The editor is not wired yet. For now, add posts via your CMS or extend the shared blog data module.
        </p>
        <Link
          href="/blog"
          className="mt-8 inline-flex rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
        >
          Back to blog
        </Link>
      </div>
    </DashboardShell>
  );
}
