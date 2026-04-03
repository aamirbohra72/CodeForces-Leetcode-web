import type { Metadata } from 'next';
import { BlogPageClient } from './BlogPageClient';

export const metadata: Metadata = {
  title: 'Blog | Codeforces Platform',
  description: 'Articles, tutorials, and engineering stories.',
};

export default function BlogPage() {
  return <BlogPageClient />;
}
