import type { VisualScript } from '@/types/visual-script';
import { stackStep } from './helpers';
import { validParenthesesScript } from './strings';
import { slidingWindowMaxScript } from './sliding-window-max';

const META = {
  section: 'Stack and Queues',
  companies: ['Amazon', 'Google', 'Microsoft'],
};

const minStack: VisualScript = {
  id: 'dsa-sq-1',
  type: 'dsa',
  title: 'Min Stack',
  meta: {
    ...META,
    eyebrow: 'PATTERN · AUX MIN STACK',
    leetcode: 'LeetCode #155',
    difficulty: 'MEDIUM',
    description: 'Design a stack that supports push, pop, top, and getMin in O(1). Keep an auxiliary min stack.',
  },
  defaultApproachId: 'optimized',
  approaches: [
    {
      id: 'brute',
      label: 'Brute force · scan for min',
      complexity: { time: 'O(n) getMin', space: 'O(n)' },
      code: ['store values in stack', 'getMin: scan entire stack'],
      steps: [
        stackStep(1, '', 0, ['-2', '0', '-3'], { op: 'push' }, 'Values on main stack. getMin would scan for -3.', {
          values: ['-2', '0', '-3'],
          stackLabel: 'main',
          status: 'getMin scans all — O(n)',
        }),
      ],
    },
    {
      id: 'optimized',
      label: 'Optimized · parallel min stack',
      complexity: { time: 'O(1)', space: 'O(n)' },
      code: ['on push x: mins.push(min(x, mins.top))', 'on pop: pop both stacks', 'getMin: mins.top'],
      steps: [
        stackStep(1, '', 0, ['-2'], { x: -2 }, 'push(-2): mins also -2.', {
          values: ['-2'],
          stackLabel: 'main',
          secondaryStack: ['-2'],
          secondaryLabel: 'mins',
          status: 'mins tracks running minimum',
        }),
        stackStep(1, '', 1, ['-2', '0'], { x: 0 }, 'push(0): min still -2 → mins push -2.', {
          values: ['-2', '0'],
          stackLabel: 'main',
          secondaryStack: ['-2', '-2'],
          secondaryLabel: 'mins',
        }),
        stackStep(1, '', 2, ['-2', '0', '-3'], { x: -3, getMin: -3 }, 'push(-3): new min. getMin() = mins.top = -3 in O(1).', {
          values: ['-2', '0', '-3'],
          stackLabel: 'main',
          secondaryStack: ['-2', '-2', '-3'],
          secondaryLabel: 'mins',
          status: 'getMin → -3',
        }),
      ],
    },
  ],
};

const dailyTemperatures: VisualScript = {
  id: 'dsa-sq-3',
  type: 'dsa',
  title: 'Daily Temperatures',
  meta: {
    ...META,
    eyebrow: 'PATTERN · MONOTONIC STACK',
    leetcode: 'LeetCode #739',
    difficulty: 'MEDIUM',
    description: 'For each day, how many days until a warmer temperature? Monotonic decreasing stack of indices.',
  },
  defaultApproachId: 'optimized',
  approaches: [
    {
      id: 'brute',
      label: 'Brute force · nested scan',
      complexity: { time: 'O(n²)', space: 'O(1)' },
      code: ['for i: for j>i: if T[j]>T[i]: ans[i]=j-i; break'],
      steps: [
        stackStep(1, '', 0, [], { i: 0 }, 'For each day, scan forward until warmer.', {
          values: [73, 74, 75, 71, 69, 72, 76, 73],
          highlightIndices: [0, 1],
          status: 'day0=73 → warmer at day1 → wait 1',
        }),
        stackStep(1, '', 3, [], { i: 3 }, 'day3=71 needs scan to day6=76 → wait 3.', {
          values: [73, 74, 75, 71, 69, 72, 76, 73],
          highlightIndices: [3, 6],
        }),
      ],
    },
    {
      id: 'optimized',
      label: 'Optimized · monotonic stack',
      complexity: { time: 'O(n)', space: 'O(n)' },
      code: ['stack ← indices (decreasing temps)', 'while T[i] > T[stack.top]:', '  pop j; ans[j]=i-j', 'push i'],
      steps: [
        stackStep(2, '', 2, ['0', '1'], { i: 2, t: 75 }, 'Stack holds colder earlier days as indices.', {
          values: [73, 74, 75, 71, 69, 72, 76, 73],
          stackLabel: 'idx stack',
          highlightIndices: [2],
          status: 'decreasing temps on stack',
        }),
        stackStep(3, '', 5, ['2', '3', '4'], { i: 5, t: 72 }, '72 > 69 → pop 4, ans[4]=1. Continue while warmer.', {
          values: [73, 74, 75, 71, 69, 72, 76, 73],
          stackLabel: 'idx stack',
          highlightIndices: [5, 4],
          status: 'resolve waiting days when warmer arrives',
        }),
        stackStep(3, '', 6, ['2'], { ans: '[1,1,4,2,1,1,0,0]' }, '76 resolves remaining colder days. Each index pushed/popped once.', {
          values: [73, 74, 75, 71, 69, 72, 76, 73],
          stackLabel: 'idx stack',
          highlightIndices: [6],
          status: 'answer waits computed',
        }),
      ],
    },
  ],
};

const nextGreater: VisualScript = {
  id: 'dsa-sq-4',
  type: 'dsa',
  title: 'Next Greater Element I',
  meta: {
    ...META,
    eyebrow: 'PATTERN · NEXT GREATER',
    leetcode: 'LeetCode #496',
    difficulty: 'EASY',
    description: 'For each x in nums1, find the next greater element in nums2 (to the right). Use monotonic stack + map.',
  },
  defaultApproachId: 'optimized',
  approaches: [
    {
      id: 'brute',
      label: 'Brute force · for each query scan',
      complexity: { time: 'O(n·m)', space: 'O(1)' },
      code: ['for x in nums1:', '  find x in nums2, scan right for greater'],
      steps: [
        stackStep(1, '', 0, [], { x: 4 }, 'nums1=[4,1,2], nums2=[1,3,4,2]. For 4 scan right — none → -1.', {
          values: [1, 3, 4, 2],
          highlightIndices: [2],
          status: 'query 4 → -1',
        }),
        stackStep(1, '', 0, [], { x: 1 }, 'For 1: next greater is 3.', {
          values: [1, 3, 4, 2],
          highlightIndices: [0, 1],
          status: 'query 1 → 3',
        }),
      ],
    },
    {
      id: 'optimized',
      label: 'Optimized · stack on nums2',
      complexity: { time: 'O(n+m)', space: 'O(n)' },
      code: ['monotonic stack on nums2 → map nextGreater', 'answer nums1 via map'],
      steps: [
        stackStep(2, '', 2, ['1', '3'], { cur: 4 }, 'While stack top < 4, pop and set nextGreater[top]=4.', {
          values: [1, 3, 4, 2],
          stackLabel: 'stack',
          highlightIndices: [2],
          status: '3→4, build map',
        }),
        stackStep(3, '', 3, ['4', '2'], { map: '1→3,3→4,4→-1,2→-1' }, 'Lookup nums1 queries in map — O(1) each.', {
          values: [1, 3, 4, 2],
          stackLabel: 'stack',
          status: 'answers: [-1,3,-1]',
        }),
      ],
    },
  ],
};

const largestRectangle: VisualScript = {
  id: 'dsa-sq-5',
  type: 'dsa',
  title: 'Largest Rectangle in Histogram',
  meta: {
    ...META,
    eyebrow: 'PATTERN · HISTOGRAM STACK',
    leetcode: 'LeetCode #84',
    difficulty: 'HARD',
    description: 'Largest rectangle area in histogram. For each bar, find nearest smaller left/right via monotonic stack.',
  },
  defaultApproachId: 'optimized',
  approaches: [
    {
      id: 'brute',
      label: 'Brute force · expand each bar',
      complexity: { time: 'O(n²)', space: 'O(1)' },
      code: ['for each i as height:', '  expand L/R while ≥ heights[i]', '  area = h * width'],
      steps: [
        stackStep(1, '', 2, [], { h: 5, width: 1 }, 'Bar index 2 height 5 — expand while neighbors ≥ 5.', {
          values: [2, 1, 5, 6, 2, 3],
          highlightIndices: [2],
          status: 'area candidates per bar',
        }),
        stackStep(2, '', 3, [], { h: 6, best: 10 }, 'Best often from shorter wide bars — e.g. height 2 × width 5 = 10.', {
          values: [2, 1, 5, 6, 2, 3],
          highlightIndices: [2, 3, 4, 5],
          status: 'max area = 10',
        }),
      ],
    },
    {
      id: 'optimized',
      label: 'Optimized · monotonic increasing stack',
      complexity: { time: 'O(n)', space: 'O(n)' },
      code: ['stack increasing heights', 'when smaller bar comes:', '  pop; width from new top → i', '  update max area'],
      steps: [
        stackStep(2, '', 4, ['1', '2', '3'], { i: 4, h: 2 }, 'At i=4 (h=2), pop taller bars 6 then 5 and compute areas.', {
          values: [2, 1, 5, 6, 2, 3],
          stackLabel: 'idx',
          highlightIndices: [4],
          status: 'pop 6: area 6×1; pop 5: area 5×2',
        }),
        stackStep(3, '', 6, ['1', '4', '5'], { maxArea: 10 }, 'Continue to end (sentinel 0). Max area settles at 10.', {
          values: [2, 1, 5, 6, 2, 3],
          stackLabel: 'idx',
          status: 'max area = 10',
        }),
      ],
    },
  ],
};

const queueUsingStacks: VisualScript = {
  id: 'dsa-sq-7',
  type: 'dsa',
  title: 'Implement Queue using Stacks',
  meta: {
    ...META,
    eyebrow: 'PATTERN · TWO STACKS',
    leetcode: 'LeetCode #232',
    difficulty: 'EASY',
    description: 'FIFO queue from two LIFO stacks: in-stack for push, out-stack for pop/peek (transfer when empty).',
  },
  defaultApproachId: 'optimized',
  approaches: [
    {
      id: 'brute',
      label: 'Brute force · shift on every pop',
      complexity: { time: 'O(n) pop', space: 'O(n)' },
      code: ['push to stack', 'pop: move all to temp, pop bottom, move back'],
      steps: [
        stackStep(1, '', 0, ['1', '2', '3'], { costly: 'yes' }, 'Every pop reshuffles — amortized poor.', {
          values: [1, 2, 3],
          stackLabel: 's',
          status: 'O(n) per pop',
        }),
      ],
    },
    {
      id: 'optimized',
      label: 'Optimized · lazy transfer',
      complexity: { time: 'amortized O(1)', space: 'O(n)' },
      code: ['push → in', 'pop/peek: if out empty, pour in→out', 'pop out'],
      steps: [
        stackStep(1, '', 0, ['1', '2'], { op: 'push' }, 'push(1), push(2) go to in-stack.', {
          values: [1, 2],
          stackLabel: 'in',
          secondaryStack: [],
          secondaryLabel: 'out',
        }),
        stackStep(2, '', 0, [], { pour: 'yes' }, 'pop: out empty → pour in→out (reverse order).', {
          values: [1, 2],
          stackLabel: 'in',
          secondaryStack: ['2', '1'],
          secondaryLabel: 'out',
          status: 'out top = front of queue',
        }),
        stackStep(3, '', 0, [], { pop: 1 }, 'pop out → 1 (FIFO). Next pop is O(1) from out.', {
          values: [2],
          stackLabel: 'in',
          secondaryStack: ['2'],
          secondaryLabel: 'out',
          status: 'front was 1',
        }),
      ],
    },
  ],
};

const stackUsingQueues: VisualScript = {
  id: 'dsa-sq-8',
  type: 'dsa',
  title: 'Implement Stack using Queues',
  meta: {
    ...META,
    eyebrow: 'PATTERN · QUEUE ROTATE',
    leetcode: 'LeetCode #225',
    difficulty: 'EASY',
    description: 'LIFO stack from queue(s). On push, enqueue then rotate so new element sits at front.',
  },
  defaultApproachId: 'optimized',
  approaches: [
    {
      id: 'brute',
      label: 'Brute force · two queues swap',
      complexity: { time: 'O(n) push', space: 'O(n)' },
      code: ['push to q2, move all q1→q2', 'swap q1,q2'],
      steps: [
        stackStep(1, '', 0, ['2', '1'], {}, 'After push(2), queue front is 2 (stack top).', {
          values: [2, 1],
          stackLabel: 'q (front↑)',
          status: 'front acts as stack top',
        }),
      ],
    },
    {
      id: 'optimized',
      label: 'Optimized · single queue rotate',
      complexity: { time: 'O(n) push', space: 'O(n)' },
      code: ['enqueue x', 'rotate size-1 times: dequeue→enqueue'],
      steps: [
        stackStep(1, '', 0, ['1'], { push: 1 }, 'push(1). Queue = [1].', {
          values: [1],
          stackLabel: 'queue',
        }),
        stackStep(2, '', 0, ['2', '1'], { push: 2 }, 'push(2): enqueue then rotate once → front=2.', {
          values: [2, 1],
          stackLabel: 'queue',
          status: 'pop/top read front',
        }),
      ],
    },
  ],
};

const decodeString: VisualScript = {
  id: 'dsa-sq-9',
  type: 'dsa',
  title: 'Decode String',
  meta: {
    ...META,
    eyebrow: 'PATTERN · NESTED STACK',
    leetcode: 'LeetCode #394',
    difficulty: 'MEDIUM',
    description: 'Decode encoded string k[encoded]. Stacks hold counts and partial strings across brackets.',
  },
  defaultApproachId: 'optimized',
  approaches: [
    {
      id: 'brute',
      label: 'Brute force · recursion',
      complexity: { time: 'O(n)', space: 'O(n)' },
      code: ['parse recursively on brackets', 'repeat substring k times'],
      steps: [
        stackStep(1, '3[a]2[bc]', 0, [], { s: '3[a]2[bc]' }, 'Recurse into each [...] and expand.', {
          status: 'expect "aaabcbc"',
        }),
      ],
    },
    {
      id: 'optimized',
      label: 'Optimized · two stacks',
      complexity: { time: 'O(n)', space: 'O(n)' },
      code: ['on digit: build k', 'on [: push k & cur; reset', 'on ]: pop, cur = prev + cur*k'],
      steps: [
        stackStep(2, '3[a2[c]]', 1, [], { k: 3 }, "Read k=3, see '[' → push count & empty string.", {
          stackLabel: 'counts',
          secondaryStack: [''],
          secondaryLabel: 'strs',
          status: 'enter first bracket',
        }),
        stackStep(3, '3[a2[c]]', 4, ['3'], { cur: 'a', k: 2 }, "Build 'a', then k=2 and '[' again.", {
          stackLabel: 'counts',
          secondaryStack: ['', 'a'],
          secondaryLabel: 'strs',
        }),
        stackStep(4, '3[a2[c]]', 7, ['3', '2'], { inner: 'c' }, "']' → pop: 'a' + 'c'*2 = 'acc'.", {
          stackLabel: 'counts',
          secondaryStack: [''],
          secondaryLabel: 'strs',
          status: "cur = 'acc'",
        }),
        stackStep(4, '3[a2[c]]', 8, [], { out: 'accaccacc' }, "Final ']': '' + 'acc'*3 → 'accaccacc'.", {
          stackLabel: 'counts',
          secondaryStack: [],
          secondaryLabel: 'strs',
          status: 'decoded',
          matched: true,
        }),
      ],
    },
  ],
};

const evalRPN: VisualScript = {
  id: 'dsa-sq-10',
  type: 'dsa',
  title: 'Evaluate Reverse Polish Notation',
  meta: {
    ...META,
    eyebrow: 'PATTERN · RPN STACK',
    leetcode: 'LeetCode #150',
    difficulty: 'MEDIUM',
    description: 'Evaluate postfix tokens. Push numbers; on operator, pop two, apply, push result.',
  },
  defaultApproachId: 'optimized',
  approaches: [
    {
      id: 'brute',
      label: 'Brute force · rebuild expression',
      complexity: { time: 'O(n²)', space: 'O(n)' },
      code: ['find operator, replace a b op with result', 'repeat'],
      steps: [
        stackStep(1, '', 0, [], {}, 'Scan for first operator and collapse — repeatedly.', {
          values: ['2', '1', '+', '3', '*'],
          status: 'collapse 2 1 + → 3, then 3 3 *',
        }),
      ],
    },
    {
      id: 'optimized',
      label: 'Optimized · one stack',
      complexity: { time: 'O(n)', space: 'O(n)' },
      code: ['for token:', '  if number: push', '  else: b←pop, a←pop, push a op b'],
      steps: [
        stackStep(2, '', 1, ['2', '1'], { tok: '+' }, "Tokens 2,1 on stack. See '+'.", {
          values: ['2', '1', '+', '3', '*'],
          stackLabel: 'stack',
          highlightIndices: [2],
        }),
        stackStep(3, '', 2, ['3'], { calc: '2+1=3' }, 'Pop 1 and 2, push 3.', {
          values: ['2', '1', '+', '3', '*'],
          stackLabel: 'stack',
          highlightIndices: [2],
        }),
        stackStep(3, '', 4, ['9'], { calc: '3*3=9' }, "Push 3, see '*': 3*3=9. Final answer on stack.", {
          values: ['2', '1', '+', '3', '*'],
          stackLabel: 'stack',
          highlightIndices: [4],
          status: 'result = 9',
          matched: true,
        }),
      ],
    },
  ],
};

export const STACK_QUEUE_SCRIPTS: Record<string, VisualScript> = {
  'sq-1': minStack,
  'sq-2': validParenthesesScript,
  'sq-3': dailyTemperatures,
  'sq-4': nextGreater,
  'sq-5': largestRectangle,
  'sq-6': slidingWindowMaxScript,
  'sq-7': queueUsingStacks,
  'sq-8': stackUsingQueues,
  'sq-9': decodeString,
  'sq-10': evalRPN,
};
