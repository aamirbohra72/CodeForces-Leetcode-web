import { Response } from 'express';
import { prisma } from '@codeforces/db';
import { AuthRequest } from '../middleware/auth';
import { getLeaderboard, getUserRank } from '../services/redisService';

export const leaderboardController = {
  async getContestLeaderboard(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { contestId } = req.params;

      // Verify contest exists
      const contest = await prisma.contest.findUnique({
        where: { id: contestId },
      });

      if (!contest) {
        res.status(404).json({ error: 'Contest not found' });
        return;
      }

      // If contest is LIVE, get from Redis
      if (contest.status === 'LIVE') {
        const redisLeaderboard = await getLeaderboard(contestId, 100);

        // Fetch user details for each entry
        const leaderboard = await Promise.all(
          redisLeaderboard.map(async (entry) => {
            const user = await prisma.user.findUnique({
              where: { id: entry.userId },
              select: {
                id: true,
                username: true,
                email: true,
              },
            });

            return {
              rank: entry.rank,
              userId: entry.userId,
              username: user?.username || 'Unknown',
              email: user?.email || '',
              score: entry.score,
            };
          })
        );

        res.json({
          contestId,
          status: 'LIVE',
          leaderboard,
        });
        return;
      }

      // If contest is ENDED, get from database
      if (contest.status === 'ENDED') {
        const leaderboardEntries = await prisma.leaderboardEntry.findMany({
          where: { contestId },
          orderBy: [{ rank: 'asc' }, { score: 'desc' }],
          include: {
            user: {
              select: {
                id: true,
                username: true,
                email: true,
              },
            },
          },
          take: 100,
        });

        const leaderboard = leaderboardEntries.map((entry) => ({
          rank: entry.rank || 0,
          userId: entry.userId,
          username: entry.user.username,
          email: entry.user.email,
          score: entry.score,
        }));

        res.json({
          contestId,
          status: 'ENDED',
          leaderboard,
        });
        return;
      }

      // Contest is UPCOMING
      res.json({
        contestId,
        status: 'UPCOMING',
        leaderboard: [],
      });
    } catch (error) {
      throw error;
    }
  },

  async getUserRank(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { contestId, userId } = req.params;

      // Verify contest exists
      const contest = await prisma.contest.findUnique({
        where: { id: contestId },
      });

      if (!contest) {
        res.status(404).json({ error: 'Contest not found' });
        return;
      }

      // If contest is LIVE, get from Redis
      if (contest.status === 'LIVE') {
        const rank = await getUserRank(contestId, userId);
        const leaderboard = await getLeaderboard(contestId, 1000);
        const userEntry = leaderboard.find((entry) => entry.userId === userId);

        res.json({
          rank: rank || null,
          score: userEntry?.score || 0,
        });
        return;
      }

      // If contest is ENDED, get from database
      if (contest.status === 'ENDED') {
        const entry = await prisma.leaderboardEntry.findUnique({
          where: {
            userId_contestId: {
              userId,
              contestId,
            },
          },
        });

        res.json({
          rank: entry?.rank || null,
          score: entry?.score || 0,
        });
        return;
      }

      res.json({
        rank: null,
        score: 0,
      });
    } catch (error) {
      throw error;
    }
  },
};


