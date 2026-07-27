import type { VisualScript } from '@/types/visual-script';
import { stackStep, stringStep } from './helpers';

const META = {
  section: 'Strings',
  companies: ['Amazon', 'Google', 'Microsoft'],
};

const validAnagram: VisualScript = {
  id: 'dsa-s-1',
  type: 'dsa',
  title: 'Valid Anagram',
  meta: {
    ...META,
    eyebrow: 'PATTERN · CHAR FREQ',
    leetcode: 'LeetCode #242',
    difficulty: 'EASY',
    description: 'Return true if t is an anagram of s — same characters with same counts.',
  },
  defaultApproachId: 'optimized',
  approaches: [
    {
      id: 'brute',
      label: 'Brute force · sort both',
      complexity: { time: 'O(n log n)', space: 'O(n)' },
      code: ['return sorted(s) = sorted(t)'],
      steps: [
        stringStep(1, 'anagram', {}, { s: '"anagram"', t: '"nagaram"' }, 'Sort both strings and compare — works but O(n log n).'),
        stringStep(1, 'aaagmnr', {}, { sorted: 'aaagmnr=aaagmnr' }, 'Both sort to "aaagmnr" → true.'),
      ],
    },
    {
      id: 'optimized',
      label: 'Optimized · count array',
      complexity: { time: 'O(n)', space: 'O(1)' },
      code: ['count[26] ← 0', 'for c in s: count[c]++', 'for c in t: count[c]--', 'all zeros → true'],
      steps: [
        stringStep(2, 'anagram', { windowStart: 0, windowEnd: 6 }, { count: '+s' }, 'Increment freq for each char in s.'),
        stringStep(3, 'nagaram', { windowStart: 0, windowEnd: 6 }, { count: '-t' }, 'Decrement for each char in t — all counts return to 0 → anagram.'),
      ],
    },
  ],
};

const validPalindrome: VisualScript = {
  id: 'dsa-s-2',
  type: 'dsa',
  title: 'Valid Palindrome',
  meta: {
    ...META,
    eyebrow: 'PATTERN · TWO POINTERS',
    leetcode: 'LeetCode #125',
    difficulty: 'EASY',
    description: 'After cleaning non-alphanumeric and lowercasing, check if string reads the same forward and backward.',
  },
  defaultApproachId: 'optimized',
  approaches: [
    {
      id: 'brute',
      label: 'Brute force · reverse copy',
      complexity: { time: 'O(n)', space: 'O(n)' },
      code: ['clean ← filtered lowercase', 'return clean = reverse(clean)'],
      steps: [
        stringStep(1, 'A man a plan a canal Panama', {}, { raw: 'yes' }, 'Filter to alphanumerics and lowercase.'),
        stringStep(2, 'amanaplanacanalpanama', {}, { match: 'yes' }, 'Cleaned string equals its reverse → true.'),
      ],
    },
    {
      id: 'optimized',
      label: 'Optimized · two pointers',
      complexity: { time: 'O(n)', space: 'O(1)' },
      code: ['L←0, R←n-1', 'skip non-alnum', 'if lower(s[L])≠lower(s[R]): false', 'L++; R--'],
      steps: [
        stringStep(2, 'AmanaplanacanalPanama', { windowStart: 0, windowEnd: 20, pointers: [{ name: 'L', index: 0, color: 'accent' }, { name: 'R', index: 20, color: 'secondary' }] }, { cmp: 'A=a' }, 'Compare ends after skipping spaces in original — match.'),
        stringStep(3, 'AmanaplanacanalPanama', { windowStart: 5, windowEnd: 15, pointers: [{ name: 'L', index: 5, color: 'accent' }, { name: 'R', index: 15, color: 'secondary' }] }, { cmp: 'p=p' }, 'Pointers march inward — all pairs match → palindrome.'),
      ],
    },
  ],
};

const longestPalindromeBuild: VisualScript = {
  id: 'dsa-s-3',
  type: 'dsa',
  title: 'Longest Palindrome',
  meta: {
    ...META,
    eyebrow: 'PATTERN · GREEDY PAIRS',
    leetcode: 'LeetCode #409',
    difficulty: 'EASY',
    description: 'Build the longest palindrome from letters in s (reorder allowed). Use pairs + at most one odd center.',
  },
  defaultApproachId: 'optimized',
  approaches: [
    {
      id: 'brute',
      label: 'Brute force · try permutations',
      complexity: { time: 'exponential', space: 'O(n)' },
      code: ['try arrangements', 'keep longest palindrome'],
      steps: [
        stringStep(1, 'abccccdd', {}, { letters: 'a,b,c×4,d×2' }, 'We can rearrange freely — count letters instead of permuting.'),
      ],
    },
    {
      id: 'optimized',
      label: 'Optimized · count pairs',
      complexity: { time: 'O(n)', space: 'O(1)' },
      code: ['count freq', 'pairs ← sum(freq//2)', 'odd center if any freq odd', 'length ← 2*pairs + (1 if odd else 0)'],
      steps: [
        stringStep(1, 'abccccdd', { windowStart: 0, windowEnd: 7 }, { freq: 'a1 b1 c4 d2' }, 'c contributes 2 pairs, d 1 pair, a/b are odd singles.'),
        stringStep(3, 'abccccdd', {}, { pairs: 3, center: 1, len: 7 }, '3 pairs = 6 chars + one odd center → longest length 7.'),
      ],
    },
  ],
};

const groupAnagrams: VisualScript = {
  id: 'dsa-s-4',
  type: 'dsa',
  title: 'Group Anagrams',
  meta: {
    ...META,
    eyebrow: 'PATTERN · HASH BY KEY',
    leetcode: 'LeetCode #49',
    difficulty: 'MEDIUM',
    description: 'Group strings that are anagrams of each other. Key = sorted string (or count tuple).',
  },
  defaultApproachId: 'optimized',
  approaches: [
    {
      id: 'brute',
      label: 'Brute force · compare all pairs',
      complexity: { time: 'O(n² · k log k)', space: 'O(n·k)' },
      code: ['for each unused word:', '  start a group', '  scan rest for anagrams'],
      steps: [
        stringStep(1, 'eat', {}, { words: 'eat tea tan ate bat' }, 'Pick "eat", scan for anagrams among remaining.'),
        stringStep(1, 'tea', {}, { group: '[eat,tea,ate]' }, 'tea and ate match — expensive pairwise checks.'),
      ],
    },
    {
      id: 'optimized',
      label: 'Optimized · map by sorted key',
      complexity: { time: 'O(n · k log k)', space: 'O(n·k)' },
      code: ['map key → list', 'key ← sorted(word)', 'append word to map[key]', 'return map values'],
      steps: [
        stringStep(2, 'eat', {}, { key: 'aet' }, '"eat" → key "aet". Same key buckets all anagrams.'),
        stringStep(2, 'tea', {}, { key: 'aet', group: 'eat,tea' }, '"tea" also "aet" — joins group. "tan"→"ant", "bat"→"abt".'),
        stringStep(3, 'bat', {}, { groups: 3 }, 'Three buckets: [eat,tea,ate], [tan], [bat].'),
      ],
    },
  ],
};

export const validParenthesesScript: VisualScript = {
  id: 'dsa-valid-parentheses',
  type: 'dsa',
  title: 'Valid Parentheses',
  meta: {
    ...META,
    eyebrow: 'PATTERN · STACK MATCH',
    leetcode: 'LeetCode #20',
    difficulty: 'EASY',
    description: 'Push opening brackets. On close, pop and match. Valid iff stack empty at end.',
  },
  defaultApproachId: 'optimized',
  approaches: [
    {
      id: 'brute',
      label: 'Brute force · repeatedly remove pairs',
      complexity: { time: 'O(n²)', space: 'O(n)' },
      code: ['while "()" or "[]" or "{}" in s:', '  remove that pair', 'return s empty'],
      steps: [
        stackStep(1, '()[]{}', 0, [], { s: '()[]{}' }, 'Repeatedly strip adjacent matching pairs.'),
        stackStep(1, '', 0, [], { empty: 'yes' }, 'All pairs removed → valid. Slow for nested cases.'),
      ],
    },
    {
      id: 'optimized',
      label: 'Optimized · one-pass stack',
      complexity: { time: 'O(n)', space: 'O(n)' },
      code: ['for ch in s:', '  if open: push', '  else: pop must match', 'stack empty → true'],
      steps: [
        stackStep(2, '{[()]}', 0, [], { ch: '{' }, 'See "{": push opening bracket.'),
        stackStep(2, '{[()]}', 1, ['{'], { ch: '[' }, 'See "[": push. Stack = { [.'),
        stackStep(2, '{[()]}', 2, ['{', '['], { ch: '(' }, 'See "(": push. Stack = { [ (.'),
        stackStep(3, '{[()]}', 3, ['{', '[', '('], { ch: ')', match: '(' }, 'See ")": pop "(" — matches.'),
        stackStep(3, '{[()]}', 5, ['{'], { ch: '}', match: '{' }, 'Pop "[" then "{" — all match.'),
        stackStep(4, '{[()]}', 6, [], { matched: 'yes' }, 'End of string, stack empty → valid.', { matched: true }),
      ],
    },
  ],
};

const minWindow: VisualScript = {
  id: 'dsa-s-7',
  type: 'dsa',
  title: 'Minimum Window Substring',
  meta: {
    ...META,
    eyebrow: 'PATTERN · NEED / HAVE WINDOW',
    leetcode: 'LeetCode #76',
    difficulty: 'HARD',
    description: 'Find smallest window in s that covers all characters of t (with multiplicity).',
  },
  defaultApproachId: 'optimized',
  approaches: [
    {
      id: 'brute',
      label: 'Brute force · all windows',
      complexity: { time: 'O(n² · |Σ|)', space: 'O(|Σ|)' },
      code: ['for each L,R:', '  if window covers t: track min length'],
      steps: [
        stringStep(1, 'ADOBECODEBANC', {}, { t: '"ABC"' }, 'Check every substring of s for covering A,B,C.'),
        stringStep(1, 'ADOBECODEBANC', { windowStart: 9, windowEnd: 12 }, { window: '"BANC"', best: 4 }, 'Window "BANC" covers t — length 4 is minimal.'),
      ],
    },
    {
      id: 'optimized',
      label: 'Optimized · sliding window',
      complexity: { time: 'O(n)', space: 'O(|Σ|)' },
      code: ['need ← freq(t), have ← 0', 'expand R until have=needCount', 'shrink L while still valid', 'track best window'],
      steps: [
        stringStep(2, 'ADOBECODEBANC', { windowStart: 0, windowEnd: 5, pointers: [{ name: 'L', index: 0, color: 'accent' }, { name: 'R', index: 5, color: 'secondary' }] }, { have: 'A,B,C', window: 'ADOBEC' }, 'Expand R until window covers all of t — first valid "ADOBEC".'),
        stringStep(3, 'ADOBECODEBANC', { windowStart: 9, windowEnd: 12, pointers: [{ name: 'L', index: 9, color: 'accent' }, { name: 'R', index: 12, color: 'secondary' }] }, { best: '"BANC"' }, 'Shrink and slide — best becomes "BANC" length 4.'),
      ],
    },
  ],
};

const palindromicSubstrings: VisualScript = {
  id: 'dsa-s-9',
  type: 'dsa',
  title: 'Palindromic Substrings',
  meta: {
    ...META,
    eyebrow: 'PATTERN · EXPAND CENTER',
    leetcode: 'LeetCode #647',
    difficulty: 'MEDIUM',
    description: 'Count substrings that are palindromes. Expand around each center (odd and even).',
  },
  defaultApproachId: 'optimized',
  approaches: [
    {
      id: 'brute',
      label: 'Brute force · check all substrings',
      complexity: { time: 'O(n³)', space: 'O(1)' },
      code: ['for i,j: if s[i..j] is palindrome: count++'],
      steps: [
        stringStep(1, 'aaa', {}, { n: 3 }, 'Every substring of "aaa" is a palindrome — 6 total.'),
        stringStep(1, 'aaa', { windowStart: 0, windowEnd: 2 }, { count: 6 }, 'Checking each with a reverse scan is O(n³).'),
      ],
    },
    {
      id: 'optimized',
      label: 'Optimized · expand around centers',
      complexity: { time: 'O(n²)', space: 'O(1)' },
      code: ['for each center:', '  expand while s[L]=s[R]', '  count each expansion', 'odd + even centers'],
      steps: [
        stringStep(2, 'aaa', { windowStart: 1, windowEnd: 1 }, { center: 'odd @1', add: 1 }, 'Odd center at index 1 ("a") — expand.'),
        stringStep(2, 'aaa', { windowStart: 0, windowEnd: 2 }, { center: 'odd @1', add: 3 }, 'Expand to "aaa" — three odd palindromes from this center path.'),
        stringStep(2, 'aaa', { windowStart: 0, windowEnd: 1 }, { center: 'even', total: 6 }, 'Even centers between chars add the rest → total 6.'),
      ],
    },
  ],
};

const encodeDecode: VisualScript = {
  id: 'dsa-s-8',
  type: 'dsa',
  title: 'Encode and Decode Strings',
  meta: {
    ...META,
    eyebrow: 'PATTERN · LENGTH PREFIX',
    leetcode: 'LeetCode #271',
    difficulty: 'MEDIUM',
    description: 'Encode with length#word so delimiters inside words cannot break parsing.',
  },
  defaultApproachId: 'optimized',
  approaches: [
    {
      id: 'brute',
      label: 'Brute force · delimiter join',
      complexity: { time: 'O(n)', space: 'O(n)' },
      code: ['encoded ← join(words, ",")', 'split(encoded, ",")'],
      steps: [
        stringStep(1, 'hello,world', {}, { words: '["hello","world"]' }, 'Join with comma — fails if a word contains ",".'),
        stringStep(2, 'he,llo,world', {}, { fail: 'split breaks "he,llo"' }, 'Word "he,llo" splits into three pieces — ambiguous decode.'),
      ],
    },
    {
      id: 'optimized',
      label: 'Optimized · length#payload',
      complexity: { time: 'O(n)', space: 'O(n)' },
      code: ['for w in words: append str(len(w)) + "#" + w', 'decode: read digits until #, then next len chars'],
      steps: [
        stringStep(2, '5#hello5#world', {}, { encode: '5#hello5#world' }, '"hello" → 5#hello, "world" → 5#world. No delimiter ambiguity.'),
        stringStep(3, '5#hello5#world', { windowStart: 0, windowEnd: 6, pointers: [{ name: 'read', index: 0, color: 'accent' }] }, { len: 5, word: 'hello' }, 'Read 5# → take next 5 chars = "hello".'),
        stringStep(3, '5#hello5#world', { windowStart: 7, windowEnd: 12, pointers: [{ name: 'read', index: 7, color: 'accent' }] }, { word: 'world', done: 'yes' }, 'Next segment 5#world — original list restored.'),
      ],
    },
  ],
};

const editDistance: VisualScript = {
  id: 'dsa-s-10',
  type: 'dsa',
  title: 'Edit Distance',
  meta: {
    ...META,
    eyebrow: 'PATTERN · DP ON STRINGS',
    leetcode: 'LeetCode #72',
    difficulty: 'HARD',
    description: 'Min insert/delete/replace ops to turn word1 into word2. dp[i][j] = cost for prefixes word1[0..i), word2[0..j).',
  },
  defaultApproachId: 'optimized',
  approaches: [
    {
      id: 'brute',
      label: 'Brute force · recursive try all ops',
      complexity: { time: 'O(3^(m+n))', space: 'O(m+n)' },
      code: ['if i=0: return j', 'if j=0: return i', 'try delete, insert, replace/recurse'],
      steps: [
        stringStep(1, 'horse', { windowStart: 0, windowEnd: 4 }, { word2: 'ros' }, 'At each position try 3 operations — exponential branching.'),
        stringStep(1, 'ros', { windowStart: 0, windowEnd: 2 }, { depth: 'explodes' }, 'Same subproblems recomputed many times without memo.'),
      ],
    },
    {
      id: 'optimized',
      label: 'Optimized · 2D DP table',
      complexity: { time: 'O(m·n)', space: 'O(m·n)' },
      code: ['dp[i][j] = min ops for prefixes', 'if s[i]=t[j]: dp[i][j]=dp[i-1][j-1]', 'else 1+min(delete,insert,replace)'],
      steps: [
        stringStep(2, 'horse', { windowStart: 0, windowEnd: 0, pointers: [{ name: 'i', index: 0, color: 'accent' }] }, { j: 0, dp: 'base row/col' }, 'Base: empty→"ros" needs 3 inserts; build table row by row.'),
        stringStep(3, 'horse', { windowStart: 4, windowEnd: 4, pointers: [{ name: 'i', index: 4, color: 'accent' }] }, { j: 2, cell: 'dp[5][3]' }, 'Fill dp[5][3]: align "horse" with "ros" — min of three neighbors + cost.'),
        stringStep(3, 'ros', { windowStart: 0, windowEnd: 2 }, { ans: 3, ops: 'replace h→r, delete o, delete r' }, 'Bottom-right cell = 3 edits — horse → ros.'),
      ],
    },
  ],
};

const kmpIntro: VisualScript = {
  id: 'dsa-s-11',
  type: 'dsa',
  title: 'KMP / string matching intro',
  meta: {
    ...META,
    eyebrow: 'PATTERN · LPS + SCAN',
    difficulty: 'HARD',
    description: 'Build longest proper prefix=suffix (LPS) for pattern; on mismatch jump i using LPS instead of restarting.',
  },
  defaultApproachId: 'optimized',
  approaches: [
    {
      id: 'brute',
      label: 'Brute force · restart on mismatch',
      complexity: { time: 'O(n·m)', space: 'O(1)' },
      code: ['for start in text:', '  match pattern from start', '  on fail: start++ from beginning'],
      steps: [
        stringStep(1, 'ababcabcabababd', { windowStart: 0, windowEnd: 4, pointers: [{ name: 'text', index: 0, color: 'accent' }] }, { pattern: 'ababd' }, 'Try match at index 0 — fails at last char.'),
        stringStep(1, 'ababcabcabababd', { windowStart: 1, windowEnd: 5, pointers: [{ name: 'text', index: 1, color: 'accent' }] }, { restart: 'from scratch' }, 'Shift start to 1, compare pattern from j=0 again — redundant re-checks.'),
      ],
    },
    {
      id: 'optimized',
      label: 'Optimized · KMP with LPS',
      complexity: { time: 'O(n+m)', space: 'O(m)' },
      code: ['build lps for pattern', 'i scan text, j scan pattern', 'if mismatch: j ← lps[j-1]', 'else advance both'],
      steps: [
        stringStep(2, 'ababd', { windowStart: 0, windowEnd: 4 }, { lps: '[0,0,1,2,0]' }, 'LPS of "ababd": longest border lengths at each prefix.'),
        stringStep(3, 'ababcabcabababd', { windowStart: 6, windowEnd: 10, pointers: [{ name: 'i', index: 10, color: 'accent' }, { name: 'j', index: 4, color: 'secondary' }] }, { mismatch: 'd≠c' }, 'Mismatch at text[10]: j jumps to lps[3]=2 — reuse matched "ab".'),
        stringStep(4, 'ababcabcabababd', { windowStart: 10, windowEnd: 14, pointers: [{ name: 'i', index: 14, color: 'accent' }] }, { found: 'index 10' }, 'Continue without resetting i — full match "ababd" at index 10.'),
      ],
    },
  ],
};

const wordBreak: VisualScript = {
  id: 'dsa-s-12',
  type: 'dsa',
  title: 'Word Break',
  meta: {
    ...META,
    eyebrow: 'PATTERN · DP REACHABLE',
    leetcode: 'LeetCode #139',
    difficulty: 'MEDIUM',
    description: 'dp[i] = true if s[0..i) can be segmented into dictionary words.',
  },
  defaultApproachId: 'optimized',
  approaches: [
    {
      id: 'brute',
      label: 'Brute force · backtrack all splits',
      complexity: { time: 'O(2^n)', space: 'O(n)' },
      code: ['try every cut position', 'recurse on remainder if prefix in dict'],
      steps: [
        stringStep(1, 'leetcode', { windowStart: 0, windowEnd: 3 }, { try: '"leet"' }, 'Try cut "leet" + recurse on "code" — one branch of many.'),
        stringStep(1, 'leetcode', { windowStart: 0, windowEnd: 1 }, { try: '"le"' }, 'Also try "le" + "etcode" — exponential splits without memo.'),
      ],
    },
    {
      id: 'optimized',
      label: 'Optimized · 1D DP',
      complexity: { time: 'O(n² · k)', space: 'O(n)' },
      code: ['dp[0] ← true', 'for i ← 1 to n:', '  for j ← 0 to i-1:', '    if dp[j] and s[j..i) in dict: dp[i]←true'],
      steps: [
        stringStep(2, 'leetcode', { windowStart: 0, windowEnd: 3, pointers: [{ name: 'j', index: 0, color: 'accent' }] }, { word: 'leet', dp4: 'true' }, 'dp[0]=true and "leet" in dict → dp[4]=true.'),
        stringStep(3, 'leetcode', { windowStart: 4, windowEnd: 7, pointers: [{ name: 'j', index: 4, color: 'accent' }] }, { word: 'code', dp8: 'true' }, 'dp[4]=true and "code" in dict → dp[8]=true — full string reachable.'),
        stringStep(3, 'leetcode', { windowStart: 0, windowEnd: 7 }, { ans: 'true', seg: 'leet + code' }, 'Return dp[n]=true. Segmentation: "leet" + "code".'),
      ],
    },
  ],
};

export const STRING_SCRIPTS: Record<string, VisualScript> = {
  's-1': validAnagram,
  's-2': validPalindrome,
  's-3': longestPalindromeBuild,
  's-4': groupAnagrams,
  's-6': validParenthesesScript,
  's-7': minWindow,
  's-8': encodeDecode,
  's-9': palindromicSubstrings,
  's-10': editDistance,
  's-11': kmpIntro,
  's-12': wordBreak,
};
