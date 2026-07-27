import type { VisualScript } from '@/types/visual-script';
import { arr, arrayStep, dpStep, gridStep, stringStep } from './helpers';

const META = {
  section: 'Dynamic Programming',
  companies: ['Amazon', 'Google', 'Microsoft'],
};

const climbingStairs: VisualScript = {
  id: 'dsa-dp-1',
  type: 'dsa',
  title: 'Climbing Stairs',
  meta: { ...META, eyebrow: 'PATTERN · 1D DP', leetcode: 'LeetCode #70', difficulty: 'EASY', description: 'Count distinct ways to climb n stairs taking 1 or 2 steps at a time.' },
  defaultApproachId: 'optimized',
  approaches: [
    {
      id: 'brute', label: 'Brute force · recursion', complexity: { time: 'O(2ⁿ)', space: 'O(n)' },
      code: ['ways(n): if n≤1 return 1', '  return ways(n-1)+ways(n-2)'],
      steps: [
        arrayStep(1, arr([1, 1, 2]), [{ name: 'n', index: 2, color: 'accent' }], [2], { n: 3, ways: 2 }, 'ways(3)=ways(2)+ways(1) — branches explode for large n.'),
        arrayStep(1, arr([1, 1, 2, 3]), [{ name: 'n', index: 3, color: 'accent' }], [3], { n: 4, ways: 3 }, 'ways(4) recomputes ways(2) and ways(1) many times.'),
      ],
    },
    {
      id: 'optimized', label: 'Optimized · bottom-up', complexity: { time: 'O(n)', space: 'O(1)' },
      code: ['a←1, b←1', 'for i from 2 to n: c←a+b; a←b; b←c', 'return b'],
      steps: [
        dpStep(2, ['i', 'dp[i]'], ['0', '1', '2', '3', '4'], [['—', 1, 1, null, null]], { i: 2 }, 'Base: dp[0]=1, dp[1]=1.', { highlight: [{ row: 0, col: 1 }, { row: 0, col: 2 }] }),
        dpStep(3, ['i', 'dp[i]'], ['0', '1', '2', '3', '4'], [['—', 1, 1, 2, null]], { i: 3 }, 'dp[2]=dp[1]+dp[0]=2.', { highlight: [{ row: 0, col: 3 }] }),
        dpStep(3, ['i', 'dp[i]'], ['0', '1', '2', '3', '4'], [['—', 1, 1, 2, 3]], { answer: 3 }, 'dp[3]=2+1=3 ways for n=4.', { highlight: [{ row: 0, col: 4 }] }),
      ],
    },
  ],
};

const houseRobber: VisualScript = {
  id: 'dsa-dp-2',
  type: 'dsa',
  title: 'House Robber',
  meta: { ...META, eyebrow: 'PATTERN · TAKE / SKIP', leetcode: 'LeetCode #198', difficulty: 'MEDIUM', description: 'Maximize money robbed from non-adjacent houses.' },
  defaultApproachId: 'optimized',
  approaches: [
    {
      id: 'brute', label: 'Brute force · pick/skip tree', complexity: { time: 'O(2ⁿ)', space: 'O(n)' },
      code: ['rob(i): max(rob(i+2)+nums[i], rob(i+1))'],
      steps: [
        arrayStep(1, arr([2, 7, 9, 3, 1]), [{ name: 'i', index: 0, color: 'accent' }], [0], { branch: 'take 2 or skip' }, 'At index 0 choose rob or skip — exponential branches.'),
        arrayStep(1, arr([2, 7, 9, 3, 1]), [{ name: 'i', index: 2, color: 'accent' }], [0, 2], { take: '2+9=11' }, 'Taking 2 then 9 is one path; many overlaps recomputed.'),
      ],
    },
    {
      id: 'optimized', label: 'Optimized · rolling DP', complexity: { time: 'O(n)', space: 'O(1)' },
      code: ['prev2←0, prev1←0', 'for x in nums: cur←max(prev1, prev2+x)', '  prev2←prev1; prev1←cur'],
      steps: [
        arrayStep(2, arr([2, 7, 9, 3, 1]), [{ name: 'i', index: 0, color: 'accent' }], [0], { prev1: 2, prev2: 0 }, 'House 2: cur=max(0,0+2)=2.'),
        arrayStep(2, arr([2, 7, 9, 3, 1]), [{ name: 'i', index: 1, color: 'accent' }], [1], { prev1: 7 }, 'House 7: cur=max(2,0+7)=7 — skip 2.'),
        arrayStep(3, arr([2, 7, 9, 3, 1]), [{ name: 'i', index: 2, color: 'accent' }], [2], { prev1: 11 }, 'House 9: cur=max(7,2+9)=11.'),
        arrayStep(3, arr([2, 7, 9, 3, 1]), [{ name: 'i', index: 4, color: 'accent' }], [4], { answer: 12 }, 'Finish: best=12 (rob 2+9+1).'),
      ],
    },
  ],
};

const coinChange: VisualScript = {
  id: 'dsa-dp-3',
  type: 'dsa',
  title: 'Coin Change',
  meta: { ...META, eyebrow: 'PATTERN · UNBOUNDED KNAPSACK', leetcode: 'LeetCode #322', difficulty: 'MEDIUM', description: 'Fewest coins to make amount, or -1 if impossible.' },
  defaultApproachId: 'optimized',
  approaches: [
    {
      id: 'brute', label: 'Brute force · try every coin', complexity: { time: 'O(amount^coins)', space: 'O(amount)' },
      code: ['minCoins(amt): try each coin c', '  1 + minCoins(amt-c) if amt≥c'],
      steps: [
        arrayStep(1, arr([1, 2, 5]), [{ name: 'c', index: 2, color: 'accent' }], [2], { amount: 11, try: 5 }, 'amount=11 — recurse with 6,7,10,... many paths.'),
        arrayStep(1, arr([1, 2, 5]), [], [], { depth: 'high' }, 'Same sub-amounts recomputed without memo — exponential.'),
      ],
    },
    {
      id: 'optimized', label: 'Optimized · 1D DP', complexity: { time: 'O(amount·coins)', space: 'O(amount)' },
      code: ['dp[0..amount]←∞; dp[0]←0', 'for coin: for a from coin to amount:', '  dp[a]←min(dp[a], dp[a-coin]+1)'],
      steps: [
        dpStep(2, ['coin'], ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'], [[1], [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]], { coin: 1 }, 'After coin=1: dp[a]=a for all a.', { highlight: [{ row: 0, col: 11 }] }),
        dpStep(3, ['coin'], ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'], [[5], [0, 1, 2, 3, 4, 5, 1, 2, 3, 4, 2, 3]], { coin: 5 }, 'After coin=5: dp[11]=3 (5+5+1).', { highlight: [{ row: 0, col: 11 }] }),
      ],
    },
  ],
};

const lis: VisualScript = {
  id: 'dsa-dp-4',
  type: 'dsa',
  title: 'Longest Increasing Subsequence',
  meta: { ...META, eyebrow: 'PATTERN · LIS', leetcode: 'LeetCode #300', difficulty: 'MEDIUM', description: 'Length of longest strictly increasing subsequence.' },
  defaultApproachId: 'optimized',
  approaches: [
    {
      id: 'brute', label: 'Brute force · all subsequences', complexity: { time: 'O(2ⁿ)', space: 'O(n)' },
      code: ['for each subsequence: if increasing, track max len'],
      steps: [
        arrayStep(1, arr([10, 9, 2, 5, 3, 7]), [{ name: 'i', index: 2, color: 'accent' }, { name: 'j', index: 5, color: 'secondary' }], [2, 3, 5], { subseq: '[2,3,7]', len: 3 }, 'One increasing subsequence — check all 2ⁿ subsets.'),
        arrayStep(1, arr([10, 9, 2, 5, 3, 7]), [], [], { worst: '2ⁿ' }, 'No reuse of work across starting indices.'),
      ],
    },
    {
      id: 'optimized', label: 'Optimized · dp[i] ending at i', complexity: { time: 'O(n²)', space: 'O(n)' },
      code: ['dp[i]←1 for all i', 'for i: for j<i: if nums[j]<nums[i]: dp[i]←max(dp[i],dp[j]+1)'],
      steps: [
        arrayStep(2, arr([10, 9, 2, 5, 3, 7, 101, 18]), [{ name: 'i', index: 3, color: 'accent' }], [3], { dp: '[1,1,1,2,...]' }, 'At i=3 (5): best ending here is 2 from 2.'),
        arrayStep(3, arr([10, 9, 2, 5, 3, 7, 101, 18]), [{ name: 'i', index: 6, color: 'accent' }], [2, 3, 5, 6], { dp: 4, chain: '2→3→7→101' }, 'At 101: chain length 4 is global max.'),
      ],
    },
  ],
};

const wordBreak: VisualScript = {
  id: 'dsa-dp-5',
  type: 'dsa',
  title: 'Word Break',
  meta: { ...META, eyebrow: 'PATTERN · STRING DP', leetcode: 'LeetCode #139', difficulty: 'MEDIUM', description: 'Can string s be segmented into dictionary words?' },
  defaultApproachId: 'optimized',
  approaches: [
    {
      id: 'brute', label: 'Brute force · backtrack splits', complexity: { time: 'O(2ⁿ)', space: 'O(n)' },
      code: ['try split after each i: wordBreak(s[i:])'],
      steps: [
        stringStep(1, 'catsandog', { windowStart: 0, windowEnd: 2 }, { word: 'cat', dict: 'cat,sand,dog' }, 'Try "cat" + recurse on "sandog" — many dead ends.'),
        stringStep(1, 'catsandog', { windowStart: 0, windowEnd: 6 }, { fail: 'catsand' }, '"catsand" is not in dict — backtrack.'),
      ],
    },
    {
      id: 'optimized', label: 'Optimized · dp[i] reachable', complexity: { time: 'O(n²·dict)', space: 'O(n)' },
      code: ['dp[0]←true', 'for i: for word in dict:', '  if dp[i-len] and s[i-len:i]=word: dp[i]←true'],
      steps: [
        stringStep(2, 'leetcode', { windowStart: 0, windowEnd: 3, pointers: [{ name: 'i', index: 4, color: 'accent' }] }, { word: 'leet', dp4: 'yes' }, 'dp[4]=true via "leet".'),
        stringStep(3, 'leetcode', { windowStart: 4, windowEnd: 7, pointers: [{ name: 'i', index: 8, color: 'accent' }] }, { word: 'code', answer: 'yes' }, 'dp[8]=true via "code" — full string segmented.'),
      ],
    },
  ],
};

const uniquePaths: VisualScript = {
  id: 'dsa-dp-6',
  type: 'dsa',
  title: 'Unique Paths',
  meta: { ...META, eyebrow: 'PATTERN · GRID DP', leetcode: 'LeetCode #62', difficulty: 'MEDIUM', description: 'Paths from top-left to bottom-right moving only right or down in m×n grid.' },
  defaultApproachId: 'optimized',
  approaches: [
    {
      id: 'brute', label: 'Brute force · DFS all paths', complexity: { time: 'O(2^(m+n))', space: 'O(m+n)' },
      code: ['dfs(r,c): if out of bounds return 0', '  if (r,c) is goal return 1', '  return dfs(r+1,c)+dfs(r,c+1)'],
      steps: [
        gridStep(1, [['S', '.', '.'], ['.', '.', '.'], ['.', '.', 'G']], { r: 0, c: 0 }, 'Start DFS — each cell branches right and down.', { highlight: [{ row: 0, col: 0 }] }),
        gridStep(1, [['S', '.', '.'], ['.', '.', '.'], ['.', '.', 'G']], { paths: 'many' }, '3×3 grid has 6 paths but DFS revisits states without memo.', { path: [{ row: 0, col: 0 }, { row: 0, col: 1 }, { row: 0, col: 2 }, { row: 1, col: 2 }, { row: 2, col: 2 }] }),
      ],
    },
    {
      id: 'optimized', label: 'Optimized · tabulation', complexity: { time: 'O(m·n)', space: 'O(m·n)' },
      code: ['dp[r][c]←1 on first row/col', 'dp[r][c]←dp[r-1][c]+dp[r][c-1]'],
      steps: [
        dpStep(2, ['r\\c', '0', '1', '2'], ['0', '1', '2'], [['—', 1, 1, 1], [1, null, null, null], [1, null, null, null]], { m: 3, n: 3 }, 'First row/col filled with 1.', { highlight: [{ row: 1, col: 1 }] }),
        dpStep(3, ['r\\c', '0', '1', '2'], ['0', '1', '2'], [['—', 1, 1, 1], [1, 1, 2, 3], [1, 2, 3, 6]], { answer: 6 }, 'dp[2][2]=6 unique paths.', { highlight: [{ row: 2, col: 2 }] }),
      ],
    },
  ],
};

const editDistance: VisualScript = {
  id: 'dsa-dp-7',
  type: 'dsa',
  title: 'Edit Distance',
  meta: { ...META, eyebrow: 'PATTERN · 2D STRING DP', leetcode: 'LeetCode #72', difficulty: 'HARD', description: 'Minimum insert/delete/replace ops to convert word1 to word2.' },
  defaultApproachId: 'optimized',
  approaches: [
    {
      id: 'brute', label: 'Brute force · try all edits', complexity: { time: 'O(3^(m+n))', space: 'O(m+n)' },
      code: ['recurse: match, replace, insert, delete at each step'],
      steps: [
        stringStep(1, 'horse', { pointers: [{ name: 'i', index: 0, color: 'accent' }] }, { word2: 'ros' }, 'Three choices per mismatch — tree explodes.'),
        stringStep(1, 'ros', {}, { overlap: 'yes' }, 'Subproblems like edit("orse","os") repeat without memo.'),
      ],
    },
    {
      id: 'optimized', label: 'Optimized · Wagner-Fischer', complexity: { time: 'O(m·n)', space: 'O(m·n)' },
      code: ['dp[i][j]=min edits for word1[:i], word2[:j]', 'if chars match: dp[i][j]=dp[i-1][j-1]', 'else 1+min(insert,delete,replace)'],
      steps: [
        dpStep(2, ['', 'r', 'o', 's'], ['', 'h', 'o', 'r', 's', 'e'], [[0, 1, 2, 3], [1, null, null, null], [2, null, null, null], [3, null, null, null], [4, null, null, null], [5, null, null, null]], { init: 'base row/col' }, 'Base: empty→"ros" costs 3 inserts.', { highlight: [{ row: 1, col: 1 }] }),
        dpStep(4, ['', 'r', 'o', 's'], ['', 'h', 'o', 'r', 's', 'e'], [[0, 1, 2, 3], [1, 1, 2, 3], [2, 2, 1, 2], [3, 2, 2, 2], [4, 3, 3, 2], [5, 3, 4, 3]], { answer: 3 }, 'dp[5][3]=3 edits: horse→ros.', { highlight: [{ row: 5, col: 3 }] }),
      ],
    },
  ],
};

const lcs: VisualScript = {
  id: 'dsa-dp-8',
  type: 'dsa',
  title: 'Longest Common Subsequence',
  meta: { ...META, eyebrow: 'PATTERN · 2D DP', leetcode: 'LeetCode #1143', difficulty: 'MEDIUM', description: 'Length of longest subsequence common to both strings.' },
  defaultApproachId: 'optimized',
  approaches: [
    {
      id: 'brute', label: 'Brute force · all subsequences', complexity: { time: 'O(2^m·2^n)', space: 'O(m+n)' },
      code: ['generate all subs of text1, text2; compare lengths'],
      steps: [
        stringStep(1, 'abcde', { windowStart: 0, windowEnd: 4 }, { text2: 'ace' }, 'Enumerate 2⁵ subs of abcde against ace — slow.'),
        stringStep(1, 'ace', {}, { match: 'ace' }, 'LCS=3 found only after huge search.'),
      ],
    },
    {
      id: 'optimized', label: 'Optimized · dp table', complexity: { time: 'O(m·n)', space: 'O(m·n)' },
      code: ['if text1[i]=text2[j]: dp[i][j]=1+dp[i-1][j-1]', 'else dp[i][j]=max(dp[i-1][j], dp[i][j-1])'],
      steps: [
        dpStep(2, ['', 'a', 'c', 'e'], ['', 'a', 'b', 'c', 'd', 'e'], [[0, 0, 0, 0], [0, 1, 1, 1], [0, 1, 1, 2], [0, 1, 2, 2], [0, 1, 2, 2], [0, 1, 2, 3]], { fill: 'partial' }, 'Matching "a" and "c" builds LCS along diagonal.', { highlight: [{ row: 3, col: 2 }] }),
        dpStep(3, ['', 'a', 'c', 'e'], ['', 'a', 'b', 'c', 'd', 'e'], [[0, 0, 0, 0], [0, 1, 1, 1], [0, 1, 1, 2], [0, 1, 2, 2], [0, 1, 2, 2], [0, 1, 2, 3]], { answer: 3 }, 'dp[5][3]=3 → LCS "ace".', { highlight: [{ row: 5, col: 3 }] }),
      ],
    },
  ],
};

const partitionEqualSubset: VisualScript = {
  id: 'dsa-dp-9',
  type: 'dsa',
  title: 'Partition Equal Subset Sum',
  meta: { ...META, eyebrow: 'PATTERN · 0/1 KNAPSACK', leetcode: 'LeetCode #416', difficulty: 'MEDIUM', description: 'Can nums be partitioned into two subsets with equal sum?' },
  defaultApproachId: 'optimized',
  approaches: [
    {
      id: 'brute', label: 'Brute force · all subsets', complexity: { time: 'O(2ⁿ)', space: 'O(n)' },
      code: ['for each subset S: if sum(S)=total/2 return true'],
      steps: [
        arrayStep(1, arr([1, 5, 11, 5]), [], [], { total: 22, target: 11 }, 'Need subset summing to 11 — try all 2⁴ masks.'),
        arrayStep(1, arr([1, 5, 11, 5]), [{ name: 'mask', index: 1, color: 'accent' }, { name: 'mask', index: 3, color: 'secondary' }], [1, 3], { sum: '5+5=10' }, 'Most masks fail; no memo on partial sums.'),
      ],
    },
    {
      id: 'optimized', label: 'Optimized · subset-sum DP', complexity: { time: 'O(n·sum)', space: 'O(sum)' },
      code: ['dp[s]=can we make sum s?', 'for num: for s from target down to num:', '  dp[s]|=dp[s-num]'],
      steps: [
        arrayStep(2, arr([1, 5, 11, 5]), [{ name: 'num', index: 0, color: 'accent' }], [0], { dp11: 'no' }, 'Process 1: dp[1]=true.'),
        arrayStep(3, arr([1, 5, 11, 5]), [{ name: 'num', index: 3, color: 'accent' }], [3], { dp11: 'yes' }, 'After 5: dp[11]=true via 5+5+1 — partition exists.'),
      ],
    },
  ],
};

const decodeWays: VisualScript = {
  id: 'dsa-dp-10',
  type: 'dsa',
  title: 'Decode Ways',
  meta: { ...META, eyebrow: 'PATTERN · STRING DP', leetcode: 'LeetCode #91', difficulty: 'MEDIUM', description: 'Count ways to decode a digit string (1-26 mapping).' },
  defaultApproachId: 'optimized',
  approaches: [
    {
      id: 'brute', label: 'Brute force · split tree', complexity: { time: 'O(2ⁿ)', space: 'O(n)' },
      code: ['decode(i): take 1 digit or 2 if valid', '  return decode(i+1)+decode(i+2)'],
      steps: [
        stringStep(1, '226', { pointers: [{ name: 'i', index: 0, color: 'accent' }] }, { branch: '2|26 or 22|6' }, 'Each index splits 1 or 2 chars — overlapping subcalls.'),
        stringStep(1, '226', { windowStart: 1, windowEnd: 2 }, { sub: '26' }, 'Subproblem "26" recomputed from multiple parents.'),
      ],
    },
    {
      id: 'optimized', label: 'Optimized · dp[i] ways', complexity: { time: 'O(n)', space: 'O(n)' },
      code: ['dp[0]=1; dp[1]=1 if s[0]≠"0"', 'dp[i]+=dp[i-1] if valid 1-digit', 'dp[i]+=dp[i-2] if valid 2-digit'],
      steps: [
        dpStep(2, ['i'], ['0', '1', '2', '3'], [[1, 1, null, null]], { s: '226' }, 'dp[0]=dp[1]=1.', { highlight: [{ row: 0, col: 1 }] }),
        dpStep(3, ['i'], ['0', '1', '2', '3'], [[1, 1, 2, 3]], { answer: 3 }, 'dp[3]=3: "2|2|6", "22|6", "2|26".', { highlight: [{ row: 0, col: 3 }] }),
      ],
    },
  ],
};

const maxProductSubarray: VisualScript = {
  id: 'dsa-dp-11',
  type: 'dsa',
  title: 'Maximum Product Subarray',
  meta: { ...META, eyebrow: 'PATTERN · TRACK MIN/MAX', leetcode: 'LeetCode #152', difficulty: 'MEDIUM', description: 'Find contiguous subarray with largest product.' },
  defaultApproachId: 'optimized',
  approaches: [
    {
      id: 'brute', label: 'Brute force · all subarrays', complexity: { time: 'O(n²)', space: 'O(1)' },
      code: ['for i: for j≥i: track product of nums[i..j]'],
      steps: [
        arrayStep(1, arr([-2, 0, -1]), [{ name: 'i', index: 0, color: 'accent' }, { name: 'j', index: 2, color: 'secondary' }], [0, 1, 2], { prod: 0 }, 'Subarray [-2,0,-1] product 0 — O(n²) windows.'),
        arrayStep(1, arr([-2, 0, -1]), [{ name: 'i', index: 0, color: 'accent' }, { name: 'j', index: 0, color: 'secondary' }], [0], { best: 0 }, 'Best product 0 for this input.'),
      ],
    },
    {
      id: 'optimized', label: 'Optimized · max/min DP', complexity: { time: 'O(n)', space: 'O(1)' },
      code: ['curMax, curMin ← nums[0]', 'for x: newMax←max(x, curMax*x, curMin*x)', '  track global max'],
      steps: [
        arrayStep(2, arr([2, 3, -2, 4]), [{ name: 'i', index: 1, color: 'accent' }], [1], { curMax: 6, curMin: 3 }, 'At 3: curMax=6.'),
        arrayStep(2, arr([2, 3, -2, 4]), [{ name: 'i', index: 2, color: 'accent' }], [2], { curMin: -12, flip: 'yes' }, 'At -2: negative flips min→max candidate later.'),
        arrayStep(3, arr([2, 3, -2, 4]), [{ name: 'i', index: 3, color: 'accent' }], [3], { answer: 6 }, 'Best product stays 6 (subarray [2,3]).'),
      ],
    },
  ],
};

const palindromicSubstrings: VisualScript = {
  id: 'dsa-dp-12',
  type: 'dsa',
  title: 'Palindromic Substrings',
  meta: { ...META, eyebrow: 'PATTERN · EXPAND / DP', leetcode: 'LeetCode #647', difficulty: 'MEDIUM', description: 'Count how many substrings are palindromes.' },
  defaultApproachId: 'optimized',
  approaches: [
    {
      id: 'brute', label: 'Brute force · check every substring', complexity: { time: 'O(n³)', space: 'O(1)' },
      code: ['for i: for j≥i: if s[i..j] palindrome: count++'],
      steps: [
        stringStep(1, 'aaa', { windowStart: 0, windowEnd: 2, pointers: [{ name: 'L', index: 0, color: 'accent' }, { name: 'R', index: 2, color: 'secondary' }] }, { palin: 'aaa' }, 'Check "aaa" — palindrome. O(n³) total checks.'),
        stringStep(1, 'aaa', { windowStart: 1, windowEnd: 1 }, { palin: 'a' }, 'Single chars count too — 6 total for "aaa".'),
      ],
    },
    {
      id: 'optimized', label: 'Optimized · expand around center', complexity: { time: 'O(n²)', space: 'O(1)' },
      code: ['for center c: expand while palindrome', '  count odd and even centers'],
      steps: [
        stringStep(2, 'aaa', { windowStart: 1, windowEnd: 1, pointers: [{ name: 'c', index: 1, color: 'accent' }] }, { odd: 3 }, 'Center at middle "a": "a", "aaa", "a" → 3 odd palindromes.'),
        stringStep(3, 'aaa', { windowStart: 0, windowEnd: 1, pointers: [{ name: 'c', index: 0, color: 'accent' }] }, { even: 2, total: 6 }, 'Even centers between equal chars add 2 more → 6 total.'),
      ],
    },
  ],
};

const interleavingString: VisualScript = {
  id: 'dsa-dp-13',
  type: 'dsa',
  title: 'Interleaving String',
  meta: { ...META, eyebrow: 'PATTERN · 2D DP', leetcode: 'LeetCode #97', difficulty: 'MEDIUM', description: 'Is s3 formed by interleaving s1 and s2 in order?' },
  defaultApproachId: 'optimized',
  approaches: [
    {
      id: 'brute', label: 'Brute force · backtrack', complexity: { time: 'O(2^(m+n))', space: 'O(m+n)' },
      code: ['pick next char from s1 or s2 if matches s3[i]'],
      steps: [
        stringStep(1, 'aabcc', { pointers: [{ name: 's3', index: 0, color: 'accent' }] }, { s1: 'aab', s2: 'cc' }, 'Try s1[0]=a then branch s1 vs s2 — exponential.'),
        stringStep(1, 'aabcc', {}, { dead: 'many' }, 'Wrong branches retry same (i,j) states.'),
      ],
    },
    {
      id: 'optimized', label: 'Optimized · dp[i][j]', complexity: { time: 'O(m·n)', space: 'O(m·n)' },
      code: ['dp[i][j]=can s1[:i]+s2[:j] match s3[:i+j]?', 'dp[i][j]=(s1[i-1]=s3[k] and dp[i-1][j]) or (s2[j-1]=s3[k] and dp[i][j-1])'],
      steps: [
        dpStep(2, ['s2\\s1', '', 'a', 'a', 'b'], ['', 'c', 'c'], [['T', null, null], [null, null, null], [null, null, null], [null, null, null], [null, null, null]], { init: 'yes' }, 'dp[0][0]=true — empty interleave.', { highlight: [{ row: 1, col: 1 }] }),
        dpStep(3, ['s2\\s1', '', 'a', 'a', 'b'], ['', 'c', 'c'], [['T', 'F', 'F'], ['F', 'T', 'F'], ['F', 'F', 'T'], ['F', 'F', 'F'], ['F', 'F', 'F']], { answer: 'yes' }, 'dp[3][2]=true for s1="aab", s2="cc", s3="aabcc".', { highlight: [{ row: 3, col: 2 }] }),
      ],
    },
  ],
};

const burstBalloons: VisualScript = {
  id: 'dsa-dp-14',
  type: 'dsa',
  title: 'Burst Balloons',
  meta: { ...META, eyebrow: 'PATTERN · INTERVAL DP', leetcode: 'LeetCode #312', difficulty: 'HARD', description: 'Max coins bursting all balloons — coins = left×current×right.' },
  defaultApproachId: 'optimized',
  approaches: [
    {
      id: 'brute', label: 'Brute force · try burst order', complexity: { time: 'O(n·n!)', space: 'O(n)' },
      code: ['try every burst order recursively'],
      steps: [
        arrayStep(1, arr([3, 1, 5, 8]), [{ name: 'burst', index: 1, color: 'accent' }], [1], { coins: '3×1×5=15' }, 'Burst order matters — try all permutations.'),
        arrayStep(1, arr([3, 1, 5, 8]), [], [], { fact: 'n!' }, 'n=4 → 24 orders, each with changing neighbors.'),
      ],
    },
    {
      id: 'optimized', label: 'Optimized · dp[l][r] interval', complexity: { time: 'O(n³)', space: 'O(n²)' },
      code: ['pad with 1; dp[l][r]=max coins in (l,r) exclusive', 'pick last balloon k to burst in interval'],
      steps: [
        dpStep(2, ['l\\r', '0', '1', '2', '3', '4'], ['0', '1', '2', '3', '4'], [[0, 0, 0, 0, 0, 0], [0, 0, 3, null, null, null], [0, 0, null, 35, null, null], [0, 0, null, null, null, null], [0, 0, null, null, null, null], [0, 0, null, null, null, null]], { interval: '(0,4)' }, 'Solve sub-intervals before full range.', { highlight: [{ row: 1, col: 2 }] }),
        dpStep(3, ['l\\r', '0', '1', '2', '3', '4'], ['0', '1', '2', '3', '4'], [[0, 0, 0, 0, 0, 0], [0, 0, 3, 15, 35, null], [0, 0, 0, 35, null, null], [0, 0, 0, 0, null, null], [0, 0, 0, 0, 0, null], [0, 0, 0, 0, 0, 167]], { answer: 167 }, 'dp[0][4]=167 max coins for [3,1,5,8].', { highlight: [{ row: 0, col: 4 }] }),
      ],
    },
  ],
};

const stockCooldown: VisualScript = {
  id: 'dsa-dp-15',
  type: 'dsa',
  title: 'Best Time to Buy and Sell Stock with Cooldown',
  meta: { ...META, eyebrow: 'PATTERN · STATE DP', leetcode: 'LeetCode #309', difficulty: 'MEDIUM', description: 'Max profit with unlimited trades but 1-day cooldown after each sell.' },
  defaultApproachId: 'optimized',
  approaches: [
    {
      id: 'brute', label: 'Brute force · simulate days', complexity: { time: 'O(3ⁿ)', space: 'O(n)' },
      code: ['each day: buy, sell, or rest — track cooldown'],
      steps: [
        arrayStep(1, arr([1, 2, 3, 0, 2]), [{ name: 'd', index: 0, color: 'accent' }], [0], { states: 'buy/sell/rest' }, 'Three choices per day with cooldown constraint — exponential.'),
        arrayStep(1, arr([1, 2, 3, 0, 2]), [], [], { overlap: 'yes' }, 'Same (day, holding, cooldown) states repeat.'),
      ],
    },
    {
      id: 'optimized', label: 'Optimized · hold/sold/rest', complexity: { time: 'O(n)', space: 'O(1)' },
      code: ['hold=max(hold, sold-price)', 'sold=hold+price', 'rest=max(rest, sold)'],
      steps: [
        arrayStep(2, arr([1, 2, 3, 0, 2]), [{ name: 'd', index: 1, color: 'accent' }], [1], { hold: -1, sold: 0, rest: 0 }, 'Day1 price=2: update hold/sold/rest.'),
        arrayStep(3, arr([1, 2, 3, 0, 2]), [{ name: 'd', index: 2, color: 'accent' }], [2], { sold: 2 }, 'Sell at 3 after buy at 1 → profit 2.'),
        arrayStep(3, arr([1, 2, 3, 0, 2]), [{ name: 'd', index: 4, color: 'accent' }], [4], { answer: 3 }, 'Buy 0 sell 2 after cooldown → total 3.'),
      ],
    },
  ],
};

const longestPalindromicSubseq: VisualScript = {
  id: 'dsa-dp-16',
  type: 'dsa',
  title: 'Longest Palindromic Subsequence',
  meta: { ...META, eyebrow: 'PATTERN · INTERVAL DP', leetcode: 'LeetCode #516', difficulty: 'MEDIUM', description: 'Length of longest palindromic subsequence in s.' },
  defaultApproachId: 'optimized',
  approaches: [
    {
      id: 'brute', label: 'Brute force · all subsequences', complexity: { time: 'O(2ⁿ)', space: 'O(n)' },
      code: ['for each subsequence: if palindrome, max len'],
      steps: [
        stringStep(1, 'bbbab', { windowStart: 0, windowEnd: 4 }, { try: 'all 2⁵' }, 'Check every subsequence for palindrome property.'),
        stringStep(1, 'bbbab', { windowStart: 0, windowEnd: 0 }, { best: 'bbbb' }, 'Answer 4 ("bbbb") found after exhaustive search.'),
      ],
    },
    {
      id: 'optimized', label: 'Optimized · dp[l][r]', complexity: { time: 'O(n²)', space: 'O(n²)' },
      code: ['if s[l]=s[r]: dp[l][r]=2+dp[l+1][r-1]', 'else dp[l][r]=max(dp[l+1][r], dp[l][r-1])'],
      steps: [
        dpStep(2, ['i\\j', '0', '1', '2', '3', '4'], ['0', '1', '2', '3', '4'], [[1, null, null, null, null, null], [null, 1, null, null, null, null], [null, null, 1, null, null, null], [null, null, null, 1, null, null], [null, null, null, null, 1, null]], { s: 'bbbab', base: 'len 1' }, 'Single chars have LPS length 1.', { highlight: [{ row: 0, col: 4 }] }),
        dpStep(3, ['i\\j', '0', '1', '2', '3', '4'], ['0', '1', '2', '3', '4'], [[1, 2, 2, 3, 3, 4], [null, 1, 1, 2, 2, 3], [null, null, 1, 1, 1, 1], [null, null, null, 1, 1, 1], [null, null, null, null, 1, 1]], { answer: 4 }, 'dp[0][4]=4 — subsequence "bbbb".', { highlight: [{ row: 0, col: 4 }] }),
      ],
    },
  ],
};

const targetSum: VisualScript = {
  id: 'dsa-dp-17',
  type: 'dsa',
  title: 'Target Sum',
  meta: { ...META, eyebrow: 'PATTERN · SUBSET SUM', leetcode: 'LeetCode #494', difficulty: 'MEDIUM', description: 'Assign +/- to each num to reach target — count ways.' },
  defaultApproachId: 'optimized',
  approaches: [
    {
      id: 'brute', label: 'Brute force · 2ⁿ signs', complexity: { time: 'O(2ⁿ)', space: 'O(n)' },
      code: ['for each +/- assignment: if sum=target, count++'],
      steps: [
        arrayStep(1, arr([1, 1, 1, 1, 1]), [], [], { target: 3, signs: '2⁵' }, 'Try all 32 sign assignments for five 1s.'),
        arrayStep(1, arr([1, 1, 1, 1, 1]), [{ name: '+', index: 0, color: 'accent' }, { name: '+', index: 1, color: 'secondary' }], [0, 1, 2, 3, 4], { sum: '+1+1+1+1-1=3' }, 'One valid assignment — found by exhaustive search.'),
      ],
    },
    {
      id: 'optimized', label: 'Optimized · dp[sum]', complexity: { time: 'O(n·sum)', space: 'O(sum)' },
      code: ['dp[0]=1', 'for num: for s: dp[s+num]+=dp[s]; dp[s-num]+=dp[s]'],
      steps: [
        dpStep(2, ['sum'], ['-5', '-4', '-3', '-2', '-1', '0', '1', '2', '3', '4', '5'], [[1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0]], { after: '1 one' }, 'After first 1: ways to reach ±1.', { highlight: [{ row: 0, col: 6 }] }),
        dpStep(3, ['sum'], ['-5', '-4', '-3', '-2', '-1', '0', '1', '2', '3', '4', '5'], [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10]], { answer: 10 }, 'After five 1s: dp[3]=10 ways to make target 3.', { highlight: [{ row: 0, col: 8 }] }),
      ],
    },
  ],
};

const distinctSubsequences: VisualScript = {
  id: 'dsa-dp-18',
  type: 'dsa',
  title: 'Distinct Subsequences',
  meta: { ...META, eyebrow: 'PATTERN · 2D DP', leetcode: 'LeetCode #115', difficulty: 'HARD', description: 'Count distinct subsequences of s equal to t.' },
  defaultApproachId: 'optimized',
  approaches: [
    {
      id: 'brute', label: 'Brute force · generate subs', complexity: { time: 'O(2^m)', space: 'O(m)' },
      code: ['generate all subsequences of s; count those equal to t'],
      steps: [
        stringStep(1, 'rabbbit', { pointers: [{ name: 'i', index: 0, color: 'accent' }] }, { t: 'rabbit' }, '2⁷ subsequences of rabbbit — filter to t.'),
        stringStep(1, 'rabbit', {}, { count: 3 }, 'Three match — expensive enumeration.'),
      ],
    },
    {
      id: 'optimized', label: 'Optimized · dp[i][j]', complexity: { time: 'O(m·n)', space: 'O(n)' },
      code: ['dp[j]=ways s[:i] forms t[:j]', 'if s[i]=t[j]: dp[j]+=dp[j-1]', 'dp[j]+=dp[j] (skip s[i])'],
      steps: [
        dpStep(2, ['t\\s', '', 'r', 'a', 'b', 'b', 'i', 't'], ['', 'r', 'a', 'b', 'b', 'b', 'i', 't'], [[1, 0, 0, 0, 0, 0, 0], [0, 1, 0, 0, 0, 0, 0], [0, 1, 1, 0, 0, 0, 0], [0, 1, 1, 1, 0, 0, 0], [0, 1, 1, 2, 1, 0, 0], [0, 1, 1, 2, 1, 1, 0], [0, 1, 1, 2, 3, 1, 1], [0, 1, 1, 2, 3, 1, 3]], { fill: 'partial' }, 'Extra "b" in s triples ways at dp[4].', { highlight: [{ row: 4, col: 4 }] }),
        dpStep(3, ['t\\s', '', 'r', 'a', 'b', 'b', 'i', 't'], ['', 'r', 'a', 'b', 'b', 'b', 'i', 't'], [[1, 0, 0, 0, 0, 0, 0], [0, 1, 0, 0, 0, 0, 0], [0, 1, 1, 0, 0, 0, 0], [0, 1, 1, 1, 0, 0, 0], [0, 1, 1, 2, 1, 0, 0], [0, 1, 1, 2, 1, 1, 0], [0, 1, 1, 2, 3, 1, 1], [0, 1, 1, 2, 3, 1, 3]], { answer: 3 }, 'dp[7][6]=3 distinct subsequences.', { highlight: [{ row: 7, col: 6 }] }),
      ],
    },
  ],
};

const russianDollEnvelopes: VisualScript = {
  id: 'dsa-dp-19',
  type: 'dsa',
  title: 'Russian Doll Envelopes',
  meta: { ...META, eyebrow: 'PATTERN · LIS ON SORTED', leetcode: 'LeetCode #354', difficulty: 'HARD', description: 'Max envelopes you can nest (both w and h strictly increase).' },
  defaultApproachId: 'optimized',
  approaches: [
    {
      id: 'brute', label: 'Brute force · pair DP', complexity: { time: 'O(n²)', space: 'O(n)' },
      code: ['sort by width', 'dp[i]=1+max dp[j] where w[j]<w[i] and h[j]<h[i]'],
      steps: [
        arrayStep(1, arr([5, 4, 6, 7]), [{ name: 'i', index: 1, color: 'accent' }, { name: 'j', index: 0, color: 'secondary' }], [0, 1], { env: '[5,4],[6,7]' }, 'After sort by width, check all pairs — O(n²).'),
        arrayStep(1, arr([5, 4, 6, 7]), [], [], { chain: 2 }, 'Best chain length 2 for sample envelopes.'),
      ],
    },
    {
      id: 'optimized', label: 'Optimized · sort + LIS on heights', complexity: { time: 'O(n log n)', space: 'O(n)' },
      code: ['sort by w asc, h desc (equal w)', 'LIS length on heights = answer'],
      steps: [
        arrayStep(2, arr([4, 6, 7]), [{ name: 'h', index: 0, color: 'accent' }], [0], { sorted: '[5,4],[6,7],[7,7]' }, 'Sort widths; reverse equal-w heights to avoid invalid nest.'),
        arrayStep(3, arr([4, 6, 7]), [{ name: 'h', index: 2, color: 'accent' }], [0, 1, 2], { lis: 2 }, 'LIS on heights [4,7,7] → 2 nested dolls.'),
      ],
    },
  ],
};

const eggDropping: VisualScript = {
  id: 'dsa-dp-20',
  type: 'dsa',
  title: 'Egg Dropping',
  meta: { ...META, eyebrow: 'PATTERN · INTERVAL DP', leetcode: 'LeetCode #887', difficulty: 'HARD', description: 'Minimum moves to find critical floor with k eggs and n floors.' },
  defaultApproachId: 'optimized',
  approaches: [
    {
      id: 'brute', label: 'Brute force · try every floor', complexity: { time: 'O(n·2ⁿ)', space: 'O(n·k)' },
      code: ['drop from each floor; recurse with egg break/survive'],
      steps: [
        dpStep(1, ['floor'], ['1', '2', '3', '4', '5', '6'], [[null, null, null, null, null, null]], { k: 2, n: 6 }, 'Without DP each drop splits into two subproblems — exponential.'),
        arrayStep(1, arr([1, 2, 3, 4, 5, 6]), [{ name: 'drop', index: 2, color: 'accent' }], [2], { worst: 'many' }, 'Worst case tries many floors repeatedly.'),
      ],
    },
    {
      id: 'optimized', label: 'Optimized · dp[k][n]', complexity: { time: 'O(k·n²)', space: 'O(k·n)' },
      code: ['dp[k][n]=1+min(max(break, survive)) over floors', 'break=dp[k-1][f-1], survive=dp[k][n-f]'],
      steps: [
        dpStep(2, ['eggs\\floors', '1', '2', '3', '4', '5', '6'], ['1', '2'], [[1, 2, 3, 4, 5, 6], [1, 2, 2, 3, 3, 3]], { k: 2 }, '1 egg: linear search. 2 eggs: dp[2][6]=3.', { highlight: [{ row: 1, col: 5 }] }),
        dpStep(3, ['eggs\\floors', '1', '2', '3', '4', '5', '6'], ['1', '2'], [[1, 2, 3, 4, 5, 6], [1, 2, 2, 3, 3, 3]], { answer: 3 }, 'Optimal strategy finds worst floor in 3 drops.', { highlight: [{ row: 1, col: 5 }] }),
      ],
    },
  ],
};

const minimumPathSum: VisualScript = {
  id: 'dsa-dp-21',
  type: 'dsa',
  title: 'Minimum Path Sum',
  meta: { ...META, eyebrow: 'PATTERN · GRID DP', leetcode: 'LeetCode #64', difficulty: 'MEDIUM', description: 'Min sum path from top-left to bottom-right in grid with non-negative costs.' },
  defaultApproachId: 'optimized',
  approaches: [
    {
      id: 'brute', label: 'Brute force · all paths', complexity: { time: 'O(2^(m+n))', space: 'O(m+n)' },
      code: ['dfs sum path; track minimum reaching bottom-right'],
      steps: [
        gridStep(1, [['1', '3', '1'], ['1', '5', '1'], ['4', '2', '1']], { sum: 'explore' }, 'Each path sums cells — exponential in grid size.', { highlight: [{ row: 0, col: 0 }] }),
        gridStep(1, [['1', '3', '1'], ['1', '5', '1'], ['4', '2', '1']], { best: 7 }, 'Best path 1→3→1→1→1 costs 7.', { path: [{ row: 0, col: 0 }, { row: 0, col: 1 }, { row: 0, col: 2 }, { row: 1, col: 2 }, { row: 2, col: 2 }] }),
      ],
    },
    {
      id: 'optimized', label: 'Optimized · in-place DP', complexity: { time: 'O(m·n)', space: 'O(1)' },
      code: ['dp[r][c]+=min(dp[r-1][c], dp[r][c-1])'],
      steps: [
        gridStep(2, [['1', '4', '2'], ['1', '5', '2'], ['4', '2', '1']], { row: 0 }, 'Fill first row/col with cumulative sums.', { highlight: [{ row: 0, col: 2 }] }),
        gridStep(3, [['1', '4', '2'], ['2', '7', '4'], ['6', '4', '5']], { answer: 7 }, 'Bottom-right dp value 7 is min path sum.', { highlight: [{ row: 2, col: 2 }] }),
      ],
    },
  ],
};

const knapsack01: VisualScript = {
  id: 'dsa-dp-22',
  type: 'dsa',
  title: 'Knapsack 0/1 — classic',
  meta: { ...META, eyebrow: 'PATTERN · 0/1 KNAPSACK', difficulty: 'MEDIUM', description: 'Max value with weight limit W — each item taken at most once.' },
  defaultApproachId: 'optimized',
  approaches: [
    {
      id: 'brute', label: 'Brute force · subsets', complexity: { time: 'O(2ⁿ)', space: 'O(n)' },
      code: ['for each subset: if weight≤W, max value'],
      steps: [
        arrayStep(1, arr([1, 2, 3]), [{ name: 'w', index: 0, color: 'accent' }], [0], { weights: '[1,2,3]', values: '[6,10,12]', W: 5 }, 'Try all 8 subsets for capacity 5.'),
        arrayStep(1, arr([6, 10, 12]), [{ name: 'pick', index: 0, color: 'accent' }, { name: 'pick', index: 1, color: 'secondary' }], [0, 1], { val: 16, wt: 3 }, 'Items 1+2 give value 16, weight 3 — best found by scan.'),
      ],
    },
    {
      id: 'optimized', label: 'Optimized · dp[w]', complexity: { time: 'O(n·W)', space: 'O(W)' },
      code: ['for item i: for w from W down to weight[i]:', '  dp[w]=max(dp[w], dp[w-wt]+val)'],
      steps: [
        dpStep(2, ['cap'], ['0', '1', '2', '3', '4', '5'], [[0, 6, 6, 6, 6, 6]], { item: 'wt1 val6' }, 'After item1: dp[w]=6 for w≥1.', { highlight: [{ row: 0, col: 5 }] }),
        dpStep(3, ['cap'], ['0', '1', '2', '3', '4', '5'], [[0, 6, 10, 16, 16, 16]], { answer: 16 }, 'After all items: dp[5]=16 (items 1+2).', { highlight: [{ row: 0, col: 5 }] }),
      ],
    },
  ],
};

const matrixChainMult: VisualScript = {
  id: 'dsa-dp-23',
  type: 'dsa',
  title: 'Matrix Chain Multiplication intro',
  meta: { ...META, eyebrow: 'PATTERN · INTERVAL DP', difficulty: 'HARD', description: 'Minimum scalar multiplications to multiply chain of matrices.' },
  defaultApproachId: 'optimized',
  approaches: [
    {
      id: 'brute', label: 'Brute force · all parenthesizations', complexity: { time: 'O(4ⁿ/n^1.5)', space: 'O(n)' },
      code: ['try every split point recursively (Catalan)'],
      steps: [
        arrayStep(1, arr([10, 30, 5, 60]), [{ name: 'split', index: 1, color: 'accent' }], [1], { dims: '10×30, 30×5, 5×60' }, 'Try split after each matrix — Catalan many orders.'),
        arrayStep(1, arr([10, 30, 5, 60]), [], [], { overlap: 'yes' }, 'Subchains recomputed without table.'),
      ],
    },
    {
      id: 'optimized', label: 'Optimized · dp[i][j]', complexity: { time: 'O(n³)', space: 'O(n²)' },
      code: ['dp[i][j]=min cost to multiply mats i..j', 'try split k: dp[i][k]+dp[k+1][j]+rows*mid*cols'],
      steps: [
        dpStep(2, ['i\\j', '0', '1', '2'], ['0', '1', '2'], [[0, 1500, null], [null, 0, 900], [null, null, 0]], { chain: '3 mats' }, 'Base: single matrix cost 0; pairs filled first.', { highlight: [{ row: 0, col: 1 }] }),
        dpStep(3, ['i\\j', '0', '1', '2'], ['0', '1', '2'], [[0, 1500, 2700], [null, 0, 900], [null, null, 0]], { answer: 2700 }, 'dp[0][2]=2700 min multiplications.', { highlight: [{ row: 0, col: 2 }] }),
      ],
    },
  ],
};

const regexMatching: VisualScript = {
  id: 'dsa-dp-24',
  type: 'dsa',
  title: 'Regex Matching',
  meta: { ...META, eyebrow: 'PATTERN · STRING DP', leetcode: 'LeetCode #10', difficulty: 'HARD', description: 'Match s against pattern p with . and * (zero or more of preceding).' },
  defaultApproachId: 'optimized',
  approaches: [
    {
      id: 'brute', label: 'Brute force · backtrack *', complexity: { time: 'O(2^(m+n))', space: 'O(m+n)' },
      code: ['match(i,j): try consume or expand x*'],
      steps: [
        stringStep(1, 'aab', { pointers: [{ name: 's', index: 0, color: 'accent' }] }, { p: 'c*a*b' }, 'Star allows 0 repeats — many branches on "c*".'),
        stringStep(1, 'aab', {}, { retry: 'overlap' }, 'Same (i,j) revisited without memo.'),
      ],
    },
    {
      id: 'optimized', label: 'Optimized · dp[i][j]', complexity: { time: 'O(m·n)', space: 'O(m·n)' },
      code: ['dp[i][j]=s[:i] matches p[:j]', 'handle literal, dot, and x* transitions'],
      steps: [
        dpStep(2, ['p\\s', '', 'c', '*', 'a', '*', 'b'], ['', 'a', 'a', 'b'], [['T', 'F', 'F', 'F'], ['F', null, null, null], ['F', null, null, null], ['F', null, null, null], ['F', null, null, null], ['F', null, null, null], ['F', null, null, null]], { init: 'yes' }, 'dp[0][0]=true; empty p needs stars like a*.', { highlight: [{ row: 1, col: 1 }] }),
        dpStep(4, ['p\\s', '', 'c', '*', 'a', '*', 'b'], ['', 'a', 'a', 'b'], [['T', 'F', 'F', 'F'], ['F', 'T', 'F', 'F'], ['F', 'F', 'T', 'F'], ['F', 'F', 'F', 'T'], ['F', 'F', 'F', 'F'], ['F', 'F', 'F', 'F'], ['F', 'F', 'F', 'F']], { answer: 'yes' }, 'dp[3][6]=true — "aab" matches "c*a*b".', { highlight: [{ row: 3, col: 6 }] }),
      ],
    },
  ],
};

const wildcardMatching: VisualScript = {
  id: 'dsa-dp-25',
  type: 'dsa',
  title: 'Wild Card Matching',
  meta: { ...META, eyebrow: 'PATTERN · STRING DP', leetcode: 'LeetCode #44', difficulty: 'HARD', description: 'Match s with pattern p where ? matches one char and * matches any sequence.' },
  defaultApproachId: 'optimized',
  approaches: [
    {
      id: 'brute', label: 'Brute force · backtrack *', complexity: { time: 'O(2^(m+n))', space: 'O(m+n)' },
      code: ['* eats 0..rest chars — branch each length'],
      steps: [
        stringStep(1, 'adceb', { pointers: [{ name: 's', index: 0, color: 'accent' }] }, { p: '*a*b' }, 'Leading * can skip 0,1,2,... chars — exponential branches.'),
        stringStep(1, 'adceb', {}, { dead: 'many' }, 'Without DP, same suffixes re-matched repeatedly.'),
      ],
    },
    {
      id: 'optimized', label: 'Optimized · dp[i][j]', complexity: { time: 'O(m·n)', space: 'O(m·n)' },
      code: ['if p[j-1]="*": dp[i][j]=dp[i][j-1] or dp[i-1][j]', 'else match char or "?"'],
      steps: [
        dpStep(2, ['p\\s', '', '*', 'a', 'b'], ['', 'a', 'd', 'c', 'e', 'b'], [['T', 'T', 'T', 'T', 'T', 'T'], ['F', null, null, null, null, null], ['F', null, null, null, null, null], ['F', null, null, null, null, null]], { star: 'skip' }, 'Row for "*" allows empty match: dp[0][1]=true.', { highlight: [{ row: 0, col: 1 }] }),
        dpStep(3, ['p\\s', '', '*', 'a', 'b'], ['', 'a', 'd', 'c', 'e', 'b'], [['T', 'T', 'T', 'T', 'T', 'T'], ['F', 'T', 'F', 'F', 'F', 'F'], ['F', 'F', 'F', 'F', 'F', 'T'], ['F', 'F', 'F', 'F', 'F', 'F']], { answer: 'yes' }, 'dp[5][3]=true — "adceb" matches "*a*b".', { highlight: [{ row: 5, col: 3 }] }),
      ],
    },
  ],
};

export const DP_SCRIPTS: Record<string, VisualScript> = {
  'dp-1': climbingStairs,
  'dp-2': houseRobber,
  'dp-3': coinChange,
  'dp-4': lis,
  'dp-5': wordBreak,
  'dp-6': uniquePaths,
  'dp-7': editDistance,
  'dp-8': lcs,
  'dp-9': partitionEqualSubset,
  'dp-10': decodeWays,
  'dp-11': maxProductSubarray,
  'dp-12': palindromicSubstrings,
  'dp-13': interleavingString,
  'dp-14': burstBalloons,
  'dp-15': stockCooldown,
  'dp-16': longestPalindromicSubseq,
  'dp-17': targetSum,
  'dp-18': distinctSubsequences,
  'dp-19': russianDollEnvelopes,
  'dp-20': eggDropping,
  'dp-21': minimumPathSum,
  'dp-22': knapsack01,
  'dp-23': matrixChainMult,
  'dp-24': regexMatching,
  'dp-25': wildcardMatching,
};
