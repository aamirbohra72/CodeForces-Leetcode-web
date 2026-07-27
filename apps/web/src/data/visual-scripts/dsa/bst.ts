import type { VisualScript } from '@/types/visual-script';
import { treeStep } from './helpers';

const META = {
  section: 'Binary Search Tree',
  companies: ['Amazon', 'Google', 'Microsoft'],
};

/** BST: 4 / 2 7 / 1 3 6 9 */
const BST = [
  { id: '4', value: 4, left: '2', right: '7' },
  { id: '2', value: 2, left: '1', right: '3' },
  { id: '7', value: 7, left: '6', right: '9' },
  { id: '1', value: 1 },
  { id: '3', value: 3 },
  { id: '6', value: 6 },
  { id: '9', value: 9 },
];

const searchBST: VisualScript = {
  id: 'dsa-bst-1',
  type: 'dsa',
  title: 'Search in a Binary Search Tree',
  meta: {
    ...META,
    eyebrow: 'PATTERN · BST WALK',
    leetcode: 'LeetCode #700',
    difficulty: 'EASY',
    description: 'At each node: go left if target < val, right if target > val. O(h) comparisons.',
  },
  defaultApproachId: 'optimized',
  approaches: [
    {
      id: 'brute',
      label: 'Brute force · DFS entire tree',
      complexity: { time: 'O(n)', space: 'O(h)' },
      code: ['DFS every node', 'return node where val=target'],
      steps: [
        treeStep(1, BST, '4', { target: 6 }, 'Visit root 4 — not 6, must check both subtrees.', { activeIds: ['4'] }),
        treeStep(1, BST, '4', { visit: '1,3,2,…' }, 'DFS visits nodes out of BST order — ignores the sorted property.', { activeIds: ['1', '3', '2'] }),
        treeStep(2, BST, '4', { found: 6 }, 'Eventually reach 6 — works but visits extra nodes.', { activeIds: ['6'], highlightIds: ['6'] }),
      ],
    },
    {
      id: 'optimized',
      label: 'Optimized · BST descent',
      complexity: { time: 'O(h)', space: 'O(1)' },
      code: ['while node:', '  if val=target: return node', '  if target<val: node←left', '  else: node←right'],
      steps: [
        treeStep(2, BST, '4', { target: 6, cmp: '6>4' }, '6 > 4 → go right to 7.', { activeIds: ['4'], highlightIds: ['7'] }),
        treeStep(2, BST, '4', { at: 7, cmp: '6<7' }, '6 < 7 → go left to 6.', { activeIds: ['7'], highlightIds: ['6'] }),
        treeStep(3, BST, '4', { found: 6 }, 'Node 6 matches — only 3 hops on this path.', { activeIds: ['6'], highlightIds: ['6'] }),
      ],
    },
  ],
};

const insertBST: VisualScript = {
  id: 'dsa-bst-2',
  type: 'dsa',
  title: 'Insert into a Binary Search Tree',
  meta: {
    ...META,
    eyebrow: 'PATTERN · FIND LEAF SLOT',
    leetcode: 'LeetCode #701',
    difficulty: 'MEDIUM',
    description: 'Walk like search until null — attach new node as left or right child.',
  },
  defaultApproachId: 'optimized',
  approaches: [
    {
      id: 'brute',
      label: 'Brute force · inorder insert + rebuild',
      complexity: { time: 'O(n)', space: 'O(n)' },
      code: ['inorder → sorted list', 'insert val in sorted position', 'rebuild balanced tree'],
      steps: [
        treeStep(1, BST, '4', { inorder: '[1,2,3,4,6,7,9]', insert: 5 }, 'Flatten to sorted list, insert 5, rebuild — O(n) extra work.', { label: 'before' }),
        treeStep(2, BST, '4', { rebuilt: 'yes' }, 'New tree valid but wasteful — full reconstruction for one insert.'),
      ],
    },
    {
      id: 'optimized',
      label: 'Optimized · walk to null',
      complexity: { time: 'O(h)', space: 'O(1)' },
      code: ['while node:', '  if val<node.val: go left else right', 'attach new node at null'],
      steps: [
        treeStep(2, BST, '4', { insert: 5, at: 4, go: 'right' }, '5 > 4 → move right toward 7.', { activeIds: ['4'], highlightIds: ['7'] }),
        treeStep(2, BST, '4', { at: 7, go: 'left' }, '5 < 7 → left child 6 exists, keep going.', { activeIds: ['7'], highlightIds: ['6'] }),
        treeStep(
          3,
          [
            ...BST.slice(0, 4),
            { id: '6', value: 6, left: null, right: '5n' },
            { id: '5n', value: 5 },
            ...BST.slice(5),
          ],
          '4',
          { attached: '5 as right of 6' },
          '6 has no right child — attach 5 there. BST property preserved.',
          { activeIds: ['6', '5n'], highlightIds: ['5n'] },
        ),
      ],
    },
  ],
};

const deleteBST: VisualScript = {
  id: 'dsa-bst-3',
  type: 'dsa',
  title: 'Delete Node in a BST',
  meta: {
    ...META,
    eyebrow: 'PATTERN · THREE CASES',
    leetcode: 'LeetCode #450',
    difficulty: 'MEDIUM',
    description: '0 children: unlink. 1 child: splice. 2 children: replace with inorder successor.',
  },
  defaultApproachId: 'optimized',
  approaches: [
    {
      id: 'brute',
      label: 'Brute force · rebuild without key',
      complexity: { time: 'O(n)', space: 'O(n)' },
      code: ['inorder list', 'remove key', 'rebuild BST from list'],
      steps: [
        treeStep(1, BST, '4', { delete: 2 }, 'Collect all values, remove 2, rebuild tree from scratch.', { activeIds: ['2'], highlightIds: ['2'] }),
        treeStep(2, BST, '4', { cost: 'O(n)' }, 'Works but ignores local structure — full rebuild.'),
      ],
    },
    {
      id: 'optimized',
      label: 'Optimized · case analysis',
      complexity: { time: 'O(h)', space: 'O(h)' },
      code: ['find node', '0 child: null link', '1 child: bypass', '2 children: swap with successor'],
      steps: [
        treeStep(2, BST, '4', { delete: 2, case: 'two children' }, 'Node 2 has children 1 and 3 — two-child case.', { activeIds: ['2'], highlightIds: ['1', '3'] }),
        treeStep(2, BST, '4', { successor: 3 }, 'Inorder successor of 2 is 3 (leftmost of right subtree).', { activeIds: ['3'], highlightIds: ['3'] }),
        treeStep(
          3,
          [
            { id: '4', value: 4, left: '3', right: '7' },
            { id: '3', value: 3, left: '1', right: null },
            { id: '7', value: 7, left: '6', right: '9' },
            { id: '1', value: 1 },
            { id: '6', value: 6 },
            { id: '9', value: 9 },
          ],
          '4',
          { done: '2 removed' },
          'Copy 3 into 2\'s position, delete old 3 — BST still valid.',
          { activeIds: ['3'] },
        ),
      ],
    },
  ],
};

const balanceBST: VisualScript = {
  id: 'dsa-bst-4',
  type: 'dsa',
  title: 'Balance a BST',
  meta: {
    ...META,
    eyebrow: 'PATTERN · INORDER + REBUILD',
    leetcode: 'LeetCode #1382',
    difficulty: 'MEDIUM',
    description: 'Skewed BST degrades to O(n) ops. Inorder gives sorted array; rebuild height-balanced tree in O(n).',
  },
  defaultApproachId: 'optimized',
  approaches: [
    {
      id: 'brute',
      label: 'Brute force · rotate one node at a time',
      complexity: { time: 'O(n log n)', space: 'O(h)' },
      code: ['while not balanced:', '  find heavy subtree', '  AVL-style rotate'],
      steps: [
        treeStep(
          1,
          [
            { id: '1', value: 1, right: '2' },
            { id: '2', value: 2, right: '3' },
            { id: '3', value: 3, right: '4' },
            { id: '4', value: 4 },
          ],
          '1',
          { height: 4, skewed: 'yes' },
          'Right-skewed chain — search is O(n).',
          { label: 'skewed' },
        ),
        treeStep(2, [{ id: '1', value: 1, right: '2' }, { id: '2', value: 2, right: '3' }, { id: '3', value: 3, right: '4' }, { id: '4', value: 4 }], '1', { rotates: 'many' }, 'Repeated single rotations — many passes to fix deep skew.'),
      ],
    },
    {
      id: 'optimized',
      label: 'Optimized · inorder + middle root',
      complexity: { time: 'O(n)', space: 'O(n)' },
      code: ['vals ← inorder(root)', 'build(lo, hi): mid ← (lo+hi)/2', 'root=vals[mid], recurse halves'],
      steps: [
        treeStep(1, [{ id: '1', value: 1, right: '2' }, { id: '2', value: 2, right: '3' }, { id: '3', value: 3, right: '4' }, { id: '4', value: 4 }], '1', { inorder: '[1,2,3,4]' }, 'Inorder skewed tree → sorted [1,2,3,4].', { label: 'skewed' }),
        treeStep(
          2,
          [
            { id: '2', value: 2, left: '1', right: '3' },
            { id: '1', value: 1 },
            { id: '3', value: 3, right: '4' },
            { id: '4', value: 4 },
          ],
          '2',
          { mid: 2, balanced: 'yes' },
          'Pick mid=2 as root, recurse on [1] and [3,4] — height O(log n).',
          { activeIds: ['2'] },
        ),
      ],
    },
  ],
};

const twoSumIV: VisualScript = {
  id: 'dsa-bst-5',
  type: 'dsa',
  title: 'Two Sum IV — Input is a BST',
  meta: {
    ...META,
    eyebrow: 'PATTERN · SET + BST WALK',
    leetcode: 'LeetCode #653',
    difficulty: 'EASY',
    description: 'For each value x, check if (k-x) exists. BST inorder + hash set, or two-pointer on sorted list.',
  },
  defaultApproachId: 'optimized',
  approaches: [
    {
      id: 'brute',
      label: 'Brute force · all pairs in tree',
      complexity: { time: 'O(n²)', space: 'O(h)' },
      code: ['collect all values', 'for each pair: if sum=k return true'],
      steps: [
        treeStep(1, BST, '4', { k: 10, pairs: 'try all' }, 'Values {1,2,3,4,6,7,9} — check every pair for sum 10.', { activeIds: ['4'] }),
        treeStep(2, BST, '4', { match: '4+6=10' }, 'Find 4 and 6 — O(n²) pair checks in worst case.', { activeIds: ['4', '6'], highlightIds: ['4', '6'] }),
      ],
    },
    {
      id: 'optimized',
      label: 'Optimized · hash set during DFS',
      complexity: { time: 'O(n)', space: 'O(n)' },
      code: ['seen ← set()', 'DFS node:', '  need ← k - val', '  if need in seen: true', '  seen.add(val)'],
      steps: [
        treeStep(2, BST, '4', { k: 10, seen: '{4}', at: 4 }, 'Visit 4, need=6 — not in set yet. Add 4.', { activeIds: ['4'] }),
        treeStep(3, BST, '4', { at: 6, need: 4, hit: 'yes' }, 'Reach 6, need=4 — 4 already in set → pair found.', { activeIds: ['6'], highlightIds: ['4', '6'] }),
      ],
    },
  ],
};

export const BST_SCRIPTS: Record<string, VisualScript> = {
  'bst-1': searchBST,
  'bst-2': insertBST,
  'bst-3': deleteBST,
  'bst-4': balanceBST,
  'bst-5': twoSumIV,
};
