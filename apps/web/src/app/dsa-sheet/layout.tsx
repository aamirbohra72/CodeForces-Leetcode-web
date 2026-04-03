import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'DSA Sheet | Codeforces Platform',
  description:
    'Curated data structures and algorithms sheet with topics, problems, and progress tracking.',
};

export default function DsaSheetLayout({ children }: { children: ReactNode }) {
  return children;
}
