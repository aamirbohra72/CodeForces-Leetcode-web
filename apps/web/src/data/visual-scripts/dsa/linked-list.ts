import type { VisualScript } from '@/types/visual-script';
import { listStep } from './helpers';

const META = {
  section: 'Linked List',
  companies: ['Amazon', 'Microsoft', 'Meta'],
};

const reverseList: VisualScript = {
  id: 'dsa-ll-1',
  type: 'dsa',
  title: 'Reverse Linked List',
  meta: { ...META, eyebrow: 'PATTERN · ITERATIVE REVERSE', leetcode: 'LeetCode #206', difficulty: 'EASY', description: 'Reverse a singly linked list in-place using prev / curr / next pointers.' },
  defaultApproachId: 'optimized',
  approaches: [
    {
      id: 'brute',
      label: 'Brute force · copy to array',
      complexity: { time: 'O(n)', space: 'O(n)' },
      code: ['vals ← walk list to array', 'for i from n-1 down: build new list', 'return new head'],
      steps: [
        listStep(1, [{ values: [1, 2, 3, 4, 5] }], [], { space: 'O(n)' }, 'Walk the list into an array, then rebuild links backwards — extra memory.'),
        listStep(2, [{ values: [5, 4, 3, 2, 1] }], [], { result: '5→4→3→2→1' }, 'Re-link nodes from tail of array — works but uses O(n) space.'),
      ],
    },
    {
      id: 'optimized',
      label: 'Optimized · three pointers',
      complexity: { time: 'O(n)', space: 'O(1)' },
      code: ['prev ← null', 'while curr ≠ null:', '  next ← curr.next', '  curr.next ← prev', '  prev ← curr; curr ← next'],
      steps: [
        listStep(1, [{ values: [1, 2, 3, 4, 5] }], [{ name: 'curr', row: 0, index: 0, color: 'accent' }], { prev: 'null', curr: 1 }, 'Start: prev=null, curr at head (1).'),
        listStep(3, [{ values: [1, 2, 3, 4, 5] }], [{ name: 'prev', row: 0, index: 0, color: 'accent' }, { name: 'curr', row: 0, index: 1, color: 'secondary' }], { flipped: '1→null' }, 'Flip link: 1 points back to prev. Advance prev=1, curr=2.', { highlight: [{ row: 0, index: 0 }] }),
        listStep(3, [{ values: [2, 3, 4, 5] }], [{ name: 'prev', row: 0, index: 0, color: 'accent' }, { name: 'curr', row: 0, index: 1, color: 'secondary' }], { reversed: '1' }, 'Reversed segment 1←null grows. curr now at 2.'),
        listStep(4, [{ values: [5, 4, 3, 2, 1] }], [{ name: 'prev', row: 0, index: 0, color: 'accent' }], { head: 5 }, 'When curr=null, prev is new head → 5→4→3→2→1.', { highlight: [{ row: 0, index: 0 }] }),
      ],
    },
  ],
};

const mergeTwoLists: VisualScript = {
  id: 'dsa-ll-2',
  type: 'dsa',
  title: 'Merge Two Sorted Lists',
  meta: { ...META, eyebrow: 'PATTERN · TWO LIST MERGE', leetcode: 'LeetCode #21', difficulty: 'EASY', description: 'Merge two sorted linked lists into one sorted list.' },
  defaultApproachId: 'optimized',
  approaches: [
    {
      id: 'brute',
      label: 'Brute force · collect + sort',
      complexity: { time: 'O(n log n)', space: 'O(n)' },
      code: ['vals ← all nodes', 'sort vals', 'rebuild list'],
      steps: [
        listStep(1, [{ label: 'list A', values: [1, 2, 4] }, { label: 'list B', values: [1, 3, 4] }], [], {}, 'Copy both lists into an array and sort — ignores existing structure.'),
        listStep(2, [{ label: 'merged', values: [1, 1, 2, 3, 4, 4] }], [], { sorted: 'yes' }, 'Rebuild from sorted array. Works but O(n log n).'),
      ],
    },
    {
      id: 'optimized',
      label: 'Optimized · dummy + compare',
      complexity: { time: 'O(n+m)', space: 'O(1)' },
      code: ['dummy ← new node', 'while l1 and l2:', '  attach smaller head', '  advance that list', 'append remainder'],
      steps: [
        listStep(2, [{ label: 'l1', values: [1, 2, 4] }, { label: 'l2', values: [1, 3, 4] }], [{ name: 'l1', row: 0, index: 0, color: 'accent' }, { name: 'l2', row: 1, index: 0, color: 'secondary' }], { pick: 1 }, 'Both heads are 1 — take from l1, advance l1.'),
        listStep(2, [{ label: 'l1', values: [2, 4] }, { label: 'l2', values: [1, 3, 4] }], [{ name: 'l1', row: 0, index: 0, color: 'accent' }, { name: 'l2', row: 1, index: 0, color: 'secondary' }], { pick: 'l2' }, 'l2 head (1) < l1 head (2) — attach from l2.'),
        listStep(4, [{ label: 'merged', values: [1, 1, 2, 3, 4, 4] }], [], { done: 'yes' }, 'Append remaining nodes in O(n+m) — no extra array sort.'),
      ],
    },
  ],
};

const linkedListCycle: VisualScript = {
  id: 'dsa-ll-3',
  type: 'dsa',
  title: 'Linked List Cycle',
  meta: { ...META, eyebrow: 'PATTERN · FLOYD CYCLE', leetcode: 'LeetCode #141', difficulty: 'EASY', description: 'Detect if a linked list has a cycle using slow and fast pointers.' },
  defaultApproachId: 'optimized',
  approaches: [
    {
      id: 'brute',
      label: 'Brute force · hash set',
      complexity: { time: 'O(n)', space: 'O(n)' },
      code: ['seen ← set()', 'while curr:', '  if curr in seen: return true', '  seen.add(curr); curr ← curr.next'],
      steps: [
        listStep(1, [{ values: [3, 2, 0, -4] }], [{ name: 'curr', row: 0, index: 0, color: 'accent' }], { seen: '{3}' }, 'Store each visited node address in a set.', { cycle: { row: 0, toIndex: 1 } }),
        listStep(3, [{ values: [3, 2, 0, -4] }], [{ name: 'curr', row: 0, index: 1, color: 'accent' }], { revisit: 'node 2' }, 'Revisit node 2 — cycle detected. O(n) extra space.', { cycle: { row: 0, toIndex: 1 } }),
      ],
    },
    {
      id: 'optimized',
      label: 'Optimized · Floyd tortoise & hare',
      complexity: { time: 'O(n)', space: 'O(1)' },
      code: ['slow ← head, fast ← head', 'while fast and fast.next:', '  slow ← slow.next', '  fast ← fast.next.next', '  if slow = fast: cycle exists'],
      steps: [
        listStep(2, [{ values: [3, 2, 0, -4] }], [{ name: 'slow', row: 0, index: 0, color: 'accent' }, { name: 'fast', row: 0, index: 0, color: 'secondary' }], { slow: 3, fast: 3 }, 'slow moves 1 step, fast moves 2 per round.', { cycle: { row: 0, toIndex: 1 } }),
        listStep(3, [{ values: [3, 2, 0, -4] }], [{ name: 'slow', row: 0, index: 1, color: 'accent' }, { name: 'fast', row: 0, index: 2, color: 'secondary' }], { slow: 2, fast: 0 }, 'After 1 round: slow at 2, fast at 0.', { cycle: { row: 0, toIndex: 1 } }),
        listStep(4, [{ values: [3, 2, 0, -4] }], [{ name: 'slow', row: 0, index: 2, color: 'accent' }, { name: 'fast', row: 0, index: 2, color: 'secondary' }], { meet: 'yes', cycle: 'yes' }, 'Pointers meet inside cycle — O(1) space detection.', { cycle: { row: 0, toIndex: 1 }, highlight: [{ row: 0, index: 2 }] }),
      ],
    },
  ],
};

const middleNode: VisualScript = {
  id: 'dsa-ll-4',
  type: 'dsa',
  title: 'Middle of the Linked List',
  meta: { ...META, eyebrow: 'PATTERN · SLOW / FAST', leetcode: 'LeetCode #876', difficulty: 'EASY', description: 'Return the middle node. When even length, return the second middle.' },
  defaultApproachId: 'optimized',
  approaches: [
    {
      id: 'brute',
      label: 'Brute force · count then walk',
      complexity: { time: 'O(n)', space: 'O(1)' },
      code: ['count ← length of list', 'walk count/2 steps from head'],
      steps: [
        listStep(1, [{ values: [1, 2, 3, 4, 5] }], [], { count: 5 }, 'First pass: count nodes = 5.'),
        listStep(2, [{ values: [1, 2, 3, 4, 5] }], [{ name: 'curr', row: 0, index: 2, color: 'accent' }], { mid: 3 }, 'Second pass: walk 5//2 = 2 steps → node 3.'),
      ],
    },
    {
      id: 'optimized',
      label: 'Optimized · one pass slow/fast',
      complexity: { time: 'O(n)', space: 'O(1)' },
      code: ['slow ← head, fast ← head', 'while fast and fast.next:', '  slow ← slow.next', '  fast ← fast.next.next', 'return slow'],
      steps: [
        listStep(2, [{ values: [1, 2, 3, 4, 5] }], [{ name: 'slow', row: 0, index: 0, color: 'accent' }, { name: 'fast', row: 0, index: 0, color: 'secondary' }], {}, 'fast moves 2× speed of slow.'),
        listStep(3, [{ values: [1, 2, 3, 4, 5] }], [{ name: 'slow', row: 0, index: 2, color: 'accent' }, { name: 'fast', row: 0, index: 4, color: 'secondary' }], { fast: 'null next' }, 'When fast hits end, slow is at middle (index 2 → value 3).', { highlight: [{ row: 0, index: 2 }] }),
      ],
    },
  ],
};

const removeNthFromEnd: VisualScript = {
  id: 'dsa-ll-5',
  type: 'dsa',
  title: 'Remove Nth Node From End',
  meta: { ...META, eyebrow: 'PATTERN · TWO POINTER GAP', leetcode: 'LeetCode #19', difficulty: 'MEDIUM', description: 'Remove the nth node from the end in one pass using a n-gap between two pointers.' },
  defaultApproachId: 'optimized',
  approaches: [
    {
      id: 'brute',
      label: 'Brute force · two passes',
      complexity: { time: 'O(n)', space: 'O(1)' },
      code: ['count length L', 'delete node at index L-n from start'],
      steps: [
        listStep(1, [{ values: [1, 2, 3, 4, 5] }], [], { n: 2, length: 5 }, 'Count length 5. Target: 2nd from end = node 4.'),
        listStep(2, [{ values: [1, 2, 3, 5] }], [{ name: 'del', row: 0, index: 3, color: 'accent' }], { remove: 4 }, 'Walk to index L-n=3 and unlink node 4.'),
      ],
    },
    {
      id: 'optimized',
      label: 'Optimized · dummy + n-gap',
      complexity: { time: 'O(n)', space: 'O(1)' },
      code: ['dummy.next ← head', 'advance fast n+1 steps', 'while fast: slow++, fast++', 'slow.next ← slow.next.next'],
      steps: [
        listStep(2, [{ label: 'dummy→head', values: [1, 2, 3, 4, 5] }], [{ name: 'slow', row: 0, index: 0, color: 'accent' }, { name: 'fast', row: 0, index: 2, color: 'secondary' }], { n: 2, gap: 3 }, 'Move fast n+1=3 ahead of slow (via dummy).'),
        listStep(3, [{ values: [1, 2, 3, 4, 5] }], [{ name: 'slow', row: 0, index: 2, color: 'accent' }], { fast: 'null' }, 'Advance both until fast=null — slow is before target.'),
        listStep(4, [{ values: [1, 2, 3, 5] }], [{ name: 'slow', row: 0, index: 2, color: 'accent' }], { skip: 4 }, 'slow.next = slow.next.next removes node 4 in one pass.', { highlight: [{ row: 0, index: 3 }] }),
      ],
    },
  ],
};

const addTwoNumbers: VisualScript = {
  id: 'dsa-ll-6',
  type: 'dsa',
  title: 'Add Two Numbers',
  meta: { ...META, eyebrow: 'PATTERN · DIGIT LISTS', leetcode: 'LeetCode #2', difficulty: 'MEDIUM', description: 'Two lists store digits in reverse order. Add them with carry like grade-school addition.' },
  defaultApproachId: 'optimized',
  approaches: [
    {
      id: 'brute',
      label: 'Brute force · convert to integer',
      complexity: { time: 'O(n)', space: 'O(n)' },
      code: ['num1 ← int from list', 'num2 ← int from list', 'sum ← num1+num2', 'build list from sum digits'],
      steps: [
        listStep(1, [{ label: '342', values: [2, 4, 3] }, { label: '465', values: [5, 6, 4] }], [], {}, 'Read lists into big integers — overflows on long lists.'),
        listStep(2, [{ label: '807', values: [7, 0, 8] }], [], { sum: '342+465' }, 'Rebuild digit list from sum — not safe for 100+ nodes.'),
      ],
    },
    {
      id: 'optimized',
      label: 'Optimized · walk with carry',
      complexity: { time: 'O(n)', space: 'O(1) extra' },
      code: ['carry ← 0', 'while l1 or l2 or carry:', '  sum ← d1+d2+carry', '  append sum%10, carry ← sum/10'],
      steps: [
        listStep(2, [{ label: 'l1', values: [2, 4, 3] }, { label: 'l2', values: [5, 6, 4] }], [{ name: 'l1', row: 0, index: 0, color: 'accent' }, { name: 'l2', row: 1, index: 0, color: 'secondary' }], { sum: '2+5', digit: 7, carry: 0 }, '2+5=7, carry 0 → first result digit 7.'),
        listStep(2, [{ label: 'l1', values: [4, 3] }, { label: 'l2', values: [6, 4] }], [{ name: 'l1', row: 0, index: 0, color: 'accent' }, { name: 'l2', row: 1, index: 0, color: 'secondary' }], { sum: '4+6', digit: 0, carry: 1 }, '4+6=10 → digit 0, carry 1.'),
        listStep(3, [{ label: 'result', values: [7, 0, 8] }], [], { carry: 0 }, '3+4+1=8. Final list 7→0→8 (807).'),
      ],
    },
  ],
};

const intersection: VisualScript = {
  id: 'dsa-ll-7',
  type: 'dsa',
  title: 'Intersection of Two Linked Lists',
  meta: { ...META, eyebrow: 'PATTERN · ALIGN LENGTHS', leetcode: 'LeetCode #160', difficulty: 'EASY', description: 'Two lists merge into a shared tail. Find the intersection node.' },
  defaultApproachId: 'optimized',
  approaches: [
    {
      id: 'brute',
      label: 'Brute force · nested walk',
      complexity: { time: 'O(n·m)', space: 'O(1)' },
      code: ['for each node a in A:', '  for each node b in B:', '    if a=b: return a'],
      steps: [
        listStep(1, [{ label: 'A', values: [4, 1, 8, 4, 5] }, { label: 'B', values: [5, 6, 1, 8, 4, 5] }], [{ name: 'a', row: 0, index: 0, color: 'accent' }], {}, 'Compare every pair of nodes — O(n·m).'),
        listStep(2, [{ label: 'A', values: [4, 1, 8, 4, 5] }, { label: 'B', values: [5, 6, 1, 8, 4, 5] }], [{ name: 'a', row: 0, index: 2, color: 'accent' }, { name: 'b', row: 1, index: 2, color: 'secondary' }], { match: 8 }, 'Eventually both at node 8 — intersection found after many comparisons.'),
      ],
    },
    {
      id: 'optimized',
      label: 'Optimized · length alignment',
      complexity: { time: 'O(n+m)', space: 'O(1)' },
      code: ['pad shorter list with dummy length diff', 'walk both in lockstep', 'first equal node = intersection'],
      steps: [
        listStep(2, [{ label: 'A (len 5)', values: [4, 1, 8, 4, 5] }, { label: 'B (len 6)', values: [5, 6, 1, 8, 4, 5] }], [], { diff: 1 }, 'B is 1 longer — advance B by 1 so both have same remaining length.'),
        listStep(3, [{ label: 'A', values: [4, 1, 8, 4, 5] }, { label: 'B', values: [1, 8, 4, 5] }], [{ name: 'A', row: 0, index: 2, color: 'accent' }, { name: 'B', row: 1, index: 0, color: 'secondary' }], {}, 'Walk in lockstep from aligned starts.'),
        listStep(4, [{ label: 'shared tail', values: [8, 4, 5] }], [{ name: 'meet', row: 0, index: 0, color: 'accent' }], { node: 8 }, 'First matching node is intersection — shared tail 8→4→5.', { highlight: [{ row: 0, index: 0 }] }),
      ],
    },
  ],
};

const copyRandom: VisualScript = {
  id: 'dsa-ll-8',
  type: 'dsa',
  title: 'Copy List with Random Pointer',
  meta: { ...META, eyebrow: 'PATTERN · DEEP COPY + RANDOM', leetcode: 'LeetCode #138', difficulty: 'MEDIUM', description: 'Deep-copy a list where each node has next and a random pointer. Purple arcs = random links.' },
  defaultApproachId: 'optimized',
  approaches: [
    {
      id: 'brute',
      label: 'Brute force · map old→new',
      complexity: { time: 'O(n)', space: 'O(n)' },
      code: ['pass1: clone nodes, map[old]=new', 'pass2: new.next / new.random from map'],
      steps: [
        listStep(1, [{ label: 'original', values: [7, 13, 11, 10, 1] }], [], { random: '7→null,13→7,…' }, 'Build hash map from each original node to its clone.', { randomLinks: [{ row: 0, from: 1, to: 0 }, { row: 0, from: 2, to: 4 }] }),
        listStep(2, [{ label: 'clone', values: [7, 13, 11, 10, 1] }], [], { wired: 'yes' }, 'Wire next and random on clones via the map — O(n) extra space.', { randomLinks: [{ row: 0, from: 1, to: 0 }, { row: 0, from: 2, to: 4 }] }),
      ],
    },
    {
      id: 'optimized',
      label: 'Optimized · weave then split',
      complexity: { time: 'O(n)', space: 'O(1) extra' },
      code: ['interleave clone after each node', 'set random on clones via old.random.next', 'unzip into two lists'],
      steps: [
        listStep(1, [{ values: [7, '7′', 13, '13′', 11, '11′'] }], [{ name: 'curr', row: 0, index: 0, color: 'accent' }], { weave: 'old→clone→old' }, 'Insert clone right after each original node.'),
        listStep(2, [{ values: [7, '7′', 13, '13′'] }], [{ name: 'curr', row: 0, index: 0, color: 'accent' }], { random: "clone.random = old.random.next" }, 'Set clone random using weaved neighbors — no hash map.', { randomLinks: [{ row: 0, from: 1, to: 0 }] }),
        listStep(3, [{ label: 'original', values: [7, 13, 11] }, { label: 'copy', values: ['7′', '13′', '11′'] }], [], { split: 'yes' }, 'Unzip: odd positions → original, even → deep copy.'),
      ],
    },
  ],
};

const lruCache: VisualScript = {
  id: 'dsa-ll-9',
  type: 'dsa',
  title: 'LRU Cache',
  meta: { ...META, eyebrow: 'PATTERN · HASHMAP + DLL', leetcode: 'LeetCode #146', difficulty: 'MEDIUM', description: 'O(1) get/put with capacity. Doubly linked list order + hashmap to nodes. Head = most recent.' },
  defaultApproachId: 'optimized',
  approaches: [
    {
      id: 'brute',
      label: 'Brute force · array / list scan',
      complexity: { time: 'O(n) ops', space: 'O(n)' },
      code: ['store pairs in list', 'get: scan + move to front', 'put: scan / evict oldest'],
      steps: [
        listStep(1, [{ label: 'cache (MRU→LRU)', values: ['A', 'B', 'C'] }], [], { cap: 3 }, 'Scan to find key on every get — O(n).'),
        listStep(2, [{ label: 'after get(B)', values: ['B', 'A', 'C'] }], [{ name: 'hit', row: 0, index: 0, color: 'accent' }], { move: 'front' }, 'Move B to front. Evict C when capacity exceeded.'),
      ],
    },
    {
      id: 'optimized',
      label: 'Optimized · map + doubly linked list',
      complexity: { time: 'O(1)', space: 'O(capacity)' },
      code: ['map key → node', 'get: splice node to head', 'put: upsert + evict tail if over cap'],
      steps: [
        listStep(2, [{ label: 'MRU → LRU', values: [1, 2] }], [], { map: '{1,2}', cap: 2 }, 'put(1), put(2). List order = recency.'),
        listStep(2, [{ label: 'MRU → LRU', values: [1, 2] }], [{ name: 'get', row: 0, index: 0, color: 'accent' }], { get: 1 }, 'get(1) → move 1 to MRU head.', { highlight: [{ row: 0, index: 0 }] }),
        listStep(3, [{ label: 'MRU → LRU', values: [3, 1] }], [], { put: 3, evict: 2 }, 'put(3) over capacity → evict LRU (2). Map updated in O(1).'),
      ],
    },
  ],
};

const mergeKLists: VisualScript = {
  id: 'dsa-ll-10',
  type: 'dsa',
  title: 'Merge k Sorted Lists',
  meta: { ...META, eyebrow: 'PATTERN · HEAP / DIVIDE', leetcode: 'LeetCode #23', difficulty: 'HARD', description: 'Merge k sorted linked lists into one sorted list.' },
  defaultApproachId: 'optimized',
  approaches: [
    {
      id: 'brute',
      label: 'Brute force · merge one by one',
      complexity: { time: 'O(k·n)', space: 'O(1)' },
      code: ['acc ← lists[0]', 'for i=1..k-1: acc ← mergeTwo(acc, lists[i])'],
      steps: [
        listStep(1, [{ label: 'L0', values: [1, 4, 5] }, { label: 'L1', values: [1, 3, 4] }, { label: 'L2', values: [2, 6] }], [], { k: 3 }, 'Merge L0 with L1, then merge result with L2 — repeated work.'),
        listStep(2, [{ label: 'merged', values: [1, 1, 2, 3, 4, 4, 5, 6] }], [], { done: 'yes' }, 'Correct but each merge rescans growing list.'),
      ],
    },
    {
      id: 'optimized',
      label: 'Optimized · min-heap of heads',
      complexity: { time: 'O(n log k)', space: 'O(k)' },
      code: ['push all heads into min-heap', 'pop smallest, append, push its next'],
      steps: [
        listStep(1, [{ label: 'L0', values: [1, 4, 5] }, { label: 'L1', values: [1, 3, 4] }, { label: 'L2', values: [2, 6] }], [{ name: 'heap', row: 0, index: 0, color: 'accent' }], { heap: '[1,1,2]' }, 'Heap holds current heads. Pop global min 1.'),
        listStep(2, [{ label: 'out', values: [1, 1, 2, 3, 4, 4, 5, 6] }], [], { nLogK: 'yes' }, 'Each node enters/leaves heap once → O(n log k).'),
      ],
    },
  ],
};

const reverseKGroup: VisualScript = {
  id: 'dsa-ll-11',
  type: 'dsa',
  title: 'Reverse Nodes in k-Group',
  meta: { ...META, eyebrow: 'PATTERN · GROUP REVERSE', leetcode: 'LeetCode #25', difficulty: 'HARD', description: 'Reverse every contiguous group of k nodes. Leftover < k stays as-is.' },
  defaultApproachId: 'optimized',
  approaches: [
    {
      id: 'brute',
      label: 'Brute force · to array',
      complexity: { time: 'O(n)', space: 'O(n)' },
      code: ['vals ← list', 'reverse each k-chunk in array', 'rebuild list'],
      steps: [
        listStep(1, [{ values: [1, 2, 3, 4, 5] }], [], { k: 2 }, 'Dump to array, reverse pairs [1,2][3,4], leave 5.'),
        listStep(2, [{ values: [2, 1, 4, 3, 5] }], [], { rebuilt: 'yes' }, 'Rebuild list — uses O(n) memory.'),
      ],
    },
    {
      id: 'optimized',
      label: 'Optimized · in-place groups',
      complexity: { time: 'O(n)', space: 'O(1)' },
      code: ['while ≥k nodes remain:', '  reverse exactly k links', '  reconnect group to prev'],
      steps: [
        listStep(2, [{ values: [1, 2, 3, 4, 5] }], [{ name: 'start', row: 0, index: 0, color: 'accent' }], { k: 2 }, 'First group [1,2] — reverse in place.', { highlight: [{ row: 0, index: 0 }, { row: 0, index: 1 }] }),
        listStep(2, [{ values: [2, 1, 3, 4, 5] }], [{ name: 'start', row: 0, index: 2, color: 'accent' }], { nextGroup: '[3,4]' }, 'Reconnect 2→1→3. Next group [3,4].', { highlight: [{ row: 0, index: 2 }, { row: 0, index: 3 }] }),
        listStep(3, [{ values: [2, 1, 4, 3, 5] }], [], { leftover: 5 }, 'Leftover single node 5 unchanged.'),
      ],
    },
  ],
};

const palindromeList: VisualScript = {
  id: 'dsa-ll-12',
  type: 'dsa',
  title: 'Palindrome Linked List',
  meta: { ...META, eyebrow: 'PATTERN · REVERSE HALF', leetcode: 'LeetCode #234', difficulty: 'EASY', description: 'Check if list reads the same forward and backward in O(n) time / O(1) space.' },
  defaultApproachId: 'optimized',
  approaches: [
    {
      id: 'brute',
      label: 'Brute force · copy to array',
      complexity: { time: 'O(n)', space: 'O(n)' },
      code: ['vals ← list', 'two pointers on array'],
      steps: [
        listStep(1, [{ values: [1, 2, 2, 1] }], [], {}, 'Copy values, then check palindrome on array.'),
        listStep(1, [{ values: [1, 2, 2, 1] }], [{ name: 'L', row: 0, index: 0, color: 'accent' }, { name: 'R', row: 0, index: 3, color: 'secondary' }], { ok: 'yes' }, 'L/R match all the way → true.'),
      ],
    },
    {
      id: 'optimized',
      label: 'Optimized · reverse second half',
      complexity: { time: 'O(n)', space: 'O(1)' },
      code: ['find mid (slow/fast)', 'reverse second half', 'compare first vs reversed second'],
      steps: [
        listStep(1, [{ values: [1, 2, 2, 1] }], [{ name: 'slow', row: 0, index: 1, color: 'accent' }, { name: 'fast', row: 0, index: 3, color: 'secondary' }], { mid: 2 }, 'slow at mid; second half starts at next.'),
        listStep(2, [{ label: 'first', values: [1, 2] }, { label: 'rev 2nd', values: [1, 2] }], [{ name: 'p1', row: 0, index: 0, color: 'accent' }, { name: 'p2', row: 1, index: 0, color: 'secondary' }], { cmp: '1=1' }, 'Reverse second half → [1,2]. Compare node by node.'),
        listStep(3, [{ label: 'first', values: [1, 2] }, { label: 'rev 2nd', values: [1, 2] }], [], { palindrome: 'yes' }, 'All pairs equal → palindrome.'),
      ],
    },
  ],
};

const sortList: VisualScript = {
  id: 'dsa-ll-13',
  type: 'dsa',
  title: 'Sort List',
  meta: { ...META, eyebrow: 'PATTERN · MERGE SORT', leetcode: 'LeetCode #148', difficulty: 'MEDIUM', description: 'Sort a linked list in O(n log n) time and O(1)/O(log n) space via merge sort.' },
  defaultApproachId: 'optimized',
  approaches: [
    {
      id: 'brute',
      label: 'Brute force · array sort',
      complexity: { time: 'O(n log n)', space: 'O(n)' },
      code: ['dump to array', 'sort', 'rewrite node values'],
      steps: [
        listStep(1, [{ values: [4, 2, 1, 3] }], [], {}, 'Copy values off the list.'),
        listStep(2, [{ values: [1, 2, 3, 4] }], [], { sorted: 'yes' }, 'Array sort then write back — extra O(n) space.'),
      ],
    },
    {
      id: 'optimized',
      label: 'Optimized · merge sort',
      complexity: { time: 'O(n log n)', space: 'O(log n)' },
      code: ['split mid with slow/fast', 'sort(left), sort(right)', 'mergeTwoSorted'],
      steps: [
        listStep(1, [{ values: [4, 2, 1, 3] }], [{ name: 'mid', row: 0, index: 1, color: 'accent' }], { split: '4,2 | 1,3' }, 'Split at mid into two halves.'),
        listStep(2, [{ label: 'left', values: [2, 4] }, { label: 'right', values: [1, 3] }], [], { sortedHalves: 'yes' }, 'Recursively sort each half.'),
        listStep(3, [{ label: 'merged', values: [1, 2, 3, 4] }], [], { done: 'yes' }, 'Merge two sorted lists → fully sorted.'),
      ],
    },
  ],
};

const flattenMultilevel: VisualScript = {
  id: 'dsa-ll-14',
  type: 'dsa',
  title: 'Flatten a Multilevel Doubly Linked List',
  meta: { ...META, eyebrow: 'PATTERN · DFS CHILD', leetcode: 'LeetCode #430', difficulty: 'MEDIUM', description: 'Each node may have a child list. Flatten into a single-level doubly linked list in-order.' },
  defaultApproachId: 'optimized',
  approaches: [
    {
      id: 'brute',
      label: 'Brute force · DFS collect',
      complexity: { time: 'O(n)', space: 'O(n)' },
      code: ['DFS visit next/child', 'rebuild flat doubly list'],
      steps: [
        listStep(1, [{ label: 'level 1', values: [1, 2, 3] }, { label: 'child of 2', values: [7, 8] }], [{ name: '2', row: 0, index: 1, color: 'accent' }], {}, 'Node 2 has a child list 7→8.'),
        listStep(2, [{ label: 'flat', values: [1, 2, 7, 8, 3] }], [], { rebuilt: 'yes' }, 'DFS order then rebuild — extra nodes array.'),
      ],
    },
    {
      id: 'optimized',
      label: 'Optimized · splice child in place',
      complexity: { time: 'O(n)', space: 'O(1)' },
      code: ['if node.child:', '  splice child list between node and node.next', '  clear child pointer'],
      steps: [
        listStep(1, [{ label: 'level 1', values: [1, 2, 3] }, { label: 'child', values: [7, 8] }], [{ name: 'curr', row: 0, index: 1, color: 'accent' }], { child: 7 }, 'At 2: find child 7→8. Find child tail 8.'),
        listStep(2, [{ label: 'splicing', values: [1, 2, 7, 8, 3] }], [{ name: 'curr', row: 0, index: 1, color: 'accent' }], { link: '2↔7, 8↔3' }, '2.next=7, 8.next=old next (3). Clear child.'),
        listStep(3, [{ label: 'flat DLL', values: [1, 2, 7, 8, 3] }], [], { done: 'yes' }, 'Continue scan — whole multilevel list is flat.'),
      ],
    },
  ],
};

export const LINKED_LIST_SCRIPTS: Record<string, VisualScript> = {
  'll-1': reverseList,
  'll-2': mergeTwoLists,
  'll-3': linkedListCycle,
  'll-4': middleNode,
  'll-5': removeNthFromEnd,
  'll-6': addTwoNumbers,
  'll-7': intersection,
  'll-8': copyRandom,
  'll-9': lruCache,
  'll-10': mergeKLists,
  'll-11': reverseKGroup,
  'll-12': palindromeList,
  'll-13': sortList,
  'll-14': flattenMultilevel,
};
