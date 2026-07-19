import { assertCatalogValid, allCatalogChallenges, validateCatalog } from '../../packages/db/prisma/catalog';

function main() {
  const issues = validateCatalog(allCatalogChallenges);
  if (issues.length) {
    console.error('Catalog validation issues:');
    for (const issue of issues) console.error(` - ${issue.slug}: ${issue.message}`);
    process.exit(1);
  }
  assertCatalogValid(allCatalogChallenges);
  const byMode = allCatalogChallenges.reduce<Record<string, number>>((acc, c) => {
    acc[c.judgeMode] = (acc[c.judgeMode] || 0) + 1;
    return acc;
  }, {});
  console.log(`Catalog OK: ${allCatalogChallenges.length} challenges`, byMode);
}

main();
