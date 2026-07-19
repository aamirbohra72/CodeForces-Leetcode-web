import { jsProblems } from './jsProblems';
import { reactProblems } from './reactProblems';
import type { CatalogChallenge } from './types';
import { assertCatalogValid } from './validateCatalog';

export * from './types';
export * from './validateCatalog';
export { jsProblems } from './jsProblems';
export { reactProblems } from './reactProblems';

export const allCatalogChallenges: CatalogChallenge[] = [...jsProblems, ...reactProblems];

export function getValidatedCatalog(): CatalogChallenge[] {
  assertCatalogValid(allCatalogChallenges);
  return allCatalogChallenges;
}
