import { Router } from 'express';
import { leaderboardController } from '../controllers/leaderboardController';
import { authenticate } from '../middleware/auth';

export const leaderboardRoutes = Router();

leaderboardRoutes.use(authenticate);

leaderboardRoutes.get('/contest/:contestId', leaderboardController.getContestLeaderboard);
leaderboardRoutes.get('/contest/:contestId/user/:userId', leaderboardController.getUserRank);


