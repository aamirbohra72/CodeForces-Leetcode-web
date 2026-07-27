import type { ArrayCell, Step } from '@/types/visual-script';

export function arr(nums: number[]): ArrayCell[] {
  return nums.map((value, index) => ({ value, index }));
}

export function arrayStep(
  activeLine: number,
  cells: ArrayCell[],
  pointers: { name: string; index: number; color?: 'accent' | 'secondary' }[],
  highlight: number[],
  state: Step['state'],
  captionSeed: string,
  window?: { start: number; end: number },
): Step {
  return {
    activeLine,
    diagram: { kind: 'array', cells, pointers, highlightIndices: highlight, window },
    state,
    captionSeed,
  };
}

export function seqStep(
  activeLine: number,
  actors: string[],
  messages: { from: string; to: string; label: string; invalid?: boolean }[],
  state: Step['state'],
  captionSeed: string,
  selfCalls?: string[],
): Step {
  return {
    activeLine,
    diagram: { kind: 'sequence', actors, messages, selfCalls },
    state,
    captionSeed,
  };
}

const RAIN_HEIGHTS = [0, 1, 0, 2, 1, 0, 1, 3];

export function elevationStep(
  activeLine: number,
  heights: number[],
  waterUnits: number[],
  opts: {
    focusIndices?: number[];
    pointers?: { name: string; index: number; color?: 'accent' | 'secondary' }[];
    guides?: { leftMax?: number; rightMax?: number; waterLevel?: number };
  },
  state: Step['state'],
  captionSeed: string,
): Step {
  return {
    activeLine,
    diagram: {
      kind: 'elevation',
      heights,
      waterUnits,
      focusIndices: opts.focusIndices,
      pointers: opts.pointers,
      guides: opts.guides,
    },
    state,
    captionSeed,
  };
}

/** Shared height map for Trapping Rain Water walkthroughs */
export function rainHeights(): number[] {
  return [...RAIN_HEIGHTS];
}

export function emptyWater(n: number): number[] {
  return Array(n).fill(0);
}

export function containerStep(
  activeLine: number,
  heights: number[],
  left: number,
  right: number,
  state: Step['state'],
  captionSeed: string,
  maxArea?: number,
): Step {
  return {
    activeLine,
    diagram: { kind: 'container', heights, left, right, maxArea },
    state,
    captionSeed,
  };
}

export function stringStep(
  activeLine: number,
  chars: string,
  opts: {
    windowStart?: number;
    windowEnd?: number;
    pointers?: { name: string; index: number; color?: 'accent' | 'secondary' }[];
    duplicateIndex?: number;
  },
  state: Step['state'],
  captionSeed: string,
): Step {
  return {
    activeLine,
    diagram: {
      kind: 'string',
      chars,
      windowStart: opts.windowStart,
      windowEnd: opts.windowEnd,
      pointers: opts.pointers,
      duplicateIndex: opts.duplicateIndex,
    },
    state,
    captionSeed,
  };
}

export function intervalStep(
  activeLine: number,
  intervals: { start: number; end: number; label?: string; active?: boolean; merged?: boolean }[],
  state: Step['state'],
  captionSeed: string,
  result?: { start: number; end: number; label?: string }[],
  axisMin?: number,
  axisMax?: number,
): Step {
  return {
    activeLine,
    diagram: { kind: 'interval', intervals, result, axisMin, axisMax },
    state,
    captionSeed,
  };
}

export function windowDequeStep(
  activeLine: number,
  values: number[],
  windowStart: number,
  windowEnd: number,
  dequeIndices: number[],
  state: Step['state'],
  captionSeed: string,
  currentMax?: number,
): Step {
  return {
    activeLine,
    diagram: {
      kind: 'windowDeque',
      values,
      windowStart,
      windowEnd,
      dequeIndices,
      currentMax,
    },
    state,
    captionSeed,
  };
}

export function listStep(
  activeLine: number,
  rows: { label?: string; values: (number | string)[] }[],
  pointers: { name: string; row: number; index: number; color?: 'accent' | 'secondary' }[],
  state: Step['state'],
  captionSeed: string,
  opts?: {
    highlight?: { row: number; index: number }[];
    cycle?: { row: number; toIndex: number };
    randomLinks?: { row: number; from: number; to: number }[];
  },
): Step {
  return {
    activeLine,
    diagram: {
      kind: 'linkedList',
      rows,
      pointers,
      highlight: opts?.highlight,
      cycle: opts?.cycle,
      randomLinks: opts?.randomLinks,
    },
    state,
    captionSeed,
  };
}

export function binarySearchStep(
  activeLine: number,
  values: number[],
  lo: number,
  hi: number,
  state: Step['state'],
  captionSeed: string,
  opts?: { mid?: number; target?: number; found?: boolean; label?: string },
): Step {
  return {
    activeLine,
    diagram: {
      kind: 'binarySearch',
      values,
      lo,
      hi,
      mid: opts?.mid,
      target: opts?.target,
      found: opts?.found,
      label: opts?.label,
    },
    state,
    captionSeed,
  };
}

export function treeStep(
  activeLine: number,
  nodes: { id: string; value: number | string; left?: string | null; right?: string | null }[],
  rootId: string,
  state: Step['state'],
  captionSeed: string,
  opts?: {
    highlightIds?: string[];
    activeIds?: string[];
    badges?: Record<string, string>;
    label?: string;
    secondary?: {
      nodes: { id: string; value: number | string; left?: string | null; right?: string | null }[];
      rootId: string;
      label?: string;
    };
  },
): Step {
  return {
    activeLine,
    diagram: {
      kind: 'tree',
      nodes,
      rootId,
      highlightIds: opts?.highlightIds,
      activeIds: opts?.activeIds,
      badges: opts?.badges,
      label: opts?.label,
      secondary: opts?.secondary,
    },
    state,
    captionSeed,
  };
}

export function stackStep(
  activeLine: number,
  input: string,
  cursor: number,
  stack: string[],
  state: Step['state'],
  captionSeed: string,
  opts?: {
    matched?: boolean;
    invalid?: boolean;
    values?: (number | string)[];
    stackLabel?: string;
    secondaryStack?: string[];
    secondaryLabel?: string;
    highlightIndices?: number[];
    status?: string;
  },
): Step {
  return {
    activeLine,
    diagram: {
      kind: 'stack',
      input: opts?.values ? undefined : input,
      cursor,
      values: opts?.values,
      stack,
      stackLabel: opts?.stackLabel,
      secondaryStack: opts?.secondaryStack,
      secondaryLabel: opts?.secondaryLabel,
      highlightIndices: opts?.highlightIndices,
      matched: opts?.matched,
      invalid: opts?.invalid,
      status: opts?.status,
    },
    state,
    captionSeed,
  };
}

export function dpStep(
  activeLine: number,
  rowLabels: string[],
  colLabels: string[],
  values: (number | string | null)[][],
  state: Step['state'],
  captionSeed: string,
  opts?: {
    highlight?: { row: number; col: number }[];
    label?: string;
  },
): Step {
  return {
    activeLine,
    diagram: {
      kind: 'dpTable',
      rowLabels,
      colLabels,
      values,
      highlight: opts?.highlight,
      label: opts?.label,
    },
    state,
    captionSeed,
  };
}

export function gridStep(
  activeLine: number,
  rows: string[][],
  state: Step['state'],
  captionSeed: string,
  opts?: {
    highlight?: { row: number; col: number }[];
    visited?: { row: number; col: number }[];
    path?: { row: number; col: number }[];
    label?: string;
  },
): Step {
  return {
    activeLine,
    diagram: {
      kind: 'grid',
      rows,
      highlight: opts?.highlight,
      visited: opts?.visited,
      path: opts?.path,
      label: opts?.label,
    },
    state,
    captionSeed,
  };
}

export function graphStep(
  activeLine: number,
  nodes: { id: string; label: string; x: number; y: number }[],
  edges: { from: string; to: string }[],
  state: Step['state'],
  captionSeed: string,
  opts?: {
    visited?: string[];
    active?: string[];
    queue?: string[];
    label?: string;
  },
): Step {
  return {
    activeLine,
    diagram: {
      kind: 'graph',
      nodes,
      edges,
      visited: opts?.visited,
      active: opts?.active,
      queue: opts?.queue,
      label: opts?.label,
    },
    state,
    captionSeed,
  };
}

export function heapStep(
  activeLine: number,
  values: (number | string)[],
  state: Step['state'],
  captionSeed: string,
  opts?: { highlightIndices?: number[]; label?: string },
): Step {
  return {
    activeLine,
    diagram: {
      kind: 'heap',
      values,
      highlightIndices: opts?.highlightIndices,
      label: opts?.label,
    },
    state,
    captionSeed,
  };
}

export function diff(
  d: 'Easy' | 'Medium' | 'Hard',
): 'EASY' | 'MEDIUM' | 'HARD' {
  if (d === 'Easy') return 'EASY';
  if (d === 'Hard') return 'HARD';
  return 'MEDIUM';
}
