import type { VisualScript } from '@/types/visual-script';
import { treeStep } from './helpers';

const META = {
  section: 'Binary Tree',
  companies: ['Amazon', 'Google', 'Meta'],
};

/** Classic tree: 3 / 9 20 / . . 15 7 */
const T = [
  { id: '3', value: 3, left: '9', right: '20' },
  { id: '9', value: 9, left: null, right: null },
  { id: '20', value: 20, left: '15', right: '7' },
  { id: '15', value: 15, left: null, right: null },
  { id: '7', value: 7, left: null, right: null },
];

const maxDepth: VisualScript = {
  id: 'dsa-bt-1',
  type: 'dsa',
  title: 'Maximum Depth of Binary Tree',
  meta: {
    ...META,
    eyebrow: 'PATTERN · DFS DEPTH',
    leetcode: 'LeetCode #104',
    difficulty: 'EASY',
    description: 'Depth of a node is 1 + max(depth(left), depth(right)). Leaf depth is 1.',
  },
  defaultApproachId: 'optimized',
  approaches: [
    {
      id: 'brute',
      label: 'Brute force · BFS levels',
      complexity: { time: 'O(n)', space: 'O(n)' },
      code: ['depth ← 0', 'queue ← [root]', 'while queue: process level; depth++'],
      steps: [
        treeStep(1, T, '3', { depth: 0 }, 'Count levels with BFS — each wave is one depth unit.', { activeIds: ['3'], label: 'level 1' }),
        treeStep(2, T, '3', { depth: 1 }, 'Level 2: nodes 9 and 20.', { activeIds: ['9', '20'], badges: { '9': 'L2', '20': 'L2' } }),
        treeStep(2, T, '3', { depth: 3 }, 'Level 3: 15 and 7. Max depth = 3.', { activeIds: ['15', '7'], badges: { '15': 'L3', '7': 'L3' } }),
      ],
    },
    {
      id: 'optimized',
      label: 'Optimized · recursive DFS',
      complexity: { time: 'O(n)', space: 'O(h)' },
      code: ['if node null: return 0', 'return 1 + max(depth(left), depth(right))'],
      steps: [
        treeStep(1, T, '3', { at: 3 }, 'Recurse into left (9) and right (20) subtrees.', { activeIds: ['3'] }),
        treeStep(2, T, '3', { left: 1, right: '...' }, 'Leaf 9 → depth 1. Right side still computing.', { activeIds: ['9'], badges: { '9': '1' } }),
        treeStep(2, T, '3', { left: 1, right: 2, ans: 3 }, 'Subtree 20 has depth 2 → root depth = 1+max(1,2)=3.', { activeIds: ['3', '20'], badges: { '3': '3', '20': '2', '9': '1' } }),
      ],
    },
  ],
};

const invertTree: VisualScript = {
  id: 'dsa-bt-2',
  type: 'dsa',
  title: 'Invert Binary Tree',
  meta: {
    ...META,
    eyebrow: 'PATTERN · SWAP CHILDREN',
    leetcode: 'LeetCode #226',
    difficulty: 'EASY',
    description: 'Swap left and right children of every node — mirror the tree.',
  },
  defaultApproachId: 'optimized',
  approaches: [
    {
      id: 'brute',
      label: 'Brute force · rebuild',
      complexity: { time: 'O(n)', space: 'O(n)' },
      code: ['copy nodes into array', 'rebuild with swapped children'],
      steps: [
        treeStep(1, T, '3', {}, 'Serialize tree, then rebuild with L/R flipped — extra structures.', { label: 'original' }),
        treeStep(
          2,
          [
            { id: '3', value: 3, left: '20', right: '9' },
            { id: '9', value: 9 },
            { id: '20', value: 20, left: '7', right: '15' },
            { id: '15', value: 15 },
            { id: '7', value: 7 },
          ],
          '3',
          { mirrored: 'yes' },
          'Mirrored tree: 9 and 20 swapped, 15 and 7 swapped.',
          { label: 'inverted' },
        ),
      ],
    },
    {
      id: 'optimized',
      label: 'Optimized · DFS swap',
      complexity: { time: 'O(n)', space: 'O(h)' },
      code: ['if null: return', 'swap left ↔ right', 'invert(left); invert(right)'],
      steps: [
        treeStep(2, T, '3', { swap: 'at root' }, 'At root 3: swap 9 ↔ 20.', { activeIds: ['3'], highlightIds: ['9', '20'] }),
        treeStep(
          3,
          [
            { id: '3', value: 3, left: '20', right: '9' },
            { id: '9', value: 9 },
            { id: '20', value: 20, left: '15', right: '7' },
            { id: '15', value: 15 },
            { id: '7', value: 7 },
          ],
          '3',
          { next: 'recurse' },
          'Root swapped. Recurse into new left (20) and swap its children.',
          { activeIds: ['20'], highlightIds: ['15', '7'] },
        ),
        treeStep(
          3,
          [
            { id: '3', value: 3, left: '20', right: '9' },
            { id: '9', value: 9 },
            { id: '20', value: 20, left: '7', right: '15' },
            { id: '15', value: 15 },
            { id: '7', value: 7 },
          ],
          '3',
          { done: 'yes' },
          'Every node swapped once — tree fully inverted.',
          { activeIds: ['3'] },
        ),
      ],
    },
  ],
};

const symmetricTree: VisualScript = {
  id: 'dsa-bt-3',
  type: 'dsa',
  title: 'Symmetric Tree',
  meta: {
    ...META,
    eyebrow: 'PATTERN · MIRROR DFS',
    leetcode: 'LeetCode #101',
    difficulty: 'EASY',
    description: 'Tree is symmetric if left and right subtrees are mirrors of each other.',
  },
  defaultApproachId: 'optimized',
  approaches: [
    {
      id: 'brute',
      label: 'Brute force · serialize both sides',
      complexity: { time: 'O(n)', space: 'O(n)' },
      code: ['serialize left subtree', 'serialize right reversed', 'compare strings'],
      steps: [
        treeStep(
          1,
          [
            { id: '1', value: 1, left: '2a', right: '2b' },
            { id: '2a', value: 2, left: '3a', right: '4a' },
            { id: '2b', value: 2, left: '4b', right: '3b' },
            { id: '3a', value: 3 },
            { id: '4a', value: 4 },
            { id: '4b', value: 4 },
            { id: '3b', value: 3 },
          ],
          '1',
          {},
          'Check if left half mirrors right half.',
          { label: 'candidate' },
        ),
      ],
    },
    {
      id: 'optimized',
      label: 'Optimized · paired DFS',
      complexity: { time: 'O(n)', space: 'O(h)' },
      code: ['isMirror(a,b):', '  both null → true', '  a.val=b.val and isMirror(a.L,b.R) and isMirror(a.R,b.L)'],
      steps: [
        treeStep(
          1,
          [
            { id: '1', value: 1, left: '2a', right: '2b' },
            { id: '2a', value: 2, left: '3a', right: '4a' },
            { id: '2b', value: 2, left: '4b', right: '3b' },
            { id: '3a', value: 3 },
            { id: '4a', value: 4 },
            { id: '4b', value: 4 },
            { id: '3b', value: 3 },
          ],
          '1',
          { pair: '2↔2' },
          'Compare left child 2 with right child 2 — values match.',
          { activeIds: ['2a', '2b'] },
        ),
        treeStep(
          2,
          [
            { id: '1', value: 1, left: '2a', right: '2b' },
            { id: '2a', value: 2, left: '3a', right: '4a' },
            { id: '2b', value: 2, left: '4b', right: '3b' },
            { id: '3a', value: 3 },
            { id: '4a', value: 4 },
            { id: '4b', value: 4 },
            { id: '3b', value: 3 },
          ],
          '1',
          { pair: '3↔3, 4↔4' },
          'Cross-check outer 3↔3 and inner 4↔4 — all mirrors match → true.',
          { activeIds: ['3a', '3b', '4a', '4b'] },
        ),
      ],
    },
  ],
};

const levelOrder: VisualScript = {
  id: 'dsa-bt-4',
  type: 'dsa',
  title: 'Binary Tree Level Order Traversal',
  meta: {
    ...META,
    eyebrow: 'PATTERN · BFS QUEUE',
    leetcode: 'LeetCode #102',
    difficulty: 'MEDIUM',
    description: 'Return values level by level, left to right, using a queue.',
  },
  defaultApproachId: 'optimized',
  approaches: [
    {
      id: 'brute',
      label: 'Brute force · DFS with depth map',
      complexity: { time: 'O(n)', space: 'O(n)' },
      code: ['map depth → list of values', 'DFS fill map', 'emit lists in order'],
      steps: [
        treeStep(1, T, '3', { mode: 'dfs' }, 'Track depth while DFS, bucket values by depth.', { activeIds: ['3'], badges: { '3': 'd0' } }),
        treeStep(2, T, '3', { buckets: '[[3],[9,20],[15,7]]' }, 'Buckets filled — assemble answer from map.', { badges: { '3': 'd0', '9': 'd1', '20': 'd1', '15': 'd2', '7': 'd2' } }),
      ],
    },
    {
      id: 'optimized',
      label: 'Optimized · BFS queue',
      complexity: { time: 'O(n)', space: 'O(w)' },
      code: ['queue ← [root]', 'while queue:', '  take size of level', '  pop size nodes, push children'],
      steps: [
        treeStep(2, T, '3', { queue: '[3]', level: '[3]' }, 'Start: dequeue 3 → level [[3]]. Enqueue 9,20.', { activeIds: ['3'], badges: { '3': 'L0' } }),
        treeStep(3, T, '3', { queue: '[9,20]', level: '[[3],[9,20]]' }, 'Next level size=2 → [9,20]. Enqueue 15,7.', { activeIds: ['9', '20'] }),
        treeStep(3, T, '3', { result: '[[3],[9,20],[15,7]]' }, 'Final level [15,7]. Answer = three lists.', { activeIds: ['15', '7'] }),
      ],
    },
  ],
};

const zigzag: VisualScript = {
  id: 'dsa-bt-5',
  type: 'dsa',
  title: 'Binary Tree Zigzag Level Order',
  meta: {
    ...META,
    eyebrow: 'PATTERN · BFS + REVERSE',
    leetcode: 'LeetCode #103',
    difficulty: 'MEDIUM',
    description: 'Level order, but alternate left→right and right→left each level.',
  },
  defaultApproachId: 'optimized',
  approaches: [
    {
      id: 'brute',
      label: 'Brute force · level then reverse odds',
      complexity: { time: 'O(n)', space: 'O(n)' },
      code: ['do normal level order', 'reverse every odd-indexed level'],
      steps: [
        treeStep(1, T, '3', { levels: '[[3],[9,20],[15,7]]' }, 'First get normal BFS levels.', { label: 'BFS first' }),
        treeStep(2, T, '3', { zigzag: '[[3],[20,9],[15,7]]' }, 'Reverse level 1 → [20,9]. Odd levels flipped.', { activeIds: ['20', '9'] }),
      ],
    },
    {
      id: 'optimized',
      label: 'Optimized · BFS with direction',
      complexity: { time: 'O(n)', space: 'O(w)' },
      code: ['BFS levels', 'if level index odd: reverse before append'],
      steps: [
        treeStep(2, T, '3', { dir: 'L→R', level: '[3]' }, 'Level 0 left→right: [3].', { activeIds: ['3'] }),
        treeStep(2, T, '3', { dir: 'R→L', level: '[20,9]' }, 'Level 1 right→left: collect [20,9].', { activeIds: ['20', '9'] }),
        treeStep(2, T, '3', { result: '[[3],[20,9],[15,7]]' }, 'Level 2 left→right again: [15,7].', { activeIds: ['15', '7'] }),
      ],
    },
  ],
};

const validateBST: VisualScript = {
  id: 'dsa-bt-6',
  type: 'dsa',
  title: 'Validate Binary Search Tree',
  meta: {
    ...META,
    eyebrow: 'PATTERN · RANGE CHECK',
    leetcode: 'LeetCode #98',
    difficulty: 'MEDIUM',
    description: 'Every node must lie strictly between (low, high) from ancestors.',
  },
  defaultApproachId: 'optimized',
  approaches: [
    {
      id: 'brute',
      label: 'Brute force · inorder check sorted',
      complexity: { time: 'O(n)', space: 'O(n)' },
      code: ['inorder traversal → list', 'check list strictly increasing'],
      steps: [
        treeStep(
          1,
          [
            { id: '5', value: 5, left: '1', right: '4' },
            { id: '1', value: 1 },
            { id: '4', value: 4, left: '3', right: '6' },
            { id: '3', value: 3 },
            { id: '6', value: 6 },
          ],
          '5',
          { inorder: '[1,5,3,4,6]' },
          'Inorder visits left→root→right. Not sorted → invalid BST.',
          { highlightIds: ['4'], label: 'invalid example' },
        ),
      ],
    },
    {
      id: 'optimized',
      label: 'Optimized · DFS with bounds',
      complexity: { time: 'O(n)', space: 'O(h)' },
      code: ['valid(node, lo, hi):', '  if node.val ≤ lo or ≥ hi: false', '  valid(left, lo, node.val) and valid(right, node.val, hi)'],
      steps: [
        treeStep(
          2,
          [
            { id: '5', value: 5, left: '1', right: '4' },
            { id: '1', value: 1 },
            { id: '4', value: 4, left: '3', right: '6' },
            { id: '3', value: 3 },
            { id: '6', value: 6 },
          ],
          '5',
          { lo: '-∞', hi: '∞' },
          'Root 5 ok. Left must be <5, right must be >5.',
          { activeIds: ['5'] },
        ),
        treeStep(
          2,
          [
            { id: '5', value: 5, left: '1', right: '4' },
            { id: '1', value: 1 },
            { id: '4', value: 4, left: '3', right: '6' },
            { id: '3', value: 3 },
            { id: '6', value: 6 },
          ],
          '5',
          { node: 4, lo: 5, hi: '∞', fail: 'yes' },
          'Node 4 is on the right of 5 but 4 < 5 — violates BST. Return false.',
          { activeIds: ['4'], highlightIds: ['5'] },
        ),
      ],
    },
  ],
};

const diameter: VisualScript = {
  id: 'dsa-bt-14',
  type: 'dsa',
  title: 'Diameter of Binary Tree',
  meta: {
    ...META,
    eyebrow: 'PATTERN · HEIGHT + PATH',
    leetcode: 'LeetCode #543',
    difficulty: 'EASY',
    description: 'Diameter = longest path between any two nodes (edge count). Path may not pass through root.',
  },
  defaultApproachId: 'optimized',
  approaches: [
    {
      id: 'brute',
      label: 'Brute force · for each node',
      complexity: { time: 'O(n²)', space: 'O(h)' },
      code: ['for each node:', '  diameter via node = height(L)+height(R)', '  track global max'],
      steps: [
        treeStep(1, T, '3', {}, 'At every node recompute left/right heights — O(n) each → O(n²).', { activeIds: ['3'] }),
        treeStep(2, T, '3', { via20: '1+1=2', via3: '1+2=3' }, 'Best path edges = 3 (9–3–20–15 or similar).', { activeIds: ['9', '3', '20', '15'] }),
      ],
    },
    {
      id: 'optimized',
      label: 'Optimized · single DFS',
      complexity: { time: 'O(n)', space: 'O(h)' },
      code: ['dfs returns height', 'at node: best ← max(best, Lh+Rh)', 'return 1+max(Lh,Rh)'],
      steps: [
        treeStep(2, T, '3', { at: 20, Lh: 1, Rh: 1 }, 'At 20: Lh+Rh=2 updates best. Return height 2.', { activeIds: ['20'], badges: { '20': 'h2' } }),
        treeStep(2, T, '3', { at: 3, Lh: 1, Rh: 2, best: 3 }, 'At root: 1+2=3 edges through root — diameter=3.', { activeIds: ['3'], badges: { '3': 'd=3' } }),
      ],
    },
  ],
};

const sameTree: VisualScript = {
  id: 'dsa-bt-15',
  type: 'dsa',
  title: 'Same Tree',
  meta: {
    ...META,
    eyebrow: 'PATTERN · PAIRED DFS',
    leetcode: 'LeetCode #100',
    difficulty: 'EASY',
    description: 'Two trees are the same if structure and values match recursively.',
  },
  defaultApproachId: 'optimized',
  approaches: [
    {
      id: 'brute',
      label: 'Brute force · serialize both',
      complexity: { time: 'O(n)', space: 'O(n)' },
      code: ['serialize A and B with null markers', 'compare strings'],
      steps: [
        treeStep(
          1,
          [
            { id: 'a1', value: 1, left: 'a2', right: 'a3' },
            { id: 'a2', value: 2 },
            { id: 'a3', value: 3 },
          ],
          'a1',
          { ser: '1,2,3' },
          'Serialize both trees and compare strings.',
          {
            label: 'tree A',
            secondary: {
              nodes: [
                { id: 'b1', value: 1, left: 'b2', right: 'b3' },
                { id: 'b2', value: 2 },
                { id: 'b3', value: 3 },
              ],
              rootId: 'b1',
              label: 'tree B',
            },
          },
        ),
      ],
    },
    {
      id: 'optimized',
      label: 'Optimized · simultaneous DFS',
      complexity: { time: 'O(n)', space: 'O(h)' },
      code: ['if both null: true', 'if one null or vals differ: false', 'same(left) and same(right)'],
      steps: [
        treeStep(
          2,
          [
            { id: 'a1', value: 1, left: 'a2', right: 'a3' },
            { id: 'a2', value: 2 },
            { id: 'a3', value: 3 },
          ],
          'a1',
          { compare: 'roots=1' },
          'Roots both 1 — continue to children.',
          {
            activeIds: ['a1'],
            label: 'tree A',
            secondary: {
              nodes: [
                { id: 'b1', value: 1, left: 'b2', right: 'b3' },
                { id: 'b2', value: 2 },
                { id: 'b3', value: 3 },
              ],
              rootId: 'b1',
              label: 'tree B',
            },
          },
        ),
        treeStep(
          3,
          [
            { id: 'a1', value: 1, left: 'a2', right: 'a3' },
            { id: 'a2', value: 2 },
            { id: 'a3', value: 3 },
          ],
          'a1',
          { result: 'true' },
          'Left 2=2 and right 3=3 — trees are identical.',
          {
            activeIds: ['a2', 'a3'],
            label: 'tree A',
            secondary: {
              nodes: [
                { id: 'b1', value: 1, left: 'b2', right: 'b3' },
                { id: 'b2', value: 2 },
                { id: 'b3', value: 3 },
              ],
              rootId: 'b1',
              label: 'tree B',
            },
          },
        ),
      ],
    },
  ],
};

const subtree: VisualScript = {
  id: 'dsa-bt-16',
  type: 'dsa',
  title: 'Subtree of Another Tree',
  meta: {
    ...META,
    eyebrow: 'PATTERN · SAME-TREE SCAN',
    leetcode: 'LeetCode #572',
    difficulty: 'EASY',
    description: 'Return true if subRoot is identical to some subtree of root.',
  },
  defaultApproachId: 'optimized',
  approaches: [
    {
      id: 'brute',
      label: 'Brute force · check every node',
      complexity: { time: 'O(n·m)', space: 'O(h)' },
      code: ['for each node in root:', '  if sameTree(node, subRoot): return true'],
      steps: [
        treeStep(
          1,
          [
            { id: '3', value: 3, left: '4', right: '5' },
            { id: '4', value: 4, left: '1', right: '2' },
            { id: '5', value: 5 },
            { id: '1', value: 1 },
            { id: '2', value: 2 },
          ],
          '3',
          { try: 'root=3' },
          'Try matching subRoot at every node of the big tree.',
          {
            label: 'root',
            secondary: {
              nodes: [
                { id: 's4', value: 4, left: 's1', right: 's2' },
                { id: 's1', value: 1 },
                { id: 's2', value: 2 },
              ],
              rootId: 's4',
              label: 'subRoot',
            },
          },
        ),
        treeStep(
          1,
          [
            { id: '3', value: 3, left: '4', right: '5' },
            { id: '4', value: 4, left: '1', right: '2' },
            { id: '5', value: 5 },
            { id: '1', value: 1 },
            { id: '2', value: 2 },
          ],
          '3',
          { match: 'at 4' },
          'Subtree rooted at 4 matches subRoot exactly → true.',
          {
            activeIds: ['4', '1', '2'],
            label: 'root',
            secondary: {
              nodes: [
                { id: 's4', value: 4, left: 's1', right: 's2' },
                { id: 's1', value: 1 },
                { id: 's2', value: 2 },
              ],
              rootId: 's4',
              label: 'subRoot',
            },
          },
        ),
      ],
    },
    {
      id: 'optimized',
      label: 'Optimized · DFS + sameTree',
      complexity: { time: 'O(n·m)', space: 'O(h)' },
      code: ['isSubtree(root):', '  if sameTree(root, sub): true', '  else isSubtree(left) or isSubtree(right)'],
      steps: [
        treeStep(
          1,
          [
            { id: '3', value: 3, left: '4', right: '5' },
            { id: '4', value: 4, left: '1', right: '2' },
            { id: '5', value: 5 },
            { id: '1', value: 1 },
            { id: '2', value: 2 },
          ],
          '3',
          { at: 3, same: 'no' },
          'Root 3 ≠ subRoot 4 — recurse left and right.',
          {
            activeIds: ['3'],
            label: 'root',
            secondary: {
              nodes: [
                { id: 's4', value: 4, left: 's1', right: 's2' },
                { id: 's1', value: 1 },
                { id: 's2', value: 2 },
              ],
              rootId: 's4',
              label: 'subRoot',
            },
          },
        ),
        treeStep(
          2,
          [
            { id: '3', value: 3, left: '4', right: '5' },
            { id: '4', value: 4, left: '1', right: '2' },
            { id: '5', value: 5 },
            { id: '1', value: 1 },
            { id: '2', value: 2 },
          ],
          '3',
          { found: 'yes' },
          'sameTree(4, subRoot) succeeds — return true.',
          {
            activeIds: ['4'],
            label: 'root',
            secondary: {
              nodes: [
                { id: 's4', value: 4, left: 's1', right: 's2' },
                { id: 's1', value: 1 },
                { id: 's2', value: 2 },
              ],
              rootId: 's4',
              label: 'subRoot',
            },
          },
        ),
      ],
    },
  ],
};

const constructTree: VisualScript = {
  id: 'dsa-bt-7',
  type: 'dsa',
  title: 'Construct Binary Tree from Traversals',
  meta: { ...META, eyebrow: 'PATTERN · PRE+IN SPLIT', leetcode: 'LeetCode #105', difficulty: 'MEDIUM', description: 'Preorder gives root; inorder locates root to split left/right subtrees.' },
  defaultApproachId: 'optimized',
  approaches: [
    {
      id: 'brute',
      label: 'Brute force · try every node as root',
      complexity: { time: 'O(n²)', space: 'O(n)' },
      code: ['for each val as root:', '  split inorder', '  verify preorder matches'],
      steps: [
        treeStep(1, [{ id: '3', value: 3 }], '3', { pre: '[3,9,20,15,7]', in: '[9,3,15,20,7]' }, 'Try each value as root and validate — O(n²) rescans.', { label: 'guess root' }),
        treeStep(2, T, '3', { built: 'yes' }, 'Root 3 confirmed when splits align — but each guess rescans inorder.', { activeIds: ['3'] }),
      ],
    },
    {
      id: 'optimized',
      label: 'Optimized · recursive split',
      complexity: { time: 'O(n)', space: 'O(n)' },
      code: ['root ← pre[0]', 'find root in inorder → mid', 'left ← build(pre[1..mid], in[0..mid))', 'right ← build rest'],
      steps: [
        treeStep(1, [{ id: '3', value: 3 }], '3', { pre0: 3, inMid: 1 }, 'pre[0]=3 is root. Inorder index 1 splits left [9] and right [15,20,7].', { activeIds: ['3'] }),
        treeStep(2, [{ id: '3', value: 3, left: '9', right: '20' }, { id: '9', value: 9 }, { id: '20', value: 20 }], '3', { leftDone: 9 }, 'Recurse: left subtree root 9; right starts at 20.', { activeIds: ['9', '20'] }),
        treeStep(3, T, '3', { done: 'yes' }, 'Full tree built in O(n) with hash map for inorder indices.', { activeIds: ['3'] }),
      ],
    },
  ],
};

const lcaBST: VisualScript = {
  id: 'dsa-bt-8',
  type: 'dsa',
  title: 'Lowest Common Ancestor of BST',
  meta: { ...META, eyebrow: 'PATTERN · BST SPLIT', leetcode: 'LeetCode #235', difficulty: 'EASY', description: 'LCA is first node where p and q diverge to different sides, or one is ancestor of the other.' },
  defaultApproachId: 'optimized',
  approaches: [
    {
      id: 'brute',
      label: 'Brute force · store path to p and q',
      complexity: { time: 'O(h)', space: 'O(h)' },
      code: ['pathP ← root→p', 'pathQ ← root→q', 'last common node in both paths'],
      steps: [
        treeStep(1, [{ id: '6', value: 6, left: '2', right: '8' }, { id: '2', value: 2, left: '0', right: '4' }, { id: '8', value: 8 }, { id: '0', value: 0 }, { id: '4', value: 4, left: '3', right: '5' }, { id: '3', value: 3 }, { id: '5', value: 5 }], '6', { pathP: '6→2', pathQ: '6→8' }, 'Walk from root recording paths to p=2 and q=8 — two arrays.', { label: 'BST' }),
        treeStep(2, [{ id: '6', value: 6, left: '2', right: '8' }, { id: '2', value: 2, left: '0', right: '4' }, { id: '8', value: 8 }, { id: '0', value: 0 }, { id: '4', value: 4, left: '3', right: '5' }, { id: '3', value: 3 }, { id: '5', value: 5 }], '6', { lca: 6 }, 'Compare paths — last match is 6. Extra O(h) space for paths.', { activeIds: ['6'], highlightIds: ['2', '8'] }),
      ],
    },
    {
      id: 'optimized',
      label: 'Optimized · walk from root',
      complexity: { time: 'O(h)', space: 'O(1)' },
      code: ['while node:', '  if p,q both < val: go left', '  elif both > val: go right', '  else: return node'],
      steps: [
        treeStep(2, [{ id: '6', value: 6, left: '2', right: '8' }, { id: '2', value: 2, left: '0', right: '4' }, { id: '8', value: 8 }, { id: '0', value: 0 }, { id: '4', value: 4, left: '3', right: '5' }, { id: '3', value: 3 }, { id: '5', value: 5 }], '6', { p: 2, q: 8, split: 'yes' }, '2 < 6 < 8 — p and q on different sides → current node 6 is LCA.', { activeIds: ['6'], highlightIds: ['2', '8'] }),
      ],
    },
  ],
};

const maxPathSum: VisualScript = {
  id: 'dsa-bt-9',
  type: 'dsa',
  title: 'Binary Tree Maximum Path Sum',
  meta: { ...META, eyebrow: 'PATTERN · GAIN + BEST', leetcode: 'LeetCode #124', difficulty: 'HARD', description: 'At each node track best downward gain and update global max for paths through node.' },
  defaultApproachId: 'optimized',
  approaches: [
    {
      id: 'brute',
      label: 'Brute force · all paths',
      complexity: { time: 'O(n²)', space: 'O(h)' },
      code: ['for each node as path apex:', '  try all left+right combinations'],
      steps: [
        treeStep(1, [{ id: '-10', value: -10, left: '9', right: '20' }, { id: '9', value: 9 }, { id: '20', value: 20, left: '15', right: '7' }, { id: '15', value: 15 }, { id: '7', value: 7 }], '-10', { try: 'every apex' }, 'For each node enumerate paths through it — O(n²) on skewed trees.', { label: 'with negatives' }),
        treeStep(2, [{ id: '-10', value: -10, left: '9', right: '20' }, { id: '9', value: 9 }, { id: '20', value: 20, left: '15', right: '7' }, { id: '15', value: 15 }, { id: '7', value: 7 }], '-10', { best: 42 }, 'Best path 15→20→7 sums to 42 — found after many checks.', { activeIds: ['15', '20', '7'] }),
      ],
    },
    {
      id: 'optimized',
      label: 'Optimized · postorder gain',
      complexity: { time: 'O(n)', space: 'O(h)' },
      code: ['dfs returns max gain down one branch', 'pathThrough = val + max(0,L) + max(0,R)', 'best = max(best, pathThrough)'],
      steps: [
        treeStep(2, [{ id: '-10', value: -10, left: '9', right: '20' }, { id: '9', value: 9 }, { id: '20', value: 20, left: '15', right: '7' }, { id: '15', value: 15 }, { id: '7', value: 7 }], '-10', { at: 20, L: 15, R: 7 }, 'At 20: gain down left=15, right=7. Path through 20 = 15+20+7=42.', { activeIds: ['20'], badges: { '20': '42' } }),
        treeStep(2, [{ id: '-10', value: -10, left: '9', right: '20' }, { id: '9', value: 9 }, { id: '20', value: 20, left: '15', right: '7' }, { id: '15', value: 15 }, { id: '7', value: 7 }], '-10', { best: 42 }, 'Return max single-branch gain upward; global best stays 42.', { badges: { '20': 'best=42' } }),
      ],
    },
  ],
};

const serializeTree: VisualScript = {
  id: 'dsa-bt-10',
  type: 'dsa',
  title: 'Serialize and Deserialize Binary Tree',
  meta: { ...META, eyebrow: 'PATTERN · PREORDER + NULL', leetcode: 'LeetCode #297', difficulty: 'HARD', description: 'Preorder with null markers uniquely encodes shape + values for reconstruction.' },
  defaultApproachId: 'optimized',
  approaches: [
    {
      id: 'brute',
      label: 'Brute force · level order only',
      complexity: { time: 'O(n)', space: 'O(n)' },
      code: ['BFS with null padding', 'rebuild level by level'],
      steps: [
        treeStep(1, T, '3', { bfs: '[3,9,20,null,null,15,7]' }, 'Level-order with many nulls — works but verbose for sparse trees.', { label: 'serialize' }),
        treeStep(2, T, '3', { rebuilt: 'yes' }, 'Rebuild from queue — extra null tokens for missing children.'),
      ],
    },
    {
      id: 'optimized',
      label: 'Optimized · preorder DFS codec',
      complexity: { time: 'O(n)', space: 'O(n)' },
      code: ['serialize: val, serialize(left), serialize(right)', 'use "#" for null', 'deserialize: read preorder'],
      steps: [
        treeStep(1, T, '3', { ser: '3,9,#,#,20,15,#,#,7,#,#' }, 'Preorder 3→9→null→null→20→15… — compact with # nulls.', { label: 'encode' }),
        treeStep(2, T, '3', { des: 'read 3, build left, right' }, 'Deserialize: read 3 as root, recurse left subtree from 9…', { activeIds: ['3'] }),
        treeStep(3, T, '3', { match: 'identical' }, 'Original tree restored — O(n) encode and decode.', { activeIds: ['3', '9', '20', '15', '7'] }),
      ],
    },
  ],
};

const pathSumIII: VisualScript = {
  id: 'dsa-bt-11',
  type: 'dsa',
  title: 'Path Sum III',
  meta: { ...META, eyebrow: 'PATTERN · PREFIX ON TREE', leetcode: 'LeetCode #437', difficulty: 'MEDIUM', description: 'Count downward paths with sum target. Prefix map on root→node sums during DFS.' },
  defaultApproachId: 'optimized',
  approaches: [
    {
      id: 'brute',
      label: 'Brute force · start at every node',
      complexity: { time: 'O(n²)', space: 'O(h)' },
      code: ['for each node:', '  dfs count paths starting here with sum k'],
      steps: [
        treeStep(1, [{ id: '10', value: 10, left: '5', right: '-3' }, { id: '5', value: 5, left: '3', right: '2' }, { id: '-3', value: -3, right: '11' }, { id: '3', value: 3, left: '3', right: '-2' }, { id: '2', value: 2 }, { id: '11', value: 11 }], '10', { k: 8, starts: 'every node' }, 'Try paths starting at 10, 5, 3… — rescans subtrees.', { label: 'k=8' }),
        treeStep(2, [{ id: '10', value: 10, left: '5', right: '-3' }, { id: '5', value: 5, left: '3', right: '2' }, { id: '-3', value: -3, right: '11' }, { id: '3', value: 3, left: '3', right: '-2' }, { id: '2', value: 2 }, { id: '11', value: 11 }], '10', { count: 3 }, 'Three paths sum to 8: 5→3, 5→2→1, -3→11 — O(n²) work.', { highlightIds: ['5', '3', '-3', '11'] }),
      ],
    },
    {
      id: 'optimized',
      label: 'Optimized · prefix map DFS',
      complexity: { time: 'O(n)', space: 'O(n)' },
      code: ['map prefixSum → count', 'dfs(node, curr):', '  curr += val', '  ans += map[curr-k]', '  recurse; backtrack map'],
      steps: [
        treeStep(2, [{ id: '10', value: 10, left: '5', right: '-3' }, { id: '5', value: 5, left: '3', right: '2' }, { id: '-3', value: -3, right: '11' }, { id: '3', value: 3, left: '3', right: '-2' }, { id: '2', value: 2 }, { id: '11', value: 11 }], '10', { curr: 15, need: 7 }, 'At node with prefix 15, look for prefix 15-8=7 in map.', { activeIds: ['5'] }),
        treeStep(3, [{ id: '10', value: 10, left: '5', right: '-3' }, { id: '5', value: 5, left: '3', right: '2' }, { id: '-3', value: -3, right: '11' }, { id: '3', value: 3, left: '3', right: '-2' }, { id: '2', value: 2 }, { id: '11', value: 11 }], '10', { count: 3 }, 'One DFS pass counts all 3 paths — O(n) with hash map.', { badges: { '10': '3 paths' } }),
      ],
    },
  ],
};

const flattenTree: VisualScript = {
  id: 'dsa-bt-12',
  type: 'dsa',
  title: 'Flatten Binary Tree to Linked List',
  meta: { ...META, eyebrow: 'PATTERN · REVERSE PREORDER', leetcode: 'LeetCode #114', difficulty: 'MEDIUM', description: 'In-place flatten to right-only list in preorder order (root, left subtree, right subtree).' },
  defaultApproachId: 'optimized',
  approaches: [
    {
      id: 'brute',
      label: 'Brute force · collect + relink',
      complexity: { time: 'O(n)', space: 'O(n)' },
      code: ['preorder → array', 'relink nodes in array order'],
      steps: [
        treeStep(1, T, '3', { pre: '[3,9,20,15,7]' }, 'Collect preorder into array — O(n) extra list.', { label: 'original' }),
        treeStep(
          2,
          [{ id: '3', value: 3, right: '9' }, { id: '9', value: 9, right: '20' }, { id: '20', value: 20, right: '15' }, { id: '15', value: 15, right: '7' }, { id: '7', value: 7 }],
          '3',
          { flat: 'yes' },
          'Rewire right pointers: 3→9→20→15→7, all left=null.',
          { label: 'flattened' },
        ),
      ],
    },
    {
      id: 'optimized',
      label: 'Optimized · Morris-style splice',
      complexity: { time: 'O(n)', space: 'O(1)' },
      code: ['while root:', '  if root.left:', '    attach rightmost of left to root.right', '    move left subtree to right', '  root ← root.right'],
      steps: [
        treeStep(2, T, '3', { at: 3, action: 'splice left 9' }, 'At 3: find rightmost of left (9), hook to old right 20, move left to right.', { activeIds: ['3'], highlightIds: ['9', '20'] }),
        treeStep(3, [{ id: '3', value: 3, right: '9' }, { id: '9', value: 9, right: '20' }, { id: '20', value: 20, left: '15', right: '7' }, { id: '15', value: 15 }, { id: '7', value: 7 }], '3', { next: 'flatten 20 subtree' }, 'Advance to 9, repeat — O(1) space in-place.', { activeIds: ['9'] }),
        treeStep(3, [{ id: '3', value: 3, right: '9' }, { id: '9', value: 9, right: '20' }, { id: '20', value: 20, right: '15' }, { id: '15', value: 15, right: '7' }, { id: '7', value: 7 }], '3', { done: 'yes' }, 'Final right chain 3→9→20→15→7, all left null.', { label: 'done' }),
      ],
    },
  ],
};

const nextRightPointers: VisualScript = {
  id: 'dsa-bt-13',
  type: 'dsa',
  title: 'Populating Next Right Pointers',
  meta: { ...META, eyebrow: 'PATTERN · LEVEL LINKS', leetcode: 'LeetCode #116', difficulty: 'MEDIUM', description: 'Connect each node to its next right node on the same level — perfect binary tree.' },
  defaultApproachId: 'optimized',
  approaches: [
    {
      id: 'brute',
      label: 'Brute force · BFS queue',
      complexity: { time: 'O(n)', space: 'O(n)' },
      code: ['level order with queue', 'link consecutive nodes in each level'],
      steps: [
        treeStep(1, [{ id: '1', value: 1, left: '2', right: '3' }, { id: '2', value: 2, left: '4', right: '5' }, { id: '3', value: 3, left: '6', right: '7' }, { id: '4', value: 4 }, { id: '5', value: 5 }, { id: '6', value: 6 }, { id: '7', value: 7 }], '1', { level: '[1]' }, 'BFS queue stores full level — O(n) extra space.', { label: 'perfect tree' }),
        treeStep(2, [{ id: '1', value: 1, left: '2', right: '3' }, { id: '2', value: 2, left: '4', right: '5' }, { id: '3', value: 3, left: '6', right: '7' }, { id: '4', value: 4 }, { id: '5', value: 5 }, { id: '6', value: 6 }, { id: '7', value: 7 }], '1', { links: '2→3, 4→5→6→7' }, 'Wire next pointers within each dequeued level.', { activeIds: ['2', '3', '4', '5'] }),
      ],
    },
    {
      id: 'optimized',
      label: 'Optimized · already-linked traversal',
      complexity: { time: 'O(n)', space: 'O(1)' },
      code: ['head ← root', 'while head:', '  connect head.left.next to head.right', '  connect head.right.next to head.next.left', '  head ← head.next'],
      steps: [
        treeStep(2, [{ id: '1', value: 1, left: '2', right: '3' }, { id: '2', value: 2, left: '4', right: '5' }, { id: '3', value: 3, left: '6', right: '7' }, { id: '4', value: 4 }, { id: '5', value: 5 }, { id: '6', value: 6 }, { id: '7', value: 7 }], '1', { link: '2→3' }, 'Use existing next on level 1: connect 2→3 via children of 1.', { activeIds: ['1'], highlightIds: ['2', '3'] }),
        treeStep(3, [{ id: '1', value: 1, left: '2', right: '3' }, { id: '2', value: 2, left: '4', right: '5' }, { id: '3', value: 3, left: '6', right: '7' }, { id: '4', value: 4 }, { id: '5', value: 5 }, { id: '6', value: 6 }, { id: '7', value: 7 }], '1', { link: '4→5→6→7' }, 'Traverse via next pointers — O(1) space links level 2.', { activeIds: ['2', '3'], highlightIds: ['4', '5', '6', '7'] }),
      ],
    },
  ],
};

const kthSmallestBST: VisualScript = {
  id: 'dsa-bt-17',
  type: 'dsa',
  title: 'Kth Smallest Element in a BST',
  meta: { ...META, eyebrow: 'PATTERN · INORDER COUNT', leetcode: 'LeetCode #230', difficulty: 'MEDIUM', description: 'Inorder traversal of BST visits values in sorted order — stop at kth node.' },
  defaultApproachId: 'optimized',
  approaches: [
    {
      id: 'brute',
      label: 'Brute force · collect all + sort',
      complexity: { time: 'O(n log n)', space: 'O(n)' },
      code: ['vals ← all nodes', 'sort vals', 'return vals[k-1]'],
      steps: [
        treeStep(1, [{ id: '5', value: 5, left: '3', right: '7' }, { id: '3', value: 3, left: '2', right: '4' }, { id: '7', value: 7 }, { id: '2', value: 2 }, { id: '4', value: 4 }], '5', { collect: '[5,3,7,2,4]' }, 'Gather all values ignoring BST order — then sort.', { label: 'BST' }),
        treeStep(2, [{ id: '5', value: 5, left: '3', right: '7' }, { id: '3', value: 3, left: '2', right: '4' }, { id: '7', value: 7 }, { id: '2', value: 2 }, { id: '4', value: 4 }], '5', { k: 3, ans: 3 }, 'Sorted [2,3,4,5,7] → 3rd smallest is 3. Wasted O(n log n).', { activeIds: ['3'] }),
      ],
    },
    {
      id: 'optimized',
      label: 'Optimized · inorder stop at k',
      complexity: { time: 'O(h+k)', space: 'O(h)' },
      code: ['inorder(node):', '  inorder(left)', '  count++; if count=k: return val', '  inorder(right)'],
      steps: [
        treeStep(2, [{ id: '5', value: 5, left: '3', right: '7' }, { id: '3', value: 3, left: '2', right: '4' }, { id: '7', value: 7 }, { id: '2', value: 2 }, { id: '4', value: 4 }], '5', { order: '2 (1st)' }, 'Inorder: visit 2 — count=1.', { activeIds: ['2'], badges: { '2': '1st' } }),
        treeStep(2, [{ id: '5', value: 5, left: '3', right: '7' }, { id: '3', value: 3, left: '2', right: '4' }, { id: '7', value: 7 }, { id: '2', value: 2 }, { id: '4', value: 4 }], '5', { order: '3 (3rd)', k: 3 }, 'Next 3 — count=3 → answer 3 without visiting 7.', { activeIds: ['3'], badges: { '3': '3rd' } }),
      ],
    },
  ],
};

const recoverBST: VisualScript = {
  id: 'dsa-bt-18',
  type: 'dsa',
  title: 'Recover Binary Search Tree',
  meta: { ...META, eyebrow: 'PATTERN · SWAPPED INORDER', leetcode: 'LeetCode #99', difficulty: 'HARD', description: 'Two nodes were swapped. Inorder has one or two adjacent violations — swap them back.' },
  defaultApproachId: 'optimized',
  approaches: [
    {
      id: 'brute',
      label: 'Brute force · sort values + reassign',
      complexity: { time: 'O(n log n)', space: 'O(n)' },
      code: ['vals ← inorder', 'sort vals', 'reassign each node in inorder walk'],
      steps: [
        treeStep(1, [{ id: '3', value: 3, left: '1', right: '4' }, { id: '1', value: 1 }, { id: '4', value: 4, left: '2' }, { id: '2', value: 2 }], '3', { inorder: '[1,3,2,4]', bad: '3>2' }, 'Inorder not sorted — collect and sort values.', { label: 'swapped' }),
        treeStep(2, [{ id: '2', value: 2, left: '1', right: '4' }, { id: '1', value: 1 }, { id: '4', value: 4, left: '3' }, { id: '3', value: 3 }], '2', { fixed: 'yes' }, 'Reassign sorted values — fixes tree but mutates structure heavily.', { label: 'reassigned' }),
      ],
    },
    {
      id: 'optimized',
      label: 'Optimized · find two violations',
      complexity: { time: 'O(n)', space: 'O(h)' },
      code: ['inorder with prev', 'if prev.val > node.val: record pair', 'swap the two bad nodes'],
      steps: [
        treeStep(2, [{ id: '3', value: 3, left: '1', right: '4' }, { id: '1', value: 1 }, { id: '4', value: 4, left: '2' }, { id: '2', value: 2 }], '3', { prev: 3, curr: 2, bad: 'yes' }, 'Inorder: prev=3 > curr=2 — first violation. Record nodes 3 and 2.', { activeIds: ['3', '2'], highlightIds: ['3', '2'] }),
        treeStep(
          3,
          [{ id: '2', value: 2, left: '1', right: '4' }, { id: '1', value: 1 }, { id: '4', value: 4, left: '3' }, { id: '3', value: 3 }],
          '2',
          { swap: '3↔2' },
          'Swap values of the two recorded nodes — BST restored in O(n).',
          { activeIds: ['2', '3'] },
        ),
      ],
    },
  ],
};

export const BINARY_TREE_SCRIPTS: Record<string, VisualScript> = {
  'bt-1': maxDepth,
  'bt-2': invertTree,
  'bt-3': symmetricTree,
  'bt-4': levelOrder,
  'bt-5': zigzag,
  'bt-6': validateBST,
  'bt-7': constructTree,
  'bt-8': lcaBST,
  'bt-9': maxPathSum,
  'bt-10': serializeTree,
  'bt-11': pathSumIII,
  'bt-12': flattenTree,
  'bt-13': nextRightPointers,
  'bt-14': diameter,
  'bt-15': sameTree,
  'bt-16': subtree,
  'bt-17': kthSmallestBST,
  'bt-18': recoverBST,
};
