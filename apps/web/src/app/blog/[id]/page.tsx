import type { Metadata } from 'next';
import { DashboardShell } from '@/components/DashboardShell';
import { BlogPostView } from '@/components/blog/BlogPostView';
import { getBlogPostById, getBlogStaticParams } from '@/data/blog';

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
  const post = getBlogPostById(params.id) ?? null;

  return (
    <DashboardShell mainClassName="min-h-0 overflow-y-auto p-0">
      <BlogPostView postId={params.id} initialPost={post} />
    </DashboardShell>
  );
}
