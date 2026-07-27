import type { VisualScript } from '@/types/visual-script';

const CELLS = [
  { value: 2, index: 0 },
  { value: 7, index: 1 },
  { value: 11, index: 2 },
  { value: 15, index: 3 },
  { value: 20, index: 4 },
  { value: 25, index: 5 },
];

const TARGET = 26;

export const twoSumIiScript: VisualScript = {
  id: 'dsa-two-sum-ii',
  type: 'dsa',
  title: 'Two Sum II',
  meta: {
    eyebrow: 'PATTERN · TWO POINTERS',
    section: 'Two Pointers',
    leetcode: 'LeetCode #167',
    difficulty: 'MEDIUM',
    description:
      'You are given a 1-indexed sorted array and a target. Find two numbers that add up to target and return their indices. Exactly one solution exists; you may not use the same element twice.',
    companies: ['Amazon', 'Microsoft', 'Apple'],
  },
  defaultApproachId: 'optimized',
  approaches: [
    {
      id: 'brute',
      label: 'Brute force',
      complexity: { time: 'O(n²)', space: 'O(1)' },
      code: [
        'given sorted arr, target',
        'for i ← 0 to n - 2',
        '  for j ← i + 1 to n - 1',
        '    sum ← arr[i] + arr[j]',
        '    if sum = target: return [i, j]',
        'return []',
      ],
      steps: [
        {
          activeLine: 1,
          diagram: {
            kind: 'array',
            cells: CELLS,
            pointers: [],
            highlightIndices: [],
          },
          state: { target: TARGET, i: null, j: null, sum: null },
          captionSeed:
            'Brute force checks every pair. Sorted order doesn’t help here — we still scan all combinations.',
        },
        {
          activeLine: 2,
          diagram: {
            kind: 'array',
            cells: CELLS,
            pointers: [
              { name: 'i', index: 0, color: 'accent' },
              { name: 'j', index: 1, color: 'secondary' },
            ],
            highlightIndices: [0, 1],
          },
          state: { target: TARGET, i: 0, j: 1, sum: 9 },
          captionSeed: 'Try i = 0, j = 1. sum = 2 + 7 = 9 — not the target.',
        },
        {
          activeLine: 3,
          diagram: {
            kind: 'array',
            cells: CELLS,
            pointers: [
              { name: 'i', index: 0, color: 'accent' },
              { name: 'j', index: 2, color: 'secondary' },
            ],
            highlightIndices: [0, 2],
          },
          state: { target: TARGET, i: 0, j: 2, sum: 13 },
          captionSeed: 'Advance j. sum = 2 + 11 = 13 — still too small.',
        },
        {
          activeLine: 3,
          diagram: {
            kind: 'array',
            cells: CELLS,
            pointers: [
              { name: 'i', index: 1, color: 'accent' },
              { name: 'j', index: 3, color: 'secondary' },
            ],
            highlightIndices: [1, 3],
          },
          state: { target: TARGET, i: 1, j: 3, sum: 22 },
          captionSeed: 'i moves to 1. sum = 7 + 15 = 22 — close, but not 26.',
        },
        {
          activeLine: 5,
          diagram: {
            kind: 'array',
            cells: CELLS,
            pointers: [
              { name: 'i', index: 2, color: 'accent' },
              { name: 'j', index: 3, color: 'secondary' },
            ],
            highlightIndices: [2, 3],
          },
          state: { target: TARGET, i: 2, j: 3, sum: 26 },
          captionSeed: 'Finally i = 2, j = 3. sum = 11 + 15 = 26 — match found.',
        },
      ],
    },
    {
      id: 'optimized',
      label: 'Optimized · two pointers',
      complexity: { time: 'O(n)', space: 'O(1)' },
      code: [
        'given sorted arr, target',
        'left ← 0',
        'right ← n - 1',
        'while left < right:',
        '  sum ← arr[left] + arr[right]',
        '  if sum = target: return [left, right]',
        '  if sum < target: left ← left + 1',
        '  else: right ← right - 1',
        'return []',
      ],
      steps: [
        {
          activeLine: 2,
          diagram: {
            kind: 'array',
            cells: CELLS,
            pointers: [
              { name: 'left', index: 0, color: 'accent' },
              { name: 'right', index: 5, color: 'secondary' },
            ],
            highlightIndices: [0, 5],
          },
          state: { target: TARGET, left: 0, right: 5, sum: null },
          captionSeed:
            'Key insight: the array is sorted. Pick the smallest and largest — they bracket the answer.',
        },
        {
          activeLine: 5,
          diagram: {
            kind: 'array',
            cells: CELLS,
            pointers: [
              { name: 'left', index: 0, color: 'accent' },
              { name: 'right', index: 5, color: 'secondary' },
            ],
            highlightIndices: [0, 5],
          },
          state: { target: TARGET, left: 0, right: 5, sum: 27 },
          captionSeed: 'sum = 2 + 25 = 27 > target — shrink from the right.',
        },
        {
          activeLine: 8,
          diagram: {
            kind: 'array',
            cells: CELLS,
            pointers: [
              { name: 'left', index: 0, color: 'accent' },
              { name: 'right', index: 4, color: 'secondary' },
            ],
            highlightIndices: [0, 4],
          },
          state: { target: TARGET, left: 0, right: 4, sum: 22 },
          captionSeed: 'sum = 2 + 20 = 22 < target — grow from the left.',
        },
        {
          activeLine: 8,
          diagram: {
            kind: 'array',
            cells: CELLS,
            pointers: [
              { name: 'left', index: 1, color: 'accent' },
              { name: 'right', index: 3, color: 'secondary' },
            ],
            highlightIndices: [1, 3],
          },
          state: { target: TARGET, left: 1, right: 3, sum: 22 },
          captionSeed: 'sum = 7 + 15 = 22 — still under target, bump left again.',
        },
        {
          activeLine: 6,
          diagram: {
            kind: 'array',
            cells: CELLS,
            pointers: [
              { name: 'left', index: 2, color: 'accent' },
              { name: 'right', index: 3, color: 'secondary' },
            ],
            highlightIndices: [2, 3],
          },
          state: { target: TARGET, left: 2, right: 3, sum: 26 },
          captionSeed: 'sum = 11 + 15 = 26 — exact match. Return [2, 3] in one pass.',
        },
      ],
    },
  ],
};
