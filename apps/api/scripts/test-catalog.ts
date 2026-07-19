import assert from 'node:assert/strict';
import { allCatalogChallenges, validateCatalog, assertCatalogValid } from '../../../packages/db/prisma/catalog';

const issues = validateCatalog(allCatalogChallenges);
assert.equal(issues.length, 0, issues.map((i) => `${i.slug}: ${i.message}`).join('\n'));
assertCatalogValid(allCatalogChallenges);

const slugs = new Set(allCatalogChallenges.map((c) => c.slug));
assert.equal(slugs.size, allCatalogChallenges.length);
assert.ok(allCatalogChallenges.length >= 40, 'expected full catalog');

const jsFn = allCatalogChallenges.filter((c) => c.judgeMode === 'JS_FUNCTION');
const react = allCatalogChallenges.filter((c) => c.judgeMode === 'REACT_COMPONENT');
const stdin = allCatalogChallenges.filter((c) => c.judgeMode === 'STDIN');
assert.ok(jsFn.length >= 9);
assert.ok(react.length === 24);
assert.ok(stdin.length >= 11);

console.log('validateCatalog tests passed', {
  total: allCatalogChallenges.length,
  stdin: stdin.length,
  jsFunction: jsFn.length,
  react: react.length,
});
