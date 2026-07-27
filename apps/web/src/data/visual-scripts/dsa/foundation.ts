import type { VisualScript } from '@/types/visual-script';
import { arr, arrayStep, seqStep, stringStep } from './helpers';

const META = {
  section: 'Foundation',
  companies: ['Amazon', 'Google', 'Meta'],
};

const timeSpaceBasics: VisualScript = {
  id: 'dsa-f-1',
  type: 'dsa',
  title: 'Time & space complexity basics',
  meta: {
    ...META,
    eyebrow: 'CONCEPT · TIME & SPACE',
    difficulty: 'EASY',
    description: 'Time counts operations as input grows; space counts extra memory beyond the input.',
  },
  defaultApproachId: 'optimized',
  approaches: [
    {
      id: 'brute',
      label: 'Brute force · copy then scan',
      complexity: { time: 'O(n)', space: 'O(n)' },
      code: ['copy ← duplicate array', 'max ← -∞', 'for x in copy: max ← max(max, x)'],
      steps: [
        arrayStep(1, arr([3, 1, 4, 1, 5]), [], [0, 1, 2, 3, 4], { n: 5, extra: 'O(n) copy' }, 'Duplicate the array first — uses O(n) extra space for the copy.'),
        arrayStep(2, arr([3, 1, 4, 1, 5]), [{ name: 'i', index: 2, color: 'accent' }], [2], { max: 4, scans: 5 }, 'Still one linear pass over n=5 elements → O(n) time, but O(n) space from the copy.'),
      ],
    },
    {
      id: 'optimized',
      label: 'Optimized · single pass in-place',
      complexity: { time: 'O(n)', space: 'O(1)' },
      code: ['max ← -∞', 'for x in nums: max ← max(max, x)', 'return max'],
      steps: [
        arrayStep(1, arr([3, 1, 4, 1, 5]), [{ name: 'i', index: 0, color: 'accent' }], [0], { max: 3 }, 'Track running max — one variable, no extra array.'),
        arrayStep(2, arr([3, 1, 4, 1, 5]), [{ name: 'i', index: 2, color: 'accent' }], [2], { max: 4 }, 'After scanning all n elements: O(n) time, O(1) extra space.'),
      ],
    },
  ],
};

const asymptoticNotation: VisualScript = {
  id: 'dsa-f-2',
  type: 'dsa',
  title: 'Asymptotic notation (Big O, Theta, Omega)',
  meta: {
    ...META,
    eyebrow: 'CONCEPT · GROWTH RATES',
    difficulty: 'EASY',
    description: 'Big O is an upper bound, Omega a lower bound, Theta a tight bound as n → ∞.',
  },
  defaultApproachId: 'optimized',
  approaches: [
    {
      id: 'brute',
      label: 'Brute force · all pairs',
      complexity: { time: 'O(n²)', space: 'O(1)' },
      code: ['for i ← 0 to n-1', '  for j ← i+1 to n-1', '    check pair (i,j)'],
      steps: [
        arrayStep(1, arr([2, 7, 4, 1]), [{ name: 'i', index: 0, color: 'accent' }, { name: 'j', index: 1, color: 'secondary' }], [0, 1], { pairs: '6 for n=4' }, 'Nested loops: n=4 → 6 pair checks. Grows like n(n-1)/2 = O(n²).'),
        arrayStep(2, arr([2, 7, 4, 1]), [{ name: 'i', index: 2, color: 'accent' }, { name: 'j', index: 3, color: 'secondary' }], [2, 3], { n: 4, bound: 'O(n²)' }, 'Double the input size → roughly 4× more work — quadratic growth.'),
      ],
    },
    {
      id: 'optimized',
      label: 'Optimized · single pass',
      complexity: { time: 'O(n)', space: 'O(1)' },
      code: ['for i ← 0 to n-1', '  process nums[i] once'],
      steps: [
        arrayStep(1, arr([2, 7, 4, 1]), [{ name: 'i', index: 0, color: 'accent' }], [0], { ops: 1, n: 4 }, 'One pointer walks the array — exactly n steps.'),
        arrayStep(2, arr([2, 7, 4, 1]), [{ name: 'i', index: 3, color: 'accent' }], [3], { ops: 4, bound: 'Θ(n)' }, '4 elements → 4 operations. Linear: doubling n doubles work — tight Θ(n) bound.'),
      ],
    },
  ],
};

const nestedLoops: VisualScript = {
  id: 'dsa-f-3',
  type: 'dsa',
  title: 'Analyzing nested loops',
  meta: {
    ...META,
    eyebrow: 'CONCEPT · LOOP DEPTH',
    difficulty: 'EASY',
    description: 'Count how many times the inner body runs when loops depend on the outer index.',
  },
  defaultApproachId: 'optimized',
  approaches: [
    {
      id: 'brute',
      label: 'Brute force · mis-count as O(n)',
      complexity: { time: 'O(n²) actual', space: 'O(1)' },
      code: ['for i ← 0 to n-1', '  for j ← 0 to n-1', '    count++'],
      steps: [
        arrayStep(1, arr([0, 1, 2, 3]), [{ name: 'i', index: 0, color: 'accent' }, { name: 'j', index: 0, color: 'secondary' }], [0], { innerRuns: 'n each i' }, 'Outer i=0: inner j runs n=4 times. Looks like "two loops" but body runs n×n.'),
        arrayStep(2, arr([0, 1, 2, 3]), [{ name: 'i', index: 3, color: 'accent' }, { name: 'j', index: 3, color: 'secondary' }], [0, 1, 2, 3], { total: 16, formula: 'n²' }, 'All 4×4 = 16 iterations — not O(n), it is O(n²).'),
      ],
    },
    {
      id: 'optimized',
      label: 'Optimized · triangular inner bound',
      complexity: { time: 'O(n²)', space: 'O(1)' },
      code: ['for i ← 0 to n-1', '  for j ← i to n-1', '    count++'],
      steps: [
        arrayStep(1, arr([0, 1, 2, 3]), [{ name: 'i', index: 0, color: 'accent' }, { name: 'j', index: 0, color: 'secondary' }], [0], { jFrom: 'i', runs: 4 }, 'i=0: j runs 4 times (0..3).'),
        arrayStep(2, arr([0, 1, 2, 3]), [{ name: 'i', index: 2, color: 'accent' }, { name: 'j', index: 3, color: 'secondary' }], [2, 3], { runs: '2 for i=2' }, 'i=2: j runs only 2 times — inner length shrinks.'),
        arrayStep(2, arr([0, 1, 2, 3]), [], [0, 1, 2, 3], { sum: '4+3+2+1=10', bound: 'O(n²)' }, 'Total 10 = n(n+1)/2 — still quadratic, just half the full n² grid.'),
      ],
    },
  ],
};

const introRecursion: VisualScript = {
  id: 'dsa-f-4',
  type: 'dsa',
  title: 'Introduction to recursion',
  meta: {
    ...META,
    eyebrow: 'CONCEPT · CALL STACK',
    difficulty: 'MEDIUM',
    description: 'A function calls itself on a smaller subproblem until a base case stops the chain.',
  },
  defaultApproachId: 'optimized',
  approaches: [
    {
      id: 'brute',
      label: 'Brute force · explicit stack simulation',
      complexity: { time: 'O(n)', space: 'O(n)' },
      code: ['stack ← push n, n-1, …, 1', 'while stack: pop and accumulate'],
      steps: [
        seqStep(1, ['main', 'stack'], [{ from: 'main', to: 'stack', label: 'push 5,4,3,2,1' }], { n: 5 }, 'Manually push all values — same work as recursion but you manage the stack yourself.'),
        seqStep(2, ['main', 'stack'], [{ from: 'stack', to: 'main', label: 'pop → sum += 1..5' }], { sum: 15 }, 'Pop until empty. O(n) time, O(n) stack space — honest equivalent to recursion.'),
      ],
    },
    {
      id: 'optimized',
      label: 'Optimized · recursive sum(1..n)',
      complexity: { time: 'O(n)', space: 'O(n)' },
      code: ['sum(n): if n=0 return 0', 'return n + sum(n-1)'],
      steps: [
        seqStep(1, ['main', 'sum'], [{ from: 'main', to: 'sum', label: 'sum(5)' }], { call: 'sum(5)' }, 'main calls sum(5) — not done until base case.'),
        seqStep(2, ['main', 'sum'], [{ from: 'sum', to: 'sum', label: 'sum(4)' }, { from: 'sum', to: 'sum', label: '…' }], { depth: 5 }, 'Each call waits on sum(n-1) — call chain depth n.', ['sum']),
        seqStep(3, ['main', 'sum'], [{ from: 'sum', to: 'main', label: 'return 0 @ n=0' }], { unwind: '5+4+3+2+1=15' }, 'Base n=0 returns 0; unwinding adds each n → 15. Space O(n) for call frames.'),
      ],
    },
  ],
};

const divideConquer: VisualScript = {
  id: 'dsa-f-5',
  type: 'dsa',
  title: 'Divide and conquer intuition',
  meta: {
    ...META,
    eyebrow: 'CONCEPT · SPLIT · SOLVE · MERGE',
    difficulty: 'MEDIUM',
    description: 'Break the problem in half, solve each half recursively, then combine results.',
  },
  defaultApproachId: 'optimized',
  approaches: [
    {
      id: 'brute',
      label: 'Brute force · solve whole at once',
      complexity: { time: 'O(n log n) sort or O(n²)', space: 'O(n)' },
      code: ['sort entire array', 'return sorted'],
      steps: [
        arrayStep(1, arr([38, 27, 43, 3]), [], [0, 1, 2, 3], { method: 'monolithic sort' }, 'Sort all n=4 elements in one shot — works but hides the split structure.'),
        arrayStep(2, arr([3, 27, 38, 43]), [], [0, 1, 2, 3], { done: 'sorted' }, 'Result sorted, but we did not exploit independent subarrays.'),
      ],
    },
    {
      id: 'optimized',
      label: 'Optimized · merge sort split',
      complexity: { time: 'O(n log n)', space: 'O(n)' },
      code: ['if n≤1: return', 'left ← sort(left half)', 'right ← sort(right half)', 'merge(left, right)'],
      steps: [
        seqStep(1, ['sort', 'left', 'right'], [{ from: 'sort', to: 'left', label: '[38,27]' }, { from: 'sort', to: 'right', label: '[43,3]' }], { split: '[38,27|43,3]' }, 'Split [38,27,43,3] into halves — solve each independently.'),
        seqStep(2, ['left', 'right', 'merge'], [{ from: 'left', to: 'merge', label: '[27,38]' }, { from: 'right', to: 'merge', label: '[3,43]' }], { halves: 'sorted' }, 'Left → [27,38], right → [3,43] after recursive calls.'),
        arrayStep(3, arr([3, 27, 38, 43]), [], [0, 1, 2, 3], { merged: 'yes' }, 'Merge two sorted halves in O(n) — log n split levels → O(n log n) total.'),
      ],
    },
  ],
};

const bitManipulation: VisualScript = {
  id: 'dsa-f-6',
  type: 'dsa',
  title: 'Bit manipulation essentials',
  meta: {
    ...META,
    eyebrow: 'CONCEPT · XOR & MASKS',
    difficulty: 'MEDIUM',
    description: 'XOR cancels duplicates; masks isolate or set individual bits.',
  },
  defaultApproachId: 'optimized',
  approaches: [
    {
      id: 'brute',
      label: 'Brute force · hash count parity',
      complexity: { time: 'O(n)', space: 'O(n)' },
      code: ['map ← freq', 'for x in nums: map[x]++', 'return key with odd count'],
      steps: [
        arrayStep(1, arr([4, 1, 2, 1, 2]), [{ name: 'i', index: 0, color: 'accent' }], [0], { map: '{4:1}' }, 'Count frequencies in a hash map — O(n) extra space.'),
        arrayStep(2, arr([4, 1, 2, 1, 2]), [], [0, 1, 2, 3, 4], { lone: 4 }, 'Only 4 appears once — found after full map build.'),
      ],
    },
    {
      id: 'optimized',
      label: 'Optimized · XOR all',
      complexity: { time: 'O(n)', space: 'O(1)' },
      code: ['ans ← 0', 'for x in nums: ans ← ans XOR x', 'return ans'],
      steps: [
        arrayStep(1, arr([4, 1, 2, 1, 2]), [{ name: 'i', index: 1, color: 'accent' }], [0, 1], { xor: '4^1=5' }, 'XOR accumulates: pairs like 1^1 cancel to 0.'),
        arrayStep(2, arr([4, 1, 2, 1, 2]), [{ name: 'i', index: 4, color: 'accent' }], [0, 1, 2, 3, 4], { xor: '4', space: 'O(1)' }, 'After all XORs: 4 remains — single number, no extra map.'),
      ],
    },
  ],
};

const mathForCp: VisualScript = {
  id: 'dsa-f-7',
  type: 'dsa',
  title: 'Math for competitive programming',
  meta: {
    ...META,
    eyebrow: 'CONCEPT · MOD & GCD',
    difficulty: 'MEDIUM',
    description: 'Modular arithmetic keeps numbers bounded; GCD via Euclidean algorithm is O(log min(a,b)).',
  },
  defaultApproachId: 'optimized',
  approaches: [
    {
      id: 'brute',
      label: 'Brute force · list all divisors',
      complexity: { time: 'O(min(a,b))', space: 'O(1)' },
      code: ['d ← min(a,b) down to 1', 'if a%d=0 and b%d=0: return d'],
      steps: [
        arrayStep(1, arr([48, 18]), [{ name: 'd', index: 0, color: 'accent' }], [0, 1], { try: 'd=18,17,…' }, 'gcd(48,18): try d=18 — 48%18≠0. Scan downward.'),
        arrayStep(2, arr([48, 18]), [{ name: 'd', index: 1, color: 'accent' }], [1], { gcd: 6, tries: 12 }, 'Reach d=6 — first common divisor. Up to min(a,b) steps.'),
      ],
    },
    {
      id: 'optimized',
      label: 'Optimized · Euclidean GCD',
      complexity: { time: 'O(log min(a,b))', space: 'O(1)' },
      code: ['while b ≠ 0:', '  (a,b) ← (b, a mod b)', 'return a'],
      steps: [
        arrayStep(1, arr([48, 18]), [], [0, 1], { step: '48,18 → 18,12' }, 'Replace (48,18) with (18, 48 mod 18=12).'),
        arrayStep(2, arr([18, 12]), [], [0, 1], { step: '18,12 → 12,6' }, 'Next: (18,12) → (12,6).'),
        arrayStep(2, arr([6, 0]), [], [0], { gcd: 6, steps: 3 }, '(6,0) → gcd=6 in 3 steps — logarithmic in magnitude.'),
      ],
    },
  ],
};

const prefixSums: VisualScript = {
  id: 'dsa-f-8',
  type: 'dsa',
  title: 'Prefix sums — concept',
  meta: {
    ...META,
    eyebrow: 'CONCEPT · RANGE SUM',
    difficulty: 'EASY',
    description: 'prefix[i] = sum of nums[0..i]. Range sum [L,R] = prefix[R] - prefix[L-1] in O(1).',
  },
  defaultApproachId: 'optimized',
  approaches: [
    {
      id: 'brute',
      label: 'Brute force · re-sum each query',
      complexity: { time: 'O(n) per query', space: 'O(1)' },
      code: ['for each query [L,R]:', '  s ← 0', '  for i ← L to R: s += nums[i]'],
      steps: [
        arrayStep(1, arr([2, 4, 1, 5, 3]), [{ name: 'i', index: 1, color: 'accent' }], [0, 1], { query: '[0,1]', sum: 6 }, 'Query [0,1]: walk indices 0..1 → 2+4=6.'),
        arrayStep(2, arr([2, 4, 1, 5, 3]), [{ name: 'i', index: 4, color: 'accent' }], [2, 3, 4], { query: '[2,4]', sum: 9 }, 'Query [2,4]: scan again → 1+5+3=9. Each query costs O(range length).'),
      ],
    },
    {
      id: 'optimized',
      label: 'Optimized · prefix array',
      complexity: { time: 'O(n) build, O(1) query', space: 'O(n)' },
      code: ['prefix[0] ← nums[0]', 'prefix[i] ← prefix[i-1] + nums[i]', 'sum(L,R) ← prefix[R]-prefix[L-1]'],
      steps: [
        arrayStep(1, arr([2, 4, 1, 5, 3]), [], [0, 1, 2, 3, 4], { prefix: '[2,6,7,12,15]' }, 'Build prefix: [2, 6, 7, 12, 15] in one left-to-right pass.'),
        arrayStep(2, arr([2, 4, 1, 5, 3]), [], [2, 3, 4], { query: '[2,4]', calc: '15-6=9' }, 'sum[2,4] = prefix[4]-prefix[1] = 15-6 = 9 — O(1) after preprocess.'),
      ],
    },
  ],
};

const hashingWhenWhy: VisualScript = {
  id: 'dsa-f-9',
  type: 'dsa',
  title: 'Hashing — when and why',
  meta: {
    ...META,
    eyebrow: 'CONCEPT · O(1) LOOKUP',
    difficulty: 'EASY',
    description: 'Use a hash map when you need fast "have I seen this value?" checks while scanning once.',
  },
  defaultApproachId: 'optimized',
  approaches: [
    {
      id: 'brute',
      label: 'Brute force · nested search',
      complexity: { time: 'O(n²)', space: 'O(1)' },
      code: ['for i: for j>i:', '  if nums[i]=nums[j]: return true'],
      steps: [
        arrayStep(1, arr([1, 2, 3, 1]), [{ name: 'i', index: 0, color: 'accent' }, { name: 'j', index: 3, color: 'secondary' }], [0, 3], { cmp: '1=1' }, 'Compare index 0 with 3 — duplicate found after O(n²) checks worst case.'),
        arrayStep(1, arr([1, 2, 3, 1]), [{ name: 'i', index: 0, color: 'accent' }, { name: 'j', index: 1, color: 'secondary' }], [0, 1], { miss: '1≠2' }, 'Many comparisons before finding the matching pair.'),
      ],
    },
    {
      id: 'optimized',
      label: 'Optimized · hash set on the fly',
      complexity: { time: 'O(n)', space: 'O(n)' },
      code: ['seen ← set()', 'for x in nums:', '  if x in seen: return true', '  seen.add(x)'],
      steps: [
        arrayStep(2, arr([1, 2, 3, 1]), [{ name: 'i', index: 0, color: 'accent' }], [0], { seen: '{1}' }, 'See 1 — add to set.'),
        arrayStep(3, arr([1, 2, 3, 1]), [{ name: 'i', index: 3, color: 'accent' }], [3], { hit: '1 in seen' }, 'At index 3 value 1 already in set → duplicate in one O(1) lookup.'),
      ],
    },
  ],
};

const sortingStability: VisualScript = {
  id: 'dsa-f-10',
  type: 'dsa',
  title: 'Sorting stability & comparisons',
  meta: {
    ...META,
    eyebrow: 'CONCEPT · STABLE vs UNSTABLE',
    difficulty: 'EASY',
    description: 'Stable sort keeps equal-key items in original relative order. Quick sort is typically unstable; merge sort is stable.',
  },
  defaultApproachId: 'optimized',
  approaches: [
    {
      id: 'brute',
      label: 'Brute force · unstable partition (concept)',
      complexity: { time: 'O(n log n)', space: 'O(log n)' },
      code: ['quicksort by key only', 'equal keys may swap positions'],
      steps: [
        stringStep(1, 'A1B1A2', { windowStart: 0, windowEnd: 4 }, { keys: 'A,B,A', ids: '1,1,2' }, 'Items: A₁, B₁, A₂ — sort key is letter only.'),
        stringStep(2, 'A1A2B1', { windowStart: 0, windowEnd: 4 }, { unstable: 'A2 before A1 possible' }, 'After unstable sort by key: A₂ can appear before A₁ — original order of equal A lost.'),
      ],
    },
    {
      id: 'optimized',
      label: 'Optimized · stable merge sort',
      complexity: { time: 'O(n log n)', space: 'O(n)' },
      code: ['merge sort', 'on tie take from left half first'],
      steps: [
        stringStep(1, 'A1B1A2', { windowStart: 0, windowEnd: 4 }, { input: 'A1 B1 A2' }, 'Start with A₁ before A₂ among A keys.'),
        stringStep(2, 'A1A2B1', { windowStart: 0, windowEnd: 4 }, { stable: 'A1 still before A2' }, 'Stable merge: A₁ stays before A₂ — equal keys preserve input order.'),
      ],
    },
  ],
};

export const FOUNDATION_SCRIPTS: Record<string, VisualScript> = {
  'f-1': timeSpaceBasics,
  'f-2': asymptoticNotation,
  'f-3': nestedLoops,
  'f-4': introRecursion,
  'f-5': divideConquer,
  'f-6': bitManipulation,
  'f-7': mathForCp,
  'f-8': prefixSums,
  'f-9': hashingWhenWhy,
  'f-10': sortingStability,
};
