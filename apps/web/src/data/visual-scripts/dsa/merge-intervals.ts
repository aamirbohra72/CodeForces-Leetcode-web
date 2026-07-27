import type { VisualScript } from '@/types/visual-script';
import { intervalStep } from './helpers';

const INPUT = [
  { start: 1, end: 3 },
  { start: 2, end: 6 },
  { start: 8, end: 10 },
  { start: 15, end: 18 },
];

const META = {
  section: 'Arrays',
  companies: ['Amazon', 'Microsoft', 'Meta'],
};

export const mergeIntervalsScript: VisualScript = {
  id: 'dsa-merge-intervals',
  type: 'dsa',
  title: 'Merge Intervals',
  meta: {
    ...META,
    eyebrow: 'PATTERN · TIMELINE MERGE',
    leetcode: 'LeetCode #56',
    difficulty: 'MEDIUM',
    description: 'Given intervals, merge all overlapping ones. Two intervals overlap if start₁ ≤ end₂.',
  },
  defaultApproachId: 'optimized',
  approaches: [
    {
      id: 'brute',
      label: 'Brute force · repeat merge',
      complexity: { time: 'O(n²)', space: 'O(n)' },
      code: [
        'repeat until no change:',
        '  if intervals[i] overlaps intervals[i+1]:',
        '    merge into one interval',
      ],
      steps: [
        intervalStep(
          1,
          INPUT.map((x, i) => ({ ...x, label: `#${i + 1}` })),
          { pass: 1 },
          'Four intervals on a timeline. [1,3] and [2,6] overlap — they share time 2–3.',
        ),
        intervalStep(
          2,
          [
            { start: 1, end: 6, label: 'merged', active: true, merged: true },
            { start: 8, end: 10, label: '#3' },
            { start: 15, end: 18, label: '#4' },
          ],
          { merged: '[1,6]' },
          'Merge overlapping pair → [1,6]. Scan again until no more merges.',
        ),
      ],
    },
    {
      id: 'optimized',
      label: 'Optimized · sort + linear merge',
      complexity: { time: 'O(n log n)', space: 'O(n)' },
      code: [
        'sort intervals by start',
        'res ← [intervals[0]]',
        'for each next interval:',
        '  if next.start ≤ res[-1].end: extend res[-1].end',
        '  else: push next',
      ],
      steps: [
        intervalStep(
          1,
          INPUT.map((x) => ({ ...x, merged: false })),
          { sorted: 'by start' },
          'After sorting by start, overlaps become adjacent — one left-to-right scan suffices.',
          undefined,
          0,
          20,
        ),
        intervalStep(
          3,
          [
            { start: 1, end: 6, active: true, merged: true },
            { start: 8, end: 10, active: true },
          ],
          { cur: '[8,10]', res: '[1,6]' },
          '[1,6] in result. Next [8,10] starts after 6 — no overlap, append.',
          [{ start: 1, end: 6 }, { start: 8, end: 10 }],
          0,
          20,
        ),
        intervalStep(
          4,
          [{ start: 15, end: 18, active: true }],
          { done: 'yes' },
          'Append [15,18]. Final merged set shown below.',
          [
            { start: 1, end: 6 },
            { start: 8, end: 10 },
            { start: 15, end: 18 },
          ],
          0,
          20,
        ),
      ],
    },
  ],
};
