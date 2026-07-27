import type { VisualScript } from '@/types/visual-script';
import { arr, arrayStep, gridStep, stackStep, stringStep } from './helpers';

const META = {
  section: 'Backtracking',
  companies: ['Amazon', 'Google', 'Meta'],
};

const subsets: VisualScript = {
  id: 'dsa-bk-1',
  type: 'dsa',
  title: 'Subsets',
  meta: {
    ...META,
    eyebrow: 'PATTERN · INCLUDE / EXCLUDE',
    leetcode: 'LeetCode #78',
    difficulty: 'MEDIUM',
    description: 'Return all subsets of nums with no duplicates. At each index, choose to include nums[i] or skip it.',
  },
  defaultApproachId: 'optimized',
  approaches: [
    {
      id: 'brute',
      label: 'Brute force · bitmask all',
      complexity: { time: 'O(n·2^n)', space: 'O(n)' },
      code: ['for mask 0..2^n-1:', '  build subset where bit i set'],
      steps: [
        arrayStep(1, arr([1, 2, 3]), [], [0], { mask: '000' }, 'Mask 000 → subset [].'),
        arrayStep(1, arr([1, 2, 3]), [], [0, 2], { mask: '101' }, 'Mask 101 → subset [1,3]. Enumerate all 2^n masks.'),
        arrayStep(2, arr([1, 2, 3]), [], [], { count: 8 }, 'Eight subsets total for n=3.'),
      ],
    },
    {
      id: 'optimized',
      label: 'Optimized · backtracking',
      complexity: { time: 'O(n·2^n)', space: 'O(n)' },
      code: ['dfs(i, path):', '  if i=n: record path', '  dfs(i+1, path)', '  dfs(i+1, path+[nums[i]])'],
      steps: [
        arrayStep(2, arr([1, 2, 3]), [{ name: 'i', index: 0, color: 'accent' }], [0], { path: '[]' }, 'i=0: skip branch stays [].'),
        arrayStep(2, arr([1, 2, 3]), [{ name: 'i', index: 0, color: 'accent' }], [0], { path: '[1]' }, 'Include 1 → path [1], recurse i=1.'),
        arrayStep(3, arr([1, 2, 3]), [{ name: 'i', index: 2, color: 'accent' }], [0, 2], { path: '[1,3]' }, 'Choices at each level build all subsets without explicit bitmask.'),
      ],
    },
  ],
};

const subsetsII: VisualScript = {
  id: 'dsa-bk-2',
  type: 'dsa',
  title: 'Subsets II',
  meta: {
    ...META,
    eyebrow: 'PATTERN · SORT + SKIP DUPES',
    leetcode: 'LeetCode #90',
    difficulty: 'MEDIUM',
    description: 'Subsets with duplicates. Sort first; at each level skip nums[i] when nums[i]==nums[i-1] and not chosen at this depth.',
  },
  defaultApproachId: 'optimized',
  approaches: [
    {
      id: 'brute',
      label: 'Brute force · bitmask + dedupe set',
      complexity: { time: 'O(n·2^n)', space: 'O(n)' },
      code: ['generate all bitmask subsets', 'sort each; store in set'],
      steps: [
        arrayStep(1, arr([1, 2, 2]), [], [0, 1, 2], { dup: 'two 2s' }, 'Bitmask may produce [1,2] twice from different 2s.'),
        arrayStep(2, arr([1, 2]), [], [0, 1], { dedupe: 'set' }, 'Use set of sorted tuples to dedupe — extra work.'),
      ],
    },
    {
      id: 'optimized',
      label: 'Optimized · backtrack + skip',
      complexity: { time: 'O(n·2^n)', space: 'O(n)' },
      code: ['sort nums', 'dfs(i, path):', '  if i=n: record', '  dfs(i+1, path)', '  skip equal nums[i] at same depth'],
      steps: [
        arrayStep(1, arr([1, 2, 2]), [{ name: 'i', index: 1, color: 'accent' }], [1], { sorted: 'yes' }, 'Sorted [1,2,2]. At i=1 pick first 2.'),
        arrayStep(2, arr([1, 2, 2]), [{ name: 'i', index: 2, color: 'accent' }], [1, 2], { skip: '2nd 2' }, 'At i=2 skip duplicate 2 when previous 2 not taken at this depth.'),
        arrayStep(3, arr([1, 2, 2]), [], [], { ans: '[ [],[1],[1,2],[1,2,2],[2],[2,2] ]' }, 'Six unique subsets without duplicate paths.'),
      ],
    },
  ],
};

const permutations: VisualScript = {
  id: 'dsa-bk-3',
  type: 'dsa',
  title: 'Permutations',
  meta: {
    ...META,
    eyebrow: 'PATTERN · SWAP / USED',
    leetcode: 'LeetCode #46',
    difficulty: 'MEDIUM',
    description: 'All permutations of distinct nums. Track used array; at each position try every unused value.',
  },
  defaultApproachId: 'optimized',
  approaches: [
    {
      id: 'brute',
      label: 'Brute force · next_permutation loop',
      complexity: { time: 'O(n·n!)', space: 'O(n)' },
      code: ['sort nums', 'do: record nums', 'while next_permutation(nums)'],
      steps: [
        arrayStep(1, arr([1, 2, 3]), [], [0, 1, 2], { perm: '123' }, 'Start sorted [1,2,3], iterate std::next_permutation.'),
        arrayStep(2, arr([1, 3, 2]), [], [0, 1, 2], { perm: '132' }, 'Six permutations total — library rotation trick.'),
      ],
    },
    {
      id: 'optimized',
      label: 'Optimized · backtracking',
      complexity: { time: 'O(n·n!)', space: 'O(n)' },
      code: ['dfs(path, used):', '  if len(path)=n: record', '  for j unused: used[j]=true; dfs; undo'],
      steps: [
        arrayStep(2, arr([1, 2, 3]), [{ name: 'p', index: 0, color: 'accent' }], [0], { path: '[1]' }, 'Pick 1 first — used={1}.'),
        arrayStep(2, arr([1, 2, 3]), [{ name: 'p', index: 1, color: 'accent' }], [0, 1], { path: '[1,2]' }, 'Then 2 → [1,2], only 3 left.'),
        arrayStep(3, arr([1, 2, 3]), [], [0, 1, 2], { path: '[1,2,3]' }, 'Complete permutation — backtrack and try other branches.'),
      ],
    },
  ],
};

const combinationSum: VisualScript = {
  id: 'dsa-bk-4',
  type: 'dsa',
  title: 'Combination Sum',
  meta: {
    ...META,
    eyebrow: 'PATTERN · REUSE CANDIDATES',
    leetcode: 'LeetCode #39',
    difficulty: 'MEDIUM',
    description: 'Find combinations summing to target; same number may be reused. Start dfs from index i to allow reuse.',
  },
  defaultApproachId: 'optimized',
  approaches: [
    {
      id: 'brute',
      label: 'Brute force · bounded depth search',
      complexity: { time: 'O(n^(t/min))', space: 'O(t/min)' },
      code: ['try all sequences of picks until sum≥target'],
      steps: [
        arrayStep(1, arr([2, 3, 6, 7]), [{ name: 's', index: 0, color: 'accent' }], [0], { target: 7, sum: 2 }, 'Pick 2 repeatedly: 2+2+2+2 overshoots — explore many paths.'),
        arrayStep(2, arr([2, 3, 6, 7]), [{ name: 's', index: 2, color: 'accent' }], [0, 2], { sum: 7 }, 'Find 2+2+3 and 7 — brute explores redundant orderings.'),
      ],
    },
    {
      id: 'optimized',
      label: 'Optimized · backtrack from i',
      complexity: { time: 'O(n^(t/min))', space: 'O(t/min)' },
      code: ['dfs(i, rem, path):', '  if rem=0: record', '  if rem<0: return', '  for j≥i: dfs(j, rem-c[j], path+c[j])'],
      steps: [
        arrayStep(2, arr([2, 3, 6, 7]), [{ name: 'i', index: 0, color: 'accent' }], [0], { rem: 5, path: '[2]' }, 'Take 2, remain 5 — reuse from index 0.'),
        arrayStep(2, arr([2, 3, 6, 7]), [{ name: 'i', index: 1, color: 'accent' }], [0, 1], { rem: 2, path: '[2,3]' }, 'Add 3 → remain 2, reuse 2 again.'),
        arrayStep(3, arr([2, 3, 6, 7]), [], [], { ans: '[[2,2,3],[7]]' }, 'Prune when rem<0; combinations avoid duplicate orderings.'),
      ],
    },
  ],
};

const generateParentheses: VisualScript = {
  id: 'dsa-bk-5',
  type: 'dsa',
  title: 'Generate Parentheses',
  meta: {
    ...META,
    eyebrow: 'PATTERN · OPEN/CLOSE BALANCE',
    leetcode: 'LeetCode #22',
    difficulty: 'MEDIUM',
    description: 'Generate all valid combinations of n pairs. Add `(` if open<n; add `)` if close<open.',
  },
  defaultApproachId: 'optimized',
  approaches: [
    {
      id: 'brute',
      label: 'Brute force · filter all strings',
      complexity: { time: 'O(4^n)', space: 'O(n)' },
      code: ['generate all 2^(2n) strings of ( and )', 'keep valid ones'],
      steps: [
        stackStep(1, '((()))', 0, [], { n: 3 }, 'Generate all 64 strings of length 6 — most invalid.', { status: 'many invalid' }),
        stackStep(2, '()()()', 0, [], { valid: 'yes' }, 'Only Catalan(3)=5 strings pass balance check.'),
      ],
    },
    {
      id: 'optimized',
      label: 'Optimized · backtracking',
      complexity: { time: 'O(4^n/√n)', space: 'O(n)' },
      code: ['dfs(open, close, s):', '  if len(s)=2n: record', '  if open<n: add (', '  if close<open: add )'],
      steps: [
        stackStep(2, '(', 1, ['('], { open: 1, close: 0 }, 'Start with `(`. open=1, close=0.', { stackLabel: 'built', status: 'open < n → can add (' }),
        stackStep(2, '(()', 3, ['(', '('], { open: 2, close: 1 }, 'Add second `(`. Must balance with `)` before exceeding open.', { stackLabel: 'built' }),
        stackStep(3, '()()', 4, ['(', ')', '(', ')'], { done: 2 }, 'Complete n=2 pair strings: ()(), (()). Only valid branches kept.', { stackLabel: 'built', status: '5 strings for n=3' }),
      ],
    },
  ],
};

const wordSearch: VisualScript = {
  id: 'dsa-bk-6',
  type: 'dsa',
  title: 'Word Search',
  meta: {
    ...META,
    eyebrow: 'PATTERN · GRID DFS',
    leetcode: 'LeetCode #79',
    difficulty: 'MEDIUM',
    description: 'Find word in 2D board by adjacent cells. DFS from each cell; mark visited, backtrack unmark.',
  },
  defaultApproachId: 'optimized',
  approaches: [
    {
      id: 'brute',
      label: 'Brute force · try all paths',
      complexity: { time: 'O(m·n·4^L)', space: 'O(L)' },
      code: ['for each cell as start:', '  explore all paths length L'],
      steps: [
        gridStep(1, [['A', 'B', 'C', 'E'], ['S', 'F', 'C', 'S'], ['A', 'D', 'E', 'E']], { word: 'ABCCED' }, 'Board 3×4. Try starting from every cell.', { highlight: [{ row: 0, col: 0 }], label: 'start A' }),
        gridStep(2, [['A', 'B', 'C', 'E'], ['S', 'F', 'C', 'S'], ['A', 'D', 'E', 'E']], { path: 'ABCCED' }, 'Path A→B→C→C→E→D exists — many dead ends explored too.', { path: [{ row: 0, col: 0 }, { row: 0, col: 1 }, { row: 0, col: 2 }, { row: 1, col: 2 }, { row: 2, col: 2 }, { row: 2, col: 1 }] }),
      ],
    },
    {
      id: 'optimized',
      label: 'Optimized · DFS + backtrack',
      complexity: { time: 'O(m·n·4^L)', space: 'O(L)' },
      code: ['dfs(r,c,i):', '  if i=len(word): true', '  mark visited', '  try 4 neighbors; unmark'],
      steps: [
        gridStep(1, [['A', 'B', 'C', 'E'], ['S', 'F', 'C', 'S'], ['A', 'D', 'E', 'E']], { i: 0, ch: 'A' }, 'Match word[0]=A at (0,0).', { highlight: [{ row: 0, col: 0 }], label: 'match A' }),
        gridStep(2, [['A', 'B', 'C', 'E'], ['S', 'F', 'C', 'S'], ['A', 'D', 'E', 'E']], { i: 2, ch: 'C' }, 'Extend to B then C along row 0.', { visited: [{ row: 0, col: 0 }, { row: 0, col: 1 }, { row: 0, col: 2 }], highlight: [{ row: 0, col: 2 }] }),
        gridStep(3, [['A', 'B', 'C', 'E'], ['S', 'F', 'C', 'S'], ['A', 'D', 'E', 'E']], { found: 'ABCCED' }, 'Backtrack from dead ends; complete path found → true.', { path: [{ row: 0, col: 0 }, { row: 0, col: 1 }, { row: 0, col: 2 }, { row: 1, col: 2 }, { row: 2, col: 2 }, { row: 2, col: 1 }] }),
      ],
    },
  ],
};

const nQueens: VisualScript = {
  id: 'dsa-bk-7',
  type: 'dsa',
  title: 'N-Queens',
  meta: {
    ...META,
    eyebrow: 'PATTERN · ROW PLACEMENT',
    leetcode: 'LeetCode #51',
    difficulty: 'HARD',
    description: 'Place n queens on n×n board with no attacks. Place one queen per row; track cols and diagonals.',
  },
  defaultApproachId: 'optimized',
  approaches: [
    {
      id: 'brute',
      label: 'Brute force · all queen placements',
      complexity: { time: 'O(C(n²,n))', space: 'O(n)' },
      code: ['try all ways to pick n squares from n²', 'check no shared row/col/diag'],
      steps: [
        gridStep(1, [['.', '.', '.', '.'], ['.', '.', '.', '.'], ['.', '.', '.', '.'], ['.', '.', '.', '.']], { n: 4 }, 'Try combinatorial placements — vast search space.', { label: '4×4 board' }),
        gridStep(2, [['Q', '.', '.', '.'], ['.', '.', '.', 'Q'], ['.', 'Q', '.', '.'], ['.', '.', 'Q', '.']], { valid: 'yes' }, 'One valid solution among many checked placements.'),
      ],
    },
    {
      id: 'optimized',
      label: 'Optimized · backtrack by row',
      complexity: { time: 'O(n!)', space: 'O(n)' },
      code: ['dfs(row):', '  for col:', '    if safe(row,col): place; dfs(row+1); remove'],
      steps: [
        gridStep(1, [['Q', '.', '.', '.'], ['.', '.', '.', '.'], ['.', '.', '.', '.'], ['.', '.', '.', '.']], { row: 0 }, 'Row 0: try col 0 — queen placed.', { highlight: [{ row: 0, col: 0 }] }),
        gridStep(2, [['Q', '.', '.', '.'], ['.', '.', '.', 'Q'], ['.', '.', '.', '.'], ['.', '.', '.', '.']], { row: 1 }, 'Row 1: cols/diags block many cols — try col 3.', { highlight: [{ row: 1, col: 3 }] }),
        gridStep(3, [['Q', '.', '.', '.'], ['.', '.', '.', 'Q'], ['.', 'Q', '.', '.'], ['.', '.', '.', 'Q']], { solutions: 2 }, 'Complete valid board — 2 solutions for n=4.', { path: [{ row: 0, col: 0 }, { row: 1, col: 3 }, { row: 2, col: 1 }, { row: 3, col: 2 }] }),
      ],
    },
  ],
};

const sudoku: VisualScript = {
  id: 'dsa-bk-8',
  type: 'dsa',
  title: 'Sudoku Solver',
  meta: {
    ...META,
    eyebrow: 'PATTERN · CONSTRAINT PROPAGATION',
    leetcode: 'LeetCode #37',
    difficulty: 'HARD',
    description: 'Fill empty cells 1–9 with row, column, and 3×3 box uniqueness. Find empty, try digits, backtrack on conflict.',
  },
  defaultApproachId: 'optimized',
  approaches: [
    {
      id: 'brute',
      label: 'Brute force · try all fills',
      complexity: { time: 'O(9^m)', space: 'O(m)' },
      code: ['for each empty cell try 1..9', 'backtrack on first complete invalid board'],
      steps: [
        gridStep(1, [['5', '3', '.', '.', '7', '.', '.', '.', '.'], ['6', '.', '.', '1', '9', '5', '.', '.', '.'], ['.', '9', '8', '.', '.', '.', '.', '6', '.']], { empty: 'many' }, 'Classic puzzle — naive trial of all 9 choices per empty.', { label: 'partial board' }),
        gridStep(2, [['5', '3', '4', '6', '7', '8', '9', '1', '2']], { conflict: 'row dup' }, 'Random fill hits row conflict quickly — backtrack.', { highlight: [{ row: 0, col: 2 }] }),
      ],
    },
    {
      id: 'optimized',
      label: 'Optimized · backtrack + validity check',
      complexity: { time: 'O(9^m)', space: 'O(1)' },
      code: ['find next empty (r,c)', 'for d in 1..9:', '  if valid(r,c,d): board[r][c]=d', '    if solve(): true', '  board[r][c]="."'],
      steps: [
        gridStep(1, [['5', '3', '.', '.', '7', '.', '.', '.', '.'], ['6', '.', '.', '1', '9', '5', '.', '.', '.'], ['.', '9', '8', '.', '.', '.', '.', '6', '.']], { cell: '(0,2)' }, 'First empty (0,2). Only 4,6,8,9 possible after checks.', { highlight: [{ row: 0, col: 2 }], label: 'next empty' }),
        gridStep(2, [['5', '3', '4', '.', '7', '.', '.', '.', '.'], ['6', '.', '.', '1', '9', '5', '.', '.', '.'], ['.', '9', '8', '.', '.', '.', '.', '6', '.']], { try: 4 }, 'Place 4 at (0,2) — valid. Recurse to next empty.', { highlight: [{ row: 0, col: 2 }] }),
        gridStep(3, [['5', '3', '4', '6', '7', '8', '9', '1', '2'], ['6', '7', '2', '1', '9', '5', '3', '4', '8'], ['1', '9', '8', '3', '4', '2', '5', '6', '7']], { solved: 'yes' }, 'Backtrack dead ends; propagate until full valid grid.', { label: 'solved' }),
      ],
    },
  ],
};

const palindromePartitioning: VisualScript = {
  id: 'dsa-bk-9',
  type: 'dsa',
  title: 'Palindrome Partitioning',
  meta: {
    ...META,
    eyebrow: 'PATTERN · CUT + CHECK',
    leetcode: 'LeetCode #131',
    difficulty: 'MEDIUM',
    description: 'Partition s so every substring is a palindrome. Try every cut position from start; recurse on remainder.',
  },
  defaultApproachId: 'optimized',
  approaches: [
    {
      id: 'brute',
      label: 'Brute force · all cut sets',
      complexity: { time: 'O(n·2^n)', space: 'O(n)' },
      code: ['for each bitmask of cut positions:', '  split s; check all parts palindrome'],
      steps: [
        stringStep(1, 'aab', {}, { cuts: 'after 0,1' }, 'Try cuts at different positions — split and verify each part.'),
        stringStep(2, 'aab', {}, { parts: 'a|a|b fail' }, 'Cut a|a|b — "b" ok but earlier invalid partitions pruned late.'),
      ],
    },
    {
      id: 'optimized',
      label: 'Optimized · backtrack + pal check',
      complexity: { time: 'O(n·2^n)', space: 'O(n)' },
      code: ['dfs(start, path):', '  for end in start..n-1:', '    if s[start:end+1] palindrome:', '      dfs(end+1, path+part)'],
      steps: [
        stringStep(2, 'aab', { windowStart: 0, windowEnd: 0, pointers: [{ name: 'cut', index: 0, color: 'accent' }] }, { part: 'a' }, 'Start=0: "a" palindrome → recurse from index 1.'),
        stringStep(2, 'aab', { windowStart: 1, windowEnd: 1, pointers: [{ name: 'cut', index: 1, color: 'accent' }] }, { part: 'a' }, 'From 1: "a" again palindrome → remainder "b".'),
        stringStep(3, 'aab', {}, { ans: '[["a","a","b"],["aa","b"]]' }, 'Also cut "aa" at start — collect all palindrome partitions.'),
      ],
    },
  ],
};

const letterCombinations: VisualScript = {
  id: 'dsa-bk-10',
  type: 'dsa',
  title: 'Letter Combinations of a Phone Number',
  meta: {
    ...META,
    eyebrow: 'PATTERN · DIGIT → LETTERS',
    leetcode: 'LeetCode #17',
    difficulty: 'MEDIUM',
    description: 'Map digits 2–9 to phone letters. Backtrack building string one digit at a time.',
  },
  defaultApproachId: 'optimized',
  approaches: [
    {
      id: 'brute',
      label: 'Brute force · nested loops',
      complexity: { time: 'O(4^n)', space: 'O(n)' },
      code: ['for each letter on digit0:', '  for each on digit1: ...'],
      steps: [
        stringStep(1, '23', {}, { map: '2→abc,3→def' }, 'Digits "23" — triple nested loops for general length.'),
        stringStep(2, 'ad', {}, { combo: 'ad' }, 'One of 3×3=9 combinations from nested iteration.'),
      ],
    },
    {
      id: 'optimized',
      label: 'Optimized · backtracking',
      complexity: { time: 'O(4^n)', space: 'O(n)' },
      code: ['dfs(i, path):', '  if i=len: record', '  for c in map[digits[i]]:', '    dfs(i+1, path+c)'],
      steps: [
        stringStep(2, '23', { windowStart: 0, windowEnd: 0, pointers: [{ name: 'i', index: 0, color: 'accent' }] }, { pick: 'a' }, 'Digit 2 → try a, b, c on first branch.'),
        stringStep(2, '23', { windowStart: 1, windowEnd: 1, pointers: [{ name: 'i', index: 1, color: 'accent' }] }, { pick: 'd' }, 'Append digit 3 letters → "ad".'),
        stringStep(3, '23', {}, { ans: '["ad","ae","af","bd","be","bf","cd","ce","cf"]' }, 'All 9 combos from systematic DFS.'),
      ],
    },
  ],
};

const restoreIp: VisualScript = {
  id: 'dsa-bk-11',
  type: 'dsa',
  title: 'Restore IP Addresses',
  meta: {
    ...META,
    eyebrow: 'PATTERN · 4 SEGMENTS',
    leetcode: 'LeetCode #93',
    difficulty: 'MEDIUM',
    description: 'Split digit string into 4 valid IP octets (0–255, no leading zeros). Backtrack placing dots after 1–3 digits.',
  },
  defaultApproachId: 'optimized',
  approaches: [
    {
      id: 'brute',
      label: 'Brute force · all dot positions',
      complexity: { time: 'O(3^4)', space: 'O(1)' },
      code: ['try 3 cut positions among digits', 'validate each segment'],
      steps: [
        stringStep(1, '25525511135', {}, { try: '2.5.525.11135' }, 'Bad cuts produce invalid octets >255 or bad leading zeros.'),
        stringStep(2, '25525511135', {}, { filter: 'valid only' }, 'Check each of O(3^3) dot placements — many invalid.'),
      ],
    },
    {
      id: 'optimized',
      label: 'Optimized · backtrack segments',
      complexity: { time: 'O(3^4)', space: 'O(1)' },
      code: ['dfs(start, parts):', '  if parts=4 and start=n: record', '  for len 1..3:', '    if valid octet: dfs(start+len, parts+1)'],
      steps: [
        stringStep(2, '25525511135', { windowStart: 0, windowEnd: 2, pointers: [{ name: 'seg', index: 0, color: 'accent' }] }, { seg1: '255' }, 'First octet "255" valid. 3 segments remain.'),
        stringStep(2, '25525511135', { windowStart: 3, windowEnd: 5 }, { seg2: '255' }, 'Second octet "255". Continue building.'),
        stringStep(3, '25525511135', {}, { ans: '["255.255.11.135","255.255.111.35"]' }, 'Prune leading-zero and >255 segments early.'),
      ],
    },
  ],
};

const wordBreakII: VisualScript = {
  id: 'dsa-bk-12',
  type: 'dsa',
  title: 'Word Break II',
  meta: {
    ...META,
    eyebrow: 'PATTERN · SEGMENT + DICT',
    leetcode: 'LeetCode #140',
    difficulty: 'HARD',
    description: 'Return all sentences where each word is in dictionary. Backtrack from start; try every dict word prefix.',
  },
  defaultApproachId: 'optimized',
  approaches: [
    {
      id: 'brute',
      label: 'Brute force · all splits',
      complexity: { time: 'O(2^n)', space: 'O(n)' },
      code: ['generate every substring split', 'filter where all parts in wordDict'],
      steps: [
        stringStep(1, 'catsanddog', {}, { dict: 'cat,cats,and,sand,dog' }, 'Try all ways to cut "catsanddog" into substrings.'),
        stringStep(2, 'catsanddog', {}, { bad: 'catsand|dog' }, 'Many cuts fail dict lookup — generate then filter.'),
      ],
    },
    {
      id: 'optimized',
      label: 'Optimized · backtracking',
      complexity: { time: 'O(2^n)', space: 'O(n)' },
      code: ['dfs(start, path):', '  if start=n: record sentence', '  for end>start:', '    if s[start:end] in dict: dfs(end, path+word)'],
      steps: [
        stringStep(2, 'catsanddog', { windowStart: 0, windowEnd: 3, pointers: [{ name: 'w', index: 0, color: 'accent' }] }, { word: 'cats' }, '"cats" in dict — recurse from index 4.'),
        stringStep(2, 'catsanddog', { windowStart: 0, windowEnd: 2 }, { word: 'cat' }, 'Also branch "cat" — leads to different sentences.'),
        stringStep(3, 'catsanddog', {}, { ans: '["cats and dog","cat sand dog"]' }, 'Collect "cats and dog" and "cat sand dog".'),
      ],
    },
  ],
};

const partitionKEqual: VisualScript = {
  id: 'dsa-bk-13',
  type: 'dsa',
  title: 'Partition to K Equal Sum Subsets',
  meta: {
    ...META,
    eyebrow: 'PATTERN · K BUCKETS',
    leetcode: 'LeetCode #698',
    difficulty: 'MEDIUM',
    description: 'Split nums into k subsets with equal sum. If total not divisible by k, impossible. Backtrack placing nums into buckets.',
  },
  defaultApproachId: 'optimized',
  approaches: [
    {
      id: 'brute',
      label: 'Brute force · assign each num to bucket',
      complexity: { time: 'O(k^n)', space: 'O(n)' },
      code: ['for each num try bucket 0..k-1', 'check all sums equal at end'],
      steps: [
        arrayStep(1, arr([4, 3, 2, 3, 5, 2, 1]), [], [], { k: 4, target: 8 }, 'Target subset sum = 32/4 = 8. Try arbitrary bucket assignments.'),
        arrayStep(2, arr([4, 3, 2, 3, 5, 2, 1]), [{ name: 'b0', index: 0, color: 'accent' }], [0, 1, 2, 3], { b0: '4+3+1=8' }, 'One bucket might reach 8 — search all assignments.'),
      ],
    },
    {
      id: 'optimized',
      label: 'Optimized · backtrack + prune',
      complexity: { time: 'O(k·2^n)', space: 'O(n)' },
      code: ['sort nums desc', 'buckets[k]', 'dfs(i): place nums[i] in first bucket that fits', 'prune equal bucket states'],
      steps: [
        arrayStep(2, arr([5, 4, 3, 3, 2, 2, 1]), [{ name: 'i', index: 0, color: 'accent' }], [0], { place: 5 }, 'Place largest 5 first — sort desc for early fail.'),
        arrayStep(2, arr([5, 4, 3, 3, 2, 2, 1]), [{ name: 'b', index: 1, color: 'accent' }], [0, 1], { b1: '4+3+1' }, 'Fill buckets to target 8; skip symmetric bucket swaps.'),
        arrayStep(3, arr([5, 4, 3, 3, 2, 2, 1]), [], [], { ans: 'true' }, 'All seven numbers partition into four sums of 8.'),
      ],
    },
  ],
};

const matchsticksSquare: VisualScript = {
  id: 'dsa-bk-14',
  type: 'dsa',
  title: 'Matchsticks to Square',
  meta: {
    ...META,
    eyebrow: 'PATTERN · 4 SIDES k=4',
    leetcode: 'LeetCode #473',
    difficulty: 'MEDIUM',
    description: 'Can matchsticks form a square? Same as k=4 equal subsets with side = sum/4.',
  },
  defaultApproachId: 'optimized',
  approaches: [
    {
      id: 'brute',
      label: 'Brute force · permute sides',
      complexity: { time: 'O(4^n)', space: 'O(n)' },
      code: ['assign each stick to side 0..3', 'check all sides equal'],
      steps: [
        arrayStep(1, arr([1, 1, 2, 2, 2]), [], [0, 1, 2, 3, 4], { sides: '????' }, 'Five sticks — try assigning each to one of four sides.'),
        arrayStep(2, arr([1, 1, 2, 2, 2]), [], [], { side: 3 }, 'Need each side sum = 6 — brute assigns stick by stick.'),
      ],
    },
    {
      id: 'optimized',
      label: 'Optimized · backtrack buckets',
      complexity: { time: 'O(4^n)', space: 'O(n)' },
      code: ['if sum%4: false', 'target ← sum/4', 'dfs place sticks into 4 buckets ≤ target'],
      steps: [
        arrayStep(1, arr([1, 1, 2, 2, 2]), [], [], { target: 6 }, 'Total 24 → side length 6. Sort sticks descending.'),
        arrayStep(2, arr([2, 2, 2, 1, 1]), [{ name: 's', index: 0, color: 'accent' }], [0], { side0: 2 }, 'Place stick 2 on side0. Continue filling to 6.'),
        arrayStep(3, arr([2, 2, 2, 1, 1]), [], [], { ans: 'true' }, 'Partition [1,1,2,2,2] → sides 6+6+6+6 square.'),
      ],
    },
  ],
};

const expressionAddOperators: VisualScript = {
  id: 'dsa-bk-15',
  type: 'dsa',
  title: 'Expression Add Operators',
  meta: {
    ...META,
    eyebrow: 'PATTERN · OPS + MULT FIXUP',
    leetcode: 'LeetCode #282',
    difficulty: 'HARD',
    description: 'Insert +, -, or * between digits to evaluate to target. Track prev operand to undo multiplication on backtrack.',
  },
  defaultApproachId: 'optimized',
  approaches: [
    {
      id: 'brute',
      label: 'Brute force · try all op placements',
      complexity: { time: 'O(4^n)', space: 'O(n)' },
      code: ['for each slot choose + - * or concat', 'evaluate left-to-right with * precedence'],
      steps: [
        stringStep(1, '123', {}, { target: 6 }, 'Insert ops in "123" — many evaluate differently.'),
        stringStep(2, '1+2+3', {}, { val: 6 }, 'Brute finds 1+2+3=6 among all op combinations.'),
      ],
    },
    {
      id: 'optimized',
      label: 'Optimized · backtrack + running total',
      complexity: { time: 'O(4^n)', space: 'O(n)' },
      code: ['dfs(i, path, total, prev):', '  try + - * on next number', '  * uses total-prev+prev*num'],
      steps: [
        stringStep(2, '123', { windowStart: 0, windowEnd: 0 }, { total: 1, prev: 1 }, 'Start with first num 1. Try +2 → total 3.'),
        stringStep(2, '123', { windowStart: 0, windowEnd: 2 }, { total: 3, prev: 2 }, 'Path "1+2" total=3. Append +3 → 6 hits target.'),
        stringStep(3, '123', {}, { ans: '["1+2+3"]', target: 6 }, 'Also handle * precedence: 2*3 grouped correctly with prev operand.'),
      ],
    },
  ],
};

export const BACKTRACKING_SCRIPTS: Record<string, VisualScript> = {
  'bk-1': subsets,
  'bk-2': subsetsII,
  'bk-3': permutations,
  'bk-4': combinationSum,
  'bk-5': generateParentheses,
  'bk-6': wordSearch,
  'bk-7': nQueens,
  'bk-8': sudoku,
  'bk-9': palindromePartitioning,
  'bk-10': letterCombinations,
  'bk-11': restoreIp,
  'bk-12': wordBreakII,
  'bk-13': partitionKEqual,
  'bk-14': matchsticksSquare,
  'bk-15': expressionAddOperators,
};
