import { prisma } from '../src';

/**
 * Remove legacy practice challenges that were never migrated to the catalog (no slug).
 * Keeps contest rows and any challenges that already have a catalog slug.
 */
async function main() {
  const legacy = await prisma.challenge.findMany({
    where: { slug: null },
    select: { id: true, title: true, contest: { select: { name: true } } },
  });
  console.log(`Found ${legacy.length} legacy challenges without slug`);

  // Prefer deleting only those under the interview practice contest name, plus old duplicates
  // that share titles with catalog entries.
  const catalogTitles = new Set(
    (
      await prisma.challenge.findMany({
        where: { slug: { not: null } },
        select: { title: true },
      })
    ).map((c) => c.title),
  );

  const toDelete = legacy.filter(
    (c) =>
      c.contest.name.includes('Interview Practice') ||
      catalogTitles.has(c.title) ||
      ['Two Sum', 'Longest Substring', 'Hello World'].includes(c.title),
  );

  const ids = toDelete.map((c) => c.id);
  if (ids.length === 0) {
    console.log('Nothing to delete');
    await prisma.$disconnect();
    return;
  }

  const deletedCases = await prisma.challengeTestCase.deleteMany({ where: { challengeId: { in: ids } } });
  const deletedSubs = await prisma.submission.deleteMany({ where: { challengeId: { in: ids } } });
  const deletedChallenges = await prisma.challenge.deleteMany({ where: { id: { in: ids } } });
  console.log({
    deletedChallenges: deletedChallenges.count,
    deletedCases: deletedCases.count,
    deletedSubs: deletedSubs.count,
  });

  const remaining = await prisma.challenge.count();
  const withSlug = await prisma.challenge.count({ where: { slug: { not: null } } });
  console.log({ remaining, withSlug });
  await prisma.$disconnect();
}

main().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
