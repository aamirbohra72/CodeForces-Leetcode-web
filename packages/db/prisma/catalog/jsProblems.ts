/**
 * Practice problem catalog: Algorithm / JavaScript problems.
 *
 * Two judge modes are represented here:
 *
 * 1. STDIN — the submission is a full program that reads from standard input and
 *    writes the answer to standard output. Test case `input` is the raw stdin text
 *    and `expectedOutput` is the exact expected stdout (trailing whitespace trimmed).
 *
 * 2. JS_FUNCTION — the submission is a JavaScript module that exports the required
 *    function/class via `module.exports`. The judge harness parses the test case
 *    `input` as JSON and drives the exported code according to the protocol below.
 *    `expectedOutput` is a deterministic JSON string that the harness result is
 *    compared against (deep-equality after JSON parse).
 *
 * JS_FUNCTION harness protocol (per `fn` field in the input JSON):
 *
 * - "debounce":   { fn, wait, calls: [{ t, args }] }
 *                 The harness creates debounced = debounce(spy, wait) using virtual
 *                 (fake) timers, invokes debounced(...args) at each virtual time `t`,
 *                 then flushes all timers. Result: array of spy invocations as
 *                 { t, args } where `t` is the virtual time of invocation.
 *                 Trailing-edge semantics: fires `wait` ms after the last call.
 *
 * - "throttle":   { fn, wait, calls: [{ t, args }] }
 *                 Leading-edge semantics: a call invokes the underlying function
 *                 immediately if at least `wait` ms have elapsed since the previous
 *                 invocation (the first call always invokes). Result: array of
 *                 { t, args } invocations.
 *
 * - "deepClone":  { fn, value }
 *                 The harness calls deepClone(value), verifies the clone is not
 *                 reference-equal to the original (for objects/arrays) and that
 *                 mutating the clone does not affect the original. Result: the clone,
 *                 serialized as JSON.
 *
 * - "promiseAllSettled": { fn, tasks: [{ type: "resolve"|"reject", value?, reason?, delay? }] }
 *                 The harness builds one promise per task (settling after optional
 *                 `delay` ms) and awaits promiseAllSettled(promises). Result: the
 *                 settled-outcome array [{ status, value } | { status, reason }].
 *
 * - "LRUCache":   { fn, capacity, ops: [["put", key, value] | ["get", key]] }
 *                 The harness instantiates new LRUCache(capacity) and applies the
 *                 operations in order. Result: array with one entry per op —
 *                 null for "put", the returned value (or -1 if absent) for "get".
 *
 * - "curry":      { fn, arity, chains: [ [argGroup, argGroup, ...], ... ] }
 *                 The harness curries a variadic sum function of the given arity:
 *                 curried = curry((...xs) => xs.reduce((a, b) => a + b, 0), arity)
 *                 and evaluates each chain as curried(...g1)(...g2)(...gn).
 *                 Result: array of final values, one per chain.
 *
 * - "memoize":    { fn, calls: [argsArray, ...] }
 *                 The harness memoizes a spy that sums its numeric arguments and
 *                 counts raw invocations, then applies each calls entry. Cache key
 *                 is derived from JSON.stringify(args). Result:
 *                 { results: [...], callCount: <raw invocations> }.
 *
 * - "EventEmitter": { fn, ops: [["on", event, label] | ["once", event, label] |
 *                                ["off", event, label] | ["emit", event, ...args]] }
 *                 Each label identifies a harness-created listener that records
 *                 [label, args] into a shared log when invoked. Result: the log,
 *                 an array of [label, argsArray] entries in invocation order.
 *
 * - "compose" / "pipe": { fn, fns: [name, ...], input }
 *                 Named primitives available to the harness:
 *                 add1 (x => x + 1), double (x => x * 2), square (x => x * x),
 *                 negate (x => -x). compose applies right-to-left, pipe applies
 *                 left-to-right. Result: the final numeric value.
 */

export type JudgeMode = 'STDIN' | 'JS_FUNCTION' | 'REACT_COMPONENT';

export type CatalogTestCase = {
  name: string;
  input: string; // for STDIN: stdin text; for JS_FUNCTION: JSON string of harness args/spec
  expectedOutput: string; // for STDIN: stdout; for JS_FUNCTION: JSON expected result or harness result string
  isSample: boolean;
  isHidden: boolean;
  order: number;
  specJson?: string; // optional extra JSON for harness
};

export type CatalogChallenge = {
  slug: string;
  title: string;
  description: string; // FULL problem statement with requirements, examples explanation
  difficulty: 'Easy' | 'Medium' | 'Hard';
  practiceLanguage: 'JavaScript' | 'React.js';
  companies: string[];
  estimatedTime: string;
  inputFormat: string;
  outputFormat: string;
  constraints: string;
  sampleInput: string;
  sampleOutput: string;
  judgeMode: JudgeMode;
  allowedLanguages: string[]; // e.g. ['javascript'] or ['javascript','python','java','cpp']
  starterCode: string;
  judgeReady: boolean;
  testCases: CatalogTestCase[];
};

const ALL_LANGS = ['javascript', 'python', 'java', 'cpp'];
const JS_ONLY = ['javascript'];

export const jsProblems: CatalogChallenge[] = [
  // ------------------------------------------------------------------
  // 1. anagram-checker (STDIN)
  // ------------------------------------------------------------------
  {
    slug: 'anagram-checker',
    title: 'Anagram Checker',
    description: `You are given two strings. Your task is to determine whether they are anagrams of each other.

Two strings are anagrams if one can be formed by rearranging the letters of the other, using every character exactly once. For example, "listen" and "silent" are anagrams because both contain exactly one 'l', one 'i', one 's', one 't', one 'e', and one 'n'. The strings "hello" and "world" are not anagrams: they have different characters and different character counts.

The comparison is case-sensitive and the strings consist of lowercase English letters only. Note that two strings of different lengths can never be anagrams, so you can short-circuit that case immediately. A common approach is to count character frequencies in both strings (using a fixed-size array or a hash map) and compare the counts; sorting both strings and comparing them also works within the given constraints.

Print "YES" if the two strings are anagrams of each other, and "NO" otherwise.`,
    difficulty: 'Easy',
    practiceLanguage: 'JavaScript',
    companies: ['Amazon', 'Google', 'Adobe'],
    estimatedTime: '10 min',
    inputFormat:
      'Two lines. The first line contains string a. The second line contains string b. Both consist of lowercase English letters.',
    outputFormat: 'A single line: "YES" if a and b are anagrams, otherwise "NO".',
    constraints: '1 <= a.length, b.length <= 10^5; a and b contain only lowercase English letters (a-z).',
    sampleInput: 'listen\nsilent',
    sampleOutput: 'YES',
    judgeMode: 'STDIN',
    allowedLanguages: ALL_LANGS,
    starterCode: `const lines = require('fs').readFileSync(0, 'utf8').split(/\\r?\\n/);
const a = (lines[0] || '').trim();
const b = (lines[1] || '').trim();

function isAnagram(s, t) {
  // TODO: return true if s and t are anagrams of each other
  return false;
}

console.log(isAnagram(a, b) ? 'YES' : 'NO');
`,
    judgeReady: true,
    testCases: [
      { name: 'sample: listen / silent', input: 'listen\nsilent', expectedOutput: 'YES', isSample: true, isHidden: false, order: 1 },
      { name: 'sample: hello / world', input: 'hello\nworld', expectedOutput: 'NO', isSample: true, isHidden: false, order: 2 },
      { name: 'same multiset, different order', input: 'aabbcc\nabcabc', expectedOutput: 'YES', isSample: false, isHidden: true, order: 3 },
      { name: 'different lengths', input: 'abc\nabcd', expectedOutput: 'NO', isSample: false, isHidden: true, order: 4 },
      { name: 'single identical char', input: 'a\na', expectedOutput: 'YES', isSample: false, isHidden: true, order: 5 },
      { name: 'same length, different counts', input: 'aabb\nabbb', expectedOutput: 'NO', isSample: false, isHidden: true, order: 6 },
      { name: 'classic rat / tar', input: 'rat\ntar', expectedOutput: 'YES', isSample: false, isHidden: true, order: 7 },
    ],
  },

  // ------------------------------------------------------------------
  // 2. power-of-four (STDIN)
  // ------------------------------------------------------------------
  {
    slug: 'power-of-four',
    title: 'Power of Four',
    description: `Given an integer n, determine whether it is a power of four. An integer n is a power of four if there exists a non-negative integer k such that n equals 4 raised to the power k. The powers of four are 1, 4, 16, 64, 256, 1024, and so on.

Note the edge cases carefully. The number 1 is a power of four (4^0 = 1). Zero and negative numbers are never powers of four. A number like 8 is a power of two but not a power of four, so simply checking "is a power of two" is not enough.

There are several valid approaches: repeatedly divide n by 4 while it is divisible and check whether you end at 1; or use bit manipulation — a power of four has exactly one set bit, and that bit must be in an even position (mask 0x55555555). Any correct approach within the constraints is accepted.

Print "true" if n is a power of four and "false" otherwise (lowercase, without quotes).`,
    difficulty: 'Easy',
    practiceLanguage: 'JavaScript',
    companies: ['Two Sigma', 'Google', 'Bloomberg'],
    estimatedTime: '10 min',
    inputFormat: 'A single line containing one integer n.',
    outputFormat: 'A single line: "true" if n is a power of four, otherwise "false".',
    constraints: '-2^31 <= n <= 2^31 - 1.',
    sampleInput: '16',
    sampleOutput: 'true',
    judgeMode: 'STDIN',
    allowedLanguages: ALL_LANGS,
    starterCode: `const n = parseInt(require('fs').readFileSync(0, 'utf8').trim(), 10);

function isPowerOfFour(x) {
  // TODO: return true if x is a power of four
  return false;
}

console.log(isPowerOfFour(n) ? 'true' : 'false');
`,
    judgeReady: true,
    testCases: [
      { name: 'sample: 16', input: '16', expectedOutput: 'true', isSample: true, isHidden: false, order: 1 },
      { name: 'sample: 5', input: '5', expectedOutput: 'false', isSample: true, isHidden: false, order: 2 },
      { name: 'one is 4^0', input: '1', expectedOutput: 'true', isSample: false, isHidden: true, order: 3 },
      { name: 'zero is not a power', input: '0', expectedOutput: 'false', isSample: false, isHidden: true, order: 4 },
      { name: 'power of two but not four', input: '8', expectedOutput: 'false', isSample: false, isHidden: true, order: 5 },
      { name: 'large power of four', input: '1048576', expectedOutput: 'true', isSample: false, isHidden: true, order: 6 },
      { name: 'negative number', input: '-16', expectedOutput: 'false', isSample: false, isHidden: true, order: 7 },
    ],
  },

  // ------------------------------------------------------------------
  // 3. flatten-nested-array (STDIN)
  // ------------------------------------------------------------------
  {
    slug: 'flatten-nested-array',
    title: 'Flatten a Nested Array',
    description: `You are given an arbitrarily nested array of integers, provided as a single line of JSON. Your task is to flatten it completely — that is, produce a single-level array containing all the integers in the same left-to-right order in which they appear in the nested structure — and print the result as JSON.

For example, the input [1,[2,[3,[4]]]] flattens to [1,2,3,4]: walking the structure depth-first from left to right visits 1 first, then descends into the nested arrays to find 2, 3, and finally 4. Empty arrays contribute nothing, so [[[]]] flattens to [].

The nesting depth is not fixed, so a solution that only flattens one or two levels will fail. Recursion is the most natural approach, but an explicit stack also works. In JavaScript you may use Array.prototype.flat(Infinity), but implementing the traversal yourself is the point of the exercise in an interview setting.

Print the flattened array as compact JSON with no spaces, e.g. [1,2,3,4]. An empty result must be printed as [].`,
    difficulty: 'Easy',
    practiceLanguage: 'JavaScript',
    companies: ['Meta', 'Airbnb', 'Flipkart'],
    estimatedTime: '15 min',
    inputFormat: 'A single line containing a JSON array. Elements are either integers or further (possibly empty) JSON arrays, nested to arbitrary depth.',
    outputFormat: 'A single line: the fully flattened array as compact JSON (no spaces between elements).',
    constraints: 'Total number of integers <= 10^4; nesting depth <= 1000; each integer fits in a 32-bit signed integer.',
    sampleInput: '[1,[2,[3,[4]]]]',
    sampleOutput: '[1,2,3,4]',
    judgeMode: 'STDIN',
    allowedLanguages: ['javascript', 'python'],
    starterCode: `const raw = require('fs').readFileSync(0, 'utf8').trim();
const nested = JSON.parse(raw);

function flatten(arr) {
  // TODO: return a new fully flattened array
  return arr;
}

console.log(JSON.stringify(flatten(nested)));
`,
    judgeReady: true,
    testCases: [
      { name: 'sample: deep right nesting', input: '[1,[2,[3,[4]]]]', expectedOutput: '[1,2,3,4]', isSample: true, isHidden: false, order: 1 },
      { name: 'sample: pairs', input: '[[1,2],[3,4]]', expectedOutput: '[1,2,3,4]', isSample: true, isHidden: false, order: 2 },
      { name: 'empty array', input: '[]', expectedOutput: '[]', isSample: false, isHidden: true, order: 3 },
      { name: 'only empty nesting', input: '[[[]]]', expectedOutput: '[]', isSample: false, isHidden: true, order: 4 },
      { name: 'already flat', input: '[1,2,3]', expectedOutput: '[1,2,3]', isSample: false, isHidden: true, order: 5 },
      { name: 'mixed depths', input: '[[1],[[2]],[[[3]]],4]', expectedOutput: '[1,2,3,4]', isSample: false, isHidden: true, order: 6 },
      { name: 'negative numbers and zero', input: '[0,[-1,[5]]]', expectedOutput: '[0,-1,5]', isSample: false, isHidden: true, order: 7 },
    ],
  },

  // ------------------------------------------------------------------
  // 4. find-smallest-number (STDIN)
  // ------------------------------------------------------------------
  {
    slug: 'find-smallest-number',
    title: 'Find the Smallest Number',
    description: `You are given an array of n integers. Your task is to find and print the smallest (minimum) element of the array.

This is a fundamental single-pass scan problem: initialize the answer with the first element, then walk through the remaining elements, updating the answer whenever you see a smaller value. Be careful not to initialize the minimum with a constant like 0 — the array may contain only positive numbers larger than 0, or only negative numbers, and a hard-coded initial value will produce a wrong answer in one of those cases.

The array may contain duplicates and may consist of a single element, in which case that element is the answer. Values can be negative, so make sure your comparison logic handles the full signed range.

Print the minimum value as a single integer on its own line.`,
    difficulty: 'Easy',
    practiceLanguage: 'JavaScript',
    companies: ['TCS', 'Infosys', 'Amazon'],
    estimatedTime: '5 min',
    inputFormat: 'Two lines. The first line contains an integer n, the number of elements. The second line contains n space-separated integers.',
    outputFormat: 'A single line containing the smallest element of the array.',
    constraints: '1 <= n <= 10^5; -10^9 <= each element <= 10^9.',
    sampleInput: '5\n3 1 4 1 5',
    sampleOutput: '1',
    judgeMode: 'STDIN',
    allowedLanguages: ALL_LANGS,
    starterCode: `const lines = require('fs').readFileSync(0, 'utf8').split(/\\r?\\n/);
const n = parseInt(lines[0], 10);
const nums = lines[1].trim().split(/\\s+/).map(Number).slice(0, n);

function findSmallest(arr) {
  // TODO: return the minimum element of arr
  return arr[0];
}

console.log(findSmallest(nums));
`,
    judgeReady: true,
    testCases: [
      { name: 'sample: mixed values', input: '5\n3 1 4 1 5', expectedOutput: '1', isSample: true, isHidden: false, order: 1 },
      { name: 'sample: negatives present', input: '4\n-2 -8 0 7', expectedOutput: '-8', isSample: true, isHidden: false, order: 2 },
      { name: 'single element', input: '1\n42', expectedOutput: '42', isSample: false, isHidden: true, order: 3 },
      { name: 'all equal', input: '3\n100 100 100', expectedOutput: '100', isSample: false, isHidden: true, order: 4 },
      { name: 'strictly decreasing', input: '6\n9 8 7 6 5 4', expectedOutput: '4', isSample: false, isHidden: true, order: 5 },
      { name: 'all negative', input: '5\n-1 -2 -3 -4 -5', expectedOutput: '-5', isSample: false, isHidden: true, order: 6 },
      { name: 'minimum at front', input: '4\n-1000000000 0 5 1000000000', expectedOutput: '-1000000000', isSample: false, isHidden: true, order: 7 },
    ],
  },

  // ------------------------------------------------------------------
  // 5. voting-eligibility (STDIN)
  // ------------------------------------------------------------------
  {
    slug: 'voting-eligibility',
    title: 'Voting Eligibility',
    description: `A person is eligible to vote if their age is 18 years or older. Given a person's age, determine whether they are eligible to vote.

Read a single integer representing the age. If the age is greater than or equal to 18, print "ELIGIBLE". Otherwise print "NOT ELIGIBLE". Pay attention to the boundary: a person who is exactly 18 years old is eligible, so use an inclusive comparison (>= 18), not a strict one.

Although this is a beginner problem, it exercises the essentials: reading input, converting a string to a number, applying a conditional, and printing an exact expected string. The output must match exactly, including the space in "NOT ELIGIBLE" and the uppercase letters — outputs like "Eligible" or "NOT_ELIGIBLE" will be judged wrong.`,
    difficulty: 'Easy',
    practiceLanguage: 'JavaScript',
    companies: ['TCS', 'Wipro', 'Accenture'],
    estimatedTime: '5 min',
    inputFormat: 'A single line containing one integer, the age of the person.',
    outputFormat: 'A single line: "ELIGIBLE" if age >= 18, otherwise "NOT ELIGIBLE".',
    constraints: '0 <= age <= 150.',
    sampleInput: '20',
    sampleOutput: 'ELIGIBLE',
    judgeMode: 'STDIN',
    allowedLanguages: ALL_LANGS,
    starterCode: `const age = parseInt(require('fs').readFileSync(0, 'utf8').trim(), 10);

// TODO: print 'ELIGIBLE' if age >= 18, otherwise 'NOT ELIGIBLE'
console.log('NOT ELIGIBLE');
`,
    judgeReady: true,
    testCases: [
      { name: 'sample: adult', input: '20', expectedOutput: 'ELIGIBLE', isSample: true, isHidden: false, order: 1 },
      { name: 'sample: minor', input: '15', expectedOutput: 'NOT ELIGIBLE', isSample: true, isHidden: false, order: 2 },
      { name: 'boundary: exactly 18', input: '18', expectedOutput: 'ELIGIBLE', isSample: false, isHidden: true, order: 3 },
      { name: 'boundary: 17', input: '17', expectedOutput: 'NOT ELIGIBLE', isSample: false, isHidden: true, order: 4 },
      { name: 'edge: newborn', input: '0', expectedOutput: 'NOT ELIGIBLE', isSample: false, isHidden: true, order: 5 },
      { name: 'edge: centenarian', input: '100', expectedOutput: 'ELIGIBLE', isSample: false, isHidden: true, order: 6 },
    ],
  },

  // ------------------------------------------------------------------
  // 6. zigzag-string (STDIN)
  // ------------------------------------------------------------------
  {
    slug: 'zigzag-string',
    title: 'Zigzag String Conversion',
    description: `The string "PAYPALISHIRING" written in a zigzag pattern on 3 rows looks like this:

P   A   H   N
A P L S I I G
Y   I   R

Reading the rows left to right, top to bottom, produces "PAHNAPLSIIGYIR". Given a string s and a number of rows numRows, write the string in this zigzag pattern and print the row-by-row reading.

The zigzag pattern is formed by writing characters down the first column until you reach the bottom row, then diagonally up and to the right until you reach the top row, then down again, and so on. A clean way to simulate this is to keep one string builder per row and a direction flag: append the current character to the current row, and flip the direction whenever you touch row 0 or row numRows - 1.

Watch the edge case numRows = 1: there is no zigzag movement at all, and the output is simply the original string. Your direction-flipping logic must not get stuck or divide by zero in that case. Similarly, if numRows is greater than or equal to the string length, every character sits in its own row of the first column and the output again equals the input.`,
    difficulty: 'Medium',
    practiceLanguage: 'JavaScript',
    companies: ['PayPal', 'Amazon', 'Microsoft'],
    estimatedTime: '20 min',
    inputFormat: 'Two lines. The first line contains the string s (uppercase and lowercase English letters, no spaces). The second line contains the integer numRows.',
    outputFormat: 'A single line containing the zigzag-converted string.',
    constraints: '1 <= s.length <= 1000; 1 <= numRows <= 1000; s consists of English letters only.',
    sampleInput: 'PAYPALISHIRING\n3',
    sampleOutput: 'PAHNAPLSIIGYIR',
    judgeMode: 'STDIN',
    allowedLanguages: ALL_LANGS,
    starterCode: `const lines = require('fs').readFileSync(0, 'utf8').split(/\\r?\\n/);
const s = (lines[0] || '').trim();
const numRows = parseInt(lines[1], 10);

function convert(str, rows) {
  // TODO: return the zigzag conversion of str over the given number of rows
  return str;
}

console.log(convert(s, numRows));
`,
    judgeReady: true,
    testCases: [
      { name: 'sample: 3 rows', input: 'PAYPALISHIRING\n3', expectedOutput: 'PAHNAPLSIIGYIR', isSample: true, isHidden: false, order: 1 },
      { name: 'sample: 4 rows', input: 'PAYPALISHIRING\n4', expectedOutput: 'PINALSIGYAHRPI', isSample: true, isHidden: false, order: 2 },
      { name: 'single row returns input', input: 'ABCDEF\n1', expectedOutput: 'ABCDEF', isSample: false, isHidden: true, order: 3 },
      { name: 'two rows', input: 'ABCD\n2', expectedOutput: 'ACBD', isSample: false, isHidden: true, order: 4 },
      { name: 'rows exceed length', input: 'A\n5', expectedOutput: 'A', isSample: false, isHidden: true, order: 5 },
      { name: 'two-character string, one row', input: 'AB\n1', expectedOutput: 'AB', isSample: false, isHidden: true, order: 6 },
      { name: 'rows equal length', input: 'ABCDE\n5', expectedOutput: 'ABCDE', isSample: false, isHidden: true, order: 7 },
    ],
  },

  // ------------------------------------------------------------------
  // 7. binary-search (STDIN)
  // ------------------------------------------------------------------
  {
    slug: 'binary-search',
    title: 'Binary Search',
    description: `You are given a sorted array of n distinct integers in ascending order, and a target value. Find the index of the target in the array, or report -1 if it is not present. Indices are 0-based. Your algorithm must run in O(log n) time — a linear scan is conceptually wrong for this problem even if it passes small tests.

Binary search maintains a window [lo, hi] that is known to contain the target if it exists. At each step, examine the middle element: if it equals the target you are done; if it is smaller, the target can only be to the right, so move lo past the middle; if it is larger, move hi before the middle. The window shrinks by half each iteration, giving the logarithmic bound.

The classic bugs to avoid are off-by-one errors in the window updates (use lo = mid + 1 and hi = mid - 1, never lo = mid) and an incorrect loop condition (the loop should continue while lo <= hi). Also make sure you handle a single-element array and targets smaller or larger than every element.

Print the 0-based index of the target, or -1 if the target does not occur in the array.`,
    difficulty: 'Easy',
    practiceLanguage: 'JavaScript',
    companies: ['Google', 'Microsoft', 'Uber'],
    estimatedTime: '15 min',
    inputFormat: 'Three lines. The first line contains the integer n. The second line contains n space-separated integers sorted in strictly ascending order. The third line contains the integer target.',
    outputFormat: 'A single line containing the 0-based index of target in the array, or -1 if it is not present.',
    constraints: '1 <= n <= 10^5; -10^9 <= elements, target <= 10^9; all elements are distinct and sorted ascending.',
    sampleInput: '6\n-1 0 3 5 9 12\n9',
    sampleOutput: '4',
    judgeMode: 'STDIN',
    allowedLanguages: ALL_LANGS,
    starterCode: `const lines = require('fs').readFileSync(0, 'utf8').split(/\\r?\\n/);
const n = parseInt(lines[0], 10);
const nums = lines[1].trim().split(/\\s+/).map(Number).slice(0, n);
const target = parseInt(lines[2], 10);

function binarySearch(arr, t) {
  // TODO: return the 0-based index of t in arr, or -1 if absent (O(log n))
  return -1;
}

console.log(binarySearch(nums, target));
`,
    judgeReady: true,
    testCases: [
      { name: 'sample: target present', input: '6\n-1 0 3 5 9 12\n9', expectedOutput: '4', isSample: true, isHidden: false, order: 1 },
      { name: 'sample: target absent', input: '6\n-1 0 3 5 9 12\n2', expectedOutput: '-1', isSample: true, isHidden: false, order: 2 },
      { name: 'single element found', input: '1\n5\n5', expectedOutput: '0', isSample: false, isHidden: true, order: 3 },
      { name: 'single element not found', input: '1\n5\n-5', expectedOutput: '-1', isSample: false, isHidden: true, order: 4 },
      { name: 'target is first element', input: '5\n1 2 3 4 5\n1', expectedOutput: '0', isSample: false, isHidden: true, order: 5 },
      { name: 'target is last element', input: '5\n1 2 3 4 5\n5', expectedOutput: '4', isSample: false, isHidden: true, order: 6 },
      { name: 'target larger than all', input: '4\n2 4 6 8\n9', expectedOutput: '-1', isSample: false, isHidden: true, order: 7 },
    ],
  },

  // ------------------------------------------------------------------
  // 8. valid-parentheses (STDIN)
  // ------------------------------------------------------------------
  {
    slug: 'valid-parentheses',
    title: 'Valid Parentheses',
    description: `You are given a string containing only the six bracket characters: '(', ')', '{', '}', '[' and ']'. Determine whether the string is valid.

A string is valid when every opening bracket is closed by the same type of bracket, brackets are closed in the correct order (a bracket may only close when all brackets opened after it have already been closed), and every closing bracket has a corresponding opening bracket. For example, "()[]{}" is valid, "{[]}" is valid because the inner pair closes before the outer one, but "([)]" is invalid because the parenthesis closes while the square bracket opened after it is still open.

The standard solution uses a stack: push every opening bracket; on a closing bracket, check that the stack is non-empty and its top is the matching opener, then pop. After processing the whole string, the stack must be empty — a leftover opener like in "(" makes the string invalid, and a closing bracket with an empty stack like in "]" is also invalid.

Print "VALID" if the string is valid and "INVALID" otherwise.`,
    difficulty: 'Easy',
    practiceLanguage: 'JavaScript',
    companies: ['Amazon', 'Meta', 'Bloomberg'],
    estimatedTime: '15 min',
    inputFormat: "A single line containing the string s, composed only of the characters '(', ')', '{', '}', '[' and ']'.",
    outputFormat: 'A single line: "VALID" if s is a valid bracket sequence, otherwise "INVALID".',
    constraints: "1 <= s.length <= 10^4; s consists only of the characters '()[]{}'.",
    sampleInput: '()[]{}',
    sampleOutput: 'VALID',
    judgeMode: 'STDIN',
    allowedLanguages: ALL_LANGS,
    starterCode: `const s = require('fs').readFileSync(0, 'utf8').trim();

function isValid(str) {
  // TODO: return true if str is a valid bracket sequence
  return false;
}

console.log(isValid(s) ? 'VALID' : 'INVALID');
`,
    judgeReady: true,
    testCases: [
      { name: 'sample: three simple pairs', input: '()[]{}', expectedOutput: 'VALID', isSample: true, isHidden: false, order: 1 },
      { name: 'sample: mismatched pair', input: '(]', expectedOutput: 'INVALID', isSample: true, isHidden: false, order: 2 },
      { name: 'interleaved brackets', input: '([)]', expectedOutput: 'INVALID', isSample: false, isHidden: true, order: 3 },
      { name: 'properly nested', input: '{[]}', expectedOutput: 'VALID', isSample: false, isHidden: true, order: 4 },
      { name: 'unclosed opener', input: '(', expectedOutput: 'INVALID', isSample: false, isHidden: true, order: 5 },
      { name: 'closer with empty stack', input: ']', expectedOutput: 'INVALID', isSample: false, isHidden: true, order: 6 },
      { name: 'deeply nested valid', input: '((({{{[[[]]]}}})))', expectedOutput: 'VALID', isSample: false, isHidden: true, order: 7 },
    ],
  },

  // ------------------------------------------------------------------
  // 9. two-sum (STDIN)
  // ------------------------------------------------------------------
  {
    slug: 'two-sum',
    title: 'Two Sum',
    description: `Given an array of n integers and an integer target, find the two distinct indices i and j (with i < j) such that the element at i plus the element at j equals the target. Each input is guaranteed to have exactly one solution, and you may not use the same element twice.

The brute-force approach checks every pair in O(n^2) time. The expected solution runs in O(n) using a hash map: iterate through the array, and for each element x check whether target - x has been seen before; if so, you have found the pair, otherwise record x with its index and continue. Because you look backwards for the complement, each pair is discovered exactly once and the smaller index naturally comes first.

Be careful with duplicate values: for the array [3, 3] with target 6, the answer is the pair of indices 0 and 1 — a map keyed by value must be consulted before inserting the current element, or the element would match itself. Negative numbers and zero are valid inputs, so do not assume positivity anywhere.

Print the two 0-based indices in increasing order, separated by a single space.`,
    difficulty: 'Easy',
    practiceLanguage: 'JavaScript',
    companies: ['Google', 'Amazon', 'Apple'],
    estimatedTime: '15 min',
    inputFormat: 'Three lines. The first line contains the integer n. The second line contains n space-separated integers. The third line contains the integer target.',
    outputFormat: 'A single line containing two space-separated 0-based indices i and j (i < j) such that nums[i] + nums[j] = target.',
    constraints: '2 <= n <= 10^5; -10^9 <= elements, target <= 10^9; exactly one valid answer exists.',
    sampleInput: '4\n2 7 11 15\n9',
    sampleOutput: '0 1',
    judgeMode: 'STDIN',
    allowedLanguages: ALL_LANGS,
    starterCode: `const lines = require('fs').readFileSync(0, 'utf8').split(/\\r?\\n/);
const n = parseInt(lines[0], 10);
const nums = lines[1].trim().split(/\\s+/).map(Number).slice(0, n);
const target = parseInt(lines[2], 10);

function twoSum(arr, t) {
  // TODO: return [i, j] with i < j and arr[i] + arr[j] === t
  return [0, 1];
}

console.log(twoSum(nums, target).join(' '));
`,
    judgeReady: true,
    testCases: [
      { name: 'sample: classic', input: '4\n2 7 11 15\n9', expectedOutput: '0 1', isSample: true, isHidden: false, order: 1 },
      { name: 'sample: middle pair', input: '3\n3 2 4\n6', expectedOutput: '1 2', isSample: true, isHidden: false, order: 2 },
      { name: 'duplicate values', input: '2\n3 3\n6', expectedOutput: '0 1', isSample: false, isHidden: true, order: 3 },
      { name: 'non-adjacent pair', input: '5\n1 5 3 7 9\n12', expectedOutput: '1 3', isSample: false, isHidden: true, order: 4 },
      { name: 'negative plus positive', input: '4\n-3 4 3 90\n0', expectedOutput: '0 2', isSample: false, isHidden: true, order: 5 },
      { name: 'zeros sum to zero', input: '5\n0 4 3 0 9\n0', expectedOutput: '0 3', isSample: false, isHidden: true, order: 6 },
      { name: 'last two elements', input: '4\n1 2 8 9\n17', expectedOutput: '2 3', isSample: false, isHidden: true, order: 7 },
    ],
  },

  // ------------------------------------------------------------------
  // 10. longest-substring (STDIN)
  // ------------------------------------------------------------------
  {
    slug: 'longest-substring',
    title: 'Longest Substring Without Repeating Characters',
    description: `Given a string s, find the length of the longest substring that contains no repeated characters. A substring is a contiguous block of characters — "abc" is a substring of "abcabcbb", but the subsequence "acb" is not.

For "abcabcbb" the answer is 3, achieved by "abc". For "bbbbb" the answer is 1, since any longer window contains a repeated 'b'. For "pwwkew" the answer is 3, achieved by "wke" — note that "pwke" is not a valid candidate because it is a subsequence, not a substring.

The expected approach is a sliding window over the string with a map from character to its most recent index. Extend the right edge one character at a time; when the incoming character has been seen inside the current window, jump the left edge to just past that character's previous position. Each character is processed once, giving O(n) time. A subtle bug to test against: in "abba", when the second 'a' arrives, the left edge must not move backwards even though the recorded index of 'a' is small — always take the maximum of the current left edge and the jump target.

Print a single integer: the length of the longest substring without repeating characters.`,
    difficulty: 'Medium',
    practiceLanguage: 'JavaScript',
    companies: ['Amazon', 'Meta', 'Adobe'],
    estimatedTime: '20 min',
    inputFormat: 'A single line containing the string s. It consists of printable ASCII characters with no spaces.',
    outputFormat: 'A single line containing one integer: the length of the longest substring of s without repeating characters.',
    constraints: '1 <= s.length <= 5 * 10^4; s consists of printable ASCII characters (letters, digits, symbols) with no whitespace.',
    sampleInput: 'abcabcbb',
    sampleOutput: '3',
    judgeMode: 'STDIN',
    allowedLanguages: ALL_LANGS,
    starterCode: `const s = require('fs').readFileSync(0, 'utf8').trim();

function lengthOfLongestSubstring(str) {
  // TODO: return the length of the longest substring without repeating characters
  return 0;
}

console.log(lengthOfLongestSubstring(s));
`,
    judgeReady: true,
    testCases: [
      { name: 'sample: abcabcbb', input: 'abcabcbb', expectedOutput: '3', isSample: true, isHidden: false, order: 1 },
      { name: 'sample: all same char', input: 'bbbbb', expectedOutput: '1', isSample: true, isHidden: false, order: 2 },
      { name: 'pwwkew', input: 'pwwkew', expectedOutput: '3', isSample: false, isHidden: true, order: 3 },
      { name: 'single character', input: 'a', expectedOutput: '1', isSample: false, isHidden: true, order: 4 },
      { name: 'dvdf window jump', input: 'dvdf', expectedOutput: '3', isSample: false, isHidden: true, order: 5 },
      { name: 'abba left-edge trap', input: 'abba', expectedOutput: '2', isSample: false, isHidden: true, order: 6 },
      { name: 'tmmzuxt reuse after window', input: 'tmmzuxt', expectedOutput: '5', isSample: false, isHidden: true, order: 7 },
    ],
  },

  // ------------------------------------------------------------------
  // 11. hello-world (STDIN)
  // ------------------------------------------------------------------
  {
    slug: 'hello-world',
    title: 'Hello, World!',
    description: `Write a program that prints exactly the text "Hello, World!" (without the quotes) followed by a newline. The program receives no meaningful input, and any input provided should be ignored.

This is the traditional first program and doubles as a check that your submission pipeline works end to end: your code compiles or parses, runs inside the judge sandbox, and its standard output is captured and compared against the expected answer.

The output comparison is exact, so mind the details: a capital H, a capital W, a comma after "Hello", a single space before "World", and an exclamation mark at the end. "hello world", "Hello World!" (missing comma), and "Hello, World" (missing exclamation mark) are all judged wrong.`,
    difficulty: 'Easy',
    practiceLanguage: 'JavaScript',
    companies: ['TCS', 'Infosys', 'Cognizant'],
    estimatedTime: '2 min',
    inputFormat: 'No input (any provided input must be ignored).',
    outputFormat: 'A single line containing exactly: Hello, World!',
    constraints: 'None.',
    sampleInput: '',
    sampleOutput: 'Hello, World!',
    judgeMode: 'STDIN',
    allowedLanguages: ALL_LANGS,
    starterCode: `// TODO: print exactly: Hello, World!
console.log('');
`,
    judgeReady: true,
    testCases: [
      { name: 'sample: exact output', input: '', expectedOutput: 'Hello, World!', isSample: true, isHidden: false, order: 1 },
      { name: 'sample: repeat run', input: '', expectedOutput: 'Hello, World!', isSample: true, isHidden: false, order: 2 },
      { name: 'ignores stray input line', input: 'ignored\n', expectedOutput: 'Hello, World!', isSample: false, isHidden: true, order: 3 },
      { name: 'ignores numeric input', input: '12345', expectedOutput: 'Hello, World!', isSample: false, isHidden: true, order: 4 },
      { name: 'ignores multi-line input', input: 'a\nb\nc', expectedOutput: 'Hello, World!', isSample: false, isHidden: true, order: 5 },
      { name: 'deterministic output', input: '', expectedOutput: 'Hello, World!', isSample: false, isHidden: true, order: 6 },
    ],
  },

  // ------------------------------------------------------------------
  // 12. debounce (JS_FUNCTION)
  // ------------------------------------------------------------------
  {
    slug: 'debounce',
    title: 'Implement debounce',
    description: `Implement the classic debounce utility. debounce(fn, wait) returns a new function that delays invoking fn until wait milliseconds have elapsed since the last time the debounced function was called. If the debounced function is called again before the wait period expires, the pending invocation is cancelled and the timer restarts. When fn finally runs, it must be called with the arguments of the most recent call.

Debouncing is how real applications tame bursty event streams: a search box should not fire a network request on every keystroke, but only once the user pauses typing; a window resize handler should recompute layout once the user stops dragging, not sixty times per second. Your implementation is the trailing-edge variant — fn fires once, after the burst ends.

Implement it with setTimeout and clearTimeout: each call clears any pending timer and schedules a new one for wait milliseconds later. The judge harness runs your code under virtual (fake) timers, calls the debounced function at scripted virtual times, then advances time until all pending timers have fired. It records every invocation of the underlying function as an object { t, args }, where t is the virtual time at which fn ran and args is the argument list it received.

For example, with wait = 100 and calls at t = 0 with ["a"] and t = 50 with ["b"], the timer set at t = 0 is cancelled by the call at t = 50, and fn fires exactly once at t = 150 with ["b"]. Export your function via module.exports = { debounce }.`,
    difficulty: 'Medium',
    practiceLanguage: 'JavaScript',
    companies: ['Meta', 'Uber', 'Atlassian'],
    estimatedTime: '20 min',
    inputFormat: 'Harness JSON: {"fn":"debounce","wait":<ms>,"calls":[{"t":<virtualTime>,"args":[...]}]}. The harness calls the debounced function at each virtual time t with the given args, then flushes all timers.',
    outputFormat: 'JSON array of underlying-function invocations: [{"t":<virtualTime>,"args":[...]}] in chronological order.',
    constraints: '1 <= wait <= 10000; 0 <= number of calls <= 50; call times are non-negative integers in increasing order. Trailing-edge semantics only (no leading call, no maxWait).',
    sampleInput: '{"fn":"debounce","wait":100,"calls":[{"t":0,"args":["a"]},{"t":50,"args":["b"]}]}',
    sampleOutput: '[{"t":150,"args":["b"]}]',
    judgeMode: 'JS_FUNCTION',
    allowedLanguages: JS_ONLY,
    starterCode: `/**
 * Returns a debounced version of fn that fires wait ms after the last call,
 * with the arguments of the most recent call (trailing edge).
 * @param {Function} fn
 * @param {number} wait milliseconds
 * @returns {Function}
 */
function debounce(fn, wait) {
  // TODO: implement using setTimeout / clearTimeout
  return function (...args) {
    fn.apply(this, args);
  };
}

module.exports = { debounce };
`,
    judgeReady: true,
    testCases: [
      {
        name: 'sample: second call resets timer',
        input: '{"fn":"debounce","wait":100,"calls":[{"t":0,"args":["a"]},{"t":50,"args":["b"]}]}',
        expectedOutput: '[{"t":150,"args":["b"]}]',
        isSample: true, isHidden: false, order: 1,
      },
      {
        name: 'sample: single call fires after wait',
        input: '{"fn":"debounce","wait":100,"calls":[{"t":0,"args":[1]}]}',
        expectedOutput: '[{"t":100,"args":[1]}]',
        isSample: true, isHidden: false, order: 2,
      },
      {
        name: 'chain of resets fires once',
        input: '{"fn":"debounce","wait":100,"calls":[{"t":0,"args":[1]},{"t":90,"args":[2]},{"t":180,"args":[3]}]}',
        expectedOutput: '[{"t":280,"args":[3]}]',
        isSample: false, isHidden: true, order: 3,
      },
      {
        name: 'separated bursts fire independently',
        input: '{"fn":"debounce","wait":50,"calls":[{"t":0,"args":["x"]},{"t":100,"args":["y"]}]}',
        expectedOutput: '[{"t":50,"args":["x"]},{"t":150,"args":["y"]}]',
        isSample: false, isHidden: true, order: 4,
      },
      {
        name: 'long burst with late reset',
        input: '{"fn":"debounce","wait":200,"calls":[{"t":0,"args":[1]},{"t":100,"args":[2]},{"t":150,"args":[3]},{"t":300,"args":[4]}]}',
        expectedOutput: '[{"t":500,"args":[4]}]',
        isSample: false, isHidden: true, order: 5,
      },
      {
        name: 'no calls, no invocations',
        input: '{"fn":"debounce","wait":100,"calls":[]}',
        expectedOutput: '[]',
        isSample: false, isHidden: true, order: 6,
      },
      {
        name: 'multiple arguments preserved',
        input: '{"fn":"debounce","wait":100,"calls":[{"t":0,"args":[1,2,3]}]}',
        expectedOutput: '[{"t":100,"args":[1,2,3]}]',
        isSample: false, isHidden: true, order: 7,
      },
    ],
  },

  // ------------------------------------------------------------------
  // 13. deep-clone (JS_FUNCTION)
  // ------------------------------------------------------------------
  {
    slug: 'deep-clone',
    title: 'Implement deepClone',
    description: `Implement deepClone(value), a function that returns a deep copy of a JSON-style value. The input can be a primitive (number, string, boolean, null), a plain object, or an array — and objects and arrays may be nested to arbitrary depth.

A deep copy means the returned structure is completely independent of the original: every nested object and array is a fresh instance, so mutating any part of the clone must never affect the original, and vice versa. This is what distinguishes deepClone from a shallow copy such as Object.assign({}, obj) or the array spread [...arr], which copy only the top level and share all nested references.

Primitives and null should be returned as-is. For arrays, produce a new array whose elements are deep clones of the original elements, preserving order. For plain objects, produce a new object with the same keys, each mapped to a deep clone of the corresponding value. Recursion is the natural approach; take care to check for null before treating something as an object, since typeof null === "object" in JavaScript.

The judge harness calls your function with the "value" field of the test input, verifies the clone deep-equals the original, verifies the clone is not reference-equal to the original for objects and arrays (including nested levels), and verifies that mutating the clone leaves the original untouched. You may not use structuredClone or JSON.parse(JSON.stringify(...)) as a learning constraint in interviews, but the judge only checks behavior. Export via module.exports = { deepClone }.`,
    difficulty: 'Medium',
    practiceLanguage: 'JavaScript',
    companies: ['Meta', 'Flipkart', 'Razorpay'],
    estimatedTime: '20 min',
    inputFormat: 'Harness JSON: {"fn":"deepClone","value":<any JSON value>}. The harness invokes deepClone(value).',
    outputFormat: 'The cloned value serialized as JSON. It must deep-equal the input value, and the harness additionally verifies reference independence.',
    constraints: 'Values are valid JSON: numbers, strings, booleans, null, arrays and plain objects; nesting depth <= 100; no functions, Dates, Maps, Sets, or circular references.',
    sampleInput: '{"fn":"deepClone","value":{"a":1,"b":{"c":[1,2,3]}}}',
    sampleOutput: '{"a":1,"b":{"c":[1,2,3]}}',
    judgeMode: 'JS_FUNCTION',
    allowedLanguages: JS_ONLY,
    starterCode: `/**
 * Returns a deep copy of a JSON-style value (primitives, arrays, plain objects).
 * @param {*} value
 * @returns {*} a structurally equal value sharing no object/array references
 */
function deepClone(value) {
  // TODO: implement recursively; handle null, arrays, and plain objects
  return value;
}

module.exports = { deepClone };
`,
    judgeReady: true,
    testCases: [
      {
        name: 'sample: nested object with array',
        input: '{"fn":"deepClone","value":{"a":1,"b":{"c":[1,2,3]}}}',
        expectedOutput: '{"a":1,"b":{"c":[1,2,3]}}',
        isSample: true, isHidden: false, order: 1,
      },
      {
        name: 'sample: array of objects',
        input: '{"fn":"deepClone","value":[{"id":1,"tags":["a"]},{"id":2,"tags":[]}]}',
        expectedOutput: '[{"id":1,"tags":["a"]},{"id":2,"tags":[]}]',
        isSample: true, isHidden: false, order: 2,
      },
      {
        name: 'primitive number passes through',
        input: '{"fn":"deepClone","value":42}',
        expectedOutput: '42',
        isSample: false, isHidden: true, order: 3,
      },
      {
        name: 'null values preserved',
        input: '{"fn":"deepClone","value":{"a":null,"b":[null,{"c":null}]}}',
        expectedOutput: '{"a":null,"b":[null,{"c":null}]}',
        isSample: false, isHidden: true, order: 4,
      },
      {
        name: 'empty object and array',
        input: '{"fn":"deepClone","value":{"obj":{},"arr":[]}}',
        expectedOutput: '{"obj":{},"arr":[]}',
        isSample: false, isHidden: true, order: 5,
      },
      {
        name: 'deeply nested arrays',
        input: '{"fn":"deepClone","value":[[[[1]]],[2,[3,[4]]]]}',
        expectedOutput: '[[[[1]]],[2,[3,[4]]]]',
        isSample: false, isHidden: true, order: 6,
      },
      {
        name: 'mixed types',
        input: '{"fn":"deepClone","value":{"s":"text","n":3.5,"b":false,"list":[true,"x",{"k":0}]}}',
        expectedOutput: '{"s":"text","n":3.5,"b":false,"list":[true,"x",{"k":0}]}',
        isSample: false, isHidden: true, order: 7,
      },
    ],
  },

  // ------------------------------------------------------------------
  // 14. promise-allsettled (JS_FUNCTION)
  // ------------------------------------------------------------------
  {
    slug: 'promise-allsettled',
    title: 'Implement Promise.allSettled',
    description: `Implement promiseAllSettled(promises), a polyfill of the built-in Promise.allSettled. Given an array of promises, it returns a single promise that fulfills once every input promise has settled — that is, either fulfilled or rejected — and never rejects itself.

The resolved value is an array of outcome objects in the same order as the input array, regardless of the order in which the promises actually settle. A fulfilled input at position i produces { status: "fulfilled", value: <resolved value> } at position i; a rejected input produces { status: "rejected", reason: <rejection reason> }. This is what makes allSettled different from Promise.all, which short-circuits and rejects on the first failure: allSettled always waits for everything and reports each outcome individually.

The key implementation details are order preservation (write each result into a fixed slot by index, do not push results as they arrive), a settlement counter so you know when all inputs are done, and correct handling of the empty array, which must resolve immediately to []. Wrap each input with Promise.resolve so plain values are also tolerated. You may not call the built-in Promise.allSettled.

The judge harness constructs promises from task descriptors — {"type":"resolve","value":...} or {"type":"reject","reason":...}, optionally with a "delay" in milliseconds — passes them to your function, and compares the awaited result as JSON. Export via module.exports = { promiseAllSettled }.`,
    difficulty: 'Medium',
    practiceLanguage: 'JavaScript',
    companies: ['Amazon', 'Atlassian', 'Swiggy'],
    estimatedTime: '25 min',
    inputFormat: 'Harness JSON: {"fn":"promiseAllSettled","tasks":[{"type":"resolve"|"reject","value"?:any,"reason"?:any,"delay"?:ms}]}. The harness builds one promise per task and awaits promiseAllSettled(promises).',
    outputFormat: 'JSON array of settlement records in input order: {"status":"fulfilled","value":...} or {"status":"rejected","reason":...}.',
    constraints: '0 <= tasks.length <= 50; delays <= 1000 ms; the returned promise must never reject; built-in Promise.allSettled is disallowed.',
    sampleInput: '{"fn":"promiseAllSettled","tasks":[{"type":"resolve","value":1},{"type":"reject","reason":"boom"}]}',
    sampleOutput: '[{"status":"fulfilled","value":1},{"status":"rejected","reason":"boom"}]',
    judgeMode: 'JS_FUNCTION',
    allowedLanguages: JS_ONLY,
    starterCode: `/**
 * Polyfill of Promise.allSettled: resolves with an array of
 * { status: 'fulfilled', value } / { status: 'rejected', reason }
 * records in input order, after every input promise settles.
 * @param {Array<Promise<any>>} promises
 * @returns {Promise<Array<{status: string, value?: any, reason?: any}>>}
 */
function promiseAllSettled(promises) {
  // TODO: implement without using Promise.allSettled
  return Promise.resolve([]);
}

module.exports = { promiseAllSettled };
`,
    judgeReady: true,
    testCases: [
      {
        name: 'sample: one fulfilled, one rejected',
        input: '{"fn":"promiseAllSettled","tasks":[{"type":"resolve","value":1},{"type":"reject","reason":"boom"}]}',
        expectedOutput: '[{"status":"fulfilled","value":1},{"status":"rejected","reason":"boom"}]',
        isSample: true, isHidden: false, order: 1,
      },
      {
        name: 'sample: all fulfilled',
        input: '{"fn":"promiseAllSettled","tasks":[{"type":"resolve","value":"a"},{"type":"resolve","value":"b"},{"type":"resolve","value":"c"}]}',
        expectedOutput: '[{"status":"fulfilled","value":"a"},{"status":"fulfilled","value":"b"},{"status":"fulfilled","value":"c"}]',
        isSample: true, isHidden: false, order: 2,
      },
      {
        name: 'all rejected, outer promise still fulfills',
        input: '{"fn":"promiseAllSettled","tasks":[{"type":"reject","reason":"e1"},{"type":"reject","reason":"e2"}]}',
        expectedOutput: '[{"status":"rejected","reason":"e1"},{"status":"rejected","reason":"e2"}]',
        isSample: false, isHidden: true, order: 3,
      },
      {
        name: 'empty input resolves to empty array',
        input: '{"fn":"promiseAllSettled","tasks":[]}',
        expectedOutput: '[]',
        isSample: false, isHidden: true, order: 4,
      },
      {
        name: 'order preserved despite delays',
        input: '{"fn":"promiseAllSettled","tasks":[{"type":"resolve","value":"slow","delay":50},{"type":"resolve","value":"fast","delay":0}]}',
        expectedOutput: '[{"status":"fulfilled","value":"slow"},{"status":"fulfilled","value":"fast"}]',
        isSample: false, isHidden: true, order: 5,
      },
      {
        name: 'mixed outcomes with delays',
        input: '{"fn":"promiseAllSettled","tasks":[{"type":"reject","reason":"late","delay":30},{"type":"resolve","value":7},{"type":"reject","reason":"early","delay":0}]}',
        expectedOutput: '[{"status":"rejected","reason":"late"},{"status":"fulfilled","value":7},{"status":"rejected","reason":"early"}]',
        isSample: false, isHidden: true, order: 6,
      },
      {
        name: 'non-primitive values preserved',
        input: '{"fn":"promiseAllSettled","tasks":[{"type":"resolve","value":{"id":1,"tags":["x"]}},{"type":"resolve","value":[1,2]}]}',
        expectedOutput: '[{"status":"fulfilled","value":{"id":1,"tags":["x"]}},{"status":"fulfilled","value":[1,2]}]',
        isSample: false, isHidden: true, order: 7,
      },
    ],
  },

  // ------------------------------------------------------------------
  // 15. lru-cache (JS_FUNCTION)
  // ------------------------------------------------------------------
  {
    slug: 'lru-cache',
    title: 'Design an LRU Cache',
    description: `Design and implement a Least Recently Used (LRU) cache as a class. The cache is created with a fixed positive capacity and supports two operations: get(key) returns the value associated with key, or -1 if the key is not present; put(key, value) inserts the key-value pair, or updates the value if the key already exists. When inserting a new key would exceed the capacity, the least recently used key must be evicted first.

"Used" means touched by either operation: a successful get(key) makes that key the most recently used, and put(key, value) — whether inserting or updating — also makes the key the most recently used. A failed get (key absent) does not change recency of anything. This recency rule is where most buggy implementations fail, so trace it carefully: after put(1,1), put(2,2), get(1), the least recently used key is 2, and the next eviction removes 2, not 1.

The interview-grade solution achieves O(1) average time for both operations by pairing a hash map with a doubly linked list that maintains usage order (most recent at one end, eviction candidate at the other). In JavaScript there is an elegant shortcut: the built-in Map preserves insertion order, so deleting a key and re-inserting it moves it to the "most recent" end, and map.keys().next().value yields the oldest key for eviction.

The judge harness instantiates new LRUCache(capacity) and applies a scripted sequence of operations, recording null for each put and the returned value for each get. Export your class via module.exports = { LRUCache }.`,
    difficulty: 'Medium',
    practiceLanguage: 'JavaScript',
    companies: ['Amazon', 'Microsoft', 'Google'],
    estimatedTime: '30 min',
    inputFormat: 'Harness JSON: {"fn":"LRUCache","capacity":<int>,"ops":[["put",key,value] | ["get",key]]}. Keys and values are integers. The harness applies ops in order to a fresh instance.',
    outputFormat: 'JSON array with one entry per operation: null for "put", and the returned integer (or -1 when absent) for "get".',
    constraints: '1 <= capacity <= 3000; 0 <= key, value <= 10^4; up to 10^4 operations; get and put should run in O(1) average time.',
    sampleInput: '{"fn":"LRUCache","capacity":2,"ops":[["put",1,1],["put",2,2],["get",1],["put",3,3],["get",2],["put",4,4],["get",1],["get",3],["get",4]]}',
    sampleOutput: '[null,null,1,null,-1,null,-1,3,4]',
    judgeMode: 'JS_FUNCTION',
    allowedLanguages: JS_ONLY,
    starterCode: `/**
 * Least Recently Used cache with O(1) get and put.
 */
class LRUCache {
  /**
   * @param {number} capacity maximum number of entries
   */
  constructor(capacity) {
    this.capacity = capacity;
    // TODO: initialize your storage
  }

  /**
   * @param {number} key
   * @returns {number} the value for key, or -1 if absent; marks key most recently used
   */
  get(key) {
    // TODO: implement
    return -1;
  }

  /**
   * Inserts or updates key with value; evicts the least recently used
   * entry when capacity would be exceeded.
   * @param {number} key
   * @param {number} value
   */
  put(key, value) {
    // TODO: implement
  }
}

module.exports = { LRUCache };
`,
    judgeReady: true,
    testCases: [
      {
        name: 'sample: classic LeetCode sequence',
        input: '{"fn":"LRUCache","capacity":2,"ops":[["put",1,1],["put",2,2],["get",1],["put",3,3],["get",2],["put",4,4],["get",1],["get",3],["get",4]]}',
        expectedOutput: '[null,null,1,null,-1,null,-1,3,4]',
        isSample: true, isHidden: false, order: 1,
      },
      {
        name: 'sample: capacity one',
        input: '{"fn":"LRUCache","capacity":1,"ops":[["put",1,1],["get",1],["put",2,2],["get",1],["get",2]]}',
        expectedOutput: '[null,1,null,-1,2]',
        isSample: true, isHidden: false, order: 2,
      },
      {
        name: 'put updates value and recency',
        input: '{"fn":"LRUCache","capacity":2,"ops":[["put",1,1],["put",2,2],["put",1,10],["put",3,3],["get",1],["get",2],["get",3]]}',
        expectedOutput: '[null,null,null,null,10,-1,3]',
        isSample: false, isHidden: true, order: 3,
      },
      {
        name: 'get refreshes recency',
        input: '{"fn":"LRUCache","capacity":2,"ops":[["put",1,1],["put",2,2],["get",1],["put",3,3],["get",2],["get",1],["get",3]]}',
        expectedOutput: '[null,null,1,null,-1,1,3]',
        isSample: false, isHidden: true, order: 4,
      },
      {
        name: 'get on empty cache',
        input: '{"fn":"LRUCache","capacity":2,"ops":[["get",5]]}',
        expectedOutput: '[-1]',
        isSample: false, isHidden: true, order: 5,
      },
      {
        name: 'failed get does not change recency',
        input: '{"fn":"LRUCache","capacity":2,"ops":[["put",1,1],["put",2,2],["get",9],["put",3,3],["get",1],["get",2],["get",3]]}',
        expectedOutput: '[null,null,-1,null,-1,2,3]',
        isSample: false, isHidden: true, order: 6,
      },
      {
        name: 'capacity three with rolling evictions',
        input: '{"fn":"LRUCache","capacity":3,"ops":[["put",1,1],["put",2,2],["put",3,3],["get",1],["put",4,4],["get",2],["get",3],["get",4],["get",1]]}',
        expectedOutput: '[null,null,null,1,null,-1,3,4,1]',
        isSample: false, isHidden: true, order: 7,
      },
    ],
  },

  // ------------------------------------------------------------------
  // 16. curry (JS_FUNCTION)
  // ------------------------------------------------------------------
  {
    slug: 'curry',
    title: 'Implement curry',
    description: `Implement curry(fn, arity), which transforms a function into a curried version that can be called with its arguments split across any number of calls. The curried function accumulates arguments; as soon as the total number of accumulated arguments reaches the given arity, the original function is invoked with all of them and its result is returned. Until then, each call returns a new function awaiting more arguments.

For a three-argument sum, all of these must produce the same result: curried(1)(2)(3), curried(1, 2)(3), curried(1)(2, 3), and curried(1, 2, 3). Currying is a staple of functional programming — it enables partial application, where you fix some arguments now and supply the rest later, and it appears in real APIs such as Ramda and lodash/fp.

The clean recursive implementation: return a function that concatenates its received arguments onto those collected so far; if the total meets or exceeds the arity, call fn with them; otherwise recurse with the combined list. Each partial application must be independent — calling curried(1) twice and continuing each chain separately must not share state, so avoid mutating a captured array.

The judge harness curries a variadic sum function at the specified arity and evaluates each chain in "chains" (a list of call-argument groups) against your implementation. For example the chain [[1],[2],[3]] means curried(1)(2)(3). Export via module.exports = { curry }.`,
    difficulty: 'Medium',
    practiceLanguage: 'JavaScript',
    companies: ['Meta', 'Razorpay', 'Groww'],
    estimatedTime: '20 min',
    inputFormat: 'Harness JSON: {"fn":"curry","arity":<int>,"chains":[[argGroup,...],...]}. The harness computes curry(sum, arity) once per chain and applies the argument groups in sequence.',
    outputFormat: 'JSON array with the final value of each chain, in order.',
    constraints: '1 <= arity <= 6; each chain supplies exactly arity arguments in total across its groups; arguments are integers.',
    sampleInput: '{"fn":"curry","arity":3,"chains":[[[1],[2],[3]],[[1,2],[3]],[[1,2,3]]]}',
    sampleOutput: '[6,6,6]',
    judgeMode: 'JS_FUNCTION',
    allowedLanguages: JS_ONLY,
    starterCode: `/**
 * Curries fn so its arguments may be supplied across multiple calls.
 * Invokes fn once at least 'arity' arguments have accumulated.
 * @param {Function} fn
 * @param {number} arity number of arguments fn expects
 * @returns {Function}
 */
function curry(fn, arity) {
  // TODO: implement; partial applications must be independent (no shared mutable state)
  return fn;
}

module.exports = { curry };
`,
    judgeReady: true,
    testCases: [
      {
        name: 'sample: all split styles of arity 3',
        input: '{"fn":"curry","arity":3,"chains":[[[1],[2],[3]],[[1,2],[3]],[[1,2,3]]]}',
        expectedOutput: '[6,6,6]',
        isSample: true, isHidden: false, order: 1,
      },
      {
        name: 'sample: arity 2',
        input: '{"fn":"curry","arity":2,"chains":[[[4],[5]],[[4,5]]]}',
        expectedOutput: '[9,9]',
        isSample: true, isHidden: false, order: 2,
      },
      {
        name: 'arity 1 invokes immediately',
        input: '{"fn":"curry","arity":1,"chains":[[[7]],[[0]]]}',
        expectedOutput: '[7,0]',
        isSample: false, isHidden: true, order: 3,
      },
      {
        name: 'arity 4 with uneven splits',
        input: '{"fn":"curry","arity":4,"chains":[[[1],[2,3],[4]],[[1,2,3,4]],[[1],[2],[3],[4]]]}',
        expectedOutput: '[10,10,10]',
        isSample: false, isHidden: true, order: 4,
      },
      {
        name: 'negative numbers',
        input: '{"fn":"curry","arity":3,"chains":[[[-1],[-2],[-3]],[[-1,-2],[3]]]}',
        expectedOutput: '[-6,0]',
        isSample: false, isHidden: true, order: 5,
      },
      {
        name: 'independent partial applications',
        input: '{"fn":"curry","arity":2,"chains":[[[10],[1]],[[10],[2]],[[10],[3]]]}',
        expectedOutput: '[11,12,13]',
        isSample: false, isHidden: true, order: 6,
      },
      {
        name: 'zeros everywhere',
        input: '{"fn":"curry","arity":3,"chains":[[[0],[0],[0]]]}',
        expectedOutput: '[0]',
        isSample: false, isHidden: true, order: 7,
      },
    ],
  },

  // ------------------------------------------------------------------
  // 17. throttle (JS_FUNCTION)
  // ------------------------------------------------------------------
  {
    slug: 'throttle',
    title: 'Implement throttle',
    description: `Implement the throttle utility. throttle(fn, wait) returns a new function that, when called repeatedly, invokes fn at most once every wait milliseconds. This implementation uses leading-edge semantics: the very first call invokes fn immediately, and any subsequent call is ignored unless at least wait milliseconds have elapsed since the last actual invocation — in which case it invokes fn immediately with that call's arguments.

Throttling differs from debouncing in an important way: a debounced function waits for a quiet period and fires once at the end of a burst, while a throttled function fires at a steady maximum rate throughout the burst. Throttle is the right tool for scroll handlers, mousemove tracking, and rate-limiting button clicks, where you want regular updates during continuous activity rather than one update after it stops.

The implementation only needs to remember the timestamp of the last invocation: on each call, compare the current time against it; if the gap is at least wait (or there has been no invocation yet), call fn with the provided arguments and update the timestamp, otherwise do nothing. No timers are required for the leading-edge variant.

The judge harness runs your throttled function under virtual time, calling it at scripted times with scripted arguments, and records each actual invocation of the underlying function as { t, args }. For example with wait = 100 and calls at t = 0, 50, and 100, the invocations are at t = 0 and t = 100 — the call at t = 50 is swallowed. Export via module.exports = { throttle }.`,
    difficulty: 'Medium',
    practiceLanguage: 'JavaScript',
    companies: ['Uber', 'Meta', 'Zomato'],
    estimatedTime: '20 min',
    inputFormat: 'Harness JSON: {"fn":"throttle","wait":<ms>,"calls":[{"t":<virtualTime>,"args":[...]}]}. The harness calls the throttled function at each virtual time t with the given args.',
    outputFormat: 'JSON array of underlying-function invocations: [{"t":<virtualTime>,"args":[...]}] in chronological order.',
    constraints: '1 <= wait <= 10000; 0 <= number of calls <= 50; call times are non-negative integers in strictly increasing order. Leading-edge semantics only (no trailing call).',
    sampleInput: '{"fn":"throttle","wait":100,"calls":[{"t":0,"args":["a"]},{"t":50,"args":["b"]},{"t":100,"args":["c"]}]}',
    sampleOutput: '[{"t":0,"args":["a"]},{"t":100,"args":["c"]}]',
    judgeMode: 'JS_FUNCTION',
    allowedLanguages: JS_ONLY,
    starterCode: `/**
 * Returns a throttled version of fn that invokes at most once per wait ms.
 * Leading edge: the first call fires immediately; later calls fire only if
 * at least wait ms have passed since the last actual invocation.
 * @param {Function} fn
 * @param {number} wait milliseconds
 * @returns {Function}
 */
function throttle(fn, wait) {
  // TODO: implement by tracking the last invocation time
  return function (...args) {
    fn.apply(this, args);
  };
}

module.exports = { throttle };
`,
    judgeReady: true,
    testCases: [
      {
        name: 'sample: middle call swallowed',
        input: '{"fn":"throttle","wait":100,"calls":[{"t":0,"args":["a"]},{"t":50,"args":["b"]},{"t":100,"args":["c"]}]}',
        expectedOutput: '[{"t":0,"args":["a"]},{"t":100,"args":["c"]}]',
        isSample: true, isHidden: false, order: 1,
      },
      {
        name: 'sample: single call fires immediately',
        input: '{"fn":"throttle","wait":100,"calls":[{"t":0,"args":[1]}]}',
        expectedOutput: '[{"t":0,"args":[1]}]',
        isSample: true, isHidden: false, order: 2,
      },
      {
        name: 'boundary: exactly wait apart all fire',
        input: '{"fn":"throttle","wait":50,"calls":[{"t":0,"args":[1]},{"t":49,"args":[2]},{"t":50,"args":[3]},{"t":99,"args":[4]},{"t":100,"args":[5]}]}',
        expectedOutput: '[{"t":0,"args":[1]},{"t":50,"args":[3]},{"t":100,"args":[5]}]',
        isSample: false, isHidden: true, order: 3,
      },
      {
        name: 'window anchored to last invocation',
        input: '{"fn":"throttle","wait":100,"calls":[{"t":0,"args":[1]},{"t":150,"args":[2]},{"t":299,"args":[3]},{"t":300,"args":[4]}]}',
        expectedOutput: '[{"t":0,"args":[1]},{"t":150,"args":[2]},{"t":299,"args":[3]}]',
        isSample: false, isHidden: true, order: 4,
      },
      {
        name: 'sparse calls all fire',
        input: '{"fn":"throttle","wait":200,"calls":[{"t":0,"args":["x"]},{"t":200,"args":["y"]},{"t":400,"args":["z"]}]}',
        expectedOutput: '[{"t":0,"args":["x"]},{"t":200,"args":["y"]},{"t":400,"args":["z"]}]',
        isSample: false, isHidden: true, order: 5,
      },
      {
        name: 'no calls, no invocations',
        input: '{"fn":"throttle","wait":100,"calls":[]}',
        expectedOutput: '[]',
        isSample: false, isHidden: true, order: 6,
      },
      {
        name: 'multiple arguments preserved',
        input: '{"fn":"throttle","wait":100,"calls":[{"t":0,"args":[1,"two",3]}]}',
        expectedOutput: '[{"t":0,"args":[1,"two",3]}]',
        isSample: false, isHidden: true, order: 7,
      },
    ],
  },

  // ------------------------------------------------------------------
  // 18. memoize (JS_FUNCTION)
  // ------------------------------------------------------------------
  {
    slug: 'memoize',
    title: 'Implement memoize',
    description: `Implement memoize(fn), which returns a memoized version of fn: a wrapper that caches results by argument list, so calling it again with the same arguments returns the cached result without invoking fn a second time.

Memoization trades memory for speed and is everywhere in practice — caching expensive computations, deduplicating identical network requests, and React's useMemo are all variations of this idea. The essential contract is transparency: the memoized function must return exactly what fn would return for those arguments, and fn must be invoked at most once per distinct argument list.

"Same arguments" here means the argument lists serialize identically with JSON.stringify — use the serialized argument list as your cache key in a Map or plain object. Note that argument order matters: (1, 2) and (2, 1) are different keys even if fn happens to be commutative, and a call with no arguments is its own key (JSON.stringify of an empty array). Do not compare arguments by reference, and do not limit the cache size.

The judge harness wraps a spy function that sums its numeric arguments and counts how many times it actually runs. It applies your memoized wrapper to a scripted list of calls, then reports both the results of every call and the total number of raw invocations — so an implementation that forgets to cache (callCount too high) or caches incorrectly (wrong results) both fail. Export via module.exports = { memoize }.`,
    difficulty: 'Easy',
    practiceLanguage: 'JavaScript',
    companies: ['Google', 'Flipkart', 'PhonePe'],
    estimatedTime: '15 min',
    inputFormat: 'Harness JSON: {"fn":"memoize","calls":[[...args],...]}. The harness memoizes a counting sum spy and applies each argument list in order.',
    outputFormat: 'JSON object {"results":[...],"callCount":<int>} where results holds every call result in order and callCount is the number of times the underlying function actually ran.',
    constraints: '1 <= calls.length <= 100; arguments are integers; cache key equivalence is JSON.stringify of the argument list.',
    sampleInput: '{"fn":"memoize","calls":[[2,3],[2,3],[4,5]]}',
    sampleOutput: '{"results":[5,5,9],"callCount":2}',
    judgeMode: 'JS_FUNCTION',
    allowedLanguages: JS_ONLY,
    starterCode: `/**
 * Returns a memoized version of fn keyed by JSON.stringify of the argument list.
 * fn runs at most once per distinct argument list.
 * @param {Function} fn
 * @returns {Function}
 */
function memoize(fn) {
  // TODO: implement with a Map keyed by JSON.stringify(args)
  return function (...args) {
    return fn.apply(this, args);
  };
}

module.exports = { memoize };
`,
    judgeReady: true,
    testCases: [
      {
        name: 'sample: repeat call served from cache',
        input: '{"fn":"memoize","calls":[[2,3],[2,3],[4,5]]}',
        expectedOutput: '{"results":[5,5,9],"callCount":2}',
        isSample: true, isHidden: false, order: 1,
      },
      {
        name: 'sample: interleaved repeats',
        input: '{"fn":"memoize","calls":[[1],[2],[1]]}',
        expectedOutput: '{"results":[1,2,1],"callCount":2}',
        isSample: true, isHidden: false, order: 2,
      },
      {
        name: 'no-argument calls share one cache entry',
        input: '{"fn":"memoize","calls":[[],[]]}',
        expectedOutput: '{"results":[0,0],"callCount":1}',
        isSample: false, isHidden: true, order: 3,
      },
      {
        name: 'argument order matters',
        input: '{"fn":"memoize","calls":[[1,2],[2,1]]}',
        expectedOutput: '{"results":[3,3],"callCount":2}',
        isSample: false, isHidden: true, order: 4,
      },
      {
        name: 'many repeats, one invocation',
        input: '{"fn":"memoize","calls":[[5],[5],[5],[5],[5]]}',
        expectedOutput: '{"results":[5,5,5,5,5],"callCount":1}',
        isSample: false, isHidden: true, order: 5,
      },
      {
        name: 'all distinct, no cache hits',
        input: '{"fn":"memoize","calls":[[1],[2],[3],[4]]}',
        expectedOutput: '{"results":[1,2,3,4],"callCount":4}',
        isSample: false, isHidden: true, order: 6,
      },
      {
        name: 'negative numbers and zero',
        input: '{"fn":"memoize","calls":[[-1,1],[0],[-1,1],[0]]}',
        expectedOutput: '{"results":[0,0,0,0],"callCount":2}',
        isSample: false, isHidden: true, order: 7,
      },
    ],
  },

  // ------------------------------------------------------------------
  // 19. event-emitter (JS_FUNCTION)
  // ------------------------------------------------------------------
  {
    slug: 'event-emitter',
    title: 'Implement an EventEmitter',
    description: `Implement an EventEmitter class supporting the publish/subscribe pattern that underpins Node.js events, DOM event handling, and countless application architectures. Your class must provide four methods.

on(event, listener) registers a listener for the named event. Multiple listeners may be registered for the same event, and when the event is emitted they must be invoked in registration order. once(event, listener) registers a listener that runs on the next emission of the event and is then automatically removed — subsequent emissions must not invoke it. off(event, listener) removes a previously registered listener (matched by function reference); removing a listener that was never registered, or removing from an unknown event, is a silent no-op. emit(event, ...args) invokes every listener currently registered for the event, passing along all arguments; emitting an event with no listeners is also a silent no-op.

Two details deserve care. First, once-listeners must be removable with off before they ever fire, and must not fire twice even if emit is called repeatedly. Second, events are independent namespaces — listeners on "a" must never fire for "b".

The judge harness drives your class with a script of operations. Each on/once/off refers to a listener by a string label; the harness creates one listener function per label that appends [label, args] to a shared log when invoked. After running the whole script, the log is the result. For example, on("greet","A") followed by emit("greet","hi") produces the log [["A",["hi"]]]. Export via module.exports = { EventEmitter }.`,
    difficulty: 'Medium',
    practiceLanguage: 'JavaScript',
    companies: ['Netflix', 'Atlassian', 'CRED'],
    estimatedTime: '25 min',
    inputFormat: 'Harness JSON: {"fn":"EventEmitter","ops":[["on",event,label] | ["once",event,label] | ["off",event,label] | ["emit",event,...args]]}. Labels identify harness-created listener functions.',
    outputFormat: 'JSON array: the invocation log, one [label, argsArray] entry per listener invocation, in order.',
    constraints: '1 <= ops.length <= 200; event names and labels are strings; emit may carry 0 or more JSON-serializable arguments.',
    sampleInput: '{"fn":"EventEmitter","ops":[["on","greet","A"],["on","greet","B"],["emit","greet","hi"]]}',
    sampleOutput: '[["A",["hi"]],["B",["hi"]]]',
    judgeMode: 'JS_FUNCTION',
    allowedLanguages: JS_ONLY,
    starterCode: `/**
 * Minimal publish/subscribe EventEmitter.
 */
class EventEmitter {
  constructor() {
    // TODO: initialize listener storage, e.g. Map<event, listener[]>
  }

  /**
   * Registers listener for event. Listeners fire in registration order.
   * @param {string} event
   * @param {Function} listener
   */
  on(event, listener) {
    // TODO: implement
  }

  /**
   * Registers a listener that fires on the next emit only, then is removed.
   * @param {string} event
   * @param {Function} listener
   */
  once(event, listener) {
    // TODO: implement
  }

  /**
   * Removes a previously registered listener (matched by reference). No-op if absent.
   * @param {string} event
   * @param {Function} listener
   */
  off(event, listener) {
    // TODO: implement
  }

  /**
   * Invokes all listeners registered for event with the given arguments.
   * @param {string} event
   * @param {...*} args
   */
  emit(event, ...args) {
    // TODO: implement
  }
}

module.exports = { EventEmitter };
`,
    judgeReady: true,
    testCases: [
      {
        name: 'sample: two listeners in order',
        input: '{"fn":"EventEmitter","ops":[["on","greet","A"],["on","greet","B"],["emit","greet","hi"]]}',
        expectedOutput: '[["A",["hi"]],["B",["hi"]]]',
        isSample: true, isHidden: false, order: 1,
      },
      {
        name: 'sample: off removes a listener',
        input: '{"fn":"EventEmitter","ops":[["on","evt","A"],["on","evt","B"],["off","evt","A"],["emit","evt",1]]}',
        expectedOutput: '[["B",[1]]]',
        isSample: true, isHidden: false, order: 2,
      },
      {
        name: 'once fires exactly once',
        input: '{"fn":"EventEmitter","ops":[["once","evt","A"],["emit","evt",1],["emit","evt",2]]}',
        expectedOutput: '[["A",[1]]]',
        isSample: false, isHidden: true, order: 3,
      },
      {
        name: 'emit with no listeners is a no-op',
        input: '{"fn":"EventEmitter","ops":[["emit","ghost",1],["on","evt","A"],["emit","evt"]]}',
        expectedOutput: '[["A",[]]]',
        isSample: false, isHidden: true, order: 4,
      },
      {
        name: 'events are independent',
        input: '{"fn":"EventEmitter","ops":[["on","a","A"],["on","b","B"],["emit","a",1],["emit","b",2]]}',
        expectedOutput: '[["A",[1]],["B",[2]]]',
        isSample: false, isHidden: true, order: 5,
      },
      {
        name: 'once removable before firing',
        input: '{"fn":"EventEmitter","ops":[["once","evt","A"],["off","evt","A"],["emit","evt",1]]}',
        expectedOutput: '[]',
        isSample: false, isHidden: true, order: 6,
      },
      {
        name: 'multiple emits with multiple args',
        input: '{"fn":"EventEmitter","ops":[["on","evt","A"],["emit","evt",1,2],["emit","evt","x"],["off","evt","A"],["emit","evt",3]]}',
        expectedOutput: '[["A",[1,2]],["A",["x"]]]',
        isSample: false, isHidden: true, order: 7,
      },
      {
        name: 'off of unregistered listener is a no-op',
        input: '{"fn":"EventEmitter","ops":[["on","evt","A"],["off","evt","B"],["off","other","A"],["emit","evt",7]]}',
        expectedOutput: '[["A",[7]]]',
        isSample: false, isHidden: true, order: 8,
      },
    ],
  },

  // ------------------------------------------------------------------
  // 20. compose-pipe (JS_FUNCTION)
  // ------------------------------------------------------------------
  {
    slug: 'compose-pipe',
    title: 'Implement compose and pipe',
    description: `Implement the two fundamental function-combination utilities from functional programming: compose and pipe. Both take an array of unary functions and return a single new function; they differ only in the order of application.

compose(fns) applies the functions right-to-left, matching mathematical composition: compose([f, g, h])(x) equals f(g(h(x))). pipe(fns) applies them left-to-right, reading like a data pipeline: pipe([f, g, h])(x) equals h(g(f(x))). For example, with add1 and double: compose([add1, double])(5) doubles first then adds one, giving 11, while pipe([add1, double])(5) adds one first then doubles, giving 12.

Both must handle the empty array by returning the identity function — the input passes through unchanged. The idiomatic implementations are one-liners with reduceRight (for compose) and reduce (for pipe), but an explicit loop is equally acceptable; what matters is that each function receives the previous function's return value, and that the composed function itself is reusable (calling it twice with different inputs must work).

The judge harness maps the names in the "fns" field to fixed primitives — add1 (x => x + 1), double (x => x * 2), square (x => x * x), and negate (x => -x) — builds the array, calls your compose or pipe with it, applies the result to "input", and compares the final number. Export both functions via module.exports = { compose, pipe }.`,
    difficulty: 'Easy',
    practiceLanguage: 'JavaScript',
    companies: ['Meta', 'Stripe', 'Swiggy'],
    estimatedTime: '15 min',
    inputFormat: 'Harness JSON: {"fn":"compose"|"pipe","fns":["add1"|"double"|"square"|"negate",...],"input":<number>}. The harness resolves the named primitives, combines them with your function, and applies the result to input.',
    outputFormat: 'A single JSON number: the final result of the combined function applied to input.',
    constraints: '0 <= fns.length <= 20; input is an integer with |input| <= 1000; every named function is unary.',
    sampleInput: '{"fn":"compose","fns":["add1","double"],"input":5}',
    sampleOutput: '11',
    judgeMode: 'JS_FUNCTION',
    allowedLanguages: JS_ONLY,
    starterCode: `/**
 * compose([f, g, h])(x) === f(g(h(x)))  (right-to-left)
 * @param {Function[]} fns array of unary functions
 * @returns {Function}
 */
function compose(fns) {
  // TODO: implement (empty array -> identity function)
  return (x) => x;
}

/**
 * pipe([f, g, h])(x) === h(g(f(x)))  (left-to-right)
 * @param {Function[]} fns array of unary functions
 * @returns {Function}
 */
function pipe(fns) {
  // TODO: implement (empty array -> identity function)
  return (x) => x;
}

module.exports = { compose, pipe };
`,
    judgeReady: true,
    testCases: [
      {
        name: 'sample: compose right-to-left',
        input: '{"fn":"compose","fns":["add1","double"],"input":5}',
        expectedOutput: '11',
        isSample: true, isHidden: false, order: 1,
      },
      {
        name: 'sample: pipe left-to-right',
        input: '{"fn":"pipe","fns":["add1","double"],"input":5}',
        expectedOutput: '12',
        isSample: true, isHidden: false, order: 2,
      },
      {
        name: 'compose with square',
        input: '{"fn":"compose","fns":["square","add1"],"input":2}',
        expectedOutput: '9',
        isSample: false, isHidden: true, order: 3,
      },
      {
        name: 'pipe with square',
        input: '{"fn":"pipe","fns":["square","add1"],"input":2}',
        expectedOutput: '5',
        isSample: false, isHidden: true, order: 4,
      },
      {
        name: 'empty compose is identity',
        input: '{"fn":"compose","fns":[],"input":7}',
        expectedOutput: '7',
        isSample: false, isHidden: true, order: 5,
      },
      {
        name: 'empty pipe is identity',
        input: '{"fn":"pipe","fns":[],"input":-3}',
        expectedOutput: '-3',
        isSample: false, isHidden: true, order: 6,
      },
      {
        name: 'three functions composed',
        input: '{"fn":"compose","fns":["negate","double","add1"],"input":4}',
        expectedOutput: '-10',
        isSample: false, isHidden: true, order: 7,
      },
      {
        name: 'three functions piped',
        input: '{"fn":"pipe","fns":["negate","double","add1"],"input":4}',
        expectedOutput: '-7',
        isSample: false, isHidden: true, order: 8,
      },
    ],
  },
];

export default jsProblems;
