import type { VisualScript } from '@/types/visual-script';
import { arr, arrayStep, intervalStep, stackStep, stringStep } from './helpers';

const META = {
  section: 'Greedy Algorithm',
  companies: ['Amazon', 'Google', 'Microsoft'],
};

const assignCookies: VisualScript = {
  id: 'dsa-g-1',
  type: 'dsa',
  title: 'Assign Cookies',
  meta: {
    ...META,
    eyebrow: 'PATTERN · SORT + TWO POINTERS',
    leetcode: 'LeetCode #455',
    difficulty: 'EASY',
    description: 'Maximize children fed: each child needs g[i] cookies, each cookie s[j] satisfies one child if s[j]≥g[i].',
  },
  defaultApproachId: 'optimized',
  approaches: [
    {
      id: 'brute',
      label: 'Brute force · try each cookie per child',
      complexity: { time: 'O(n·m)', space: 'O(1)' },
      code: ['for each child:', '  find smallest unused cookie that fits'],
      steps: [
        arrayStep(1, arr([1, 2, 3]), [{ name: 'c', index: 0, color: 'accent' }], [0], { g: '1,2', s: '1,1,3' }, 'Child greed 1 needs cookie ≥1 — try cookie 0 size 1.'),
        arrayStep(2, arr([1, 3]), [{ name: 'c', index: 1, color: 'accent' }], [1], { fed: 1 }, 'Child greed 2 needs ≥2 — only cookie 3 fits. Fed 1 child total with naive matching.'),
      ],
    },
    {
      id: 'optimized',
      label: 'Optimized · sort both, two pointers',
      complexity: { time: 'O(n log n + m log m)', space: 'O(1)' },
      code: ['sort g and s', 'j ← 0', 'for each child i:', '  while s[j]<g[i]: j++', '  if j<m: j++, count++'],
      steps: [
        arrayStep(1, arr([1, 2]), [{ name: 'i', index: 0, color: 'accent' }, { name: 'j', index: 0, color: 'secondary' }], [0], { g: 1, s: 1 }, 'Sorted g=[1,2], s=[1,1,3]. j=0 cookie satisfies child 0.'),
        arrayStep(2, arr([1, 2]), [{ name: 'i', index: 1, color: 'accent' }, { name: 'j', index: 2, color: 'secondary' }], [1, 2], { skip: 's[1]=1<2' }, 'Advance j past cookie 1 (too small). Cookie 3 satisfies child 2.'),
        arrayStep(3, arr([1, 2]), [], [], { ans: 2 }, 'Two children fed — greedy smallest-fit cookie never wastes large cookies early.'),
      ],
    },
  ],
};

const jumpGame: VisualScript = {
  id: 'dsa-g-2',
  type: 'dsa',
  title: 'Jump Game',
  meta: {
    ...META,
    eyebrow: 'PATTERN · REACHABLE FARTHEST',
    leetcode: 'LeetCode #55',
    difficulty: 'MEDIUM',
    description: 'Can you reach the last index? Track farthest reachable position while scanning left to right.',
  },
  defaultApproachId: 'optimized',
  approaches: [
    {
      id: 'brute',
      label: 'Brute force · DFS all jumps',
      complexity: { time: 'O(2^n)', space: 'O(n)' },
      code: ['dfs(i):', '  if i≥last: true', '  for step 1..nums[i]: if dfs(i+step): true'],
      steps: [
        arrayStep(1, arr([2, 3, 1, 1, 4]), [{ name: 'i', index: 0, color: 'accent' }], [0], { try: '1 or 2' }, 'From index 0 jump 1 or 2 — explore all paths recursively.'),
        arrayStep(2, arr([2, 3, 1, 1, 4]), [{ name: 'i', index: 4, color: 'accent' }], [4], { reach: 'yes' }, 'Path 0→1→4 reaches end — DFS finds it but exponential.'),
      ],
    },
    {
      id: 'optimized',
      label: 'Optimized · greedy farthest',
      complexity: { time: 'O(n)', space: 'O(1)' },
      code: ['far ← 0', 'for i, jump in enumerate(nums):', '  if i>far: return false', '  far ← max(far, i+jump)'],
      steps: [
        arrayStep(2, arr([2, 3, 1, 1, 4]), [{ name: 'i', index: 0, color: 'accent' }], [0], { far: 2 }, 'i=0 jump=2 → farthest reachable index 2.'),
        arrayStep(2, arr([2, 3, 1, 1, 4]), [{ name: 'i', index: 1, color: 'accent' }], [1], { far: 4 }, 'i=1 jump=3 → far=max(2,4)=4 — last index reachable.'),
        arrayStep(3, arr([2, 3, 1, 1, 4]), [], [4], { ans: 'true' }, 'far≥last-1 throughout → return true.'),
      ],
    },
  ],
};

const jumpGameII: VisualScript = {
  id: 'dsa-g-3',
  type: 'dsa',
  title: 'Jump Game II',
  meta: {
    ...META,
    eyebrow: 'PATTERN · BFS LEVELS',
    leetcode: 'LeetCode #45',
    difficulty: 'MEDIUM',
    description: 'Minimum jumps to reach the last index. Greedy BFS: extend current jump range, count when range ends.',
  },
  defaultApproachId: 'optimized',
  approaches: [
    {
      id: 'brute',
      label: 'Brute force · BFS',
      complexity: { time: 'O(n²)', space: 'O(n)' },
      code: ['queue ← (0,0)', 'while queue:', '  pop i,jumps; push i+1..i+nums[i] with jumps+1'],
      steps: [
        arrayStep(1, arr([2, 3, 1, 1, 4]), [{ name: 'q', index: 0, color: 'accent' }], [0], { jumps: 0 }, 'BFS layer 0: start at index 0.'),
        arrayStep(2, arr([2, 3, 1, 1, 4]), [{ name: 'q', index: 1, color: 'accent' }, { name: 'q', index: 2, color: 'secondary' }], [1, 2], { jumps: 1 }, 'Layer 1: indices 1,2 reachable in one jump.'),
        arrayStep(3, arr([2, 3, 1, 1, 4]), [{ name: 'q', index: 4, color: 'accent' }], [4], { jumps: 2 }, 'Layer 2 reaches index 4 — answer 2 jumps.'),
      ],
    },
    {
      id: 'optimized',
      label: 'Optimized · greedy range',
      complexity: { time: 'O(n)', space: 'O(1)' },
      code: ['end ← 0, far ← 0, jumps ← 0', 'for i, jump:', '  far ← max(far, i+jump)', '  if i=end: jumps++; end=far'],
      steps: [
        arrayStep(2, arr([2, 3, 1, 1, 4]), [{ name: 'i', index: 0, color: 'accent' }], [0], { end: 0, far: 2, jumps: 1 }, 'End of jump 1 range at i=0 → jumps=1, new end=2.'),
        arrayStep(2, arr([2, 3, 1, 1, 4]), [{ name: 'i', index: 2, color: 'accent' }], [2], { end: 2, far: 4, jumps: 2 }, 'End of jump 2 at i=2 → jumps=2, end=4 covers last index.'),
        arrayStep(3, arr([2, 3, 1, 1, 4]), [], [4], { ans: 2 }, 'Minimum jumps = 2 without explicit BFS queue.'),
      ],
    },
  ],
};

const gasStation: VisualScript = {
  id: 'dsa-g-4',
  type: 'dsa',
  title: 'Gas Station',
  meta: {
    ...META,
    eyebrow: 'PATTERN · TOTAL TANK + RESTART',
    leetcode: 'LeetCode #134',
    difficulty: 'MEDIUM',
    description: 'Circuit with gas[i] and cost[i]. If total gas ≥ total cost, a unique start exists. Track running tank; reset start when tank drops below 0.',
  },
  defaultApproachId: 'optimized',
  approaches: [
    {
      id: 'brute',
      label: 'Brute force · try each start',
      complexity: { time: 'O(n²)', space: 'O(1)' },
      code: ['for start ← 0 to n-1:', '  simulate full circuit from start', '  if tank never negative: return start'],
      steps: [
        arrayStep(1, arr([1, 2, 3, 4, 5]), [{ name: 's', index: 0, color: 'accent' }], [0], { gas: '1,2,3,4,5', cost: '3,4,5,1,2' }, 'Try start=0: tank goes negative at some station — fail.'),
        arrayStep(2, arr([1, 2, 3, 4, 5]), [{ name: 's', index: 3, color: 'accent' }], [3], { ok: 'yes' }, 'Try start=3 — completes circuit. O(n²) tries each start.'),
      ],
    },
    {
      id: 'optimized',
      label: 'Optimized · one pass greedy',
      complexity: { time: 'O(n)', space: 'O(1)' },
      code: ['total ← 0, tank ← 0, start ← 0', 'for i:', '  tank += gas[i]-cost[i]; total += same', '  if tank<0: start=i+1; tank=0'],
      steps: [
        arrayStep(2, arr([1, 2, 3, 4, 5]), [{ name: 'i', index: 2, color: 'accent' }], [2], { tank: -1 }, 'Tank dips negative after index 2 — cannot start in 0..2.'),
        arrayStep(2, arr([1, 2, 3, 4, 5]), [{ name: 's', index: 3, color: 'accent' }], [3], { start: 3 }, 'Reset start=3, tank=0 — only viable start if total≥0.'),
        arrayStep(3, arr([1, 2, 3, 4, 5]), [], [3], { ans: 3 }, 'Single pass finds start=3 when circuit possible.'),
      ],
    },
  ],
};

const handOfStraights: VisualScript = {
  id: 'dsa-g-5',
  type: 'dsa',
  title: 'Hand of Straights',
  meta: {
    ...META,
    eyebrow: 'PATTERN · FREQ MAP + GREEDY GROUPS',
    leetcode: 'LeetCode #846',
    difficulty: 'MEDIUM',
    description: 'Partition hand into groups of k consecutive cards. Process smallest card first, consume k consecutive ranks.',
  },
  defaultApproachId: 'optimized',
  approaches: [
    {
      id: 'brute',
      label: 'Brute force · backtracking groups',
      complexity: { time: 'O(n!)', space: 'O(n)' },
      code: ['try forming groups of k consecutive from multiset'],
      steps: [
        arrayStep(1, arr([1, 2, 3, 6, 2, 3, 4, 7, 8]), [], [0, 1, 2], { group: '[1,2,3]' }, 'Try group starting at 1: need 1,2,3 — available.'),
        arrayStep(2, arr([6, 7, 8, 2, 3, 4]), [], [0, 1, 2], { group2: '[6,7,8]' }, 'Next group 6,7,8 — backtrack if dead end.'),
      ],
    },
    {
      id: 'optimized',
      label: 'Optimized · sorted freq greedy',
      complexity: { time: 'O(n log n)', space: 'O(n)' },
      code: ['count cards', 'for card in sorted keys:', '  while count[card]>0:', '    form group card..card+k-1'],
      steps: [
        arrayStep(1, arr([1, 2, 3, 6, 2, 3, 4, 7, 8]), [{ name: 'c', index: 0, color: 'accent' }], [0, 1, 2], { k: 3, start: 1 }, 'Smallest card 1 — peel group [1,2,3].'),
        arrayStep(2, arr([2, 3, 4, 6, 7, 8]), [{ name: 'c', index: 0, color: 'accent' }], [0, 1, 2], { start: 2 }, 'Next smallest 2 — group [2,3,4].'),
        arrayStep(3, arr([6, 7, 8]), [], [0, 1, 2], { ans: 'true' }, 'Final group [6,7,8] — all cards grouped.'),
      ],
    },
  ],
};

const mergeTriplets: VisualScript = {
  id: 'dsa-g-6',
  type: 'dsa',
  title: 'Merge Triplets to Target',
  meta: {
    ...META,
    eyebrow: 'PATTERN · COMPONENT GREEDY',
    leetcode: 'LeetCode #1899',
    difficulty: 'MEDIUM',
    description: 'Can some subset of triplets merge to target [a,b,c]? Keep triplets ≤ target per coordinate; collect max of each component.',
  },
  defaultApproachId: 'optimized',
  approaches: [
    {
      id: 'brute',
      label: 'Brute force · subset search',
      complexity: { time: 'O(2^n)', space: 'O(n)' },
      code: ['try all subsets', 'merge = coordinate-wise max', 'check equals target'],
      steps: [
        arrayStep(1, arr([2, 5, 3]), [{ name: 't', index: 0, color: 'accent' }], [0], { target: '[2,5,4]' }, 'Triplet pool includes [2,5,3], [1,8,4], [1,7,5] — try subsets.'),
        arrayStep(2, arr([2, 5, 4]), [], [0, 1, 2], { pick: '[2,5,3]+[1,8,4]' }, 'Merge max coords → [2,8,4] overshoots b — invalid.'),
      ],
    },
    {
      id: 'optimized',
      label: 'Optimized · filter + max components',
      complexity: { time: 'O(n)', space: 'O(1)' },
      code: ['good ← triplets where t[i]≤target[i] for all i', 'need a,b,c from some good triplets', 'track max seen per coordinate'],
      steps: [
        arrayStep(1, arr([2, 5, 3]), [{ name: 'ok', index: 0, color: 'accent' }], [0], { filter: '≤target' }, 'Keep [2,5,3] and [1,8,4] — drop [1,7,5] (5>4 on c).'),
        arrayStep(2, arr([2, 5, 4]), [], [0, 1, 2], { have: 'a=2,b=5,c=4' }, 'Max a=2, b=5, c=4 from good set matches target.'),
        arrayStep(3, arr([2, 5, 4]), [], [], { ans: 'true' }, 'Greedy collection of components suffices — no merge needed.'),
      ],
    },
  ],
};

const minDeletionsUniqueFreq: VisualScript = {
  id: 'dsa-g-7',
  type: 'dsa',
  title: 'Minimum Deletions to Make Character Frequencies Unique',
  meta: {
    ...META,
    eyebrow: 'PATTERN · FREQ SORT + SLOT',
    leetcode: 'LeetCode #1647',
    difficulty: 'MEDIUM',
    description: 'Delete min chars so every remaining letter frequency is unique. Sort frequencies descending, place into next free slot.',
  },
  defaultApproachId: 'optimized',
  approaches: [
    {
      id: 'brute',
      label: 'Brute force · try deletion counts',
      complexity: { time: 'O(n²)', space: 'O(n)' },
      code: ['for deletions 0..n:', '  if can make freqs unique: return deletions'],
      steps: [
        stringStep(1, 'aabbbcc', {}, { freq: 'a:2,b:3,c:2' }, 'Freq map: a×2, b×3, c×2 — duplicate frequency 2.'),
        stringStep(2, 'aabbbcc', {}, { try: 'delete 1 c' }, 'Try deleting one char at a time until freqs unique — slow.'),
      ],
    },
    {
      id: 'optimized',
      label: 'Optimized · greedy freq placement',
      complexity: { time: 'O(n + k log k)', space: 'O(k)' },
      code: ['count freqs, sort desc', 'used ← set of occupied counts', 'for f: while f in used: f--, deletions++'],
      steps: [
        arrayStep(1, arr([3, 2, 2]), [{ name: 'f', index: 0, color: 'accent' }], [0], { freqs: '3,2,2' }, 'Sorted freqs [3,2,2]. Place 3 at slot 3.'),
        arrayStep(2, arr([3, 2, 1]), [{ name: 'f', index: 2, color: 'accent' }], [2], { move: '2→1' }, 'Second 2 collides — decrement to 1, +1 deletion.'),
        arrayStep(3, arr([3, 2, 1]), [], [], { ans: 1 }, 'One deletion makes frequencies {3,2,1} all unique.'),
      ],
    },
  ],
};

const removeKDigits: VisualScript = {
  id: 'dsa-g-8',
  type: 'dsa',
  title: 'Remove K Digits',
  meta: {
    ...META,
    eyebrow: 'PATTERN · MONOTONIC STACK',
    leetcode: 'LeetCode #402',
    difficulty: 'MEDIUM',
    description: 'Remove k digits to form the smallest possible number. Monotonic increasing stack drops larger leading digits.',
  },
  defaultApproachId: 'optimized',
  approaches: [
    {
      id: 'brute',
      label: 'Brute force · try all removals',
      complexity: { time: 'O(C(n,k)·n)', space: 'O(n)' },
      code: ['for each subset of k indices to remove:', '  track min numeric string'],
      steps: [
        stringStep(1, '1432219', {}, { k: 3 }, 'Remove 3 digits from "1432219" — try many combinations.'),
        stringStep(2, '1219', {}, { best: '1219' }, 'Best among brute tries is "1219". Exponential subsets.'),
      ],
    },
    {
      id: 'optimized',
      label: 'Optimized · monotonic stack',
      complexity: { time: 'O(n)', space: 'O(n)' },
      code: ['stack ← digits', 'while k>0 and stack.top>cur:', '  pop; k--', 'append rest; trim leading zeros'],
      steps: [
        stackStep(2, '1432219', 1, ['1'], { d: 4 }, 'See 4 after 1 — keep. See 3 after 4 — pop 4 (k--).', { values: ['1', '4', '3', '2', '2', '1', '9'], stackLabel: 'result', status: 'pop larger digit' }),
        stackStep(3, '1432219', 4, ['1', '2'], { d: 2 }, 'Stack [1,2] — removed two larger digits so far.', { values: ['1', '4', '3', '2', '2', '1', '9'], stackLabel: 'result' }),
        stackStep(4, '1432219', 7, ['1', '2', '1', '9'], { ans: '1219' }, 'Finish scan → "1219" smallest with 3 removals.', { values: ['1', '4', '3', '2', '2', '1', '9'], stackLabel: 'result', status: 'answer 1219' }),
      ],
    },
  ],
};

const nonOverlappingIntervals: VisualScript = {
  id: 'dsa-g-9',
  type: 'dsa',
  title: 'Non-overlapping Intervals',
  meta: {
    ...META,
    eyebrow: 'PATTERN · SORT BY END',
    leetcode: 'LeetCode #435',
    difficulty: 'MEDIUM',
    description: 'Minimum intervals to remove so rest are non-overlapping. Greedy: sort by end, keep earliest-finishing compatible interval.',
  },
  defaultApproachId: 'optimized',
  approaches: [
    {
      id: 'brute',
      label: 'Brute force · try all keep sets',
      complexity: { time: 'O(2^n)', space: 'O(n)' },
      code: ['for each subset:', '  if non-overlapping: max keep size'],
      steps: [
        intervalStep(1, [{ start: 1, end: 2 }, { start: 2, end: 3 }, { start: 3, end: 4 }, { start: 1, end: 3 }], { n: 4 }, 'Four intervals — try keeping different subsets.'),
        intervalStep(2, [{ start: 1, end: 2, active: true }, { start: 2, end: 3, active: true }, { start: 3, end: 4, active: true }], { keep: 3 }, 'Keep {[1,2],[2,3],[3,4]} — remove 1 interval [1,3].'),
      ],
    },
    {
      id: 'optimized',
      label: 'Optimized · sort by end, greedy keep',
      complexity: { time: 'O(n log n)', space: 'O(1)' },
      code: ['sort by end', 'prevEnd ← -∞, removals ← 0', 'for [s,e]:', '  if s<prevEnd: removals++', '  else: prevEnd=e'],
      steps: [
        intervalStep(1, [{ start: 1, end: 2 }, { start: 2, end: 3 }, { start: 1, end: 3 }, { start: 3, end: 4 }], { sort: 'by end' }, 'Sort by ending time — earliest finish first.'),
        intervalStep(2, [{ start: 1, end: 2, active: true, merged: true }, { start: 2, end: 3, active: true }, { start: 1, end: 3, active: true }], { clash: '[1,3]' }, 'Keep [1,2] and [2,3]. [1,3] overlaps → remove it.'),
        intervalStep(3, [{ start: 1, end: 2, merged: true }, { start: 2, end: 3, merged: true }, { start: 3, end: 4, merged: true }], { ans: 1 }, 'One removal — same as max interval scheduling.', [{ start: 1, end: 2 }, { start: 2, end: 3 }, { start: 3, end: 4 }], 0, 5),
      ],
    },
  ],
};

const partitionLabels: VisualScript = {
  id: 'dsa-g-10',
  type: 'dsa',
  title: 'Partition Labels',
  meta: {
    ...META,
    eyebrow: 'PATTERN · LAST OCCURRENCE',
    leetcode: 'LeetCode #763',
    difficulty: 'MEDIUM',
    description: 'Split string into max parts where each letter appears in at most one part. Extend part end to last index of any char seen.',
  },
  defaultApproachId: 'optimized',
  approaches: [
    {
      id: 'brute',
      label: 'Brute force · try all cuts',
      complexity: { time: 'O(2^n)', space: 'O(n)' },
      code: ['try every partition', 'check each letter in one part only'],
      steps: [
        stringStep(1, 'ababcbacadefegdehijhklij', {}, { try: 'cuts' }, 'Try many cut positions — validate each letter single-part.'),
        stringStep(2, 'ababcbacadefegde', {}, { part1: 'ababcbaca' }, 'First valid large part ends at index 8.'),
      ],
    },
    {
      id: 'optimized',
      label: 'Optimized · last occurrence scan',
      complexity: { time: 'O(n)', space: 'O(1)' },
      code: ['last[c] ← last index of c', 'end ← 0, size ← 0', 'for i,c:', '  end ← max(end, last[c])', '  if i=end: record size; reset'],
      steps: [
        stringStep(2, 'ababcbacadefegdehijhklij', { windowStart: 0, windowEnd: 8, pointers: [{ name: 'i', index: 8, color: 'accent' }] }, { end: 8 }, 'Scanning: a,b,c force end to index 8 before first cut.'),
        stringStep(3, 'ababcbacadefegdehijhklij', { windowStart: 9, windowEnd: 15, pointers: [{ name: 'i', index: 15, color: 'accent' }] }, { part2: 7 }, 'Next part "defegde" size 7 when i catches extended end.'),
        stringStep(4, 'ababcbacadefegdehijhklij', {}, { ans: '[9,7,8]' }, 'Sizes [9,7,8] — greedy last-occurrence extension is optimal.'),
      ],
    },
  ],
};

const queueReconstruction: VisualScript = {
  id: 'dsa-g-11',
  type: 'dsa',
  title: 'Queue Reconstruction by Height',
  meta: {
    ...META,
    eyebrow: 'PATTERN · SORT + INSERT',
    leetcode: 'LeetCode #406',
    difficulty: 'MEDIUM',
    description: 'Rebuild queue from [h,k] pairs. Sort by height desc then k asc; insert each person at index k among taller already placed.',
  },
  defaultApproachId: 'optimized',
  approaches: [
    {
      id: 'brute',
      label: 'Brute force · backtracking order',
      complexity: { time: 'O(n!)', space: 'O(n)' },
      code: ['permute people', 'check k counts for each ordering'],
      steps: [
        arrayStep(1, arr([7, 6, 5, 4, 3, 2]), [], [0, 1, 2], { people: '[7,0],[6,1]...' }, 'Try permutations of seven people — verify k constraint.'),
        arrayStep(2, arr([7, 6, 5, 4, 3, 2, 1]), [], [], { valid: 'one order' }, 'Only sorted-by-height order may satisfy — brute is factorial.'),
      ],
    },
    {
      id: 'optimized',
      label: 'Optimized · sort h↓ k↑, insert at k',
      complexity: { time: 'O(n²)', space: 'O(n)' },
      code: ['sort by (-h, k)', 'result ← []', 'for [h,k]: insert at index k'],
      steps: [
        arrayStep(1, arr([7, 6, 5, 4]), [{ name: 'h', index: 0, color: 'accent' }], [0], { order: '7,6,5,4...' }, 'Process tallest first: [7,0] inserts at index 0.'),
        arrayStep(2, arr([7, 6, 5]), [{ name: 'k', index: 1, color: 'accent' }], [1], { insert: '[6,1]→1' }, '[6,1] sees one taller ahead — insert at k=1 → [7,6].'),
        arrayStep(3, arr([7, 6, 5, 4, 3, 2, 1]), [], [], { ans: 'rebuilt' }, 'Continue inserts → final queue satisfies all k values.'),
      ],
    },
  ],
};

const validParenthesisString: VisualScript = {
  id: 'dsa-g-12',
  type: 'dsa',
  title: 'Valid Parenthesis String',
  meta: {
    ...META,
    eyebrow: 'PATTERN · LOW/HIGH BALANCE',
    leetcode: 'LeetCode #678',
    difficulty: 'MEDIUM',
    description: '`*` can be `(`, `)`, or empty. Track min and max possible open count after each char — valid if range includes 0 at end.',
  },
  defaultApproachId: 'optimized',
  approaches: [
    {
      id: 'brute',
      label: 'Brute force · try * assignments',
      complexity: { time: 'O(3^k)', space: 'O(n)' },
      code: ['for each * choose ( ) or empty', 'run standard balance check'],
      steps: [
        stringStep(1, '(*))', {}, { star: 1 }, 'One `*` in "(*))" — try 3 assignments for star.'),
        stackStep(1, '(*))', 0, ['('], { try: 'empty' }, 'Treat * as empty → balance like "())" fails.', { status: 'some assignments invalid' }),
      ],
    },
    {
      id: 'optimized',
      label: 'Optimized · greedy range [lo,hi]',
      complexity: { time: 'O(n)', space: 'O(1)' },
      code: ['lo,hi ← 0', 'for c:', '  update lo,hi for ( ) *', 'return lo=0 at end'],
      steps: [
        stringStep(2, '(*))', { windowStart: 0, windowEnd: 3, pointers: [{ name: 'i', index: 1, color: 'accent' }] }, { lo: 0, hi: 2 }, 'At `*`: lo-- (as ), hi++ (as () — range of open counts.'),
        stringStep(3, '(*))', { windowStart: 0, windowEnd: 3 }, { lo: 0, hi: 1 }, 'After `)`: tighten range — still possibly valid.'),
        stringStep(4, '(*))', {}, { ans: 'true', lo: 0 }, 'End with lo=0 → some assignment makes valid parentheses.'),
      ],
    },
  ],
};

export const GREEDY_SCRIPTS: Record<string, VisualScript> = {
  'g-1': assignCookies,
  'g-2': jumpGame,
  'g-3': jumpGameII,
  'g-4': gasStation,
  'g-5': handOfStraights,
  'g-6': mergeTriplets,
  'g-7': minDeletionsUniqueFreq,
  'g-8': removeKDigits,
  'g-9': nonOverlappingIntervals,
  'g-10': partitionLabels,
  'g-11': queueReconstruction,
  'g-12': validParenthesisString,
};
