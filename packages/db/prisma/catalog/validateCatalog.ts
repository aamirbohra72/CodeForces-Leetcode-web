import type { CatalogChallenge } from './types';

const PLACEHOLDER = /^(n\/a|na|todo|tbd|coming soon)?$/i;

export type CatalogValidationIssue = {
  slug: string;
  message: string;
};

export function validateCatalog(challenges: CatalogChallenge[]): CatalogValidationIssue[] {
  const issues: CatalogValidationIssue[] = [];
  const seenSlugs = new Set<string>();

  for (const challenge of challenges) {
    const slug = challenge.slug || '(missing-slug)';
    if (!challenge.slug?.trim()) {
      issues.push({ slug, message: 'slug is required' });
    } else if (seenSlugs.has(challenge.slug)) {
      issues.push({ slug, message: 'duplicate slug' });
    } else {
      seenSlugs.add(challenge.slug);
    }

    if (!challenge.title?.trim()) issues.push({ slug, message: 'title is required' });
    if (!challenge.description || challenge.description.trim().length < 40) {
      issues.push({ slug, message: 'description must be a complete statement' });
    }
    for (const field of ['inputFormat', 'outputFormat', 'constraints'] as const) {
      const value = challenge[field]?.trim() ?? '';
      if (!value || PLACEHOLDER.test(value)) {
        issues.push({ slug, message: `${field} must not be empty or placeholder` });
      }
    }

    if (!challenge.allowedLanguages?.length) {
      issues.push({ slug, message: 'allowedLanguages must be non-empty' });
    }
    if (!challenge.starterCode?.trim()) {
      issues.push({ slug, message: 'starterCode is required' });
    }

    if (!challenge.judgeReady) {
      continue;
    }

    if (!challenge.testCases?.length) {
      issues.push({ slug, message: 'judgeReady challenges need test cases' });
      continue;
    }

    const sampleCases = challenge.testCases.filter((t) => t.isSample);
    const hiddenCases = challenge.testCases.filter((t) => t.isHidden);
    if (sampleCases.length < 1) {
      issues.push({ slug, message: 'at least one sample test case required' });
    }
    if (hiddenCases.length < 2 && challenge.judgeMode !== 'REACT_COMPONENT') {
      issues.push({ slug, message: 'at least two hidden test cases required' });
    }
    if (challenge.testCases.length < 4) {
      issues.push({ slug, message: 'at least four test cases required when judgeReady' });
    }

    const orders = new Set<number>();
    for (const tc of challenge.testCases) {
      if (orders.has(tc.order)) {
        issues.push({ slug, message: `duplicate test case order ${tc.order}` });
      }
      orders.add(tc.order);
      if (!tc.name?.trim()) issues.push({ slug, message: `test case order ${tc.order} missing name` });
      if (tc.expectedOutput == null) {
        issues.push({ slug, message: `test case ${tc.name} missing expectedOutput` });
      }
      if (challenge.judgeMode === 'STDIN' && tc.isSample && !challenge.sampleOutput?.length) {
        issues.push({ slug, message: 'STDIN sample challenges need sampleOutput' });
      }
    }

    if (challenge.judgeMode === 'STDIN') {
      if (!challenge.sampleOutput?.trim() && PLACEHOLDER.test(challenge.sampleOutput ?? '')) {
        issues.push({ slug, message: 'STDIN challenges need sampleOutput' });
      }
    }
  }

  return issues;
}

export function assertCatalogValid(challenges: CatalogChallenge[]): void {
  const issues = validateCatalog(challenges);
  if (issues.length > 0) {
    const detail = issues.map((i) => `${i.slug}: ${i.message}`).join('\n');
    throw new Error(`Catalog validation failed:\n${detail}`);
  }
}
