import { prisma } from '@codeforces/db';
import { getLeaderboard, clearLeaderboard } from './redisService';

export async function finalizeContestLeaderboard(contestId: string): Promise<void> {
  // Get leaderboard from Redis
  const redisLeaderboard = await getLeaderboard(contestId, 1000);

  // Clear Redis leaderboard
  await clearLeaderboard(contestId);

  // Calculate ranks (handle ties)
  const rankedLeaderboard = redisLeaderboard.map((entry, index) => {
    // If score is same as previous, use same rank
    const prevEntry = index > 0 ? rankedLeaderboard[index - 1] : null;
    const rank = prevEntry && prevEntry.score === entry.score ? prevEntry.rank : index + 1;

    return {
      ...entry,
      rank,
    };
  });

  // Store in database
  for (const entry of rankedLeaderboard) {
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
}


