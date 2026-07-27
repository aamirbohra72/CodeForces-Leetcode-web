import type { VisualScript } from '@/types/visual-script';
import { arr, arrayStep, heapStep, stackStep, stringStep } from './helpers';

const META = {
  section: 'Heap',
  companies: ['Amazon', 'Google', 'Meta'],
};

const kthLargest: VisualScript = {
  id: 'dsa-h-1',
  type: 'dsa',
  title: 'Kth Largest Element in an Array',
  meta: {
    ...META,
    eyebrow: 'PATTERN · MIN-HEAP OF SIZE K',
    leetcode: 'LeetCode #215',
    difficulty: 'MEDIUM',
    description: 'Return the kth largest element in nums. A size-k min-heap keeps the k biggest values seen so far.',
  },
  defaultApproachId: 'optimized',
  approaches: [
    {
      id: 'brute',
      label: 'Brute force · sort',
      complexity: { time: 'O(n log n)', space: 'O(1)' },
      code: ['sort nums descending', 'return nums[k-1]'],
      steps: [
        arrayStep(1, arr([3, 2, 1, 5, 6, 4]), [], [0, 1, 2, 3, 4, 5], { k: 2 }, 'Unsorted array — sort entire input to read off the kth largest.'),
        arrayStep(2, arr([6, 5, 4, 3, 2, 1]), [{ name: 'k', index: 1, color: 'accent' }], [1], { ans: 5 }, 'After sort, index k-1=1 holds 5 — the 2nd largest.'),
      ],
    },
    {
      id: 'optimized',
      label: 'Optimized · size-k min-heap',
      complexity: { time: 'O(n log k)', space: 'O(k)' },
      code: ['heap ← empty min-heap', 'for x in nums:', '  push x; if size>k: pop min', 'return heap.min'],
      steps: [
        heapStep(2, [3, 2], { k: 2, size: 2 }, 'Push 3 then 2 — heap holds two largest so far.', { highlightIndices: [0, 1], label: 'min-heap size 2' }),
        heapStep(2, [3, 5, 6], { pushed: 5 }, 'After 5 and 6, pop small values — heap keeps {5,6}.', { highlightIndices: [0, 1], label: 'top-k retained' }),
        heapStep(3, [5, 6], { ans: 5 }, 'Root of min-heap is the kth largest → 5.', { highlightIndices: [0], label: 'kth largest = root' }),
      ],
    },
  ],
};

const mergeKLists: VisualScript = {
  id: 'dsa-h-2',
  type: 'dsa',
  title: 'Merge k Sorted Lists',
  meta: {
    ...META,
    eyebrow: 'PATTERN · MIN-HEAP OF HEADS',
    leetcode: 'LeetCode #23',
    difficulty: 'HARD',
    description: 'Merge k sorted linked lists into one sorted list. A min-heap tracks the smallest head among active lists.',
  },
  defaultApproachId: 'optimized',
  approaches: [
    {
      id: 'brute',
      label: 'Brute force · merge two at a time',
      complexity: { time: 'O(kn)', space: 'O(1)' },
      code: ['result ← lists[0]', 'for i ← 1 to k-1:', '  result ← merge(result, lists[i])'],
      steps: [
        arrayStep(1, arr([1, 4, 5]), [], [0, 1, 2], { list: 'L0' }, 'Start with L0=[1,4,5]. Merge L1 next — repeated pairwise merge is slow.'),
        arrayStep(2, arr([1, 1, 3, 4, 4, 5, 6]), [], [], { merged: 'partial' }, 'After merging all lists pairwise → [1,1,3,4,4,5,6]. O(kn) total work.'),
      ],
    },
    {
      id: 'optimized',
      label: 'Optimized · min-heap of k heads',
      complexity: { time: 'O(n log k)', space: 'O(k)' },
      code: ['push all list heads into min-heap', 'while heap:', '  pop min, append, push its next'],
      steps: [
        heapStep(1, [1, 1, 2], { lists: 3 }, 'Heap holds heads 1,1,2 from three lists. Pop global minimum.', { highlightIndices: [0], label: 'heads in heap' }),
        heapStep(2, [1, 2, 3], { out: '[1]' }, 'Pop 1, advance that list, push next 3. Heap now {1,2,3}.', { highlightIndices: [0] }),
        heapStep(3, [4, 5, 6], { done: '[1,1,2,3,4,4,5,6]' }, 'Each node enters/leaves heap once → O(n log k).', { highlightIndices: [0] }),
      ],
    },
  ],
};

const topKFrequent: VisualScript = {
  id: 'dsa-h-3',
  type: 'dsa',
  title: 'Top K Frequent Elements',
  meta: {
    ...META,
    eyebrow: 'PATTERN · FREQ MAP + HEAP',
    leetcode: 'LeetCode #347',
    difficulty: 'MEDIUM',
    description: 'Return the k most frequent elements. Count frequencies, then keep top k with a min-heap of size k.',
  },
  defaultApproachId: 'optimized',
  approaches: [
    {
      id: 'brute',
      label: 'Brute force · sort by frequency',
      complexity: { time: 'O(n log n)', space: 'O(n)' },
      code: ['count frequencies', 'sort pairs by freq desc', 'return first k keys'],
      steps: [
        arrayStep(1, arr([1, 1, 1, 2, 2, 3]), [], [0, 1, 2, 3, 4, 5], { freq: '1→3,2→2,3→1' }, 'Count: 1 appears 3×, 2 appears 2×, 3 appears 1×.'),
        arrayStep(2, arr([1, 2]), [{ name: 'k', index: 0, color: 'accent' }], [0, 1], { k: 2, ans: '[1,2]' }, 'Sort by freq → take top k=2 → [1,2].'),
      ],
    },
    {
      id: 'optimized',
      label: 'Optimized · bucket or heap',
      complexity: { time: 'O(n log k)', space: 'O(n)' },
      code: ['freq ← count(nums)', 'min-heap of size k on (freq, val)', 'return heap values'],
      steps: [
        heapStep(1, ['1:3', '2:2'], { k: 2 }, 'Push (freq,val) pairs. Heap size capped at k.', { highlightIndices: [0], label: 'freq pairs' }),
        heapStep(2, ['1:3', '2:2', '3:1'], { consider: 3 }, 'See 3:1 — if heap full, evict lowest freq.', { highlightIndices: [2] }),
        heapStep(3, ['1:3', '2:2'], { ans: '[1,2]' }, 'Final heap holds top-2 frequent elements.', { highlightIndices: [0, 1] }),
      ],
    },
  ],
};

const findMedianStream: VisualScript = {
  id: 'dsa-h-4',
  type: 'dsa',
  title: 'Find Median from Data Stream',
  meta: {
    ...META,
    eyebrow: 'PATTERN · TWO HEAPS',
    leetcode: 'LeetCode #295',
    difficulty: 'HARD',
    description: 'Support addNum and findMedian. A max-heap for the lower half and min-heap for the upper half balance in O(log n).',
  },
  defaultApproachId: 'optimized',
  approaches: [
    {
      id: 'brute',
      label: 'Brute force · sorted list',
      complexity: { time: 'O(n log n) add', space: 'O(n)' },
      code: ['store all numbers in array', 'on median: sort and pick middle'],
      steps: [
        arrayStep(1, arr([1, 2]), [], [0, 1], { stream: '1,2' }, 'Insert 1, then 2 — keep sorted array on every add.'),
        arrayStep(2, arr([1, 2, 3, 4]), [], [1, 2], { median: 2.5 }, 'After 3,4: sorted [1,2,3,4] → median (2+3)/2 = 2.5. Resorting each time is costly.'),
      ],
    },
    {
      id: 'optimized',
      label: 'Optimized · max-heap + min-heap',
      complexity: { time: 'O(log n) add', space: 'O(n)' },
      code: ['low ← max-heap, high ← min-heap', 'balance sizes ±1', 'median ← top(low) or avg tops'],
      steps: [
        stackStep(1, '', 0, ['1'], { low: 'max' }, 'Add 1 → low max-heap = [1].', { secondaryStack: [], secondaryLabel: 'high (min)', stackLabel: 'low (max)', status: 'low holds smaller half' }),
        stackStep(2, '', 1, ['1', '2'], { balance: 'ok' }, 'Add 2 → push to low, rebalance → low=[1], high=[2].', { secondaryStack: ['2'], secondaryLabel: 'high (min)', stackLabel: 'low (max)' }),
        stackStep(3, '', 2, ['2', '3'], { median: 2 }, 'Add 3 → low=[2,1], high=[3]. Median = top(low) = 2.', { secondaryStack: ['3'], secondaryLabel: 'high (min)', stackLabel: 'low (max)', status: 'median = 2' }),
      ],
    },
  ],
};

const lastStoneWeight: VisualScript = {
  id: 'dsa-h-5',
  type: 'dsa',
  title: 'Last Stone Weight',
  meta: {
    ...META,
    eyebrow: 'PATTERN · MAX-HEAP SMASH',
    leetcode: 'LeetCode #1046',
    difficulty: 'EASY',
    description: 'Repeatedly smash the two heaviest stones. Push difference back until one or zero stones remain.',
  },
  defaultApproachId: 'optimized',
  approaches: [
    {
      id: 'brute',
      label: 'Brute force · rescan max each round',
      complexity: { time: 'O(n²)', space: 'O(1)' },
      code: ['while len≥2:', '  y ← max, x ← second max', '  if y≠x: push y-x'],
      steps: [
        arrayStep(1, arr([2, 7, 4, 1, 8, 1]), [], [1, 3], { pick: '8,7' }, 'Scan for two largest each round: smash 8 and 7 → diff 1.'),
        arrayStep(2, arr([2, 4, 1, 1, 1]), [], [], { left: 1 }, 'Repeat until one stone 1 remains — O(n²) rescans.'),
      ],
    },
    {
      id: 'optimized',
      label: 'Optimized · max-heap',
      complexity: { time: 'O(n log n)', space: 'O(n)' },
      code: ['max-heap ← stones', 'while size≥2:', '  y←pop; x←pop; if y≠x: push y-x', 'return heap.top or 0'],
      steps: [
        heapStep(1, [8, 7, 4, 2, 1, 1], { round: 1 }, 'Max-heap built from stones. Pop 8 and 7.', { highlightIndices: [0, 1], label: 'max-heap' }),
        heapStep(2, [4, 2, 1, 1, 1], { pushed: 1 }, 'Push diff 1 back. Next smash 4 and 2 → push 2.', { highlightIndices: [0] }),
        heapStep(3, [2, 1, 1, 1], { ans: 1 }, 'Final single stone weight = 1.', { highlightIndices: [0], label: 'last stone' }),
      ],
    },
  ],
};

const taskScheduler: VisualScript = {
  id: 'dsa-h-6',
  type: 'dsa',
  title: 'Task Scheduler',
  meta: {
    ...META,
    eyebrow: 'PATTERN · FREQ + COOLDOWN',
    leetcode: 'LeetCode #621',
    difficulty: 'MEDIUM',
    description: 'Schedule tasks with cooldown n between identical tasks. Max frequency task drives minimum intervals.',
  },
  defaultApproachId: 'optimized',
  approaches: [
    {
      id: 'brute',
      label: 'Brute force · simulate queue',
      complexity: { time: 'O(n · cycles)', space: 'O(n)' },
      code: ['queue tasks by freq', 'simulate time slots with cooldown map'],
      steps: [
        arrayStep(1, arr([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]), [], [], { tasks: 'A×5,B×1,C×1,D×1' }, 'Simulate second-by-second: pick highest-freq available task, wait n=2 if cooling.'),
        arrayStep(2, arr([]), [], [], { ans: 16 }, 'After 16 slots all tasks done — simulation works but slow.'),
      ],
    },
    {
      id: 'optimized',
      label: 'Optimized · math formula',
      complexity: { time: 'O(n)', space: 'O(1)' },
      code: ['maxFreq ← max count', 'maxCount ← # tasks with maxFreq', 'ans ← (maxFreq-1)*(n+1)+maxCount', 'return max(ans, len(tasks))'],
      steps: [
        heapStep(1, ['A:5', 'B:1', 'C:1', 'D:1'], { n: 2 }, 'A runs 5 times — dominates schedule. Cooldown n=2 idle slots possible.', { highlightIndices: [0], label: 'freq heap' }),
        heapStep(2, ['A', 'A', 'A', 'A', 'A'], { blocks: 5 }, 'Formula: (5-1)×(2+1)+4 = 16 intervals minimum.', { highlightIndices: [0] }),
        heapStep(3, [], { ans: 16 }, 'Answer = max(16, task count) = 16.', { label: 'min intervals' }),
      ],
    },
  ],
};

const reorganizeString: VisualScript = {
  id: 'dsa-h-7',
  type: 'dsa',
  title: 'Reorganize String',
  meta: {
    ...META,
    eyebrow: 'PATTERN · MAX-HEAP PLACEMENT',
    leetcode: 'LeetCode #767',
    difficulty: 'MEDIUM',
    description: 'Rearrange s so no two adjacent chars match. Greedily place the most frequent remaining char, alternating with the next.',
  },
  defaultApproachId: 'optimized',
  approaches: [
    {
      id: 'brute',
      label: 'Brute force · backtracking',
      complexity: { time: 'O(n!)', space: 'O(n)' },
      code: ['try all permutations of s', 'return first with no adjacent dupes'],
      steps: [
        stringStep(1, 'aab', {}, { try: 'aba' }, 'Permute "aab" — only valid order is "aba". Brute tries many invalid orderings.'),
        stringStep(2, 'aba', {}, { ok: 'yes' }, 'Found "aba" — no adjacent equal letters.'),
      ],
    },
    {
      id: 'optimized',
      label: 'Optimized · max-heap by freq',
      complexity: { time: 'O(n log k)', space: 'O(k)' },
      code: ['count chars', 'max-heap by freq', 'pop top twice, append, push back leftovers'],
      steps: [
        heapStep(1, ['a:2', 'b:1'], {}, 'Heap: a×2 most frequent. Place a, then must use different char.', { highlightIndices: [0], label: 'char freq' }),
        heapStep(2, ['a:1', 'b:0'], { built: 'ab' }, 'After placing a,b push a:1 back. Continue → "aba".', { highlightIndices: [0] }),
        heapStep(3, [], { ans: 'aba' }, 'Impossible if any freq > (n+1)/2 — here succeeds.', { label: 'result' }),
      ],
    },
  ],
};

const kClosestPoints: VisualScript = {
  id: 'dsa-h-8',
  type: 'dsa',
  title: 'K Closest Points to Origin',
  meta: {
    ...META,
    eyebrow: 'PATTERN · MAX-HEAP OF SIZE K',
    leetcode: 'LeetCode #973',
    difficulty: 'MEDIUM',
    description: 'Return k points closest to origin. Maintain a size-k max-heap on distance — evict farthest when full.',
  },
  defaultApproachId: 'optimized',
  approaches: [
    {
      id: 'brute',
      label: 'Brute force · sort by distance',
      complexity: { time: 'O(n log n)', space: 'O(n)' },
      code: ['dist ← x²+y² for each point', 'sort by dist', 'return first k'],
      steps: [
        arrayStep(1, arr([1, 3, 5, 2]), [{ name: 'd²', index: 0, color: 'accent' }], [0], { pts: '(1,3),(2,2),(3,1)' }, 'Compute squared distances: 10, 8, 10 for three points.'),
        arrayStep(2, arr([8, 10, 10]), [], [0], { k: 2, pick: '(2,2),(3,1)' }, 'Sort by dist, take k=2 closest.'),
      ],
    },
    {
      id: 'optimized',
      label: 'Optimized · size-k max-heap',
      complexity: { time: 'O(n log k)', space: 'O(k)' },
      code: ['max-heap size k on distance', 'for each point:', '  push; if size>k: pop max dist'],
      steps: [
        heapStep(1, ['(1,3):10', '(2,2):8'], { k: 2 }, 'Push first two points. Heap holds farthest among kept set.', { highlightIndices: [0], label: 'dist max-heap' }),
        heapStep(2, ['(2,2):8', '(3,1):10'], { evict: '(1,3)' }, 'Point (3,1) dist=10 — evict (1,3):10, keep (2,2) and (3,1).', { highlightIndices: [0, 1] }),
        heapStep(3, ['(2,2):8', '(3,1):10'], { ans: 'k closest' }, 'Heap contents are the k closest points.', { highlightIndices: [0, 1] }),
      ],
    },
  ],
};

const singleThreadedCpu: VisualScript = {
  id: 'dsa-h-9',
  type: 'dsa',
  title: 'Single Threaded CPU',
  meta: {
    ...META,
    eyebrow: 'PATTERN · MIN-HEAP BY READY TIME',
    leetcode: 'LeetCode #1834',
    difficulty: 'MEDIUM',
    description: 'Process tasks in order of (enqueueTime, index). Min-heap holds ready tasks sorted by (duration, index).',
  },
  defaultApproachId: 'optimized',
  approaches: [
    {
      id: 'brute',
      label: 'Brute force · rescan ready set',
      complexity: { time: 'O(n²)', space: 'O(n)' },
      code: ['time ← 0', 'while tasks remain:', '  pick min (duration,index) among ready', '  run it'],
      steps: [
        arrayStep(1, arr([0, 2, 4, 6]), [{ name: 't', index: 0, color: 'accent' }], [0], { ready: 'task0' }, 'At time 0 only task 0 ready — run duration 3.'),
        arrayStep(2, arr([1, 2, 3, 4]), [{ name: 't', index: 2, color: 'accent' }], [2], { order: '[0,2,3,1]' }, 'Rescan all ready tasks each step — O(n²).'),
      ],
    },
    {
      id: 'optimized',
      label: 'Optimized · min-heap of ready tasks',
      complexity: { time: 'O(n log n)', space: 'O(n)' },
      code: ['sort tasks by enqueueTime', 'heap ← ready by (duration, index)', 'advance clock, push newly ready'],
      steps: [
        heapStep(1, ['0:3', '1:2'], { time: 0 }, 'At t=0 push tasks with enqueue≤0. Pop shortest duration.', { highlightIndices: [0], label: 'ready heap' }),
        heapStep(2, ['2:4', '1:2'], { time: 3 }, 'After task 0 finishes at t=3, push newly ready tasks.', { highlightIndices: [0] }),
        heapStep(3, ['1:2', '2:4', '3:1'], { ans: '[0,2,3,1]' }, 'Always pop min (duration,index) — correct CPU order.', { highlightIndices: [0] }),
      ],
    },
  ],
};

const designTwitter: VisualScript = {
  id: 'dsa-h-10',
  type: 'dsa',
  title: 'Design Twitter',
  meta: {
    ...META,
    eyebrow: 'PATTERN · HEAP MERGE FEED',
    leetcode: 'LeetCode #355',
    difficulty: 'HARD',
    description: 'getNewsFeed returns 10 most recent tweets from user and followees. Merge k sorted tweet lists with a max-heap.',
  },
  defaultApproachId: 'optimized',
  approaches: [
    {
      id: 'brute',
      label: 'Brute force · collect and sort',
      complexity: { time: 'O(n log n)', space: 'O(n)' },
      code: ['gather all tweets from user + followees', 'sort by timestamp desc', 'return first 10'],
      steps: [
        arrayStep(1, arr([6, 5, 4, 3, 2, 1]), [], [0, 1, 2], { pool: 6 }, 'Collect tweets from all followed users into one list.'),
        arrayStep(2, arr([6, 5, 4, 3, 2, 1]), [{ name: '10', index: 9, color: 'accent' }], [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], { feed: 'top 10' }, 'Sort by time and slice 10 — works but rescans everything.'),
      ],
    },
    {
      id: 'optimized',
      label: 'Optimized · heap merge tweet lists',
      complexity: { time: 'O(k log k)', space: 'O(k)' },
      code: ['max-heap of latest tweet per user', 'pop 10 times, push next from same user'],
      steps: [
        heapStep(1, ['u1:6', 'u2:5', 'u3:4'], { k: 3 }, 'Each followed user contributes their latest tweet to max-heap.', { highlightIndices: [0], label: 'tweet heap' }),
        heapStep(2, ['u1:5', 'u2:5', 'u3:4'], { pop: 6 }, 'Pop tweet 6 from u1, push u1\'s next tweet 5.', { highlightIndices: [0] }),
        heapStep(3, ['u1:4', 'u2:4', 'u3:3'], { feed: '[6,5,5,4,...]' }, 'Repeat 10 pops — merge k sorted streams like merge-k-lists.', { highlightIndices: [0, 1] }),
      ],
    },
  ],
};

const ipo: VisualScript = {
  id: 'dsa-h-11',
  type: 'dsa',
  title: 'IPO',
  meta: {
    ...META,
    eyebrow: 'PATTERN · TWO HEAPS CAPITAL',
    leetcode: 'LeetCode #502',
    difficulty: 'HARD',
    description: 'Pick at most k projects to maximize capital. Min-heap for affordable projects by profit; max-heap for best profit.',
  },
  defaultApproachId: 'optimized',
  approaches: [
    {
      id: 'brute',
      label: 'Brute force · try subsets',
      complexity: { time: 'O(2^n)', space: 'O(n)' },
      code: ['try all subsets of size ≤ k', 'track max capital achievable'],
      steps: [
        arrayStep(1, arr([0, 1, 1]), [], [0, 1, 2], { capital: 0, k: 2 }, 'Projects (cost,profit): (0,1),(1,2),(1,3). Try combinations greedily by hand.'),
        arrayStep(2, arr([0, 1, 3]), [], [], { ans: 4 }, 'Pick project 0 then 2 → capital 0→1→4. Brute explores many subsets.'),
      ],
    },
    {
      id: 'optimized',
      label: 'Optimized · min-cap + max-profit heaps',
      complexity: { time: 'O(n log n)', space: 'O(n)' },
      code: ['sort by capital', 'min-heap affordable; max-heap profits', 'repeat k: pop max profit, add to capital'],
      steps: [
        heapStep(1, ['p0:1', 'p1:2'], { cap: 0, affordable: 2 }, 'Capital 0 unlocks projects 0,1. Max-heap picks profit 2 first.', { highlightIndices: [1], label: 'profit max-heap' }),
        heapStep(2, ['p2:3'], { cap: 2 }, 'After profit 2, capital=2 — push newly affordable project 2 profit 3.', { highlightIndices: [0] }),
        heapStep(3, [], { ans: 4 }, 'Take second project profit 3 → final capital 4.', { label: 'max capital' }),
      ],
    },
  ],
};

const minCostHireWorkers: VisualScript = {
  id: 'dsa-h-12',
  type: 'dsa',
  title: 'Minimum Cost to Hire K Workers',
  meta: {
    ...META,
    eyebrow: 'PATTERN · RATIO HEAP',
    leetcode: 'LeetCode #857',
    difficulty: 'HARD',
    description: 'Hire k workers; total wage ≥ k × max wage in group. Sort by wage/quality ratio, use max-heap on quality sum.',
  },
  defaultApproachId: 'optimized',
  approaches: [
    {
      id: 'brute',
      label: 'Brute force · all k-combinations',
      complexity: { time: 'O(n^k)', space: 'O(k)' },
      code: ['for each k-subset:', '  if wage rule satisfied: track min cost'],
      steps: [
        arrayStep(1, arr([10, 20, 5]), [], [0, 1, 2], { q: '10,20,5', w: '70,100,30' }, 'Three workers — try every pair when k=2.'),
        arrayStep(2, arr([105, 130]), [], [0], { min: 105 }, 'Valid group {0,2} costs 70+30=100×? — brute checks all pairs.'),
      ],
    },
    {
      id: 'optimized',
      label: 'Optimized · sort ratio + max-heap',
      complexity: { time: 'O(n log n)', space: 'O(n)' },
      code: ['sort by wage/quality', 'max-heap of k smallest qualities', 'cost = ratio × sumQualities'],
      steps: [
        heapStep(1, ['q:10', 'q:5'], { ratio: '7.0' }, 'Fix ratio by highest wage worker. Heap keeps k smallest qualities.', { highlightIndices: [1], label: 'quality heap' }),
        heapStep(2, ['q:5', 'q:3', 'q:2'], { k: 3 }, 'Slide window — pop largest quality when size>k.', { highlightIndices: [0] }),
        heapStep(3, [], { ans: 'min cost' }, 'Min cost = best ratio × sum of k qualities in valid window.', { label: 'optimal hire' }),
      ],
    },
  ],
};

export const HEAP_SCRIPTS: Record<string, VisualScript> = {
  'h-1': kthLargest,
  'h-2': mergeKLists,
  'h-3': topKFrequent,
  'h-4': findMedianStream,
  'h-5': lastStoneWeight,
  'h-6': taskScheduler,
  'h-7': reorganizeString,
  'h-8': kClosestPoints,
  'h-9': singleThreadedCpu,
  'h-10': designTwitter,
  'h-11': ipo,
  'h-12': minCostHireWorkers,
};
