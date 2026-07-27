import type { VisualScript } from '@/types/visual-script';
import { containerStep } from './helpers';

const HEIGHTS = [1, 8, 6, 2, 5, 4, 8, 3, 7];

const META = {
  section: 'Two Pointers',
  companies: ['Amazon', 'Google', 'Apple'],
};

export const containerWaterScript: VisualScript = {
  id: 'dsa-container-water',
  type: 'dsa',
  title: 'Container With Most Water',
  meta: {
    ...META,
    eyebrow: 'PATTERN · TANK AREA',
    leetcode: 'LeetCode #11',
    difficulty: 'MEDIUM',
    description:
      'Pick two vertical lines. Water fills the rectangle between them up to the shorter wall. Maximize area = min(h[L], h[R]) × (R − L).',
  },
  defaultApproachId: 'optimized',
  approaches: [
    {
      id: 'brute',
      label: 'Brute force · try every pair',
      complexity: { time: 'O(n²)', space: 'O(1)' },
      code: [
        'maxArea ← 0',
        'for i ← 0 to n-2',
        '  for j ← i+1 to n-1',
        '    area ← min(h[i],h[j]) * (j-i)',
        '    maxArea ← max(maxArea, area)',
      ],
      steps: [
        containerStep(1, HEIGHTS, 0, 0, { phase: 'setup' }, 'Each pair of walls forms a tank — height limited by the shorter wall.'),
        containerStep(2, HEIGHTS, 0, 1, { i: 0, j: 1, area: 1 }, 'i=0,j=1: min(1,8)×1 = 1. Tiny tank — left wall is too short.'),
        containerStep(3, HEIGHTS, 0, 8, { i: 0, j: 8, area: 8, max: 8 }, 'i=0,j=8: min(1,7)×8 = 8. Wider but still capped by height 1.'),
        containerStep(3, HEIGHTS, 1, 8, { i: 1, j: 8, area: 49, max: 49 }, 'i=1,j=8: min(8,7)×7 = 49. Best pair found by checking all O(n²) pairs.'),
      ],
    },
    {
      id: 'optimized',
      label: 'Optimized · two pointers',
      complexity: { time: 'O(n)', space: 'O(1)' },
      code: [
        'L ← 0, R ← n-1, max ← 0',
        'while L < R:',
        '  area ← min(h[L],h[R]) * (R-L)',
        '  max ← max(max, area)',
        '  if h[L] < h[R]: L++ else R--',
      ],
      steps: [
        containerStep(2, HEIGHTS, 0, 8, { L: 0, R: 8, area: 8, max: 8 }, 'Start wide: min(1,7)×8 = 8. Shorter wall is on the left.'),
        containerStep(5, HEIGHTS, 1, 8, { L: 1, R: 8, area: 49, max: 49 }, 'Move the shorter side (L). min(8,7)×7 = 49 — new max.'),
        containerStep(5, HEIGHTS, 1, 6, { L: 1, R: 6, area: 40, max: 49 }, 'Right wall shorter now → R moves in. Area drops to 40; max stays 49.'),
        containerStep(5, HEIGHTS, 4, 6, { L: 4, R: 6, area: 10, max: 49 }, 'Greedy move: only shrink the shorter wall — width decreases but we might find a taller wall.'),
      ],
    },
  ],
};
