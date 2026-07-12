import { PrismaClient, UserRole, ContestStatus } from '@prisma/client';
import * as dotenv from 'dotenv';
import { resolve } from 'path';
import { interviewPracticeChallenges } from './interview-practice-challenges';

// Load environment variables - try root .env first, then apps/api/.env
dotenv.config({ path: resolve(process.cwd(), '.env') });
dotenv.config({ path: resolve(process.cwd(), 'apps/api/.env') });

const prisma = new PrismaClient();

async function main() {
  // Create admin user (no password needed with OTP auth)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@codeforces.com' },
    update: {},
    create: {
      email: 'admin@codeforces.com',
      username: 'admin',
      role: UserRole.ADMIN,
    },
  });

  // Create regular user
  const user = await prisma.user.upsert({
    where: { email: 'user@codeforces.com' },
    update: {},
    create: {
      email: 'user@codeforces.com',
      username: 'user',
      role: UserRole.USER,
    },
  });

  // Create demo contests
  const now = new Date();
  const upcomingContest = await prisma.contest.create({
    data: {
      name: 'Upcoming Contest 2024',
      description: 'A contest that will start soon',
      startTime: new Date(now.getTime() + 24 * 60 * 60 * 1000), // Tomorrow
      endTime: new Date(now.getTime() + 27 * 60 * 60 * 1000), // 3 hours later
      status: ContestStatus.UPCOMING,
    },
  });

  const liveContest = await prisma.contest.create({
    data: {
      name: 'Live Contest 2024',
      description: 'A contest that is currently running',
      startTime: new Date(now.getTime() - 60 * 60 * 1000), // 1 hour ago
      endTime: new Date(now.getTime() + 2 * 60 * 60 * 1000), // 1 hour from now
      status: ContestStatus.LIVE,
      challenges: {
        create: [
          {
            title: 'Two Sum',
            description: 'Given an array of integers, find two numbers that add up to a target.',
            difficulty: 'EASY',
            inputFormat: 'First line: n (number of elements)\nSecond line: n integers\nThird line: target',
            outputFormat: 'Two indices (0-indexed)',
            constraints: '2 <= n <= 10^5\n-10^9 <= nums[i] <= 10^9',
            sampleInput: '4\n2 7 11 15\n9',
            sampleOutput: '0 1',
          },
          {
            title: 'Longest Substring',
            description: 'Find the length of the longest substring without repeating characters.',
            difficulty: 'MEDIUM',
            inputFormat: 'A single string s',
            outputFormat: 'An integer representing the length',
            constraints: '0 <= s.length <= 5 * 10^4',
            sampleInput: 'abcabcbb',
            sampleOutput: '3',
          },
        ],
      },
    },
  });

  const interviewPracticeContest = await prisma.contest.create({
    data: {
      name: 'Interview Practice — JavaScript & React',
      description: 'Curated frontend interview prompts with company tags for /practice',
      startTime: new Date(now.getTime() - 3 * 60 * 60 * 1000),
      endTime: new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000),
      status: ContestStatus.LIVE,
      challenges: {
        create: [...interviewPracticeChallenges],
      },
    },
  });

  const endedContest = await prisma.contest.create({
    data: {
      name: 'Ended Contest 2024',
      description: 'A contest that has already ended',
      startTime: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
      endTime: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
      status: ContestStatus.ENDED,
      challenges: {
        create: [
          {
            title: 'Hello World',
            description: 'Print "Hello, World!"',
            difficulty: 'EASY',
            inputFormat: 'No input',
            outputFormat: 'Print "Hello, World!"',
            constraints: 'None',
            sampleInput: '',
            sampleOutput: 'Hello, World!',
          },
        ],
      },
    },
  });

  const seededChallenges = await prisma.challenge.findMany({
    where: {
      contestId: {
        in: [liveContest.id, interviewPracticeContest.id, endedContest.id],
      },
    },
    select: {
      id: true,
      title: true,
      sampleInput: true,
      sampleOutput: true,
    },
  });

  // Baseline: every seeded challenge gets a sample case in structured testcase table.
  await prisma.challengeTestCase.createMany({
    data: seededChallenges
      .filter((c) => c.sampleOutput.trim().length > 0)
      .map((c) => ({
        challengeId: c.id,
        input: c.sampleInput,
        expectedOutput: c.sampleOutput,
        isSample: true,
        isHidden: false,
        order: 1,
      })),
  });

  // Add hidden cases for a subset to simulate production-style judging.
  const titleToId = new Map(seededChallenges.map((c) => [c.title, c.id]));
  const hiddenCases: Array<{ title: string; input: string; expectedOutput: string; order: number }> = [
    { title: 'Anagram Checker', input: 'hello\nworld', expectedOutput: 'NO', order: 2 },
    { title: 'Anagram Checker', input: 'Dormitory\ndirtyroom', expectedOutput: 'YES', order: 3 },
    { title: 'Power of Four', input: '64', expectedOutput: 'true', order: 2 },
    { title: 'Power of Four', input: '12', expectedOutput: 'false', order: 3 },
    { title: 'Voting Eligibility', input: '18', expectedOutput: 'ELIGIBLE', order: 2 },
    { title: 'Voting Eligibility', input: '17', expectedOutput: 'NOT ELIGIBLE', order: 3 },
    { title: 'Hello World', input: '', expectedOutput: 'Hello, World!', order: 2 },
  ];

  await prisma.challengeTestCase.createMany({
    data: hiddenCases
      .map((tc) => {
        const challengeId = titleToId.get(tc.title);
        if (!challengeId) return null;
        return {
          challengeId,
          input: tc.input,
          expectedOutput: tc.expectedOutput,
          isSample: false,
          isHidden: true,
          order: tc.order,
        };
      })
      .filter((x): x is NonNullable<typeof x> => x !== null),
  });

  console.log('Seed data created:');
  console.log({ admin: admin.email, user: user.email });
  console.log({
    contests: [upcomingContest.name, liveContest.name, interviewPracticeContest.name, endedContest.name],
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
