/**
 * Teaching Assistant help — shared types + UI helpers.
 * Persistence is via /api/ta-help (Neon).
 */

export type TaHelpStatus = 'waiting' | 'replied' | 'resolved' | 'open_pool';
export type TaHelpType = 'text' | 'video';

export type TaHelpRequest = {
  id: string;
  title: string;
  type: TaHelpType;
  status: TaHelpStatus;
  dbStatus?: string;
  problem: string;
  topic: string;
  language: string;
  description: string;
  preferredSlot?: string | null;
  source?: string;
  assignedTo: string | null;
  assignedToId?: string | null;
  userId?: string;
  learnerUsername?: string | null;
  learnerEmail?: string | null;
  createdAt: string;
  updatedAt?: string;
  claimedAt?: string | null;
  resolvedAt?: string | null;
  commentCount: number;
  rating: number | null;
  satisfied: boolean | null;
  hasRecording?: boolean;
  replies?: Array<{
    id: string;
    body: string;
    authorRole: string;
    authorName: string;
    createdAt: string;
  }>;
};

export const TA_HELP_TABS: Array<{ id: TaHelpStatus; label: string }> = [
  { id: 'waiting', label: 'Waiting on TA' },
  { id: 'replied', label: 'Replied by TA' },
  { id: 'resolved', label: 'Resolved' },
  { id: 'open_pool', label: 'Moved to Open Pool' },
];

export const TA_HELP_TOPICS = [
  'DSA',
  'JavaScript',
  'React',
  'Node.js',
  'System Design',
  'LLD',
  'SQL',
  'Other',
] as const;

export const TA_HELP_LANGUAGES = [
  'JavaScript',
  'TypeScript',
  'Python',
  'C++17',
  'Java',
  'SQL',
  'N/A',
] as const;

export function formatRelativeTime(iso: string): string {
  const then = new Date(iso).getTime();
  const now = Date.now();
  const diffMs = Math.max(0, now - then);
  const mins = Math.floor(diffMs / 60000);
  if (mins < 60) return mins <= 1 ? 'Just now' : `${mins} minutes ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return hours === 1 ? '1 hour ago' : `${hours} hours ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return days === 1 ? '1 day ago' : `${days} days ago`;
  const months = Math.floor(days / 30);
  return months === 1 ? '1 month ago' : `${months} months ago`;
}

export function countByStatus(requests: TaHelpRequest[]): Record<TaHelpStatus, number> {
  return {
    waiting: requests.filter((r) => r.status === 'waiting').length,
    replied: requests.filter((r) => r.status === 'replied').length,
    resolved: requests.filter((r) => r.status === 'resolved').length,
    open_pool: requests.filter((r) => r.status === 'open_pool').length,
  };
}
