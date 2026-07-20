import { prisma } from '@codeforces/db';
import { getLeaderboard, clearLeaderboard } from './redisService';

export async function finalizeContestLeaderboard(contestId: string): Promise<void> {
  const redisLeaderboard = await getLeaderboard(contestId, 1000);

  // Rank with tie handling (same score → same rank)
  const ranked: Array<{ userId: string; score: number; rank: number }> = [];
  for (let i = 0; i < redisLeaderboard.length; i += 1) {
    const entry = redisLeaderboard[i];
    const prev = ranked[i - 1];
    const rank = prev && prev.score === entry.score ? prev.rank : i + 1;
    ranked.push({ userId: entry.userId, score: entry.score, rank });
  }

  for (const entry of ranked) {
    await prisma.leaderboardEntry.upsert({
      where: {
        userId_contestId: {
          userId: entry.userId,
          contestId,
        },
      },
      update: {
        score: entry.score,
        rank: entry.rank,
      },
      create: {
        userId: entry.userId,
        contestId,
        score: entry.score,
        rank: entry.rank,
      },
    });
  }

  await clearLeaderboard(contestId);
}
