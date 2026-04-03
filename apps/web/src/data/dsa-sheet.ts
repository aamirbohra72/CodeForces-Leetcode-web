/**
 * DSA Sheet curriculum data — mirrors a structured topic → problems layout.
 * Swap this module for an API fetch when wiring a backend.
 */

export type DsaDifficulty = 'Easy' | 'Medium' | 'Hard';

export type DsaProblem = {
  id: string;
  title: string;
  practiceUrl: string;
  videoUrl: string;
  editorialUrl: string;
  difficulty: DsaDifficulty;
};

export type DsaTopic = {
  id: string;
  order: number;
  title: string;
  /** Total count must match problems.length for progress accuracy */
  problems: DsaProblem[];
};

function p(
  topicPrefix: string,
  index: number,
  title: string,
  difficulty: DsaDifficulty,
  practiceUrl = 'https://leetcode.com/problemset/',
  videoUrl = 'https://www.youtube.com/results?search_query=',
  editorialUrl = 'https://www.google.com/search?q=',
): DsaProblem {
  const slug = `${topicPrefix}-${index}`;
  const q = encodeURIComponent(`${title} leetcode`);
  return {
    id: slug,
    title,
    practiceUrl,
    videoUrl: `${videoUrl}${encodeURIComponent(title + ' tutorial')}`,
    editorialUrl: `${editorialUrl}${q}`,
    difficulty,
  };
}

export const DSA_TOPICS: DsaTopic[] = [
  {
    id: 'foundation',
    order: 1,
    title: 'Foundation',
    problems: [
      p('f', 1, 'Time & space complexity basics', 'Easy'),
      p('f', 2, 'Asymptotic notation (Big O, Theta, Omega)', 'Easy'),
      p('f', 3, 'Analyzing nested loops', 'Easy'),
      p('f', 4, 'Introduction to recursion', 'Medium'),
      p('f', 5, 'Divide and conquer intuition', 'Medium'),
      p('f', 6, 'Bit manipulation essentials', 'Medium'),
      p('f', 7, 'Math for competitive programming', 'Medium'),
      p('f', 8, 'Prefix sums — concept', 'Easy'),
      p('f', 9, 'Hashing — when and why', 'Easy'),
      p('f', 10, 'Sorting stability & comparisons', 'Easy'),
    ],
  },
  {
    id: 'arrays',
    order: 2,
    title: 'Arrays',
    problems: [
      p('a', 1, 'Two Sum', 'Easy'),
      p('a', 2, 'Best Time to Buy and Sell Stock', 'Easy'),
      p('a', 3, 'Contains Duplicate', 'Easy'),
      p('a', 4, 'Product of Array Except Self', 'Medium'),
      p('a', 5, 'Maximum Subarray (Kadane)', 'Medium'),
      p('a', 6, 'Merge Intervals', 'Medium'),
      p('a', 7, 'Rotate Array', 'Medium'),
      p('a', 8, 'First Missing Positive', 'Hard'),
      p('a', 9, 'Trapping Rain Water', 'Hard'),
    ],
  },
  {
    id: 'linked-list',
    order: 3,
    title: 'Linked List',
    problems: [
      p('ll', 1, 'Reverse Linked List', 'Easy'),
      p('ll', 2, 'Merge Two Sorted Lists', 'Easy'),
      p('ll', 3, 'Linked List Cycle', 'Easy'),
      p('ll', 4, 'Middle of the Linked List', 'Easy'),
      p('ll', 5, 'Remove Nth Node From End', 'Medium'),
      p('ll', 6, 'Add Two Numbers', 'Medium'),
      p('ll', 7, 'Intersection of Two Linked Lists', 'Easy'),
      p('ll', 8, 'Copy List with Random Pointer', 'Medium'),
      p('ll', 9, 'LRU Cache', 'Medium'),
      p('ll', 10, 'Merge k Sorted Lists', 'Hard'),
      p('ll', 11, 'Reverse Nodes in k-Group', 'Hard'),
      p('ll', 12, 'Palindrome Linked List', 'Easy'),
      p('ll', 13, 'Sort List', 'Medium'),
      p('ll', 14, 'Flatten a Multilevel Doubly Linked List', 'Medium'),
    ],
  },
  {
    id: 'strings',
    order: 4,
    title: 'Strings',
    problems: [
      p('s', 1, 'Valid Anagram', 'Easy'),
      p('s', 2, 'Valid Palindrome', 'Easy'),
      p('s', 3, 'Longest Palindrome', 'Easy'),
      p('s', 4, 'Group Anagrams', 'Medium'),
      p('s', 5, 'Longest Substring Without Repeating Characters', 'Medium'),
      p('s', 6, 'Valid Parentheses', 'Easy'),
      p('s', 7, 'Minimum Window Substring', 'Hard'),
      p('s', 8, 'Encode and Decode Strings', 'Medium'),
      p('s', 9, 'Palindromic Substrings', 'Medium'),
      p('s', 10, 'Edit Distance', 'Hard'),
      p('s', 11, 'KMP / string matching intro', 'Hard'),
      p('s', 12, 'Word Break', 'Medium'),
    ],
  },
  {
    id: 'stack-queues',
    order: 5,
    title: 'Stack and Queues',
    problems: [
      p('sq', 1, 'Min Stack', 'Medium'),
      p('sq', 2, 'Valid Parentheses', 'Easy'),
      p('sq', 3, 'Daily Temperatures', 'Medium'),
      p('sq', 4, 'Next Greater Element I', 'Easy'),
      p('sq', 5, 'Largest Rectangle in Histogram', 'Hard'),
      p('sq', 6, 'Sliding Window Maximum', 'Hard'),
      p('sq', 7, 'Implement Queue using Stacks', 'Easy'),
      p('sq', 8, 'Implement Stack using Queues', 'Easy'),
      p('sq', 9, 'Decode String', 'Medium'),
      p('sq', 10, 'Evaluate Reverse Polish Notation', 'Medium'),
    ],
  },
  {
    id: 'binary-search',
    order: 6,
    title: 'Binary Search Algorithm',
    problems: [
      p('bs', 1, 'Sqrt(x)', 'Easy'),
      p('bs', 2, 'Search in Rotated Sorted Array', 'Medium'),
      p('bs', 3, 'First Bad Version', 'Easy'),
      p('bs', 4, 'Find Peak Element', 'Medium'),
      p('bs', 5, 'Search Insert Position', 'Easy'),
      p('bs', 6, 'Binary Search', 'Easy'),
      p('bs', 7, 'Find Minimum in Rotated Sorted Array', 'Medium'),
      p('bs', 8, 'Koko Eating Bananas', 'Medium'),
      p('bs', 9, 'Median of Two Sorted Arrays', 'Hard'),
      p('bs', 10, 'Split Array Largest Sum', 'Hard'),
    ],
  },
  {
    id: 'two-pointers',
    order: 7,
    title: 'Two Pointers & Sliding Window',
    problems: [
      p('tp', 1, 'Two Sum II — Input Array Is Sorted', 'Easy'),
      p('tp', 2, '3Sum', 'Medium'),
      p('tp', 3, 'Container With Most Water', 'Medium'),
      p('tp', 4, 'Trapping Rain Water', 'Hard'),
      p('tp', 5, 'Longest Substring Without Repeating Characters', 'Medium'),
      p('tp', 6, 'Minimum Size Subarray Sum', 'Medium'),
      p('tp', 7, 'Permutation in String', 'Medium'),
      p('tp', 8, 'Sliding Window Maximum', 'Hard'),
      p('tp', 9, 'Fruit Into Baskets', 'Medium'),
      p('tp', 10, 'Max Consecutive Ones III', 'Medium'),
      p('tp', 11, 'Subarray Product Less Than K', 'Medium'),
      p('tp', 12, 'Longest Repeating Character Replacement', 'Medium'),
    ],
  },
  {
    id: 'binary-tree',
    order: 8,
    title: 'Binary Tree',
    problems: [
      p('bt', 1, 'Maximum Depth of Binary Tree', 'Easy'),
      p('bt', 2, 'Invert Binary Tree', 'Easy'),
      p('bt', 3, 'Symmetric Tree', 'Easy'),
      p('bt', 4, 'Binary Tree Level Order Traversal', 'Medium'),
      p('bt', 5, 'Binary Tree Zigzag Level Order', 'Medium'),
      p('bt', 6, 'Validate Binary Search Tree', 'Medium'),
      p('bt', 7, 'Construct Binary Tree from Traversals', 'Medium'),
      p('bt', 8, 'Lowest Common Ancestor of BST', 'Easy'),
      p('bt', 9, 'Binary Tree Maximum Path Sum', 'Hard'),
      p('bt', 10, 'Serialize and Deserialize Binary Tree', 'Hard'),
      p('bt', 11, 'Path Sum III', 'Medium'),
      p('bt', 12, 'Flatten Binary Tree to Linked List', 'Medium'),
      p('bt', 13, 'Populating Next Right Pointers', 'Medium'),
      p('bt', 14, 'Diameter of Binary Tree', 'Easy'),
      p('bt', 15, 'Same Tree', 'Easy'),
      p('bt', 16, 'Subtree of Another Tree', 'Easy'),
      p('bt', 17, 'Kth Smallest Element in a BST', 'Medium'),
      p('bt', 18, 'Recover Binary Search Tree', 'Hard'),
    ],
  },
  {
    id: 'bst',
    order: 9,
    title: 'Binary Search Tree',
    problems: [
      p('bst', 1, 'Search in a Binary Search Tree', 'Easy'),
      p('bst', 2, 'Insert into a Binary Search Tree', 'Medium'),
      p('bst', 3, 'Delete Node in a BST', 'Medium'),
      p('bst', 4, 'Balance a BST', 'Medium'),
      p('bst', 5, 'Two Sum IV — Input is a BST', 'Easy'),
    ],
  },
  {
    id: 'heap',
    order: 10,
    title: 'Heap',
    problems: [
      p('h', 1, 'Kth Largest Element in an Array', 'Medium'),
      p('h', 2, 'Merge k Sorted Lists', 'Hard'),
      p('h', 3, 'Top K Frequent Elements', 'Medium'),
      p('h', 4, 'Find Median from Data Stream', 'Hard'),
      p('h', 5, 'Last Stone Weight', 'Easy'),
      p('h', 6, 'Task Scheduler', 'Medium'),
      p('h', 7, 'Reorganize String', 'Medium'),
      p('h', 8, 'K Closest Points to Origin', 'Medium'),
      p('h', 9, 'Single Threaded CPU', 'Medium'),
      p('h', 10, 'Design Twitter', 'Hard'),
      p('h', 11, 'IPO', 'Hard'),
      p('h', 12, 'Minimum Cost to Hire K Workers', 'Hard'),
    ],
  },
  {
    id: 'backtracking',
    order: 11,
    title: 'Backtracking',
    problems: [
      p('bk', 1, 'Subsets', 'Medium'),
      p('bk', 2, 'Subsets II', 'Medium'),
      p('bk', 3, 'Permutations', 'Medium'),
      p('bk', 4, 'Combination Sum', 'Medium'),
      p('bk', 5, 'Generate Parentheses', 'Medium'),
      p('bk', 6, 'Word Search', 'Medium'),
      p('bk', 7, 'N-Queens', 'Hard'),
      p('bk', 8, 'Sudoku Solver', 'Hard'),
      p('bk', 9, 'Palindrome Partitioning', 'Medium'),
      p('bk', 10, 'Letter Combinations of a Phone Number', 'Medium'),
      p('bk', 11, 'Restore IP Addresses', 'Medium'),
      p('bk', 12, 'Word Break II', 'Hard'),
      p('bk', 13, 'Partition to K Equal Sum Subsets', 'Medium'),
      p('bk', 14, 'Matchsticks to Square', 'Medium'),
      p('bk', 15, 'Expression Add Operators', 'Hard'),
    ],
  },
  {
    id: 'greedy',
    order: 12,
    title: 'Greedy Algorithm',
    problems: [
      p('g', 1, 'Assign Cookies', 'Easy'),
      p('g', 2, 'Jump Game', 'Medium'),
      p('g', 3, 'Jump Game II', 'Medium'),
      p('g', 4, 'Gas Station', 'Medium'),
      p('g', 5, 'Hand of Straights', 'Medium'),
      p('g', 6, 'Merge Triplets to Target', 'Medium'),
      p('g', 7, 'Minimum Deletions to Make Character Frequencies Unique', 'Medium'),
      p('g', 8, 'Remove K Digits', 'Medium'),
      p('g', 9, 'Non-overlapping Intervals', 'Medium'),
      p('g', 10, 'Partition Labels', 'Medium'),
      p('g', 11, 'Queue Reconstruction by Height', 'Medium'),
      p('g', 12, 'Valid Parenthesis String', 'Medium'),
    ],
  },
  {
    id: 'dp',
    order: 13,
    title: 'Dynamic Programming',
    problems: [
      p('dp', 1, 'Climbing Stairs', 'Easy'),
      p('dp', 2, 'House Robber', 'Medium'),
      p('dp', 3, 'Coin Change', 'Medium'),
      p('dp', 4, 'Longest Increasing Subsequence', 'Medium'),
      p('dp', 5, 'Word Break', 'Medium'),
      p('dp', 6, 'Unique Paths', 'Medium'),
      p('dp', 7, 'Edit Distance', 'Hard'),
      p('dp', 8, 'Longest Common Subsequence', 'Medium'),
      p('dp', 9, 'Partition Equal Subset Sum', 'Medium'),
      p('dp', 10, 'Decode Ways', 'Medium'),
      p('dp', 11, 'Maximum Product Subarray', 'Medium'),
      p('dp', 12, 'Palindromic Substrings', 'Medium'),
      p('dp', 13, 'Interleaving String', 'Medium'),
      p('dp', 14, 'Burst Balloons', 'Hard'),
      p('dp', 15, 'Best Time to Buy and Sell Stock with Cooldown', 'Medium'),
      p('dp', 16, 'Longest Palindromic Subsequence', 'Medium'),
      p('dp', 17, 'Target Sum', 'Medium'),
      p('dp', 18, 'Distinct Subsequences', 'Hard'),
      p('dp', 19, 'Russian Doll Envelopes', 'Hard'),
      p('dp', 20, 'Egg Dropping', 'Hard'),
      p('dp', 21, 'Minimum Path Sum', 'Medium'),
      p('dp', 22, 'Knapsack 0/1 — classic', 'Medium'),
      p('dp', 23, 'Matrix Chain Multiplication intro', 'Hard'),
      p('dp', 24, 'Regex Matching', 'Hard'),
      p('dp', 25, 'Wild Card Matching', 'Hard'),
    ],
  },
  {
    id: 'graphs',
    order: 14,
    title: 'Graphs',
    problems: [
      p('gr', 1, 'Number of Islands', 'Medium'),
      p('gr', 2, 'Clone Graph', 'Medium'),
      p('gr', 3, 'Course Schedule', 'Medium'),
      p('gr', 4, 'Course Schedule II', 'Medium'),
      p('gr', 5, 'Redundant Connection', 'Medium'),
      p('gr', 6, 'Network Delay Time', 'Medium'),
      p('gr', 7, 'Cheapest Flights Within K Stops', 'Medium'),
      p('gr', 8, 'Pacific Atlantic Water Flow', 'Medium'),
      p('gr', 9, 'Rotting Oranges', 'Medium'),
      p('gr', 10, 'Word Ladder', 'Hard'),
      p('gr', 11, 'Minimum Height Trees', 'Medium'),
      p('gr', 12, 'Critical Connections', 'Hard'),
      p('gr', 13, 'Alien Dictionary', 'Hard'),
      p('gr', 14, 'Evaluate Division', 'Medium'),
      p('gr', 15, 'Accounts Merge', 'Medium'),
      p('gr', 16, 'Shortest Path in Binary Matrix', 'Medium'),
      p('gr', 17, 'Dijkstra template', 'Medium'),
      p('gr', 18, 'Tarjan / SCC intro', 'Hard'),
      p('gr', 19, 'Bipartite graph check', 'Easy'),
      p('gr', 20, 'Reconstruct Itinerary', 'Hard'),
    ],
  },
];

const STORAGE_KEY = 'codeforces-dsa-completed';

export function getTotalProblems(topics: DsaTopic[]): number {
  return topics.reduce((sum, t) => sum + t.problems.length, 0);
}

export function loadCompletedIds(): Set<string> {
  if (typeof window === 'undefined') return new Set();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    const arr = JSON.parse(raw) as string[];
    return new Set(Array.isArray(arr) ? arr : []);
  } catch {
    return new Set();
  }
}

export function saveCompletedIds(ids: Set<string>): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids]));
}

export function countCompletedForTopic(topic: DsaTopic, done: Set<string>): number {
  return topic.problems.filter((pr) => done.has(pr.id)).length;
}

export function totalCompleted(done: Set<string>, topics: DsaTopic[]): number {
  let n = 0;
  for (const t of topics) {
    for (const p of t.problems) {
      if (done.has(p.id)) n++;
    }
  }
  return n;
}
