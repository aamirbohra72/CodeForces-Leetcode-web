import type { VisualScript } from '@/types/visual-script';
import { arr, arrayStep } from './helpers';

const META = {
  section: 'Arrays',
  companies: ['Amazon', 'Microsoft', 'Apple'],
};

const twoSum: VisualScript = {
  id: 'dsa-a-1',
  type: 'dsa',
  title: 'Two Sum',
  meta: {
    ...META,
    eyebrow: 'PATTERN · HASH MAP',
    leetcode: 'LeetCode #1',
    difficulty: 'EASY',
    description: 'Return indices of two numbers in nums that add up to target. Exactly one solution exists.',
  },
  defaultApproachId: 'optimized',
  approaches: [
    {
      id: 'brute',
      label: 'Brute force',
      complexity: { time: 'O(n²)', space: 'O(1)' },
      code: [
        'for i ← 0 to n-2',
        '  for j ← i+1 to n-1',
        '    if nums[i]+nums[j]=target: return [i,j]',
      ],
      steps: [
        arrayStep(1, arr([2, 7, 11, 15]), [{ name: 'i', index: 0, color: 'accent' }, { name: 'j', index: 1, color: 'secondary' }], [0, 1], { target: 9, sum: 9 }, 'i=0,j=1: 2+7=9 — match found immediately.'),
        arrayStep(2, arr([2, 7, 11, 15]), [{ name: 'i', index: 0, color: 'accent' }, { name: 'j', index: 2, color: 'secondary' }], [0, 2], { sum: 13 }, 'If first pair fails, j keeps scanning — worst case checks all pairs.'),
      ],
    },
    {
      id: 'optimized',
      label: 'Optimized · hash map',
      complexity: { time: 'O(n)', space: 'O(n)' },
      code: [
        'seen ← empty map',
        'for i ← 0 to n-1:',
        '  need ← target - nums[i]',
        '  if need in seen: return [seen[need], i]',
        '  seen[nums[i]] ← i',
      ],
      steps: [
        arrayStep(2, arr([2, 7, 11, 15]), [{ name: 'i', index: 0, color: 'accent' }], [0], { i: 0, need: 7, seen: '{}' }, 'i=0 val=2, need=7 — not in map yet. Store 2→0.'),
        arrayStep(3, arr([2, 7, 11, 15]), [{ name: 'i', index: 1, color: 'accent' }], [0, 1], { i: 1, need: 2, seen: '{2:0}' }, 'i=1 val=7, need=2 — seen has index 0. Return [0,1].'),
      ],
    },
  ],
};

const bestTimeStock: VisualScript = {
  id: 'dsa-a-2',
  type: 'dsa',
  title: 'Best Time to Buy and Sell Stock',
  meta: {
    ...META,
    eyebrow: 'PATTERN · ONE PASS',
    leetcode: 'LeetCode #121',
    difficulty: 'EASY',
    description: 'Maximize profit by choosing one day to buy and a later day to sell. Return max profit or 0.',
  },
  defaultApproachId: 'optimized',
  approaches: [
    {
      id: 'brute',
      label: 'Brute force',
      complexity: { time: 'O(n²)', space: 'O(1)' },
      code: ['maxProfit ← 0', 'for buy: for sell>buy: maxProfit ← max(maxProfit, price[sell]-price[buy])'],
      steps: [
        arrayStep(1, arr([7, 1, 5, 3, 6, 4]), [{ name: 'buy', index: 0, color: 'accent' }, { name: 'sell', index: 1, color: 'secondary' }], [0, 1], { profit: -6 }, 'Buy day0=7, sell day1=1 → loss.'),
        arrayStep(1, arr([7, 1, 5, 3, 6, 4]), [{ name: 'buy', index: 1, color: 'accent' }, { name: 'sell', index: 4, color: 'secondary' }], [1, 4], { profit: 5 }, 'Buy day1=1, sell day4=6 → profit 5. Best among all pairs.'),
      ],
    },
    {
      id: 'optimized',
      label: 'Optimized · track min price',
      complexity: { time: 'O(n)', space: 'O(1)' },
      code: ['minPrice ← ∞, maxProfit ← 0', 'for price in prices:', '  minPrice ← min(minPrice, price)', '  maxProfit ← max(maxProfit, price-minPrice)'],
      steps: [
        arrayStep(2, arr([7, 1, 5, 3, 6, 4]), [{ name: 'i', index: 1, color: 'accent' }], [1], { minPrice: 1, maxProfit: 0 }, 'Day1 price=1 becomes new min buy price.'),
        arrayStep(3, arr([7, 1, 5, 3, 6, 4]), [{ name: 'i', index: 2, color: 'accent' }], [2], { minPrice: 1, maxProfit: 4 }, 'Day2 sell=5 → profit 4 if bought at 1.'),
        arrayStep(3, arr([7, 1, 5, 3, 6, 4]), [{ name: 'i', index: 4, color: 'accent' }], [4], { minPrice: 1, maxProfit: 5 }, 'Day4 sell=6 → max profit 5 in one pass.'),
      ],
    },
  ],
};

const containsDuplicate: VisualScript = {
  id: 'dsa-a-3',
  type: 'dsa',
  title: 'Contains Duplicate',
  meta: { ...META, eyebrow: 'PATTERN · HASH SET', leetcode: 'LeetCode #217', difficulty: 'EASY', description: 'Return true if any value appears at least twice.' },
  defaultApproachId: 'optimized',
  approaches: [
    {
      id: 'brute',
      label: 'Brute force',
      complexity: { time: 'O(n²)', space: 'O(1)' },
      code: ['for i: for j>i: if nums[i]=nums[j]: return true', 'return false'],
      steps: [
        arrayStep(1, arr([1, 2, 3, 1]), [{ name: 'i', index: 0, color: 'accent' }, { name: 'j', index: 3, color: 'secondary' }], [0, 3], { match: '1=1' }, 'Compare nums[0] with nums[3] — duplicate found.'),
      ],
    },
    {
      id: 'optimized',
      label: 'Optimized · hash set',
      complexity: { time: 'O(n)', space: 'O(n)' },
      code: ['seen ← set()', 'for x in nums:', '  if x in seen: return true', '  seen.add(x)', 'return false'],
      steps: [
        arrayStep(2, arr([1, 2, 3, 1]), [{ name: 'i', index: 0, color: 'accent' }], [0], { seen: '{1}' }, 'Add 1 to set.'),
        arrayStep(2, arr([1, 2, 3, 1]), [{ name: 'i', index: 3, color: 'accent' }], [3], { seen: '{1,2,3}', dup: 1 }, 'See 1 again — already in set, return true.'),
      ],
    },
  ],
};

const productExceptSelf: VisualScript = {
  id: 'dsa-a-4',
  type: 'dsa',
  title: 'Product of Array Except Self',
  meta: { ...META, eyebrow: 'PATTERN · PREFIX / SUFFIX', leetcode: 'LeetCode #238', difficulty: 'MEDIUM', description: 'Return array answer where answer[i] is product of all elements except nums[i]. No division.' },
  defaultApproachId: 'optimized',
  approaches: [
    {
      id: 'brute',
      label: 'Brute force',
      complexity: { time: 'O(n²)', space: 'O(1)' },
      code: ['for i: prod ← 1', '  for j≠i: prod *= nums[j]', '  answer[i] ← prod'],
      steps: [
        arrayStep(2, arr([1, 2, 3, 4]), [{ name: 'i', index: 1, color: 'accent' }], [1], { skip: 2, prod: '1*3*4' }, 'For i=1 skip nums[1]=2, multiply rest → 12.'),
        arrayStep(2, arr([1, 2, 3, 4]), [{ name: 'i', index: 2, color: 'accent' }], [2], { prod: '1*2*4=8' }, 'Each index rescans entire array — O(n²).'),
      ],
    },
    {
      id: 'optimized',
      label: 'Optimized · prefix + suffix',
      complexity: { time: 'O(n)', space: 'O(1) extra' },
      code: ['answer[i] ← product left of i', 'suffix ← 1', 'for i from n-1 down:', '  answer[i] *= suffix; suffix *= nums[i]'],
      steps: [
        arrayStep(1, arr([1, 2, 3, 4]), [], [0, 1, 2, 3], { prefix: '[1,1,2,6]' }, 'First pass: prefix products [1,1,2,6].'),
        arrayStep(3, arr([1, 2, 3, 4]), [{ name: 'i', index: 3, color: 'accent' }], [3], { suffix: 1, ans: 6 }, 'i=3: suffix=1 → answer[3]=6*1=6.'),
        arrayStep(3, arr([1, 2, 3, 4]), [{ name: 'i', index: 0, color: 'accent' }], [0], { answer: '[24,12,8,6]' }, 'Multiply suffix into prefix pass → final answer.'),
      ],
    },
  ],
};

const maxSubarray: VisualScript = {
  id: 'dsa-a-5',
  type: 'dsa',
  title: 'Maximum Subarray (Kadane)',
  meta: { ...META, eyebrow: 'PATTERN · KADANE', leetcode: 'LeetCode #53', difficulty: 'MEDIUM', description: 'Find contiguous subarray with the largest sum.' },
  defaultApproachId: 'optimized',
  approaches: [
    {
      id: 'brute',
      label: 'Brute force',
      complexity: { time: 'O(n²)', space: 'O(1)' },
      code: ['for i: for j≥i: sum subarray; best ← max(best,sum)'],
      steps: [
        arrayStep(1, arr([-2, 1, -3, 4, -1, 2, 1, -5, 4]), [{ name: 'i', index: 3, color: 'accent' }, { name: 'j', index: 6, color: 'secondary' }], [3, 4, 5, 6], { sum: 6 }, 'Subarray [4,-1,2,1] sum=6 — best among checked windows.', { start: 3, end: 6 }),
      ],
    },
    {
      id: 'optimized',
      label: 'Optimized · Kadane',
      complexity: { time: 'O(n)', space: 'O(1)' },
      code: ['cur ← 0, best ← nums[0]', 'for x in nums:', '  cur ← max(x, cur+x)', '  best ← max(best, cur)'],
      steps: [
        arrayStep(2, arr([-2, 1, -3, 4, -1, 2, 1, -5, 4]), [{ name: 'i', index: 0, color: 'accent' }], [0], { cur: -2, best: -2 }, 'cur=max(-2,0+-2)=-2.'),
        arrayStep(2, arr([-2, 1, -3, 4, -1, 2, 1, -5, 4]), [{ name: 'i', index: 3, color: 'accent' }], [3], { cur: 4, best: 4 }, 'At 4, cur resets to 4 — start new segment.'),
        arrayStep(3, arr([-2, 1, -3, 4, -1, 2, 1, -5, 4]), [{ name: 'i', index: 6, color: 'accent' }], [3, 4, 5, 6], { cur: 6, best: 6 }, 'Extend through 2,1 → cur=6, best=6.', { start: 3, end: 6 }),
      ],
    },
  ],
};

const rotateArray: VisualScript = {
  id: 'dsa-a-7',
  type: 'dsa',
  title: 'Rotate Array',
  meta: { ...META, eyebrow: 'PATTERN · REVERSE', leetcode: 'LeetCode #189', difficulty: 'MEDIUM', description: 'Rotate nums to the right by k steps. k may be larger than n.' },
  defaultApproachId: 'optimized',
  approaches: [
    {
      id: 'brute',
      label: 'Brute force',
      complexity: { time: 'O(n·k)', space: 'O(1)' },
      code: ['for step ← 1 to k:', '  last ← nums[n-1]', '  shift all right by 1', '  nums[0] ← last'],
      steps: [
        arrayStep(1, arr([1, 2, 3, 4, 5, 6, 7]), [], [], { k: 3, n: 7 }, 'k=3. One rotation moves 7 to front.'),
        arrayStep(2, arr([7, 1, 2, 3, 4, 5, 6]), [], [], { step: 1 }, 'After 1 shift. Need 3 total — O(n·k).'),
        arrayStep(2, arr([5, 6, 7, 1, 2, 3, 4]), [], [], { step: 3 }, 'After 3 shifts — correct but slow for large k.'),
      ],
    },
    {
      id: 'optimized',
      label: 'Optimized · triple reverse',
      complexity: { time: 'O(n)', space: 'O(1)' },
      code: ['k ← k mod n', 'reverse(nums, 0, n-1)', 'reverse(nums, 0, k-1)', 'reverse(nums, k, n-1)'],
      steps: [
        arrayStep(2, arr([1, 2, 3, 4, 5, 6, 7]), [], [0, 1, 2, 3, 4, 5, 6], { step: 'reverse all' }, 'Reverse whole array → [7,6,5,4,3,2,1].'),
        arrayStep(3, arr([7, 6, 5, 4, 3, 2, 1]), [], [0, 1, 2], { step: 'reverse first k' }, 'Reverse first k=3 → [5,6,7,4,3,2,1].'),
        arrayStep(4, arr([5, 6, 7, 4, 3, 2, 1]), [], [3, 4, 5, 6], { step: 'reverse rest' }, 'Reverse tail → [5,6,7,1,2,3,4]. Done in O(n).'),
      ],
    },
  ],
};

const firstMissingPositive: VisualScript = {
  id: 'dsa-a-8',
  type: 'dsa',
  title: 'First Missing Positive',
  meta: { ...META, eyebrow: 'PATTERN · INDEX MARKING', leetcode: 'LeetCode #41', difficulty: 'HARD', description: 'Find the smallest missing positive integer in O(n) time.' },
  defaultApproachId: 'optimized',
  approaches: [
    {
      id: 'brute',
      label: 'Brute force',
      complexity: { time: 'O(n²)', space: 'O(1)' },
      code: ['for candidate ← 1,2,3,...', '  if candidate not in nums: return candidate'],
      steps: [
        arrayStep(1, arr([3, 4, -1, 1]), [], [], { check: 1 }, 'Is 1 present? Scan entire array — no.'),
        arrayStep(1, arr([3, 4, -1, 1]), [], [], { check: 2 }, 'Is 2 present? No. Answer is 2.'),
      ],
    },
    {
      id: 'optimized',
      label: 'Optimized · place value at index',
      complexity: { time: 'O(n)', space: 'O(1)' },
      code: ['for i: while 1≤nums[i]≤n and nums[i]≠nums[nums[i]]:', '  swap nums[i] with nums[nums[i]]', 'for i: if nums[i]≠i+1: return i+1'],
      steps: [
        arrayStep(2, arr([3, 4, -1, 1]), [{ name: 'i', index: 0, color: 'accent' }], [0], { val: 3, place: 'index 2' }, 'Put 3 at index 2 via swaps.'),
        arrayStep(2, arr([1, 4, 3, -1]), [{ name: 'i', index: 0, color: 'accent' }], [0], { val: 1, at: 'index 0' }, 'Eventually 1 sits at index 0.'),
        arrayStep(3, arr([1, 4, 3, -1]), [{ name: 'i', index: 1, color: 'accent' }], [1], { expect: 2, got: 4 }, 'Index 1 should hold 2 but has 4 → first missing positive is 2.'),
      ],
    },
  ],
};

export const ARRAY_SCRIPTS: Record<string, VisualScript> = {
  'a-1': twoSum,
  'a-2': bestTimeStock,
  'a-3': containsDuplicate,
  'a-4': productExceptSelf,
  'a-5': maxSubarray,
  'a-7': rotateArray,
  'a-8': firstMissingPositive,
};
