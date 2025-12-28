import { PrismaClient, UserRole, ContestStatus } from '@prisma/client';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

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

  console.log('Seed data created:');
  console.log({ admin: admin.email, user: user.email });
  console.log({ contests: [upcomingContest.name, liveContest.name, endedContest.name] });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
