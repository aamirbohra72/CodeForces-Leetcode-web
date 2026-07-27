import type { VisualScript } from '@/types/visual-script';
import { twoSumIiScript } from '../two-sum-ii';
import { ARRAY_SCRIPTS } from './arrays';
import { BACKTRACKING_SCRIPTS } from './backtracking';
import { BINARY_SEARCH_SCRIPTS } from './binary-search';
import { BINARY_TREE_SCRIPTS } from './binary-tree';
import { BST_SCRIPTS } from './bst';
import { containerWaterScript } from './container-with-most-water';
import { DP_SCRIPTS } from './dp';
import { FOUNDATION_SCRIPTS } from './foundation';
import { GRAPH_SCRIPTS } from './graphs';
import { GREEDY_SCRIPTS } from './greedy';
import { HEAP_SCRIPTS } from './heap';
import { LINKED_LIST_SCRIPTS } from './linked-list';
import { mergeIntervalsScript } from './merge-intervals';
import { slidingWindowMaxScript } from './sliding-window-max';
import { STACK_QUEUE_SCRIPTS } from './stack-queues';
import { STRING_SCRIPTS, validParenthesesScript } from './strings';
import { trappingRainWaterScript } from './trapping-rain-water';
import { TWO_POINTER_SCRIPTS } from './two-pointers';

/** pattern id (e.g. tp-1) → problem-specific VisualScript */
export const DSA_SCRIPT_REGISTRY: Record<string, VisualScript> = {
  'tp-1': twoSumIiScript,
  ...FOUNDATION_SCRIPTS,
  ...TWO_POINTER_SCRIPTS,
  ...ARRAY_SCRIPTS,
  ...LINKED_LIST_SCRIPTS,
  ...BINARY_SEARCH_SCRIPTS,
  ...BINARY_TREE_SCRIPTS,
  ...BST_SCRIPTS,
  ...HEAP_SCRIPTS,
  ...BACKTRACKING_SCRIPTS,
  ...GREEDY_SCRIPTS,
  ...STRING_SCRIPTS,
  ...STACK_QUEUE_SCRIPTS,
  ...DP_SCRIPTS,
  ...GRAPH_SCRIPTS,
  'tp-3': containerWaterScript,
  'tp-4': trappingRainWaterScript,
  'tp-8': slidingWindowMaxScript,
  'a-6': mergeIntervalsScript,
  'a-9': trappingRainWaterScript,
  's-5': TWO_POINTER_SCRIPTS['tp-5'],
  // keep explicit aliases (also covered by STACK_QUEUE_SCRIPTS)
  'sq-2': validParenthesesScript,
  'sq-6': slidingWindowMaxScript,
};

export function hasDsaScript(patternId: string): boolean {
  return patternId in DSA_SCRIPT_REGISTRY;
}

export function getDsaScriptForPattern(patternId: string): VisualScript | undefined {
  return DSA_SCRIPT_REGISTRY[patternId];
}

export function getDsaScriptCount(): number {
  return Object.keys(DSA_SCRIPT_REGISTRY).length;
}
