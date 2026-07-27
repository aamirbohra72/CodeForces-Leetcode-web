import type { VisualScript } from '@/types/visual-script';
import { graphStep, gridStep } from './helpers';

const META = {
  section: 'Graphs',
  companies: ['Amazon', 'Google', 'Meta'],
};

/** 4-node grid for island / matrix problems */
const ISLAND_GRID = [
  ['1', '1', '0', '0'],
  ['1', '0', '0', '1'],
  ['0', '0', '1', '1'],
];

const numberOfIslands: VisualScript = {
  id: 'dsa-gr-1',
  type: 'dsa',
  title: 'Number of Islands',
  meta: { ...META, eyebrow: 'PATTERN · DFS / BFS', leetcode: 'LeetCode #200', difficulty: 'MEDIUM', description: 'Count connected components of land ("1") in a 2D grid.' },
  defaultApproachId: 'optimized',
  approaches: [
    {
      id: 'brute', label: 'Brute force · flood each unvisited land', complexity: { time: 'O(m·n)', space: 'O(m·n)' },
      code: ['for each cell: if land and unvisited: islands++', '  DFS mark entire component'],
      steps: [
        gridStep(1, ISLAND_GRID, { islands: 0 }, 'Scan row-major — first land at (0,0).', { highlight: [{ row: 0, col: 0 }] }),
        gridStep(2, ISLAND_GRID, { islands: 1 }, 'DFS marks component — still need scan for new islands.', { visited: [{ row: 0, col: 0 }, { row: 0, col: 1 }, { row: 1, col: 0 }] }),
        gridStep(3, ISLAND_GRID, { islands: 3 }, 'Three separate DFS/BFS launches → 3 islands.', { visited: [{ row: 0, col: 0 }, { row: 0, col: 1 }, { row: 1, col: 0 }, { row: 1, col: 3 }, { row: 2, col: 2 }, { row: 2, col: 3 }] }),
      ],
    },
    {
      id: 'optimized', label: 'Optimized · BFS with queue', complexity: { time: 'O(m·n)', space: 'O(min(m,n))' },
      code: ['if grid[r][c]="1": islands++', '  BFS queue flood 4-directionally'],
      steps: [
        gridStep(1, ISLAND_GRID, { found: 1 }, 'BFS from (0,0) — enqueue neighbors.', { highlight: [{ row: 0, col: 0 }], visited: [{ row: 0, col: 0 }] }),
        gridStep(2, ISLAND_GRID, { queue: 'BFS' }, 'Mark visited before enqueue to avoid duplicates.', { visited: [{ row: 0, col: 0 }, { row: 0, col: 1 }, { row: 1, col: 0 }] }),
        gridStep(3, ISLAND_GRID, { answer: 3 }, 'Repeat for unvisited land cells — total 3 islands.', { visited: [{ row: 0, col: 0 }, { row: 0, col: 1 }, { row: 1, col: 0 }, { row: 1, col: 3 }, { row: 2, col: 2 }, { row: 2, col: 3 }] }),
      ],
    },
  ],
};

const CLONE_NODES = [
  { id: '1', label: '1', x: 120, y: 80 },
  { id: '2', label: '2', x: 220, y: 50 },
  { id: '3', label: '3', x: 220, y: 130 },
  { id: '4', label: '4', x: 320, y: 80 },
];
const CLONE_EDGES = [
  { from: '1', to: '2' },
  { from: '1', to: '3' },
  { from: '2', to: '4' },
  { from: '3', to: '4' },
];

const cloneGraph: VisualScript = {
  id: 'dsa-gr-2',
  type: 'dsa',
  title: 'Clone Graph',
  meta: { ...META, eyebrow: 'PATTERN · BFS + HASH MAP', leetcode: 'LeetCode #133', difficulty: 'MEDIUM', description: 'Deep copy an undirected graph with random pointers.' },
  defaultApproachId: 'optimized',
  approaches: [
    {
      id: 'brute', label: 'Brute force · clone without map', complexity: { time: 'O(V+E)', space: 'O(V)' },
      code: ['recursive clone(node): if seen return copy', '  without map → infinite loop on cycles'],
      steps: [
        graphStep(1, CLONE_NODES, CLONE_EDGES, { risk: 'cycle' }, 'Naive recursion revisits node 1→2→4→…', { active: ['1'] }),
        graphStep(2, CLONE_NODES, CLONE_EDGES, { problem: 'duplicate' }, 'Without old→new map, same node cloned repeatedly.', { active: ['2'] }),
      ],
    },
    {
      id: 'optimized', label: 'Optimized · BFS + clone map', complexity: { time: 'O(V+E)', space: 'O(V)' },
      code: ['map←{}; queue←[node]', 'while q: clone neighbors; map[old]=new'],
      steps: [
        graphStep(1, CLONE_NODES, CLONE_EDGES, { map: '{1→1\'}' }, 'Start BFS at node 1 — clone and store in map.', { active: ['1'], queue: ['1'] }),
        graphStep(2, CLONE_NODES, CLONE_EDGES, { map: '1,2,3' }, 'Clone neighbors 2,3; enqueue unmapped.', { active: ['2', '3'], visited: ['1'], queue: ['2', '3'] }),
        graphStep(3, CLONE_NODES, CLONE_EDGES, { done: 'yes' }, 'Clone node 4 — all edges wired to new nodes.', { visited: ['1', '2', '3', '4'] }),
      ],
    },
  ],
};

const CS_NODES = [
  { id: '0', label: '0', x: 80, y: 60 },
  { id: '1', label: '1', x: 200, y: 40 },
  { id: '2', label: '2', x: 200, y: 120 },
  { id: '3', label: '3', x: 320, y: 80 },
];
const CS_EDGES = [
  { from: '0', to: '1' },
  { from: '0', to: '2' },
  { from: '1', to: '3' },
  { from: '2', to: '3' },
];

const courseSchedule: VisualScript = {
  id: 'dsa-gr-3',
  type: 'dsa',
  title: 'Course Schedule',
  meta: { ...META, eyebrow: 'PATTERN · CYCLE DETECT', leetcode: 'LeetCode #207', difficulty: 'MEDIUM', description: 'Can you finish all courses given prerequisites (directed edges)?' },
  defaultApproachId: 'optimized',
  approaches: [
    {
      id: 'brute', label: 'Brute force · try all orderings', complexity: { time: 'O(n!)', space: 'O(n)' },
      code: ['permutations of courses; check each prereq satisfied'],
      steps: [
        graphStep(1, CS_NODES, CS_EDGES, { try: 'orderings' }, '4 courses → 24 permutations to validate.', { active: ['0'] }),
        graphStep(1, CS_NODES, CS_EDGES, { fail: 'prereq' }, 'Most orderings violate 0 before 1,2.', {}),
      ],
    },
    {
      id: 'optimized', label: 'Optimized · Kahn topo / DFS cycle', complexity: { time: 'O(V+E)', space: 'O(V+E)' },
      code: ['indegree[v]=prereq count', 'BFS nodes with indegree 0', 'if processed≠n → cycle'],
      steps: [
        graphStep(1, CS_NODES, CS_EDGES, { indeg: '0→0, 1→1, 2→1, 3→2' }, 'Compute indegrees from prereq edges.', { queue: ['0'] }),
        graphStep(2, CS_NODES, CS_EDGES, { pop: 0 }, 'Process 0 — reduce indegree of 1,2.', { visited: ['0'], queue: ['1', '2'] }),
        graphStep(3, CS_NODES, CS_EDGES, { answer: 'yes' }, 'All 4 processed — no cycle, can finish.', { visited: ['0', '1', '2', '3'] }),
      ],
    },
  ],
};

const courseScheduleII: VisualScript = {
  id: 'dsa-gr-4',
  type: 'dsa',
  title: 'Course Schedule II',
  meta: { ...META, eyebrow: 'PATTERN · TOPO SORT', leetcode: 'LeetCode #210', difficulty: 'MEDIUM', description: 'Return topological order of courses, or empty if impossible.' },
  defaultApproachId: 'optimized',
  approaches: [
    {
      id: 'brute', label: 'Brute force · DFS all paths', complexity: { time: 'O(n!)', space: 'O(n)' },
      code: ['backtrack valid orderings until all placed'],
      steps: [
        graphStep(1, CS_NODES, [{ from: '0', to: '1' }, { from: '0', to: '2' }, { from: '1', to: '3' }], { backtrack: 'yes' }, 'Build order one course at a time — factorial.', { active: ['0'] }),
        graphStep(1, CS_NODES, [{ from: '0', to: '1' }, { from: '0', to: '2' }, { from: '1', to: '3' }], { order: '0,1,2,3' }, 'One valid topo among many attempts.', { visited: ['0', '1', '2', '3'] }),
      ],
    },
    {
      id: 'optimized', label: 'Optimized · Kahn BFS', complexity: { time: 'O(V+E)', space: 'O(V+E)' },
      code: ['queue indegree-0 nodes', 'append to order; reduce neighbors'],
      steps: [
        graphStep(1, CS_NODES, CS_EDGES, { order: '[]' }, 'Queue=[0] — only course with no prereqs.', { queue: ['0'] }),
        graphStep(2, CS_NODES, CS_EDGES, { order: '[0,1,2]' }, 'After processing 0,1,2 — append as popped.', { visited: ['0', '1', '2'], queue: ['3'] }),
        graphStep(3, CS_NODES, CS_EDGES, { order: '[0,1,2,3]' }, 'Final topo order when queue empties.', { visited: ['0', '1', '2', '3'] }),
      ],
    },
  ],
};

const UF_NODES = [
  { id: '1', label: '1', x: 100, y: 80 },
  { id: '2', label: '2', x: 200, y: 50 },
  { id: '3', label: '3', x: 200, y: 130 },
  { id: '4', label: '4', x: 300, y: 80 },
];
const UF_EDGES = [
  { from: '1', to: '2' },
  { from: '2', to: '3' },
  { from: '3', to: '4' },
  { from: '1', to: '4' },
];

const redundantConnection: VisualScript = {
  id: 'dsa-gr-5',
  type: 'dsa',
  title: 'Redundant Connection',
  meta: { ...META, eyebrow: 'PATTERN · UNION-FIND', leetcode: 'LeetCode #684', difficulty: 'MEDIUM', description: 'Remove one edge so tree stays a tree — return last redundant edge.' },
  defaultApproachId: 'optimized',
  approaches: [
    {
      id: 'brute', label: 'Brute force · try removing each edge', complexity: { time: 'O(E·(V+E))', space: 'O(V+E)' },
      code: ['for each edge: remove; if graph is tree, return edge'],
      steps: [
        graphStep(1, UF_NODES, UF_EDGES.slice(0, 3), { try: 'remove [1,4]' }, 'Remove edge and BFS — still connected?', { active: ['1', '4'] }),
        graphStep(1, UF_NODES, UF_EDGES.slice(0, 3), { tree: 'maybe' }, 'Try each of 4 edges — O(E) checks.', {}),
      ],
    },
    {
      id: 'optimized', label: 'Optimized · Union-Find', complexity: { time: 'O(E·α(V))', space: 'O(V)' },
      code: ['for (u,v) in edges:', '  if find(u)=find(v): return [u,v]', '  union(u,v)'],
      steps: [
        graphStep(1, UF_NODES, UF_EDGES.slice(0, 2), { parent: '1-2-3' }, 'Union 1-2, 2-3 — same component forming.', { visited: ['1', '2', '3'] }),
        graphStep(2, UF_NODES, UF_EDGES.slice(0, 3), { union: '3-4' }, 'Union 3-4 — component {1,2,3,4}.', { visited: ['1', '2', '3', '4'] }),
        graphStep(3, UF_NODES, UF_EDGES, { redundant: '[1,4]' }, 'Edge 1-4 connects already-connected nodes → redundant.', { active: ['1', '4'] }),
      ],
    },
  ],
};

const DIJK_NODES = [
  { id: '0', label: '0', x: 80, y: 90 },
  { id: '1', label: '1', x: 180, y: 50 },
  { id: '2', label: '2', x: 180, y: 130 },
  { id: '3', label: '3', x: 280, y: 90 },
  { id: '4', label: '4', x: 380, y: 90 },
];
const DIJK_EDGES = [
  { from: '0', to: '1' },
  { from: '0', to: '2' },
  { from: '1', to: '3' },
  { from: '2', to: '3' },
  { from: '3', to: '4' },
];

const networkDelayTime: VisualScript = {
  id: 'dsa-gr-6',
  type: 'dsa',
  title: 'Network Delay Time',
  meta: { ...META, eyebrow: 'PATTERN · DIJKSTRA', leetcode: 'LeetCode #743', difficulty: 'MEDIUM', description: 'Time for signal from node k to reach all nodes (weighted directed graph).' },
  defaultApproachId: 'optimized',
  approaches: [
    {
      id: 'brute', label: 'Brute force · Bellman-Ford × n', complexity: { time: 'O(V²E)', space: 'O(V)' },
      code: ['repeat V-1 relaxations of all edges'],
      steps: [
        graphStep(1, DIJK_NODES, DIJK_EDGES, { round: 1 }, 'Relax all edges once — dist[1]=9 from k=0.', { active: ['0'], visited: ['0', '1'] }),
        graphStep(2, DIJK_NODES, DIJK_EDGES, { round: 2 }, 'Second pass updates dist[3] — slow V times.', { visited: ['0', '1', '2', '3'] }),
      ],
    },
    {
      id: 'optimized', label: 'Optimized · Dijkstra min-heap', complexity: { time: 'O(E log V)', space: 'O(V+E)' },
      code: ['dist[k]=0; min-heap (dist,node)', 'pop; relax neighbors if shorter'],
      steps: [
        graphStep(1, DIJK_NODES, DIJK_EDGES, { dist: '0→0' }, 'Start k=0 with dist=0 in heap.', { active: ['0'], queue: ['0'] }),
        graphStep(2, DIJK_NODES, DIJK_EDGES, { dist: '1→9,2→3' }, 'Relax from 0 — update neighbors 1,2.', { visited: ['0'], active: ['1', '2'], queue: ['2', '1'] }),
        graphStep(3, DIJK_NODES, DIJK_EDGES, { answer: 12 }, 'Max dist to node 4 is 12 — all reached.', { visited: ['0', '1', '2', '3', '4'] }),
      ],
    },
  ],
};

const cheapestFlights: VisualScript = {
  id: 'dsa-gr-7',
  type: 'dsa',
  title: 'Cheapest Flights Within K Stops',
  meta: { ...META, eyebrow: 'PATTERN · BELLMAN-FORD K', leetcode: 'LeetCode #787', difficulty: 'MEDIUM', description: 'Cheapest price from src to dst with at most k stops.' },
  defaultApproachId: 'optimized',
  approaches: [
    {
      id: 'brute', label: 'Brute force · DFS all paths', complexity: { time: 'O(V^K)', space: 'O(V)' },
      code: ['DFS from src counting stops; track min cost'],
      steps: [
        graphStep(1, DIJK_NODES, DIJK_EDGES, { src: 0, dst: 4, k: 1 }, 'Enumerate paths with ≤1 stop — many branches.', { active: ['0'], queue: ['1', '2'] }),
        graphStep(2, DIJK_NODES, DIJK_EDGES, { path: '0→2→3→4' }, 'Path 0→2→3→4 has 2 stops — invalid if k=1.', { visited: ['0', '2', '3', '4'] }),
      ],
    },
    {
      id: 'optimized', label: 'Optimized · Bellman-Ford k+1 rounds', complexity: { time: 'O(k·E)', space: 'O(V)' },
      code: ['for i in 0..k: copy=dist', '  relax all edges using copy'],
      steps: [
        graphStep(1, DIJK_NODES, DIJK_EDGES, { round: 0, dist4: '∞' }, 'Round 0: only src reachable.', { active: ['0'] }),
        graphStep(2, DIJK_NODES, DIJK_EDGES, { round: 1, dist3: 200 }, 'After 1 round: one-stop prices updated.', { visited: ['0', '1', '2'], active: ['3'] }),
        graphStep(3, DIJK_NODES, DIJK_EDGES, { answer: 200 }, 'Within k=1 stop cheapest to dst found.', { visited: ['0', '1', '2', '3'] }),
      ],
    },
  ],
};

const PACIFIC_GRID = [
  ['1', '2', '2', '3', '5'],
  ['3', '2', '3', '4', '4'],
  ['2', '4', '5', '3', '1'],
  ['6', '7', '1', '4', '5'],
  ['5', '1', '1', '2', '4'],
];

const pacificAtlantic: VisualScript = {
  id: 'dsa-gr-8',
  type: 'dsa',
  title: 'Pacific Atlantic Water Flow',
  meta: { ...META, eyebrow: 'PATTERN · MULTI-SOURCE DFS', leetcode: 'LeetCode #417', difficulty: 'MEDIUM', description: 'Cells from which water can flow to both Pacific and Atlantic oceans.' },
  defaultApproachId: 'optimized',
  approaches: [
    {
      id: 'brute', label: 'Brute force · DFS from each cell', complexity: { time: 'O(m²n²)', space: 'O(m·n)' },
      code: ['for each cell: canReachPacific && canReachAtlantic'],
      steps: [
        gridStep(1, PACIFIC_GRID, { cell: '(0,3)' }, 'From cell (0,3)=3 — DFS to Pacific top row.', { highlight: [{ row: 0, col: 3 }] }),
        gridStep(2, PACIFIC_GRID, { cell: '(0,3)' }, 'Also DFS to Atlantic — check both oceans per cell.', { highlight: [{ row: 0, col: 3 }] }),
      ],
    },
    {
      id: 'optimized', label: 'Optimized · reverse DFS from borders', complexity: { time: 'O(m·n)', space: 'O(m·n)' },
      code: ['pac←DFS from top+left borders', 'atl←DFS from bottom+right', 'return intersection'],
      steps: [
        gridStep(1, PACIFIC_GRID, { source: 'Pacific' }, 'Multi-source DFS inward from Pacific borders.', { visited: [{ row: 0, col: 0 }, { row: 0, col: 1 }, { row: 0, col: 2 }, { row: 0, col: 3 }, { row: 0, col: 4 }] }),
        gridStep(2, PACIFIC_GRID, { source: 'Atlantic' }, 'Separate DFS from Atlantic borders.', { visited: [{ row: 4, col: 4 }, { row: 4, col: 3 }, { row: 3, col: 4 }] }),
        gridStep(3, PACIFIC_GRID, { both: 7 }, 'Cells reachable from both sets — 7 coordinates.', { highlight: [{ row: 0, col: 4 }, { row: 1, col: 3 }, { row: 1, col: 4 }] }),
      ],
    },
  ],
};

const ORANGE_GRID = [
  ['2', '1', '1'],
  ['1', '1', '0'],
  ['0', '1', '1'],
];

const rottingOranges: VisualScript = {
  id: 'dsa-gr-9',
  type: 'dsa',
  title: 'Rotting Oranges',
  meta: { ...META, eyebrow: 'PATTERN · MULTI-SOURCE BFS', leetcode: 'LeetCode #994', difficulty: 'MEDIUM', description: 'Minimum minutes until no fresh orange remains, or -1 if impossible.' },
  defaultApproachId: 'optimized',
  approaches: [
    {
      id: 'brute', label: 'Brute force · simulate minute by minute', complexity: { time: 'O((mn)²)', space: 'O(m·n)' },
      code: ['each minute: scan grid; rot adjacent fresh'],
      steps: [
        gridStep(1, ORANGE_GRID, { minute: 0 }, 'Initial rotten at (0,0) — scan whole grid each minute.', { highlight: [{ row: 0, col: 0 }] }),
        gridStep(2, ORANGE_GRID, { minute: 1 }, 'After 1 min: neighbors of rotten turn — rescan all cells.', { visited: [{ row: 0, col: 0 }, { row: 0, col: 1 }, { row: 1, col: 0 }] }),
      ],
    },
    {
      id: 'optimized', label: 'Optimized · BFS level order', complexity: { time: 'O(m·n)', space: 'O(m·n)' },
      code: ['queue all rotten; minutes=0', 'process level size each minute'],
      steps: [
        gridStep(1, ORANGE_GRID, { queue: 'all rotten' }, 'Seed queue with both rotten cells.', { highlight: [{ row: 0, col: 0 }] }),
        gridStep(2, ORANGE_GRID, { minute: 1 }, 'Level 1 BFS infects adjacent fresh oranges.', { visited: [{ row: 0, col: 0 }, { row: 0, col: 1 }, { row: 1, col: 0 }] }),
        gridStep(3, ORANGE_GRID, { answer: 4 }, '4 minutes until all fresh rot — or -1 if isolated.', { visited: [{ row: 0, col: 0 }, { row: 0, col: 1 }, { row: 0, col: 2 }, { row: 1, col: 0 }, { row: 1, col: 1 }, { row: 2, col: 1 }, { row: 2, col: 2 }] }),
      ],
    },
  ],
};

const wordLadder: VisualScript = {
  id: 'dsa-gr-10',
  type: 'dsa',
  title: 'Word Ladder',
  meta: { ...META, eyebrow: 'PATTERN · BFS SHORTEST PATH', leetcode: 'LeetCode #127', difficulty: 'HARD', description: 'Shortest transformation sequence from beginWord to endWord changing one letter at a time.' },
  defaultApproachId: 'optimized',
  approaches: [
    {
      id: 'brute', label: 'Brute force · DFS all paths', complexity: { time: 'O(N·26^L)', space: 'O(N)' },
      code: ['DFS change each letter; if in dict, recurse'],
      steps: [
        graphStep(1, [
          { id: 'hit', label: 'hit', x: 80, y: 90 },
          { id: 'hot', label: 'hot', x: 200, y: 90 },
          { id: 'dot', label: 'dot', x: 320, y: 50 },
          { id: 'lot', label: 'lot', x: 320, y: 130 },
          { id: 'cog', label: 'cog', x: 440, y: 90 },
        ], [{ from: 'hit', to: 'hot' }, { from: 'hot', to: 'dot' }, { from: 'hot', to: 'lot' }, { from: 'dot', to: 'cog' }, { from: 'lot', to: 'cog' }], { dfs: 'deep' }, 'DFS explores long dead-end chains first.', { active: ['hit'] }),
        graphStep(1, [
          { id: 'hit', label: 'hit', x: 80, y: 90 },
          { id: 'cog', label: 'cog', x: 440, y: 90 },
        ], [], { slow: 'yes' }, 'Not guaranteed shortest path without BFS.', {}),
      ],
    },
    {
      id: 'optimized', label: 'Optimized · BFS by word length', complexity: { time: 'O(N·L²)', space: 'O(N)' },
      code: ['queue (word, steps)', 'try 26 letters at each position', 'first time reaching endWord wins'],
      steps: [
        graphStep(1, [
          { id: 'hit', label: 'hit', x: 80, y: 90 },
          { id: 'hot', label: 'hot', x: 200, y: 90 },
        ], [{ from: 'hit', to: 'hot' }], { step: 1 }, 'BFS level 1: hit→hot.', { active: ['hit'], queue: ['hot'] }),
        graphStep(2, [
          { id: 'hot', label: 'hot', x: 200, y: 90 },
          { id: 'dot', label: 'dot', x: 320, y: 50 },
          { id: 'lot', label: 'lot', x: 320, y: 130 },
        ], [{ from: 'hot', to: 'dot' }, { from: 'hot', to: 'lot' }], { step: 2 }, 'Level 2: dot and lot from hot.', { visited: ['hit', 'hot'], queue: ['dot', 'lot'] }),
        graphStep(3, [
          { id: 'cog', label: 'cog', x: 440, y: 90 },
        ], [], { answer: 5 }, 'Reach cog at step 5 — shortest ladder length.', { visited: ['hit', 'hot', 'dot', 'lot', 'cog'] }),
      ],
    },
  ],
};

const MHT_NODES = [
  { id: '0', label: '0', x: 200, y: 40 },
  { id: '1', label: '1', x: 120, y: 100 },
  { id: '2', label: '2', x: 280, y: 100 },
  { id: '3', label: '3', x: 80, y: 160 },
  { id: '4', label: '4', x: 200, y: 160 },
  { id: '5', label: '5', x: 320, y: 160 },
];
const MHT_EDGES = [
  { from: '0', to: '1' },
  { from: '0', to: '2' },
  { from: '1', to: '3' },
  { from: '1', to: '4' },
  { from: '2', to: '4' },
  { from: '2', to: '5' },
];

const minimumHeightTrees: VisualScript = {
  id: 'dsa-gr-11',
  type: 'dsa',
  title: 'Minimum Height Trees',
  meta: { ...META, eyebrow: 'PATTERN · TOPO ON TREE', leetcode: 'LeetCode #310', difficulty: 'MEDIUM', description: 'All roots that minimize height of undirected tree — centroids.' },
  defaultApproachId: 'optimized',
  approaches: [
    {
      id: 'brute', label: 'Brute force · BFS from each node', complexity: { time: 'O(V²)', space: 'O(V)' },
      code: ['for each node as root: BFS height', 'pick min height roots'],
      steps: [
        graphStep(1, MHT_NODES, MHT_EDGES, { root: 0, height: 3 }, 'BFS height with root=0 — try all V roots.', { active: ['0'] }),
        graphStep(1, MHT_NODES, MHT_EDGES, { root: 1, height: 2 }, 'Root 1 gives smaller height — compare all.', { active: ['1'] }),
      ],
    },
    {
      id: 'optimized', label: 'Optimized · leaf pruning', complexity: { time: 'O(V)', space: 'O(V)' },
      code: ['queue leaves; peel layer by layer', '≤2 nodes left = MHT roots'],
      steps: [
        graphStep(1, MHT_NODES, MHT_EDGES, { leaves: '3,4,5' }, 'Start with degree-1 leaves in queue.', { queue: ['3', '4', '5'] }),
        graphStep(2, MHT_NODES, MHT_EDGES, { peel: 1 }, 'Remove leaf layer — update degrees.', { visited: ['3', '5'], active: ['1', '2', '4'] }),
        graphStep(3, MHT_NODES, MHT_EDGES, { answer: '[1,4]' }, 'Two centroids remain: nodes 1 and 4.', { active: ['1', '4'] }),
      ],
    },
  ],
};

const BRIDGE_NODES = [
  { id: '0', label: '0', x: 100, y: 90 },
  { id: '1', label: '1', x: 200, y: 50 },
  { id: '2', label: '2', x: 200, y: 130 },
  { id: '3', label: '3', x: 300, y: 90 },
];
const BRIDGE_EDGES = [
  { from: '0', to: '1' },
  { from: '1', to: '2' },
  { from: '2', to: '0' },
  { from: '1', to: '3' },
];

const criticalConnections: VisualScript = {
  id: 'dsa-gr-12',
  type: 'dsa',
  title: 'Critical Connections',
  meta: { ...META, eyebrow: 'PATTERN · TARJAN BRIDGES', leetcode: 'LeetCode #1192', difficulty: 'HARD', description: 'Find bridges — edges whose removal disconnects the graph.' },
  defaultApproachId: 'optimized',
  approaches: [
    {
      id: 'brute', label: 'Brute force · remove each edge', complexity: { time: 'O(E·(V+E))', space: 'O(V+E)' },
      code: ['for each edge: remove; if disconnected, bridge'],
      steps: [
        graphStep(1, BRIDGE_NODES, [BRIDGE_EDGES[3]], { test: '1-3' }, 'Remove 1-3 and BFS — graph splits?', { active: ['1', '3'] }),
        graphStep(1, BRIDGE_NODES, BRIDGE_EDGES.slice(0, 3), { connected: 'yes' }, 'Triangle 0-1-2 still connected without 1-3.', { visited: ['0', '1', '2'] }),
      ],
    },
    {
      id: 'optimized', label: 'Optimized · Tarjan low-link', complexity: { time: 'O(V+E)', space: 'O(V)' },
      code: ['DFS disc/low times', 'bridge if low[v]>disc[u]'],
      steps: [
        graphStep(1, BRIDGE_NODES, BRIDGE_EDGES, { disc: '0:1,1:2,2:3' }, 'DFS assigns discovery times.', { active: ['0'], visited: ['0'] }),
        graphStep(2, BRIDGE_NODES, BRIDGE_EDGES, { low: '2' }, 'Node 2 low-link stays > disc[1] for edge 1-3.', { active: ['1', '3'], visited: ['0', '1', '2'] }),
        graphStep(3, BRIDGE_NODES, [BRIDGE_EDGES[3]], { bridge: '[1,3]' }, 'Edge 1-3 is only bridge — triangle edges safe.', { active: ['1', '3'] }),
      ],
    },
  ],
};

const ALIEN_NODES = [
  { id: 'w', label: 'w', x: 80, y: 80 },
  { id: 'e', label: 'e', x: 160, y: 80 },
  { id: 'r', label: 'r', x: 240, y: 80 },
  { id: 't', label: 't', x: 320, y: 80 },
  { id: 'f', label: 'f', x: 400, y: 80 },
];
const ALIEN_EDGES = [
  { from: 'w', to: 'e' },
  { from: 'e', to: 'r' },
  { from: 'r', to: 't' },
  { from: 't', to: 'f' },
];

const alienDictionary: VisualScript = {
  id: 'dsa-gr-13',
  type: 'dsa',
  title: 'Alien Dictionary',
  meta: { ...META, eyebrow: 'PATTERN · TOPO SORT', leetcode: 'LeetCode #269', difficulty: 'HARD', description: 'Derive character order from sorted alien words.' },
  defaultApproachId: 'optimized',
  approaches: [
    {
      id: 'brute', label: 'Brute force · try all permutations', complexity: { time: 'O(k!·n)', space: 'O(k)' },
      code: ['for each char ordering: verify all word pairs sorted'],
      steps: [
        graphStep(1, ALIEN_NODES, ALIEN_EDGES, { try: 'permutations' }, 'k letters → k! orders to validate against words.', { active: ['w'] }),
        graphStep(1, ALIEN_NODES, ALIEN_EDGES, { words: 'wrt,erf' }, 'Most permutations fail first word pair check.', {}),
      ],
    },
    {
      id: 'optimized', label: 'Optimized · graph + topo', complexity: { time: 'O(C)', space: 'O(1)' },
      code: ['compare adjacent words → edge a→b', 'topo sort; cycle → ""'],
      steps: [
        graphStep(1, ALIEN_NODES, [{ from: 'w', to: 'e' }], { edge: 'w<e' }, 'From "wrt" vs "erf": w before e.', { active: ['w', 'e'] }),
        graphStep(2, ALIEN_NODES, ALIEN_EDGES, { graph: 'built' }, 'All adjacent word comparisons add edges.', { visited: ['w', 'e', 'r', 't'] }),
        graphStep(3, ALIEN_NODES, ALIEN_EDGES, { order: 'wertf' }, 'Topo sort yields alien alphabet order.', { visited: ['w', 'e', 'r', 't', 'f'] }),
      ],
    },
  ],
};

const DIV_NODES = [
  { id: 'a', label: 'a', x: 100, y: 60 },
  { id: 'b', label: 'b', x: 250, y: 60 },
  { id: 'c', label: 'c', x: 400, y: 60 },
  { id: 'd', label: 'd', x: 175, y: 140 },
  { id: 'e', label: 'e', x: 325, y: 140 },
];
const DIV_EDGES = [
  { from: 'a', to: 'b' },
  { from: 'b', to: 'c' },
  { from: 'a', to: 'd' },
  { from: 'd', to: 'e' },
  { from: 'b', to: 'e' },
];

const evaluateDivision: VisualScript = {
  id: 'dsa-gr-14',
  type: 'dsa',
  title: 'Evaluate Division',
  meta: { ...META, eyebrow: 'PATTERN · WEIGHTED GRAPH', leetcode: 'LeetCode #399', difficulty: 'MEDIUM', description: 'Answer queries a/b given equations and values.' },
  defaultApproachId: 'optimized',
  approaches: [
    {
      id: 'brute', label: 'Brute force · DFS each query', complexity: { time: 'O(Q·(V+E))', space: 'O(V+E)' },
      code: ['for query a/c: DFS multiply edge weights along path'],
      steps: [
        graphStep(1, DIV_NODES, DIV_EDGES, { query: 'a/c' }, 'DFS from a hunting path to c — multiply weights.', { active: ['a'] }),
        graphStep(2, DIV_NODES, DIV_EDGES, { path: 'a→b→c' }, 'Path a→b→c gives a/c = 2×3 = 6.', { visited: ['a', 'b', 'c'] }),
      ],
    },
    {
      id: 'optimized', label: 'Optimized · Union-Find with weight', complexity: { time: 'O((E+Q)·α(V))', space: 'O(V)' },
      code: ['union a/b with weight ratio', 'find returns accumulated weight to parent'],
      steps: [
        graphStep(1, DIV_NODES, [{ from: 'a', to: 'b' }], { eq: 'a/b=2' }, 'Union a,b — store weight 2.', { active: ['a', 'b'] }),
        graphStep(2, DIV_NODES, [{ from: 'b', to: 'c' }], { eq: 'b/c=3' }, 'Union b,c — propagate ratios through parent.', { visited: ['a', 'b', 'c'] }),
        graphStep(3, DIV_NODES, DIV_EDGES, { query: 'a/c=6' }, 'Find(a)/Find(c) = 6 without re-walking graph.', { active: ['a', 'c'] }),
      ],
    },
  ],
};

const MERGE_NODES = [
  { id: 'A', label: 'A', x: 100, y: 80 },
  { id: 'B', label: 'B', x: 250, y: 50 },
  { id: 'C', label: 'C', x: 250, y: 120 },
  { id: 'D', label: 'D', x: 400, y: 80 },
];
const MERGE_EDGES = [
  { from: 'A', to: 'B' },
  { from: 'B', to: 'C' },
  { from: 'A', to: 'D' },
];

const accountsMerge: VisualScript = {
  id: 'dsa-gr-15',
  type: 'dsa',
  title: 'Accounts Merge',
  meta: { ...META, eyebrow: 'PATTERN · UNION-FIND', leetcode: 'LeetCode #721', difficulty: 'MEDIUM', description: 'Merge accounts sharing at least one email.' },
  defaultApproachId: 'optimized',
  approaches: [
    {
      id: 'brute', label: 'Brute force · pairwise merge', complexity: { time: 'O(n²·m)', space: 'O(n·m)' },
      code: ['for each pair of accounts: if shared email, merge lists'],
      steps: [
        graphStep(1, MERGE_NODES, MERGE_EDGES, { compare: 'A vs B' }, 'Compare email sets pairwise — O(n²).', { active: ['A', 'B'] }),
        graphStep(2, MERGE_NODES, MERGE_EDGES, { merge: 'A,B' }, 'Shared email found — merge and repeat scans.', { visited: ['A', 'B'] }),
      ],
    },
    {
      id: 'optimized', label: 'Optimized · UF on emails', complexity: { time: 'O(n·m·α(n))', space: 'O(n·m)' },
      code: ['map email→first seen account', 'union accounts sharing email', 'group by root'],
      steps: [
        graphStep(1, MERGE_NODES, [{ from: 'A', to: 'B' }], { email: 'john@' }, 'Email john@ links accounts A and B.', { active: ['A', 'B'] }),
        graphStep(2, MERGE_NODES, MERGE_EDGES, { union: 'A-B-C' }, 'Transitive emails merge A,B,C into one component.', { visited: ['A', 'B', 'C'] }),
        graphStep(3, MERGE_NODES, MERGE_EDGES, { groups: 2 }, 'Two root components after all unions.', { visited: ['A', 'B', 'C', 'D'] }),
      ],
    },
  ],
};

const BINARY_GRID = [
  ['0', '1', '0'],
  ['0', '0', '0'],
  ['1', '0', '1'],
];

const shortestPathBinaryMatrix: VisualScript = {
  id: 'dsa-gr-16',
  type: 'dsa',
  title: 'Shortest Path in Binary Matrix',
  meta: { ...META, eyebrow: 'PATTERN · BFS 8-DIR', leetcode: 'LeetCode #1091', difficulty: 'MEDIUM', description: 'Shortest clear path from top-left to bottom-right in 8-direction grid.' },
  defaultApproachId: 'optimized',
  approaches: [
    {
      id: 'brute', label: 'Brute force · DFS all paths', complexity: { time: 'O(8^(mn))', space: 'O(m·n)' },
      code: ['DFS from (0,0) tracking path length'],
      steps: [
        gridStep(1, BINARY_GRID, { dfs: 'yes' }, 'DFS branches 8 ways — exponential paths.', { highlight: [{ row: 0, col: 0 }] }),
        gridStep(2, BINARY_GRID, { path: 'long' }, 'May find a path but not necessarily shortest.', { path: [{ row: 0, col: 0 }, { row: 1, col: 1 }, { row: 2, col: 2 }] }),
      ],
    },
    {
      id: 'optimized', label: 'Optimized · BFS', complexity: { time: 'O(m·n)', space: 'O(m·n)' },
      code: ['if grid[0][0]=1 return -1', 'BFS 8 neighbors; track steps'],
      steps: [
        gridStep(1, BINARY_GRID, { step: 1 }, 'BFS level 1 from (0,0) — 8 directions.', { highlight: [{ row: 0, col: 0 }], visited: [{ row: 0, col: 0 }] }),
        gridStep(2, BINARY_GRID, { step: 2 }, 'Expand frontier — first visit = shortest in unweighted grid.', { visited: [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 1, col: 1 }] }),
        gridStep(3, BINARY_GRID, { answer: 4 }, 'Reach (2,2) in 4 steps — or -1 if blocked.', { highlight: [{ row: 2, col: 2 }], path: [{ row: 0, col: 0 }, { row: 1, col: 1 }, { row: 2, col: 2 }] }),
      ],
    },
  ],
};

const dijkstraTemplate: VisualScript = {
  id: 'dsa-gr-17',
  type: 'dsa',
  title: 'Dijkstra template',
  meta: { ...META, eyebrow: 'PATTERN · DIJKSTRA', difficulty: 'MEDIUM', description: 'Reusable shortest-path template on weighted directed graph with non-negative edges.' },
  defaultApproachId: 'optimized',
  approaches: [
    {
      id: 'brute', label: 'Brute force · Bellman-Ford', complexity: { time: 'O(V·E)', space: 'O(V)' },
      code: ['repeat V-1: relax all edges'],
      steps: [
        graphStep(1, DIJK_NODES, DIJK_EDGES, { round: 1 }, 'Relax every edge each round — no early exit.', { active: ['0'] }),
        graphStep(2, DIJK_NODES, DIJK_EDGES, { round: 'V-1' }, 'V-1 rounds sufficient but slower than heap.', { visited: ['0', '1', '2', '3'] }),
      ],
    },
    {
      id: 'optimized', label: 'Optimized · min-heap Dijkstra', complexity: { time: 'O(E log V)', space: 'O(V+E)' },
      code: ['dist[s]=0; pq.push(s,0)', 'while pq: u=pop; for v in adj[u]:', '  if dist[u]+w<dist[v]: update+push'],
      steps: [
        graphStep(1, DIJK_NODES, DIJK_EDGES, { pq: '[(0,0)]' }, 'Template: init dist=∞, source=0.', { active: ['0'], queue: ['0'] }),
        graphStep(2, DIJK_NODES, DIJK_EDGES, { relax: '1,2' }, 'Pop min dist node; relax outgoing edges.', { visited: ['0'], active: ['1', '2'], queue: ['2', '1'] }),
        graphStep(3, DIJK_NODES, DIJK_EDGES, { settled: 'all' }, 'Each node settled once — final dist array.', { visited: ['0', '1', '2', '3', '4'] }),
      ],
    },
  ],
};

const SCC_NODES = [
  { id: '0', label: '0', x: 100, y: 70 },
  { id: '1', label: '1', x: 200, y: 40 },
  { id: '2', label: '2', x: 200, y: 110 },
  { id: '3', label: '3', x: 300, y: 70 },
];
const SCC_EDGES = [
  { from: '0', to: '1' },
  { from: '1', to: '2' },
  { from: '2', to: '0' },
  { from: '1', to: '3' },
];

const tarjanScc: VisualScript = {
  id: 'dsa-gr-18',
  type: 'dsa',
  title: 'Tarjan / SCC intro',
  meta: { ...META, eyebrow: 'PATTERN · TARJAN SCC', difficulty: 'HARD', description: 'Find strongly connected components in directed graph using Tarjan DFS.' },
  defaultApproachId: 'optimized',
  approaches: [
    {
      id: 'brute', label: 'Brute force · Kosaraju two-pass', complexity: { time: 'O(V+E)', space: 'O(V+E)' },
      code: ['DFS order; reverse graph; DFS again'],
      steps: [
        graphStep(1, SCC_NODES, SCC_EDGES, { pass: 1 }, 'First DFS for finish order — store stack.', { visited: ['0', '1', '2'] }),
        graphStep(2, SCC_NODES, [{ from: '3', to: '1' }, { from: '2', to: '0' }, { from: '1', to: '2' }, { from: '0', to: '1' }], { pass: 2 }, 'Reverse graph; second DFS per unvisited in stack order.', { active: ['3'] }),
      ],
    },
    {
      id: 'optimized', label: 'Optimized · Tarjan one-pass', complexity: { time: 'O(V+E)', space: 'O(V)' },
      code: ['DFS with disc/low + stack', 'pop stack when low[v]≥disc[u] → SCC'],
      steps: [
        graphStep(1, SCC_NODES, SCC_EDGES, { disc: '0,1,2' }, 'DFS assigns disc/low; push to stack.', { active: ['0'], visited: ['0', '1', '2'] }),
        graphStep(2, SCC_NODES, SCC_EDGES, { low: '0=0' }, 'Cycle 0→1→2→0: low values equal → one SCC.', { active: ['0', '1', '2'] }),
        graphStep(3, SCC_NODES, SCC_EDGES, { scc: '{0,1,2},{3}' }, 'Node 3 separate SCC — no back-edge to cycle.', { visited: ['0', '1', '2', '3'] }),
      ],
    },
  ],
};

const BIP_NODES = [
  { id: '0', label: '0', x: 120, y: 80 },
  { id: '1', label: '1', x: 280, y: 40 },
  { id: '2', label: '2', x: 280, y: 120 },
  { id: '3', label: '3', x: 120, y: 160 },
];
const BIP_EDGES = [
  { from: '0', to: '1' },
  { from: '0', to: '2' },
  { from: '1', to: '3' },
  { from: '2', to: '3' },
];

const bipartiteCheck: VisualScript = {
  id: 'dsa-gr-19',
  type: 'dsa',
  title: 'Bipartite graph check',
  meta: { ...META, eyebrow: 'PATTERN · BFS COLORING', leetcode: 'LeetCode #785', difficulty: 'EASY', description: 'Can vertices be 2-colored so no edge connects same color?' },
  defaultApproachId: 'optimized',
  approaches: [
    {
      id: 'brute', label: 'Brute force · try 2^V colorings', complexity: { time: 'O(2^V·E)', space: 'O(V)' },
      code: ['for each 0/1 assignment: check all edges'],
      steps: [
        graphStep(1, BIP_NODES, BIP_EDGES, { try: '2^4' }, '16 colorings for 4 nodes — check edges each time.', { active: ['0'] }),
        graphStep(1, BIP_NODES, BIP_EDGES, { fail: 'odd cycle' }, 'Odd cycle makes many assignments invalid.', {}),
      ],
    },
    {
      id: 'optimized', label: 'Optimized · BFS 2-color', complexity: { time: 'O(V+E)', space: 'O(V)' },
      code: ['color[start]=0; BFS neighbors opposite', 'if neighbor same color → false'],
      steps: [
        graphStep(1, BIP_NODES, BIP_EDGES, { color0: 'red' }, 'Color node 0 red — BFS neighbors blue.', { active: ['0'], queue: ['1', '2'] }),
        graphStep(2, BIP_NODES, BIP_EDGES, { color1: 'blue' }, 'Nodes 1,2 blue — neighbors must be red.', { visited: ['0', '1', '2'], active: ['3'] }),
        graphStep(3, BIP_NODES, BIP_EDGES, { answer: 'yes' }, 'Node 3 red — no conflict → bipartite.', { visited: ['0', '1', '2', '3'] }),
      ],
    },
  ],
};

const ITIN_NODES = [
  { id: 'JFK', label: 'JFK', x: 80, y: 90 },
  { id: 'MUC', label: 'MUC', x: 200, y: 50 },
  { id: 'LHR', label: 'LHR', x: 200, y: 130 },
  { id: 'SFO', label: 'SFO', x: 320, y: 50 },
  { id: 'SJC', label: 'SJC', x: 320, y: 130 },
];
const ITIN_EDGES = [
  { from: 'JFK', to: 'MUC' },
  { from: 'JFK', to: 'LHR' },
  { from: 'MUC', to: 'SFO' },
  { from: 'LHR', to: 'SFO' },
  { from: 'SFO', to: 'SJC' },
];

const reconstructItinerary: VisualScript = {
  id: 'dsa-gr-20',
  type: 'dsa',
  title: 'Reconstruct Itinerary',
  meta: { ...META, eyebrow: 'PATTERN · EULERIAN PATH', leetcode: 'LeetCode #332', difficulty: 'HARD', description: 'Lexicographically smallest itinerary using all tickets once from JFK.' },
  defaultApproachId: 'optimized',
  approaches: [
    {
      id: 'brute', label: 'Brute force · backtrack routes', complexity: { time: 'O(E!)', space: 'O(E)' },
      code: ['try each unused ticket from current airport', 'backtrack when stuck'],
      steps: [
        graphStep(1, ITIN_NODES, ITIN_EDGES, { try: 'JFK→LHR?' }, 'Branch on ticket choice — factorial routes.', { active: ['JFK'], queue: ['LHR', 'MUC'] }),
        graphStep(2, ITIN_NODES, ITIN_EDGES, { dead: 'unused ticket' }, 'Wrong order leaves unused edge — backtrack.', { visited: ['JFK', 'LHR', 'SFO'] }),
      ],
    },
    {
      id: 'optimized', label: 'Optimized · Hierholzer DFS', complexity: { time: 'O(E log E)', space: 'O(E)' },
      code: ['adj lists sorted lex', 'DFS postorder stack → reverse'],
      steps: [
        graphStep(1, ITIN_NODES, [{ from: 'JFK', to: 'LHR' }, { from: 'JFK', to: 'MUC' }], { pick: 'LHR first' }, 'From JFK pick lex smallest neighbor LHR.', { active: ['JFK'], queue: ['LHR'] }),
        graphStep(2, ITIN_NODES, ITIN_EDGES, { dfs: 'postorder' }, 'Use ticket, DFS, backtrack when no tickets left.', { visited: ['JFK', 'LHR', 'SFO', 'SJC'] }),
        graphStep(3, ITIN_NODES, ITIN_EDGES, { route: 'JFK→LHR→SFO→SJC' }, 'Reverse postorder gives valid itinerary using all tickets.', { visited: ['JFK', 'MUC', 'LHR', 'SFO', 'SJC'] }),
      ],
    },
  ],
};

export const GRAPH_SCRIPTS: Record<string, VisualScript> = {
  'gr-1': numberOfIslands,
  'gr-2': cloneGraph,
  'gr-3': courseSchedule,
  'gr-4': courseScheduleII,
  'gr-5': redundantConnection,
  'gr-6': networkDelayTime,
  'gr-7': cheapestFlights,
  'gr-8': pacificAtlantic,
  'gr-9': rottingOranges,
  'gr-10': wordLadder,
  'gr-11': minimumHeightTrees,
  'gr-12': criticalConnections,
  'gr-13': alienDictionary,
  'gr-14': evaluateDivision,
  'gr-15': accountsMerge,
  'gr-16': shortestPathBinaryMatrix,
  'gr-17': dijkstraTemplate,
  'gr-18': tarjanScc,
  'gr-19': bipartiteCheck,
  'gr-20': reconstructItinerary,
};
