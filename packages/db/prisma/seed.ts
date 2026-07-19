import { PrismaClient, UserRole, ContestStatus, JudgeMode } from '@prisma/client';
import * as dotenv from 'dotenv';
import { resolve } from 'path';
import { getValidatedCatalog } from './catalog';

dotenv.config({ path: resolve(process.cwd(), '.env') });
dotenv.config({ path: resolve(process.cwd(), 'apps/api/.env') });
dotenv.config({ path: resolve(__dirname, '../../../.env') });
dotenv.config({ path: resolve(__dirname, '../../../apps/api/.env') });

const prisma = new PrismaClient();

async function upsertPracticeContest() {
  const existing = await prisma.contest.findFirst({
    where: { name: 'Interview Practice — JavaScript & React' },
  });
  if (existing) return existing;

  const now = new Date();
  return prisma.contest.create({
    data: {
      name: 'Interview Practice — JavaScript & React',
      description: 'Curated frontend interview prompts with company tags for /practice',
      startTime: new Date(now.getTime() - 3 * 60 * 60 * 1000),
      endTime: new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000),
      status: ContestStatus.LIVE,
    },
  });
}

async function seedCatalog(contestId: string) {
  const catalog = getValidatedCatalog();

  for (const challenge of catalog) {
    const data = {
      contestId,
      slug: challenge.slug,
      title: challenge.title,
      description: challenge.description,
      difficulty: challenge.difficulty,
      practiceLanguage: challenge.practiceLanguage,
      companies: challenge.companies,
      estimatedTime: challenge.estimatedTime,
      inputFormat: challenge.inputFormat,
      outputFormat: challenge.outputFormat,
      constraints: challenge.constraints,
      sampleInput: challenge.sampleInput,
      sampleOutput: challenge.sampleOutput,
      judgeMode: challenge.judgeMode as JudgeMode,
      allowedLanguages: challenge.allowedLanguages,
      starterCode: challenge.starterCode,
      judgeReady: challenge.judgeReady,
    };

    const saved = await prisma.challenge.upsert({
      where: { slug: challenge.slug },
      create: data,
      update: data,
    });

    await prisma.challengeTestCase.deleteMany({ where: { challengeId: saved.id } });
    await prisma.challengeTestCase.createMany({
      data: challenge.testCases.map((tc) => ({
        challengeId: saved.id,
        name: tc.name,
        input: tc.input,
        expectedOutput: tc.expectedOutput,
        specJson: tc.specJson ?? null,
        isSample: tc.isSample,
        isHidden: tc.isHidden,
        order: tc.order,
      })),
    });
  }

  console.log(`Upserted ${catalog.length} catalog challenges with test cases`);
}

async function main() {
  const admin = await prisma.user.upsert({
    where: { email: 'admin@codeforces.com' },
    update: {},
    create: {
      email: 'admin@codeforces.com',
      username: 'admin',
      role: UserRole.ADMIN,
    },
  });

  const user = await prisma.user.upsert({
    where: { email: 'user@codeforces.com' },
    update: {},
    create: {
      email: 'user@codeforces.com',
      username: 'user',
      role: UserRole.USER,
    },
  });

  const practiceContest = await upsertPracticeContest();
  await seedCatalog(practiceContest.id);

  // Remove legacy uncatalogued challenges so /practice only shows complete statements.
  const legacy = await prisma.challenge.findMany({
    where: { slug: null },
    select: { id: true },
  });
  if (legacy.length > 0) {
    const ids = legacy.map((c) => c.id);
    await prisma.challengeTestCase.deleteMany({ where: { challengeId: { in: ids } } });
    await prisma.submission.deleteMany({ where: { challengeId: { in: ids } } });
    await prisma.challenge.deleteMany({ where: { id: { in: ids } } });
    console.log(`Removed ${ids.length} legacy challenges without slug`);
  }

  console.log('Seed data ready:', { admin: admin.email, user: user.email, practiceContest: practiceContest.name });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
