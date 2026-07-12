/**
 * Teaching Assistant help requests — client-persisted for now.
 * Replace with API/DB when TA queue goes live.
 */

export type TaHelpStatus = 'waiting' | 'replied' | 'resolved' | 'open_pool';
export type TaHelpType = 'text' | 'video';

export type TaHelpRequest = {
  id: string;
  title: string;
  type: TaHelpType;
  status: TaHelpStatus;
  problem: string;
  topic: string;
  language: string;
  description: string;
  assignedTo: string | null;
  createdAt: string;
  commentCount: number;
  rating: number | null;
  satisfied: boolean | null;
  hasRecording?: boolean;
};

export const TA_HELP_STORAGE_KEY = 'ta-help:requests';

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

export const SEED_TA_HELP_REQUESTS: TaHelpRequest[] = [
  {
    id: 'hr-1',
    title: 'Facing compilation error',
    type: 'text',
    status: 'resolved',
    problem: 'Employee Table Creation',
    topic: 'SQL',
    language: 'SQL',
    description:
      'Getting a syntax error when creating the employees table with foreign keys. Need help debugging the CREATE TABLE statement.',
    assignedTo: 'Deeksha Sharma',
    createdAt: daysAgo(5),
    commentCount: 1,
    rating: null,
    satisfied: null,
  },
  {
    id: 'hr-2',
    title: 'Assignment / homework questions',
    type: 'video',
    status: 'resolved',
    problem: 'Change Payment Gateway',
    topic: 'LLD',
    language: 'Java',
    description:
      'I have not done this kind of question earlier. Need a walkthrough of the payment gateway redesign assignment.',
    assignedTo: 'Tarun Jain',
    createdAt: daysAgo(210),
    commentCount: 3,
    rating: 5,
    satisfied: true,
    hasRecording: true,
  },
  {
    id: 'hr-3',
    title: 'Stuck on binary search edge case',
    type: 'text',
    status: 'waiting',
    problem: 'Search Insert Position',
    topic: 'DSA',
    language: 'JavaScript',
    description:
      'My binary search fails on empty arrays and when the target is larger than all elements. Looking for the correct mid update pattern.',
    assignedTo: null,
    createdAt: daysAgo(0),
    commentCount: 0,
    rating: null,
    satisfied: null,
  },
  {
    id: 'hr-4',
    title: 'React useEffect infinite loop',
    type: 'text',
    status: 'replied',
    problem: 'Dashboard Data Fetch',
    topic: 'React',
    language: 'TypeScript',
    description:
      'Fetching course progress in useEffect retriggers endlessly. Shared a codesandbox in the request body.',
    assignedTo: 'Ananya Verma',
    createdAt: daysAgo(1),
    commentCount: 2,
    rating: null,
    satisfied: null,
  },
  {
    id: 'hr-5',
    title: 'Need second opinion on HLD tradeoffs',
    type: 'video',
    status: 'open_pool',
    problem: 'EdTech Live Class Design',
    topic: 'System Design',
    language: 'N/A',
    description:
      'Open pool request for WebSocket vs WebRTC for live coding classrooms. Waiting for any available TA.',
    assignedTo: null,
    createdAt: daysAgo(2),
    commentCount: 0,
    rating: null,
    satisfied: null,
  },
];

function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

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

export function loadTaHelpRequests(): TaHelpRequest[] {
  if (typeof window === 'undefined') return SEED_TA_HELP_REQUESTS;
  try {
    const raw = localStorage.getItem(TA_HELP_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(TA_HELP_STORAGE_KEY, JSON.stringify(SEED_TA_HELP_REQUESTS));
      return SEED_TA_HELP_REQUESTS;
    }
    const parsed = JSON.parse(raw) as TaHelpRequest[];
    return Array.isArray(parsed) ? parsed : SEED_TA_HELP_REQUESTS;
  } catch {
    return SEED_TA_HELP_REQUESTS;
  }
}

export function saveTaHelpRequests(requests: TaHelpRequest[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TA_HELP_STORAGE_KEY, JSON.stringify(requests));
}

export function createTaHelpRequest(input: {
  title: string;
  type: TaHelpType;
  problem: string;
  topic: string;
  language: string;
  description: string;
}): TaHelpRequest {
  return {
    id: `hr-${Date.now()}`,
    title: input.title.trim(),
    type: input.type,
    status: 'waiting',
    problem: input.problem.trim(),
    topic: input.topic,
    language: input.language,
    description: input.description.trim(),
    assignedTo: null,
    createdAt: new Date().toISOString(),
    commentCount: 0,
    rating: null,
    satisfied: null,
  };
}
