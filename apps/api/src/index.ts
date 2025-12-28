import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { errorHandler } from './middleware/errorHandler';
import { authRoutes } from './routes/auth';
import { contestRoutes } from './routes/contests';
import { challengeRoutes } from './routes/challenges';
import { submissionRoutes } from './routes/submissions';
import { leaderboardRoutes } from './routes/leaderboard';
import { executionRoutes } from './routes/execution';
import { connectRedis, disconnectRedis } from './services/redisService';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/contests', contestRoutes);
app.use('/api/challenges', challengeRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/execute', executionRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// Connect to Redis
connectRedis().catch(console.error);

// Graceful shutdown
process.on('SIGTERM', async () => {
  await disconnectRedis();
  process.exit(0);
});

app.listen(PORT, () => {
  console.log(`🚀 API server running on http://localhost:${PORT}`);
});

