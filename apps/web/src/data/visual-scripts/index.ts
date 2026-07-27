import type { VisualScript } from '@/types/visual-script';
import { encapsulationScript } from './encapsulation';
import { twoSumIiScript } from './two-sum-ii';

export const visualScripts: VisualScript[] = [twoSumIiScript, encapsulationScript];

export function getVisualScript(id: string): VisualScript | undefined {
  return visualScripts.find((s) => s.id === id);
}

export { encapsulationScript, twoSumIiScript };
