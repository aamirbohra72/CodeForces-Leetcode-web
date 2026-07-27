import type { VisualScript } from '@/types/visual-script';
import { arr, arrayStep, stringStep } from './helpers';

const META = {
  section: 'Two Pointers & Sliding Window',
  companies: ['Amazon', 'Microsoft', 'Google'],
};

/** tp-2: 3Sum — sorted array, fix i + two pointers */
const threeSum: VisualScript = {
  id: 'dsa-tp-2',
  type: 'dsa',
  title: '3Sum',
  meta: {
    ...META,
    eyebrow: 'PATTERN · TWO POINTERS',
    leetcode: 'LeetCode #15',
    difficulty: 'MEDIUM',
    description:
      'Find all unique triplets in nums that sum to zero. After sorting, fix nums[i] and run two pointers on the remaining slice.',
  },
  defaultApproachId: 'optimized',
  approaches: [
    {
      id: 'brute',
      label: 'Brute force',
      complexity: { time: 'O(n³)', space: 'O(1)' },
      code: [
        'sort nums',
        'for i ← 0 to n-3',
        '  for j ← i+1 to n-2',
        '    for k ← j+1 to n-1',
        '      if nums[i]+nums[j]+nums[k]=0: record triplet',
      ],
      steps: [
        arrayStep(1, arr([-1, 0, 1, 2, -1, -4]), [], [], { triplets: 0 }, 'Sort first so we can skip duplicates later.'),
        arrayStep(2, arr([-4, -1, -1, 0, 1, 2]), [{ name: 'i', index: 0, color: 'accent' }, { name: 'j', index: 1, color: 'secondary' }, { name: 'k', index: 2, color: 'secondary' }], [0, 1, 2], { i: 0, j: 1, k: 2, sum: -6 }, 'Try i=0,j=1,k=2 → -4+-1+-1=-6, not zero.'),
        arrayStep(3, arr([-4, -1, -1, 0, 1, 2]), [{ name: 'i', index: 0, color: 'accent' }, { name: 'j', index: 1, color: 'secondary' }, { name: 'k', index: 5, color: 'secondary' }], [0, 1, 5], { i: 0, j: 1, k: 5, sum: -3 }, 'k scans to index 5 — still no zero triplet for this i.'),
        arrayStep(4, arr([-4, -1, -1, 0, 1, 2]), [{ name: 'i', index: 1, color: 'accent' }, { name: 'j', index: 2, color: 'secondary' }, { name: 'k', index: 5, color: 'secondary' }], [1, 2, 5], { i: 1, j: 2, k: 5, sum: 0 }, 'Eventually (-1,-1,2) hits zero — but O(n³) checks every triple.'),
      ],
    },
    {
      id: 'optimized',
      label: 'Optimized · sort + two pointers',
      complexity: { time: 'O(n²)', space: 'O(1)' },
      code: [
        'sort nums',
        'for i ← 0 to n-3:',
        '  skip duplicate nums[i]',
        '  left ← i+1, right ← n-1',
        '  while left < right:',
        '    s ← nums[i]+nums[left]+nums[right]',
        '    if s=0: record; left++; right--',
        '    elif s<0: left++ else right--',
      ],
      steps: [
        arrayStep(2, arr([-4, -1, -1, 0, 1, 2]), [{ name: 'i', index: 1, color: 'accent' }], [1], { i: 1, fix: -1 }, 'Fix i at -1. Search pairs in [0,1,2] with two pointers.'),
        arrayStep(4, arr([-4, -1, -1, 0, 1, 2]), [{ name: 'i', index: 1, color: 'accent' }, { name: 'L', index: 2, color: 'secondary' }, { name: 'R', index: 5, color: 'secondary' }], [1, 2, 5], { i: 1, left: 2, right: 5, sum: 2 }, 'L=2 (-1), R=5 (2): sum=1>0 → move R left.'),
        arrayStep(6, arr([-4, -1, -1, 0, 1, 2]), [{ name: 'i', index: 1, color: 'accent' }, { name: 'L', index: 3, color: 'secondary' }, { name: 'R', index: 4, color: 'secondary' }], [1, 3, 4], { i: 1, left: 3, right: 4, sum: 0 }, 'L=3 (0), R=4 (1): -1+0+1=0 → record [-1,0,1].'),
        arrayStep(7, arr([-4, -1, -1, 0, 1, 2]), [{ name: 'i', index: 1, color: 'accent' }, { name: 'L', index: 2, color: 'secondary' }, { name: 'R', index: 3, color: 'secondary' }], [1, 2, 3], { triplet: '[-1,-1,2]', sum: 0 }, 'Another hit: (-1)+(-1)+2=0. Skip duplicate i values between rounds.'),
      ],
    },
  ],
};

/** tp-5: Longest Substring Without Repeating Characters */
const longestSubstring: VisualScript = {
  id: 'dsa-tp-5',
  type: 'dsa',
  title: 'Longest Substring Without Repeating Characters',
  meta: {
    ...META,
    eyebrow: 'PATTERN · SLIDING WINDOW',
    leetcode: 'LeetCode #3',
    difficulty: 'MEDIUM',
    description: 'Given a string s, find the length of the longest substring without repeating characters.',
  },
  defaultApproachId: 'optimized',
  approaches: [
    {
      id: 'brute',
      label: 'Brute force',
      complexity: { time: 'O(n³)', space: 'O(min(n,m))' },
      code: [
        'for i ← 0 to n-1',
        '  for j ← i to n-1',
        '    if s[i..j] has duplicates: break',
        '    best ← max(best, j-i+1)',
      ],
      steps: [
        stringStep(1, 'abcabcbb', {}, { s: '"abcabcbb"', best: 0 }, 'Try every substring — expand j from each start i until a duplicate appears.'),
        stringStep(2, 'abcabcbb', { windowStart: 0, windowEnd: 2, pointers: [{ name: 'i', index: 0, color: 'accent' }, { name: 'j', index: 2, color: 'secondary' }] }, { i: 0, j: 2, len: 3 }, 'i=0: "abc" has no repeats — length 3.'),
        stringStep(2, 'abcabcbb', { windowStart: 0, windowEnd: 3, duplicateIndex: 3, pointers: [{ name: 'i', index: 0, color: 'accent' }, { name: 'j', index: 3, color: 'secondary' }] }, { dup: 'a', best: 3 }, 'j=3 hits duplicate "a" — stop inner loop.'),
      ],
    },
    {
      id: 'optimized',
      label: 'Optimized · sliding window',
      complexity: { time: 'O(n)', space: 'O(min(n,m))' },
      code: [
        'left ← 0, seen ← map, best ← 0',
        'for right ← 0 to n-1:',
        '  if s[right] in seen and seen[s[right]] ≥ left:',
        '    left ← seen[s[right]] + 1',
        '  seen[s[right]] ← right',
        '  best ← max(best, right-left+1)',
      ],
      steps: [
        stringStep(2, 'abcabcbb', { windowStart: 0, windowEnd: 2, pointers: [{ name: 'L', index: 0, color: 'accent' }, { name: 'R', index: 2, color: 'secondary' }] }, { left: 0, right: 2, best: 3 }, 'R expands: "abc" all unique — best=3.'),
        stringStep(3, 'abcabcbb', { windowStart: 0, windowEnd: 3, duplicateIndex: 3, pointers: [{ name: 'L', index: 0, color: 'accent' }, { name: 'R', index: 3, color: 'secondary' }] }, { char: 'a', jump: 1 }, 'R=3 is "a" again — last seen at 0, jump L to 1.'),
        stringStep(3, 'abcabcbb', { windowStart: 1, windowEnd: 5, pointers: [{ name: 'L', index: 1, color: 'accent' }, { name: 'R', index: 5, color: 'secondary' }] }, { left: 1, right: 5, best: 3 }, 'Window "bca" / "cab" — best stays 3. Each char moves L at most once.'),
      ],
    },
  ],
};

/** tp-6: Minimum Size Subarray Sum */
const minSubarraySum: VisualScript = {
  id: 'dsa-tp-6',
  type: 'dsa',
  title: 'Minimum Size Subarray Sum',
  meta: {
    ...META,
    eyebrow: 'PATTERN · SLIDING WINDOW',
    leetcode: 'LeetCode #209',
    difficulty: 'MEDIUM',
    description: 'Find the minimal length of a contiguous subarray whose sum is ≥ target.',
  },
  defaultApproachId: 'optimized',
  approaches: [
    {
      id: 'brute',
      label: 'Brute force',
      complexity: { time: 'O(n²)', space: 'O(1)' },
      code: [
        'best ← ∞',
        'for i ← 0 to n-1',
        '  sum ← 0',
        '  for j ← i to n-1',
        '    sum += nums[j]',
        '    if sum ≥ target: best ← min(best, j-i+1); break',
      ],
      steps: [
        arrayStep(2, arr([2, 3, 1, 2, 4, 3]), [{ name: 'i', index: 0, color: 'accent' }], [0], { target: 7, i: 0, sum: 0 }, 'target=7. Try every start index i.', undefined),
        arrayStep(4, arr([2, 3, 1, 2, 4, 3]), [{ name: 'i', index: 0, color: 'accent' }, { name: 'j', index: 3, color: 'secondary' }], [0, 1, 2, 3], { i: 0, j: 3, sum: 8, len: 4 }, 'i=0: j grows until sum≥7 at [2,3,1,2]=8, len=4.', { start: 0, end: 3 }),
        arrayStep(4, arr([2, 3, 1, 2, 4, 3]), [{ name: 'i', index: 3, color: 'accent' }, { name: 'j', index: 5, color: 'secondary' }], [3, 4, 5], { i: 3, j: 5, sum: 9, len: 3 }, 'i=3: [2,4,3]=9 in 3 elements — better, but we rescan each i.', { start: 3, end: 5 }),
      ],
    },
    {
      id: 'optimized',
      label: 'Optimized · sliding window',
      complexity: { time: 'O(n)', space: 'O(1)' },
      code: [
        'left ← 0, sum ← 0, best ← ∞',
        'for right ← 0 to n-1:',
        '  sum += nums[right]',
        '  while sum ≥ target:',
        '    best ← min(best, right-left+1)',
        '    sum -= nums[left]; left++',
      ],
      steps: [
        arrayStep(2, arr([2, 3, 1, 2, 4, 3]), [{ name: 'L', index: 0, color: 'accent' }, { name: 'R', index: 3, color: 'secondary' }], [0, 1, 2, 3], { left: 0, right: 3, sum: 8, best: 4 }, 'Expand R until sum=8≥7 → best=4.', { start: 0, end: 3 }),
        arrayStep(5, arr([2, 3, 1, 2, 4, 3]), [{ name: 'L', index: 1, color: 'accent' }, { name: 'R', index: 3, color: 'secondary' }], [1, 2, 3], { left: 1, right: 3, sum: 6 }, 'Shrink from left: sum=6<7, stop shrinking.', { start: 1, end: 3 }),
        arrayStep(2, arr([2, 3, 1, 2, 4, 3]), [{ name: 'L', index: 3, color: 'accent' }, { name: 'R', index: 5, color: 'secondary' }], [3, 4, 5], { left: 3, right: 5, sum: 9, best: 3 }, 'Later window [2,4,3] sum=9 → best=min(4,3)=3.', { start: 3, end: 5 }),
      ],
    },
  ],
};

/** tp-7, tp-9, tp-10, tp-11, tp-12 — additional unique scripts */
const permutationInString: VisualScript = {
  id: 'dsa-tp-7',
  type: 'dsa',
  title: 'Permutation in String',
  meta: { ...META, eyebrow: 'PATTERN · SLIDING WINDOW', leetcode: 'LeetCode #567', difficulty: 'MEDIUM', description: 'Return true if s2 contains a permutation of s1.' },
  defaultApproachId: 'optimized',
  approaches: [
    {
      id: 'brute',
      label: 'Brute force',
      complexity: { time: 'O(n·m)', space: 'O(1)' },
      code: ['for each window of len(s1) in s2', '  if sorted(window)=sorted(s1): return true', 'return false'],
      steps: [
        stringStep(1, 'eidbaooo', { windowStart: 0, windowEnd: 1 }, { s1: '"ab"', len: 2 }, 's1="ab" — check every length-2 window in s2.'),
        stringStep(1, 'eidbaooo', { windowStart: 3, windowEnd: 4 }, { window: '"ba"', match: 'no' }, 'Window "ba" at index 3 — sorted chars ≠ sorted "ab".'),
        stringStep(1, 'eidbaooo', { windowStart: 4, windowEnd: 5 }, { window: '"ab"', match: 'yes' }, 'Window "ab" found — return true.'),
      ],
    },
    {
      id: 'optimized',
      label: 'Optimized · fixed window + freq',
      complexity: { time: 'O(n)', space: 'O(1)' },
      code: ['count s1 freq[26]', 'slide window len(s1) on s2', 'match freq → return true', 'slide: add new char, remove old'],
      steps: [
        stringStep(2, 'eidbaooo', { windowStart: 0, windowEnd: 1, pointers: [{ name: 'L', index: 0, color: 'accent' }, { name: 'R', index: 1, color: 'secondary' }] }, { need: '{a:1,b:1}', have: '{e:1,i:1}' }, 'Compare frequency arrays for window size 2.'),
        stringStep(3, 'eidbaooo', { windowStart: 4, windowEnd: 5, pointers: [{ name: 'L', index: 4, color: 'accent' }, { name: 'R', index: 5, color: 'secondary' }] }, { have: '{a:1,b:1}', match: 'yes' }, 'At L=4,R=5 frequencies match s1 — permutation found.'),
      ],
    },
  ],
};

const fruitIntoBaskets: VisualScript = {
  id: 'dsa-tp-9',
  type: 'dsa',
  title: 'Fruit Into Baskets',
  meta: { ...META, eyebrow: 'PATTERN · SLIDING WINDOW', leetcode: 'LeetCode #904', difficulty: 'MEDIUM', description: 'Pick fruits into 2 baskets (at most 2 types). Return max fruits collected.' },
  defaultApproachId: 'optimized',
  approaches: [
    {
      id: 'brute',
      label: 'Brute force',
      complexity: { time: 'O(n²)', space: 'O(1)' },
      code: ['for i ← 0 to n-1', '  types ← set', '  for j ← i to n-1', '    add nums[j]; if types>2: break', '  best ← max(best, j-i)'],
      steps: [
        arrayStep(2, arr([1, 2, 1, 2, 3]), [{ name: 'i', index: 0, color: 'accent' }, { name: 'j', index: 3, color: 'secondary' }], [0, 1, 2, 3], { types: 2, len: 4 }, 'i=0: types {1,2} only — length 4 before index 4 adds type 3.', { start: 0, end: 3 }),
        arrayStep(2, arr([1, 2, 1, 2, 3]), [{ name: 'i', index: 0, color: 'accent' }, { name: 'j', index: 4, color: 'secondary' }], [4], { types: 3, stop: 'yes' }, 'Third type forces stop — best=4 for this i.', { start: 0, end: 4 }),
      ],
    },
    {
      id: 'optimized',
      label: 'Optimized · variable window',
      complexity: { time: 'O(n)', space: 'O(1)' },
      code: ['left ← 0, freq map, best ← 0', 'for right ← 0 to n-1:', '  add nums[right]', '  while distinct types > 2: remove nums[left]; left++', '  best ← max(best, right-left+1)'],
      steps: [
        arrayStep(2, arr([1, 2, 1, 2, 3]), [{ name: 'L', index: 0, color: 'accent' }, { name: 'R', index: 3, color: 'secondary' }], [0, 1, 2, 3], { types: 2, best: 4 }, 'Window [1,2,1,2] uses only 2 types — length 4.', { start: 0, end: 3 }),
        arrayStep(3, arr([1, 2, 1, 2, 3]), [{ name: 'L', index: 1, color: 'accent' }, { name: 'R', index: 4, color: 'secondary' }], [4], { types: 3, left: 1 }, 'Add 3 → shrink left until ≤2 types again.', { start: 1, end: 4 }),
      ],
    },
  ],
};

const maxConsecutiveOnes: VisualScript = {
  id: 'dsa-tp-10',
  type: 'dsa',
  title: 'Max Consecutive Ones III',
  meta: { ...META, eyebrow: 'PATTERN · SLIDING WINDOW', leetcode: 'LeetCode #1004', difficulty: 'MEDIUM', description: 'Longest subarray of 1s if you can flip at most k zeros.' },
  defaultApproachId: 'optimized',
  approaches: [
    {
      id: 'brute',
      label: 'Brute force',
      complexity: { time: 'O(n²)', space: 'O(1)' },
      code: ['for i,j: count zeros in [i,j]', 'if zeros ≤ k: best ← max(best, len)'],
      steps: [
        arrayStep(1, arr([1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0]), [], [], { k: 2 }, 'k=2 flips allowed. Enumerate all subarrays.', undefined),
        arrayStep(1, arr([1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0]), [{ name: 'i', index: 0, color: 'accent' }, { name: 'j', index: 9, color: 'secondary' }], [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], { zeros: 3, valid: 'no' }, '[0..9] has 3 zeros > k.', { start: 0, end: 9 }),
        arrayStep(1, arr([1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0]), [{ name: 'i', index: 3, color: 'accent' }, { name: 'j', index: 9, color: 'secondary' }], [3, 4, 5, 6, 7, 8, 9], { zeros: 2, len: 7 }, 'Best valid window length 7 with at most 2 zeros.', { start: 3, end: 9 }),
      ],
    },
    {
      id: 'optimized',
      label: 'Optimized · sliding window',
      complexity: { time: 'O(n)', space: 'O(1)' },
      code: ['left ← 0, zeros ← 0', 'for right ← 0 to n-1:', '  if nums[right]=0: zeros++', '  while zeros > k: if nums[left]=0: zeros--; left++', '  best ← max(best, right-left+1)'],
      steps: [
        arrayStep(3, arr([1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0]), [{ name: 'L', index: 3, color: 'accent' }, { name: 'R', index: 9, color: 'secondary' }], [3, 4, 5, 6, 7, 8, 9], { zeros: 2, best: 7 }, 'Window holds 2 zeros — flip them mentally, length 7.', { start: 3, end: 9 }),
        arrayStep(4, arr([1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0]), [{ name: 'L', index: 5, color: 'accent' }, { name: 'R', index: 9, color: 'secondary' }], [5, 6, 7, 8, 9], { zeros: 1, best: 7 }, 'Shrink when zeros>k — maintain valid window in O(n).', { start: 5, end: 9 }),
      ],
    },
  ],
};

const subarrayProduct: VisualScript = {
  id: 'dsa-tp-11',
  type: 'dsa',
  title: 'Subarray Product Less Than K',
  meta: { ...META, eyebrow: 'PATTERN · SLIDING WINDOW', leetcode: 'LeetCode #713', difficulty: 'MEDIUM', description: 'Count contiguous subarrays where product of elements is strictly less than k.' },
  defaultApproachId: 'optimized',
  approaches: [
    {
      id: 'brute',
      label: 'Brute force',
      complexity: { time: 'O(n²)', space: 'O(1)' },
      code: ['count ← 0', 'for i: for j≥i: prod*=nums[j]; if prod<k: count++'],
      steps: [
        arrayStep(2, arr([10, 5, 2, 6]), [{ name: 'i', index: 0, color: 'accent' }, { name: 'j', index: 1, color: 'secondary' }], [0, 1], { k: 100, prod: 50, count: 1 }, 'k=100. [10,5] product 50<100 → count++.', { start: 0, end: 1 }),
        arrayStep(2, arr([10, 5, 2, 6]), [{ name: 'i', index: 0, color: 'accent' }, { name: 'j', index: 3, color: 'secondary' }], [0, 1, 2, 3], { prod: 600, count: 3 }, '[10,5,2,6]=600≥k — stop extending this i.', { start: 0, end: 3 }),
      ],
    },
    {
      id: 'optimized',
      label: 'Optimized · sliding window',
      complexity: { time: 'O(n)', space: 'O(1)' },
      code: ['left ← 0, prod ← 1, count ← 0', 'for right:', '  prod *= nums[right]', '  while prod ≥ k: prod /= nums[left]; left++', '  count += right-left+1'],
      steps: [
        arrayStep(3, arr([10, 5, 2, 6]), [{ name: 'L', index: 0, color: 'accent' }, { name: 'R', index: 2, color: 'secondary' }], [0, 1, 2], { prod: 100, count: 5 }, 'prod=100 not <k — shrink left until prod<k.', { start: 0, end: 2 }),
        arrayStep(3, arr([10, 5, 2, 6]), [{ name: 'L', index: 1, color: 'accent' }, { name: 'R', index: 2, color: 'secondary' }], [1, 2], { prod: 10, add: 2 }, 'Valid window [5,2]: add 2 new subarrays ending at R.', { start: 1, end: 2 }),
      ],
    },
  ],
};

const charReplacement: VisualScript = {
  id: 'dsa-tp-12',
  type: 'dsa',
  title: 'Longest Repeating Character Replacement',
  meta: { ...META, eyebrow: 'PATTERN · SLIDING WINDOW', leetcode: 'LeetCode #424', difficulty: 'MEDIUM', description: 'Longest substring containing the same letter after at most k replacements.' },
  defaultApproachId: 'optimized',
  approaches: [
    {
      id: 'brute',
      label: 'Brute force',
      complexity: { time: 'O(n²)', space: 'O(1)' },
      code: ['for i,j: count mismatches from dominant char', 'if mismatches ≤ k: update best'],
      steps: [
        stringStep(1, 'AABABBA', {}, { s: '"AABABBA"', k: 1 }, 'Try all substrings — count chars that need replacing.'),
        stringStep(1, 'AABABBA', { windowStart: 0, windowEnd: 3, pointers: [{ name: 'i', index: 0, color: 'accent' }, { name: 'j', index: 3, color: 'secondary' }] }, { dominant: 'A', swaps: 1, len: 4 }, '"AABA" needs 1 swap to be all A — valid.'),
      ],
    },
    {
      id: 'optimized',
      label: 'Optimized · sliding window',
      complexity: { time: 'O(n)', space: 'O(1)' },
      code: ['track freq in window, maxFreq', 'while (windowLen - maxFreq) > k: shrink left', 'best ← max(best, windowLen)'],
      steps: [
        stringStep(2, 'AABABBA', { windowStart: 0, windowEnd: 3, pointers: [{ name: 'L', index: 0, color: 'accent' }, { name: 'R', index: 3, color: 'secondary' }] }, { maxFreq: 3, swaps: 1, best: 4 }, 'Window len 4, maxFreq=3 → need 1 replacement ≤ k.'),
        stringStep(3, 'AABABBA', { windowStart: 2, windowEnd: 6, pointers: [{ name: 'L', index: 2, color: 'accent' }, { name: 'R', index: 6, color: 'secondary' }] }, { maxFreq: 4, best: 4 }, 'Shrink when replacements>k — answer stays 4.'),
      ],
    },
  ],
};

export const TWO_POINTER_SCRIPTS: Record<string, VisualScript> = {
  'tp-2': threeSum,
  'tp-5': longestSubstring,
  'tp-6': minSubarraySum,
  'tp-7': permutationInString,
  'tp-9': fruitIntoBaskets,
  'tp-10': maxConsecutiveOnes,
  'tp-11': subarrayProduct,
  'tp-12': charReplacement,
};
