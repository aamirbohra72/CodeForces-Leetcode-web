import type { VisualScript } from '@/types/visual-script';
import { OOP_SCRIPTS } from './oop-foundations';
import { SOLID_SCRIPTS } from './solid';
import { DESIGN_SCRIPTS } from './design-principles';
import { CREATIONAL_SCRIPTS } from './creational';
import { STRUCTURAL_SCRIPTS } from './structural';
import { BEHAVIORAL_SCRIPTS } from './behavioral';
import { MACHINE_SCRIPTS } from './machine-coding';

export const LLD_SCRIPT_REGISTRY: Record<string, VisualScript> = {
  ...OOP_SCRIPTS,
  ...SOLID_SCRIPTS,
  ...DESIGN_SCRIPTS,
  ...CREATIONAL_SCRIPTS,
  ...STRUCTURAL_SCRIPTS,
  ...BEHAVIORAL_SCRIPTS,
  ...MACHINE_SCRIPTS,
};

export function hasLldScript(patternId: string): boolean {
  return patternId in LLD_SCRIPT_REGISTRY;
}

export function getLldScriptForPattern(patternId: string): VisualScript | undefined {
  return LLD_SCRIPT_REGISTRY[patternId];
}

export function getLldScriptCount(): number {
  return Object.keys(LLD_SCRIPT_REGISTRY).length;
}

export const ALL_LLD_SCRIPTS: VisualScript[] = Object.values(LLD_SCRIPT_REGISTRY);
