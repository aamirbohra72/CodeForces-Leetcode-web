import { prisma } from '@codeforces/db';

export type GlobalLeaderboardRow = {
  rank: number;
  userId: string;
  username: string;
  uniqueSolved: number;
  acceptedSubmissions: number;
  scoreSum: number;
};

export type PracticeDifficultyBucket = {
  solved: number;
  total: number;
};

export type PracticeByDifficulty = {
  total: PracticeDifficultyBucket;
  easy: PracticeDifficultyBucket;
  medium: PracticeDifficultyBucket;
  hard: PracticeDifficultyBucket;
};

function normalizeDifficulty(d: string): 'easy' | 'medium' | 'hard' {
  const x = d.toLowerCase();
  if (x.includes('easy')) return 'easy';
  if (x.includes('hard')) return 'hard';
  return 'medium';
}

async function buildChallengeTotals(): Promise<{
  byBucket: { easy: number; medium: number; hard: number; total: number };
  challengeDifficulty: Map<string, 'easy' | 'medium' | 'hard'>;
}> {
  const byBucket = { easy: 0, medium: 0, hard: 0, total: 0 };
  const challengeDifficulty = new Map<string, 'easy' | 'medium' | 'hard'>();
  const rows = await prisma.challenge.findMany({ select: { id: true, difficulty: true } });
  for (const c of rows) {
    const b = normalizeDifficulty(c.difficulty);
    challengeDifficulty.set(c.id, b);
    byBucket[b]++;
    byBucket.total++;
  }
  return { byBucket, challengeDifficulty };
}

function solvedByDifficulty(
  acceptedChallengeIds: Set<string>,
  challengeDifficulty: Map<string, 'easy' | 'medium' | 'hard'>,
): PracticeByDifficulty {
  const solved = { easy: 0, medium: 0, hard: 0, total: 0 };
  for (const cid of acceptedChallengeIds) {
    const b = challengeDifficulty.get(cid);
    if (!b) continue;
    solved[b]++;
    solved.total++;
  }

  return {
    total: { solved: solved.total, total: 0 },
    easy: { solved: solved.easy, total: 0 },
    medium: { solved: solved.medium, total: 0 },
    hard: { solved: solved.hard, total: 0 },
  };
}

function mergeTotals(
  practice: PracticeByDifficulty,
  totals: { easy: number; medium: number; hard: number; total: number },
): PracticeByDifficulty {
  return {
    total: { solved: practice.total.solved, total: totals.total },
    easy: { solved: practice.easy.solved, total: totals.easy },
    medium: { solved: practice.medium.solved, total: totals.medium },
    hard: { solved: practice.hard.solved, total: totals.hard },
  };
}

function localDateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function buildYearContributionDays(year: number, byDay: Record<string, number>): { date: string; count: number }[] {
  const out: { date: string; count: number }[] = [];
  const start = new Date(year, 0, 1);
  const end = new Date(year, 11, 31);
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const key = localDateKey(d);
    out.push({ date: key, count: byDay[key] ?? 0 });
  }
  return out;
}

function longestStreakFromSortedDayKeys(sorted: string[]): number {
  if (sorted.length === 0) return 0;
  let best = 1;
  let cur = 1;
  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(sorted[i - 1] + 'T12:00:00');
    const next = new Date(sorted[i] + 'T12:00:00');
    const diffDays = Math.round((next.getTime() - prev.getTime()) / 86400000);
    if (diffDays === 1) {
      cur++;
      best = Math.max(best, cur);
    } else {
      cur = 1;
    }
  }
  return best;
}

function currentStreakFromToday(activityDays: Set<string>): number {
  let streak = 0;
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  for (let i = 0; i < 730; i++) {
    const key = localDateKey(d);
    if (activityDays.has(key)) {
      streak++;
      d.setDate(d.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
}

export async function getUserAggregateStats(userId: string): Promise<{
  uniqueSolved: number;
  acceptedSubmissions: number;
  scoreSum: number;
}> {
  const accepted = await prisma.submission.findMany({
    where: { userId, status: 'ACCEPTED' },
    select: { challengeId: true, score: true },
  });
  const challenges = new Set<string>();
  let scoreSum = 0;
  for (const r of accepted) {
    challenges.add(r.challengeId);
    scoreSum += r.score;
  }
  return {
    uniqueSolved: challenges.size,
    acceptedSubmissions: accepted.length,
    scoreSum,
  };
}

export async function getGlobalLeaderboard(limit = 100): Promise<GlobalLeaderboardRow[]> {
  const accepted = await prisma.submission.findMany({
    where: { status: 'ACCEPTED' },
    select: { userId: true, challengeId: true, score: true },
  });

  const userMap = new Map<
    string,
    { challenges: Set<string>; scoreSum: number; acceptedCount: number }
  >();

  for (const row of accepted) {
    let u = userMap.get(row.userId);
    if (!u) {
      u = { challenges: new Set(), scoreSum: 0, acceptedCount: 0 };
      userMap.set(row.userId, u);
    }
    u.challenges.add(row.challengeId);
    u.scoreSum += row.score;
    u.acceptedCount++;
  }

  const ranked = [...userMap.entries()]
    .map(([userId, v]) => ({
      userId,
      uniqueSolved: v.challenges.size,
      acceptedSubmissions: v.acceptedCount,
      scoreSum: v.scoreSum,
    }))
    .sort((a, b) => b.uniqueSolved - a.uniqueSolved || b.scoreSum - a.scoreSum)
    .slice(0, limit);

  if (ranked.length === 0) return [];

  const users = await prisma.user.findMany({
    where: { id: { in: ranked.map((r) => r.userId) } },
    select: { id: true, username: true },
  });
  const usernameById = new Map(users.map((u) => [u.id, u.username]));

  return ranked.map((r, i) => ({
    rank: i + 1,
    userId: r.userId,
    username: usernameById.get(r.userId) ?? 'Unknown',
    uniqueSolved: r.uniqueSolved,
    acceptedSubmissions: r.acceptedSubmissions,
    scoreSum: r.scoreSum,
  }));
}

export async function getUserOverview(
  userId: string,
  year: number,
): Promise<{
  practiceByDifficulty: PracticeByDifficulty;
  contributions: { year: number; totalSubmissions: number; days: { date: string; count: number }[] };
  streak: { current: number; longest: number };
}> {
  const { byBucket, challengeDifficulty } = await buildChallengeTotals();

  const acceptedRows = await prisma.submission.findMany({
    where: { userId, status: 'ACCEPTED' },
    select: { challengeId: true },
  });
  const uniqueChallenges = new Set(acceptedRows.map((r) => r.challengeId));
  const practice = mergeTotals(solvedByDifficulty(uniqueChallenges, challengeDifficulty), byBucket);

  const start = new Date(year, 0, 1);
  const end = new Date(year, 11, 31, 23, 59, 59, 999);
  const yearSubs = await prisma.submission.findMany({
    where: { userId, submittedAt: { gte: start, lte: end } },
    select: { submittedAt: true },
  });

  const byDay: Record<string, number> = {};
  const activityDays = new Set<string>();
  for (const s of yearSubs) {
    const key = localDateKey(new Date(s.submittedAt));
    byDay[key] = (byDay[key] ?? 0) + 1;
  }

  const allTimeSubs = await prisma.submission.findMany({
    where: { userId },
    select: { submittedAt: true },
  });
  for (const s of allTimeSubs) {
    activityDays.add(localDateKey(new Date(s.submittedAt)));
  }

  const sortedKeys = [...activityDays].sort();
  const days = buildYearContributionDays(year, byDay);
  const totalSubmissions = yearSubs.length;

  return {
    practiceByDifficulty: practice,
    contributions: { year, totalSubmissions, days },
    streak: {
      current: currentStreakFromToday(activityDays),
      longest: longestStreakFromSortedDayKeys(sortedKeys),
    },
  };
}
