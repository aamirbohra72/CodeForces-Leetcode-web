import type { Metadata } from 'next';
import { VisualizerPageClient } from './VisualizerPageClient';

export const metadata: Metadata = {
  title: 'Visual Lab | Codeforces Platform',
  description:
    'Step-by-step DSA and LLD visual walkthroughs — watch algorithms and design patterns unfold frame by frame.',
};

export default function VisualizerPage() {
  return <VisualizerPageClient />;
}
