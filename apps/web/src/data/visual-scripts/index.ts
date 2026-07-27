import type { VisualScript } from '@/types/visual-script';
import type { DsaPattern } from '@/data/dsa-pattern-catalog';
import type { LldPattern } from '@/data/lld-pattern-catalog';
import { encapsulationScript } from './encapsulation';
import { twoSumIiScript } from './two-sum-ii';
import { getDsaScriptForPattern } from './dsa/registry';
import { getLldScriptForPattern, ALL_LLD_SCRIPTS } from './lld/registry';

export function getScriptForPattern(
  pattern: DsaPattern | LldPattern | undefined,
): VisualScript | undefined {
  if (!pattern) return undefined;
  if (pattern.id.startsWith('lld') || pattern.categoryId === 'lld') {
    return getLldScriptForPattern(pattern.id);
  }
  return getDsaScriptForPattern(pattern.id);
}

export const visualScripts: VisualScript[] = [twoSumIiScript, ...ALL_LLD_SCRIPTS];

export { encapsulationScript, twoSumIiScript };
export { DSA_SCRIPT_REGISTRY, getDsaScriptForPattern, hasDsaScript, getDsaScriptCount } from './dsa/registry';
export { LLD_SCRIPT_REGISTRY, getLldScriptForPattern, hasLldScript, getLldScriptCount, ALL_LLD_SCRIPTS } from './lld/registry';
