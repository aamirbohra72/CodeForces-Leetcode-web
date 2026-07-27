import type { VisualScript } from '@/types/visual-script';
import { binarySearchStep } from './helpers';

const META = {
  section: 'Binary Search',
  companies: ['Amazon', 'Google', 'Microsoft'],
};

const classicBinarySearch: VisualScript = {
  id: 'dsa-bs-6',
  type: 'dsa',
  title: 'Binary Search',
  meta: { ...META, eyebrow: 'PATTERN · HALVE SEARCH SPACE', leetcode: 'LeetCode #704', difficulty: 'EASY', description: 'Find target in a sorted array. Each step eliminates half the remaining indices.' },
  defaultApproachId: 'optimized',
  approaches: [
    {
      id: 'brute',
      label: 'Brute force · linear scan',
      complexity: { time: 'O(n)', space: 'O(1)' },
      code: ['for i ← 0 to n-1:', '  if nums[i]=target: return i', 'return -1'],
      steps: [
        binarySearchStep(1, [-1, 0, 3, 5, 9, 12], 0, 5, { target: 9, i: 0 }, 'Scan left to right until target found — ignores sorted order.', { target: 9, label: 'linear scan' }),
        binarySearchStep(1, [-1, 0, 3, 5, 9, 12], 4, 4, { found: 9 }, 'Reach index 4 — found 9 after checking 5 cells.', { target: 9, mid: 4, found: true }),
      ],
    },
    {
      id: 'optimized',
      label: 'Optimized · binary search',
      complexity: { time: 'O(log n)', space: 'O(1)' },
      code: ['lo ← 0, hi ← n-1', 'while lo ≤ hi:', '  mid ← (lo+hi)/2', '  if nums[mid]=target: return mid', '  elif nums[mid]<target: lo ← mid+1', '  else: hi ← mid-1'],
      steps: [
        binarySearchStep(2, [-1, 0, 3, 5, 9, 12], 0, 5, { lo: 0, hi: 5 }, 'Search space is entire array [0..5].', { target: 9, mid: 2, label: 'sorted nums' }),
        binarySearchStep(4, [-1, 0, 3, 5, 9, 12], 3, 5, { mid: 4, val: 9 }, 'mid=4, nums[4]=9 — equals target.', { target: 9, mid: 4, found: true }),
      ],
    },
  ],
};

const searchInsert: VisualScript = {
  id: 'dsa-bs-5',
  type: 'dsa',
  title: 'Search Insert Position',
  meta: { ...META, eyebrow: 'PATTERN · LOWER BOUND', leetcode: 'LeetCode #35', difficulty: 'EASY', description: 'Return index where target would be inserted to keep order. Same binary search — return lo when not found.' },
  defaultApproachId: 'optimized',
  approaches: [
    {
      id: 'brute',
      label: 'Brute force · find first ≥ target',
      complexity: { time: 'O(n)', space: 'O(1)' },
      code: ['for i ← 0 to n-1:', '  if nums[i] ≥ target: return i', 'return n'],
      steps: [
        binarySearchStep(1, [1, 3, 5, 6], 0, 3, { target: 2 }, 'Linear scan for first position where nums[i] ≥ 2.', { target: 2, label: 'insert 2' }),
        binarySearchStep(1, [1, 3, 5, 6], 1, 1, { insertAt: 1 }, 'Index 1 (value 3) is first ≥ 2 → insert at 1.', { target: 2, mid: 1 }),
      ],
    },
    {
      id: 'optimized',
      label: 'Optimized · binary search for lo',
      complexity: { time: 'O(log n)', space: 'O(1)' },
      code: ['standard binary search', 'when loop ends, lo is insert position'],
      steps: [
        binarySearchStep(2, [1, 3, 5, 6], 0, 3, {}, 'target=2 not equal to mid values — shrink range.', { target: 2, mid: 1, label: 'target=2' }),
        binarySearchStep(3, [1, 3, 5, 6], 1, 1, { lo: 1 }, 'Loop ends with lo=1 — insert before nums[1]=3.', { target: 2, mid: 1 }),
      ],
    },
  ],
};

const firstBadVersion: VisualScript = {
  id: 'dsa-bs-3',
  type: 'dsa',
  title: 'First Bad Version',
  meta: { ...META, eyebrow: 'PATTERN · FIRST TRUE', leetcode: 'LeetCode #278', difficulty: 'EASY', description: 'Versions [1..n] — first bad causes all later to be bad. Find first bad using isBadVersion(mid).' },
  defaultApproachId: 'optimized',
  approaches: [
    {
      id: 'brute',
      label: 'Brute force · scan from 1',
      complexity: { time: 'O(n)', space: 'O(1)' },
      code: ['for v ← 1 to n:', '  if isBadVersion(v): return v'],
      steps: [
        binarySearchStep(1, [1, 2, 3, 4, 5], 0, 4, { check: 'v=1' }, 'Check version 1, 2, 3… until first bad.', { label: 'versions 1..5 (F=first bad)' }),
        binarySearchStep(1, [1, 2, 3, 4, 5], 3, 3, { firstBad: 4 }, 'Found first bad at version 4 after 4 calls.', { mid: 3, label: 'bad from 4 onward' }),
      ],
    },
    {
      id: 'optimized',
      label: 'Optimized · binary search on answer',
      complexity: { time: 'O(log n)', space: 'O(1)' },
      code: ['lo ← 1, hi ← n', 'while lo < hi:', '  mid ← (lo+hi)/2', '  if isBadVersion(mid): hi ← mid', '  else: lo ← mid+1'],
      steps: [
        binarySearchStep(2, [1, 2, 3, 4, 5], 0, 4, {}, 'mid=2 is good → first bad is in right half.', { mid: 2, label: 'good | bad' }),
        binarySearchStep(3, [1, 2, 3, 4, 5], 2, 4, {}, 'mid=3 is good → lo moves to 4.', { mid: 3 }),
        binarySearchStep(4, [1, 2, 3, 4, 5], 3, 4, { firstBad: 4 }, 'lo=hi=4 — first bad version is 4.', { mid: 3, found: true }),
      ],
    },
  ],
};

const rotatedSearch: VisualScript = {
  id: 'dsa-bs-2',
  type: 'dsa',
  title: 'Search in Rotated Sorted Array',
  meta: { ...META, eyebrow: 'PATTERN · ROTATED BS', leetcode: 'LeetCode #33', difficulty: 'MEDIUM', description: 'Sorted array rotated at unknown pivot. Still O(log n) by checking which half is sorted.' },
  defaultApproachId: 'optimized',
  approaches: [
    {
      id: 'brute',
      label: 'Brute force · linear',
      complexity: { time: 'O(n)', space: 'O(1)' },
      code: ['for i: if nums[i]=target: return i'],
      steps: [
        binarySearchStep(1, [4, 5, 6, 7, 0, 1, 2], 0, 6, { target: 0 }, 'Scan until target 0 found.', { target: 0, label: 'rotated array' }),
        binarySearchStep(1, [4, 5, 6, 7, 0, 1, 2], 4, 4, { found: 0 }, 'Found at index 4.', { target: 0, mid: 4, found: true }),
      ],
    },
    {
      id: 'optimized',
      label: 'Optimized · which half sorted?',
      complexity: { time: 'O(log n)', space: 'O(1)' },
      code: ['binary search', 'if left half sorted: check if target in range', 'else: search right half (or mirror)'],
      steps: [
        binarySearchStep(2, [4, 5, 6, 7, 0, 1, 2], 0, 6, { mid: 3, val: 7 }, 'mid=3 val=7. Left [4..7] is sorted; target 0 not there → go right.', { target: 0, mid: 3 }),
        binarySearchStep(3, [4, 5, 6, 7, 0, 1, 2], 4, 6, { mid: 5, val: 1 }, 'Search [0,1,2] half — mid=5 val=1, target 0 is left of mid.', { target: 0, mid: 5 }),
        binarySearchStep(4, [4, 5, 6, 7, 0, 1, 2], 4, 4, { found: 0 }, 'lo=hi=4 → target at index 4.', { target: 0, mid: 4, found: true }),
      ],
    },
  ],
};

const findMinRotated: VisualScript = {
  id: 'dsa-bs-7',
  type: 'dsa',
  title: 'Find Minimum in Rotated Sorted Array',
  meta: { ...META, eyebrow: 'PATTERN · PIVOT SEARCH', leetcode: 'LeetCode #153', difficulty: 'MEDIUM', description: 'Find the minimum element in a rotated sorted array with no duplicates.' },
  defaultApproachId: 'optimized',
  approaches: [
    {
      id: 'brute',
      label: 'Brute force · scan',
      complexity: { time: 'O(n)', space: 'O(1)' },
      code: ['return min(nums)'],
      steps: [
        binarySearchStep(1, [3, 4, 5, 1, 2], 0, 4, {}, 'Walk all elements to find minimum — O(n).', { label: 'rotated sorted' }),
        binarySearchStep(1, [3, 4, 5, 1, 2], 3, 3, { min: 1 }, 'Minimum is 1 at index 3.', { mid: 3, found: true }),
      ],
    },
    {
      id: 'optimized',
      label: 'Optimized · compare mid vs hi',
      complexity: { time: 'O(log n)', space: 'O(1)' },
      code: ['while lo < hi:', '  mid ← (lo+hi)/2', '  if nums[mid] > nums[hi]: lo ← mid+1', '  else: hi ← mid'],
      steps: [
        binarySearchStep(2, [3, 4, 5, 1, 2], 0, 4, {}, 'nums[mid]=5 > nums[hi]=2 → min is in right half.', { mid: 2, label: 'compare mid vs hi' }),
        binarySearchStep(3, [3, 4, 5, 1, 2], 3, 4, {}, 'nums[mid]=1 < nums[hi]=2 → min in left incl mid.', { mid: 3 }),
        binarySearchStep(4, [3, 4, 5, 1, 2], 3, 3, { min: 1 }, 'lo=hi=3 → minimum value 1.', { mid: 3, found: true }),
      ],
    },
  ],
};

const findPeak: VisualScript = {
  id: 'dsa-bs-4',
  type: 'dsa',
  title: 'Find Peak Element',
  meta: { ...META, eyebrow: 'PATTERN · PEAK BS', leetcode: 'LeetCode #162', difficulty: 'MEDIUM', description: 'Peak satisfies nums[i] > neighbors. Binary search toward the uphill side.' },
  defaultApproachId: 'optimized',
  approaches: [
    {
      id: 'brute',
      label: 'Brute force · check neighbors',
      complexity: { time: 'O(n)', space: 'O(1)' },
      code: ['for i: if nums[i] > neighbors: return i'],
      steps: [
        binarySearchStep(1, [1, 2, 3, 1], 0, 3, {}, 'Check each index against neighbors.', { label: 'nums[i] ≠ nums[i+1]' }),
        binarySearchStep(1, [1, 2, 3, 1], 2, 2, { peak: 3 }, 'Index 2 (value 3) is a peak.', { mid: 2, found: true }),
      ],
    },
    {
      id: 'optimized',
      label: 'Optimized · climb uphill',
      complexity: { time: 'O(log n)', space: 'O(1)' },
      code: ['while lo < hi:', '  mid ← (lo+hi)/2', '  if nums[mid] < nums[mid+1]: lo ← mid+1', '  else: hi ← mid'],
      steps: [
        binarySearchStep(2, [1, 2, 3, 1], 0, 3, {}, 'nums[mid]=2 < nums[mid+1]=3 → peak must be right.', { mid: 1 }),
        binarySearchStep(3, [1, 2, 3, 1], 2, 3, {}, 'nums[mid]=3 > nums[mid+1]=1 → peak at mid or left.', { mid: 2 }),
        binarySearchStep(4, [1, 2, 3, 1], 2, 2, { peak: 3 }, 'lo=hi=2 — peak index 2.', { mid: 2, found: true }),
      ],
    },
  ],
};

const kokoBananas: VisualScript = {
  id: 'dsa-bs-8',
  type: 'dsa',
  title: 'Koko Eating Bananas',
  meta: { ...META, eyebrow: 'PATTERN · BS ON ANSWER', leetcode: 'LeetCode #875', difficulty: 'MEDIUM', description: 'Binary search eating speed k in [1, max(piles)]. Minimize k such that total hours ≤ h.' },
  defaultApproachId: 'optimized',
  approaches: [
    {
      id: 'brute',
      label: 'Brute force · try every speed',
      complexity: { time: 'O(n · max)', space: 'O(1)' },
      code: ['for k ← 1 to max(piles):', '  if hours(piles,k) ≤ h: return k'],
      steps: [
        binarySearchStep(1, [3, 6, 7, 11], 0, 3, { h: 8, tryK: 1 }, 'Try k=1,2,3… compute hours to eat all piles.', { label: 'piles (hours budget h=8)' }),
        binarySearchStep(1, [3, 6, 7, 11], 3, 3, { k: 4, hours: 8 }, 'k=4 finishes in exactly 8 hours — first valid speed.', { mid: 3 }),
      ],
    },
    {
      id: 'optimized',
      label: 'Optimized · binary search speed',
      complexity: { time: 'O(n log max)', space: 'O(1)' },
      code: ['lo ← 1, hi ← max(piles)', 'while lo < hi:', '  mid ← (lo+hi)/2', '  if canFinish(mid): hi ← mid', '  else: lo ← mid+1'],
      steps: [
        binarySearchStep(2, [3, 6, 7, 11], 0, 3, { tryK: 4, hours: 8 }, 'mid speed 4 → 8 hours ≤ h. Try slower.', { mid: 1, label: 'search speed k' }),
        binarySearchStep(3, [3, 6, 7, 11], 0, 1, { tryK: 3, hours: 10 }, 'k=3 needs 10h > 8 — too slow, need faster.', { mid: 0 }),
        binarySearchStep(4, [3, 6, 7, 11], 1, 1, { minK: 4 }, 'lo=hi → minimum valid speed is 4.', { mid: 1, found: true }),
      ],
    },
  ],
};

const sqrtX: VisualScript = {
  id: 'dsa-bs-1',
  type: 'dsa',
  title: 'Sqrt(x)',
  meta: { ...META, eyebrow: 'PATTERN · BS ON ANSWER', leetcode: 'LeetCode #69', difficulty: 'EASY', description: 'Binary search integer k in [0,x] where k² ≤ x < (k+1)².' },
  defaultApproachId: 'optimized',
  approaches: [
    {
      id: 'brute',
      label: 'Brute force · increment k',
      complexity: { time: 'O(√x)', space: 'O(1)' },
      code: ['k ← 0', 'while k*k ≤ x: k++', 'return k-1'],
      steps: [
        binarySearchStep(1, [0, 1, 2, 3, 4, 5, 6, 7, 8], 0, 8, { x: 8, tryK: 0 }, 'Try k=0,1,2… until k² > x.', { target: 8, label: 'k candidates for √8' }),
        binarySearchStep(1, [0, 1, 2, 3, 4, 5, 6, 7, 8], 2, 2, { k: 2, sq: 4 }, 'k=2 → 4≤8; k=3 → 9>8 — answer 2 after linear trial.', { mid: 2, found: true }),
      ],
    },
    {
      id: 'optimized',
      label: 'Optimized · binary search k',
      complexity: { time: 'O(log x)', space: 'O(1)' },
      code: ['lo ← 0, hi ← x', 'while lo < hi:', '  mid ← (lo+hi+1)/2', '  if mid*mid ≤ x: lo ← mid', '  else: hi ← mid-1'],
      steps: [
        binarySearchStep(2, [0, 1, 2, 3, 4, 5, 6, 7, 8], 0, 8, { mid: 4, sq: 16 }, 'mid=4, 4²=16 > 8 — floor sqrt is left of 4.', { target: 8, mid: 4, label: '√8' }),
        binarySearchStep(3, [0, 1, 2, 3, 4, 5, 6, 7, 8], 0, 3, { mid: 2, sq: 4 }, 'mid=2, 2²=4 ≤ 8 — try higher lo.', { target: 8, mid: 2 }),
        binarySearchStep(4, [0, 1, 2, 3, 4, 5, 6, 7, 8], 2, 2, { ans: 2 }, 'lo=hi=2 — integer sqrt of 8 is 2.', { mid: 2, found: true }),
      ],
    },
  ],
};

const medianTwoSorted: VisualScript = {
  id: 'dsa-bs-9',
  type: 'dsa',
  title: 'Median of Two Sorted Arrays',
  meta: { ...META, eyebrow: 'PATTERN · PARTITION BS', leetcode: 'LeetCode #4', difficulty: 'HARD', description: 'Binary search partition on shorter array so left halves form valid lower half of merged array.' },
  defaultApproachId: 'optimized',
  approaches: [
    {
      id: 'brute',
      label: 'Brute force · merge then pick mid',
      complexity: { time: 'O(m+n)', space: 'O(m+n)' },
      code: ['merged ← merge(nums1, nums2)', 'return median of merged'],
      steps: [
        binarySearchStep(1, [1, 3], 0, 1, { nums2: '[2]' }, 'Merge [1,3] and [2] → [1,2,3].', { label: 'A=[1,3] B=[2]' }),
        binarySearchStep(1, [1, 2, 3], 1, 1, { median: 2 }, 'Merged length 3 — median is middle element 2. O(m+n) time and space.', { mid: 1, found: true }),
      ],
    },
    {
      id: 'optimized',
      label: 'Optimized · partition binary search',
      complexity: { time: 'O(log min(m,n))', space: 'O(1)' },
      code: ['partition A at i, B at j = (m+n+1)/2 - i', 'ensure max(left) ≤ min(right)', 'binary search i on shorter array'],
      steps: [
        binarySearchStep(2, [1, 3], 0, 1, { i: 1, leftA: '[1,3]', leftB: '[2]' }, 'Try i=1: left parts [1,3] and [2] — maxLeft=3 > minRight=3? adjust.', { label: 'partition i on A' }),
        binarySearchStep(3, [1, 3], 0, 0, { i: 0, left: '[1]', right: '[2,3]' }, 'i=0: left max=1, right min=2 — valid partition.', { mid: 0 }),
        binarySearchStep(4, [1, 3], 0, 0, { median: 2 }, 'Median = max(1,2) when odd total — answer 2 in O(log n).', { mid: 0, found: true }),
      ],
    },
  ],
};

const splitArrayLargestSum: VisualScript = {
  id: 'dsa-bs-10',
  type: 'dsa',
  title: 'Split Array Largest Sum',
  meta: { ...META, eyebrow: 'PATTERN · BS ON ANSWER', leetcode: 'LeetCode #410', difficulty: 'HARD', description: 'Binary search minimum feasible largest subarray sum when splitting into k parts.' },
  defaultApproachId: 'optimized',
  approaches: [
    {
      id: 'brute',
      label: 'Brute force · try every max sum',
      complexity: { time: 'O(n · sum)', space: 'O(1)' },
      code: ['for limit from max(nums) to sum(nums):', '  if canSplit(k, limit): return limit'],
      steps: [
        binarySearchStep(1, [7, 2, 5, 10, 8], 0, 4, { k: 2, tryLimit: 18 }, 'Try max sum 18: greedy split → [7,2,5] + [10,8] works.', { label: 'nums, k=2' }),
        binarySearchStep(1, [7, 2, 5, 10, 8], 0, 4, { tryLimit: 17, fail: 'need 3 parts' }, 'Limit 17 needs more than 2 subarrays — keep searching downward.', { mid: 2 }),
      ],
    },
    {
      id: 'optimized',
      label: 'Optimized · binary search limit',
      complexity: { time: 'O(n log sum)', space: 'O(1)' },
      code: ['lo ← max(nums), hi ← sum(nums)', 'while lo < hi:', '  mid ← (lo+hi)/2', '  if canSplit(k,mid): hi ← mid', '  else: lo ← mid+1'],
      steps: [
        binarySearchStep(2, [7, 2, 5, 10, 8], 0, 4, { mid: 15, parts: 3 }, 'mid=15 → greedy needs 3 parts (>k=2) — limit too tight.', { mid: 2, label: 'search limit' }),
        binarySearchStep(3, [7, 2, 5, 10, 8], 0, 4, { mid: 18, parts: 2 }, 'mid=18 → exactly 2 subarrays fit — try smaller limit.', { mid: 3 }),
        binarySearchStep(4, [7, 2, 5, 10, 8], 3, 3, { ans: 18 }, 'Minimum feasible largest sum = 18.', { mid: 3, found: true }),
      ],
    },
  ],
};

export const BINARY_SEARCH_SCRIPTS: Record<string, VisualScript> = {
  'bs-1': sqrtX,
  'bs-2': rotatedSearch,
  'bs-3': firstBadVersion,
  'bs-4': findPeak,
  'bs-5': searchInsert,
  'bs-6': classicBinarySearch,
  'bs-7': findMinRotated,
  'bs-8': kokoBananas,
  'bs-9': medianTwoSorted,
  'bs-10': splitArrayLargestSum,
};
