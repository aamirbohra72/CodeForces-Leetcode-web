import type { VisualScript } from '@/types/visual-script';
import { elevationStep, emptyWater, rainHeights } from './helpers';

const H = rainHeights();
const N = H.length;

const META = {
  section: 'Elevation / Rain Water',
  companies: ['Amazon', 'Google', 'Microsoft'],
};

export const trappingRainWaterScript: VisualScript = {
  id: 'dsa-trapping-rain-water',
  type: 'dsa',
  title: 'Trapping Rain Water',
  meta: {
    ...META,
    eyebrow: 'PATTERN · ELEVATION MAP',
    leetcode: 'LeetCode #42',
    difficulty: 'HARD',
    description:
      'Given an elevation map (vertical bars), compute how much rainwater gets trapped between them after it rains.',
  },
  defaultApproachId: 'dp',
  approaches: [
    {
      id: 'brute',
      label: 'Brute force · scan walls per index',
      complexity: { time: 'O(n²)', space: 'O(1)' },
      code: [
        'water ← 0',
        'for i ← 1 to n-2:',
        '  leftMax ← max(height[0..i])',
        '  rightMax ← max(height[i..n-1])',
        '  water += min(leftMax, rightMax) - height[i]',
      ],
      steps: [
        elevationStep(
          1,
          H,
          emptyWater(N),
          {},
          { total: 0 },
          'Elevation map — water only stays in valleys bounded by taller bars on both sides.',
        ),
        elevationStep(
          2,
          H,
          [0, 0, 0, 0, 0, 0, 0, 0],
          { focusIndices: [2], guides: { leftMax: 1, rightMax: 3 } },
          { i: 2, h: 0, leftMax: 1, rightMax: 3 },
          'At index 2 (height 0): scan left → tallest bar is 1; scan right → tallest is 3.',
        ),
        elevationStep(
          3,
          H,
          [0, 0, 1, 0, 0, 0, 0, 0],
          { focusIndices: [2], guides: { leftMax: 1, rightMax: 3, waterLevel: 1 } },
          { add: 1, total: 1 },
          'Water level = min(1,3) = 1. Fill 1 unit above the bar at index 2.',
        ),
        elevationStep(
          2,
          H,
          [0, 0, 1, 0, 0, 0, 0, 0],
          { focusIndices: [5], guides: { leftMax: 2, rightMax: 3 } },
          { i: 5, h: 0, leftMax: 2, rightMax: 3 },
          'Next valley at index 5 — rescan left max (2) and right max (3) for every index.',
        ),
        elevationStep(
          3,
          H,
          [0, 0, 1, 0, 0, 2, 0, 0],
          { focusIndices: [5], guides: { leftMax: 2, rightMax: 3, waterLevel: 2 } },
          { add: 2, total: 3 },
          'min(2,3)−0 = 2 units trapped at index 5. Repeating for all indices is O(n²).',
        ),
      ],
    },
    {
      id: 'dp',
      label: 'Optimized · prefix / suffix max',
      complexity: { time: 'O(n)', space: 'O(n)' },
      code: [
        'leftMax[i] ← max height from 0..i',
        'rightMax[i] ← max height from i..n-1',
        'for i: water[i] ← min(leftMax[i], rightMax[i]) - height[i]',
      ],
      steps: [
        elevationStep(
          1,
          H,
          emptyWater(N),
          {},
          { phase: 'input' },
          'Same map — precompute tallest bar to the left and right of every index once.',
        ),
        elevationStep(
          2,
          H,
          emptyWater(N),
          { focusIndices: [0, 1, 2, 3] },
          { leftMax: '[0,1,1,2]', rightMax: '[3,3,3,3,...]' },
          'leftMax builds left→right: [0,1,1,2,2,2,2,3]. rightMax builds right→left.',
        ),
        elevationStep(
          3,
          H,
          [0, 0, 1, 0, 1, 0, 0, 0],
          { focusIndices: [2, 4] },
          { formula: 'min(L,R) − h' },
          'Index 2: min(1,3)−0=1. Index 4: min(2,3)−1=1. Water fills each bowl in one pass.',
        ),
        elevationStep(
          4,
          H,
          [0, 0, 1, 0, 1, 2, 1, 0],
          {},
          { total: 6 },
          'Final trapped water = 6 units. Blue blocks show water sitting on each bar.',
        ),
      ],
    },
    {
      id: 'optimized',
      label: 'Optimized · two pointers',
      complexity: { time: 'O(n)', space: 'O(1)' },
      code: [
        'L ← 0, R ← n-1',
        'leftMax ← 0, rightMax ← 0, water ← 0',
        'while L < R:',
        '  if height[L] < height[R]:',
        '    leftMax ← max(leftMax, height[L])',
        '    water += leftMax - height[L]; L++',
        '  else: (mirror on right)',
      ],
      steps: [
        elevationStep(
          2,
          H,
          emptyWater(N),
          { pointers: [{ name: 'L', index: 0, color: 'accent' }, { name: 'R', index: 7, color: 'secondary' }] },
          { L: 0, R: 7, leftMax: 0, rightMax: 0 },
          'Two pointers at both ends. We only need running max on the shorter side.',
        ),
        elevationStep(
          3,
          H,
          [0, 0, 1, 0, 0, 0, 0, 0],
          {
            pointers: [{ name: 'L', index: 2, color: 'accent' }, { name: 'R', index: 7, color: 'secondary' }],
            focusIndices: [2],
          },
          { L: 2, leftMax: 1, water: 1 },
          'height[L]=0 < height[R]=3 → trust leftMax=1. Trap 1 unit at index 2, advance L.',
        ),
        elevationStep(
          4,
          H,
          [0, 0, 1, 0, 1, 0, 0, 0],
          {
            pointers: [{ name: 'L', index: 4, color: 'accent' }, { name: 'R', index: 7, color: 'secondary' }],
            focusIndices: [4],
          },
          { L: 4, leftMax: 2, water: 2 },
          'L=4 height 1: leftMax=2 → add min wall minus bar = 1 more unit.',
        ),
        elevationStep(
          4,
          H,
          [0, 0, 1, 0, 1, 2, 1, 0],
          {
            pointers: [{ name: 'L', index: 6, color: 'accent' }, { name: 'R', index: 6, color: 'secondary' }],
          },
          { L: 6, R: 6, total: 6 },
          'Pointers meet — 6 units trapped. Same answer, O(1) extra space.',
        ),
      ],
    },
  ],
};
