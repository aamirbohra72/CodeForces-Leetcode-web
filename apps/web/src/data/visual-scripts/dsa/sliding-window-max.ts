import type { VisualScript } from '@/types/visual-script';
import { windowDequeStep } from './helpers';

const NUMS = [1, 3, -1, -3, 5, 3, 6, 7];
const K = 3;

const META = {
  section: 'Sliding Window',
  companies: ['Amazon', 'Google', 'Microsoft'],
};

export const slidingWindowMaxScript: VisualScript = {
  id: 'dsa-sliding-window-max',
  type: 'dsa',
  title: 'Sliding Window Maximum',
  meta: {
    ...META,
    eyebrow: 'PATTERN · WINDOW + DEQUE',
    leetcode: 'LeetCode #239',
    difficulty: 'HARD',
    description: `Return the max in each window of size k=${K} as it slides across nums. Deque stores indices in decreasing value order.`,
  },
  defaultApproachId: 'optimized',
  approaches: [
    {
      id: 'brute',
      label: 'Brute force · rescan window',
      complexity: { time: 'O(n·k)', space: 'O(1)' },
      code: [
        'for start ← 0 to n-k:',
        '  max ← nums[start]',
        '  for j in window: max ← max(max, nums[j])',
        '  result.append(max)',
      ],
      steps: [
        windowDequeStep(1, NUMS, 0, 2, [], { k: K, window: '[0..2]' }, 'k=3. Highlighted band is the current window — no deque yet.'),
        windowDequeStep(3, NUMS, 0, 2, [], { max: 3 }, 'Rescan [1,3,-1] every time → max=3. Repeats for each start — O(n·k).'),
        windowDequeStep(1, NUMS, 1, 3, [], { window: '[1..3]' }, 'Slide start right by 1 — scan [3,-1,-3] again from scratch.'),
        windowDequeStep(3, NUMS, 1, 3, [], { max: 3 }, 'Still max=3, but we re-read all k elements per window.'),
      ],
    },
    {
      id: 'optimized',
      label: 'Optimized · monotonic deque',
      complexity: { time: 'O(n)', space: 'O(k)' },
      code: [
        'deque ← indices (values decreasing)',
        'for i ← 0 to n-1:',
        '  drop front if outside window',
        '  pop back while nums[back] < nums[i]',
        '  push i',
        '  if i ≥ k-1: answer.append(nums[deque.front])',
      ],
      steps: [
        windowDequeStep(2, NUMS, 0, 2, [1, 2], { i: 2, val: -1 }, 'i=2: deque=[1(3),2(-1)] — indices with decreasing values. Front is always window max.'),
        windowDequeStep(5, NUMS, 0, 2, [1], { windowMax: 3, result: '[3]' }, 'Window [0..2] complete → front index 1 has value 3.'),
        windowDequeStep(4, NUMS, 2, 4, [4], { i: 4, val: 5 }, 'i=4 val=5: pop smaller backs, deque=[4]. New max candidate dominates.'),
        windowDequeStep(5, NUMS, 4, 6, [4, 6], { windowMax: 6, result: '[3,3,5,3,6,7]' }, 'Each index enters and leaves deque once → O(n). Final maxes per window.'),
      ],
    },
  ],
};
