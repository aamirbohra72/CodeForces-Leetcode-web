import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { isPlayableTrack, getTrack } from '@/data/visualizer-tracks';
import { TrackPageClient } from './TrackPageClient';

type PageProps = {
  params: { track: string };
};

export function generateMetadata({ params }: PageProps): Metadata {
  const track = getTrack(params.track);
  if (!track) return { title: 'Visualizer | Codeforces Platform' };
  return {
    title: `${track.title} | Codeforces Platform`,
    description: track.description,
  };
}

export default function TrackPage({ params }: PageProps) {
  if (!isPlayableTrack(params.track)) notFound();
  return <TrackPageClient track={params.track} />;
}
