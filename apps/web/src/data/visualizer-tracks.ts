export type VisualizerTrackId = 'dsa' | 'lld' | 'networking' | 'os';

export type VisualizerTrackStatus = 'live' | 'bonus' | 'new' | 'coming-soon';

export type VisualizerTrack = {
  id: VisualizerTrackId;
  title: string;
  subtitle: string;
  description: string;
  status: VisualizerTrackStatus;
  tags: string[];
  stats?: string;
  href?: string;
};

export const visualizerTracks: VisualizerTrack[] = [
  {
    id: 'dsa',
    title: 'DSA Visual',
    subtitle: 'Data Structures & Algorithms',
    description:
      'Animated, step-by-step walkthroughs from two pointers to dynamic programming. Brute force first, then the optimized trick — always with the why.',
    status: 'live',
    tags: [
      'Two Pointers',
      'Arrays & Hashing',
      'Sliding Window',
      'Stack',
      'Linked List',
      'Heap',
      'Binary Search',
      'Depth-First Search',
    ],
    stats: '2 problems · growing',
    href: '/visualizer/dsa',
  },
  {
    id: 'lld',
    title: 'LLD Visual',
    subtitle: 'Low-Level & OOP Design',
    description:
      'Object-oriented design taught with animated UML — class & sequence diagrams that build themselves, plus the theory behind every pattern.',
    status: 'bonus',
    tags: ['SOLID', 'Design Patterns', 'UML', 'Sequence diagrams', 'Encapsulation'],
    stats: '1 concept · growing',
    href: '/visualizer/lld',
  },
  {
    id: 'networking',
    title: 'Networking Visual',
    subtitle: 'Computer Networks, from the wire up',
    description:
      'A full visual course — from a single fetch() down to bits on the wire and back up through TCP, DNS, HTTP and TLS.',
    status: 'new',
    tags: ['IP & Subnets', 'TCP / UDP', 'Routing', 'DNS', 'HTTP & TLS', 'ARP', 'NAT'],
    stats: 'Coming soon',
  },
  {
    id: 'os',
    title: 'Operating Systems Visual',
    subtitle: 'How your machine really runs your code',
    description:
      'Processes, scheduling, concurrency, virtual memory and file systems — explained the way a working engineer needs them.',
    status: 'new',
    tags: ['Processes', 'Scheduling', 'Threads', 'Deadlocks', 'Virtual Memory', 'File Systems'],
    stats: 'Coming soon',
  },
];

export const playableTrackIds = ['dsa', 'lld'] as const;
export type PlayableTrackId = (typeof playableTrackIds)[number];

export function isPlayableTrack(id: string): id is PlayableTrackId {
  return playableTrackIds.includes(id as PlayableTrackId);
}

export function getTrack(id: string): VisualizerTrack | undefined {
  return visualizerTracks.find((t) => t.id === id);
}
