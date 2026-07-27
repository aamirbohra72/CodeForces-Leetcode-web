import { DSA_TOPICS, type DsaDifficulty } from '@/data/dsa-sheet';
import { hasDsaScript } from '@/data/visual-scripts/dsa/registry';

export type DsaPattern = {
  id: string;
  title: string;
  categoryId: string;
  categoryTitle: string;
  categoryOrder: number;
  difficulty: DsaDifficulty;
  /** Set when a hand-crafted problem-specific script exists */
  visualScriptId?: string;
};

export type DsaPatternCategory = {
  id: string;
  order: number;
  title: string;
  patterns: DsaPattern[];
};

function buildCatalog(): DsaPatternCategory[] {
  return DSA_TOPICS.map((topic) => ({
    id: topic.id,
    order: topic.order,
    title: topic.title,
    patterns: topic.problems.map((problem) => ({
      id: problem.id,
      title: problem.title,
      categoryId: topic.id,
      categoryTitle: topic.title,
      categoryOrder: topic.order,
      difficulty: problem.difficulty,
      visualScriptId: hasDsaScript(problem.id) ? `dsa-${problem.id}` : undefined,
    })),
  }));
}

export const DSA_PATTERN_CATEGORIES = buildCatalog();

export const DSA_PATTERNS: DsaPattern[] = DSA_PATTERN_CATEGORIES.flatMap((c) => c.patterns);

const SCRIPT_TO_PATTERN = Object.fromEntries(
  DSA_PATTERNS.filter((p) => p.visualScriptId).map((p) => [p.visualScriptId!, p.id]),
) as Record<string, string>;

export function patternIdForScript(scriptId: string): string | undefined {
  return SCRIPT_TO_PATTERN[scriptId];
}

export function scriptIdForPattern(patternId: string): string | undefined {
  return getDsaPattern(patternId)?.visualScriptId;
}

export function getDsaPattern(id: string): DsaPattern | undefined {
  return DSA_PATTERNS.find((p) => p.id === id);
}

export function getDefaultDsaPatternId(): string {
  return 'tp-1';
}

export function getDsaPatternStats() {
  const total = DSA_PATTERNS.length;
  const animated = DSA_PATTERNS.filter((p) => p.visualScriptId).length;
  const categories = DSA_PATTERN_CATEGORIES.length;
  return { total, animated, categories };
}

export function searchDsaPatterns(query: string): DsaPattern[] {
  const q = query.trim().toLowerCase();
  if (!q) return DSA_PATTERNS;
  return DSA_PATTERNS.filter(
    (p) =>
      p.title.toLowerCase().includes(q) ||
      p.categoryTitle.toLowerCase().includes(q) ||
      p.difficulty.toLowerCase().includes(q),
  );
}

export function categoriesWithPatterns(
  patternIds: Set<string> | null,
): DsaPatternCategory[] {
  if (!patternIds) return DSA_PATTERN_CATEGORIES;
  return DSA_PATTERN_CATEGORIES.map((cat) => ({
    ...cat,
    patterns: cat.patterns.filter((p) => patternIds.has(p.id)),
  })).filter((cat) => cat.patterns.length > 0);
}
