'use client';

import { DashboardShell } from '@/components/DashboardShell';
import { BlogIndexView } from '@/components/blog/BlogIndexView';

export function BlogPageClient() {
  return (
    <DashboardShell mainClassName="min-h-0 overflow-y-auto p-0">
      <BlogIndexView />
    </DashboardShell>
  );
}
