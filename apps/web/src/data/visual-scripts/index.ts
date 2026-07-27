import type { VisualScript } from '@/types/visual-script';
import type { DsaPattern } from '@/data/dsa-pattern-catalog';
import { encapsulationScript } from './encapsulation';
import { twoSumIiScript } from './two-sum-ii';
import { getDsaScriptForPattern } from './dsa/registry';

const LLD_SCRIPTS: VisualScript[] = [encapsulationScript];

export function getScriptForPattern(pattern: DsaPattern): VisualScript | undefined {
  if (pattern.categoryId === 'lld' || pattern.id.startsWith('lld')) {
    return LLD_SCRIPTS.find((s) => s.id === pattern.visualScriptId) ?? encapsulationScript;
  }
  return getDsaScriptForPattern(pattern.id);
}

export const visualScripts: VisualScript[] = [twoSumIiScript, encapsulationScript];

export { encapsulationScript, twoSumIiScript };
export { DSA_SCRIPT_REGISTRY, getDsaScriptForPattern, hasDsaScript, getDsaScriptCount } from './dsa/registry';
