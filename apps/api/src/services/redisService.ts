import { createClient } from 'redis';

const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
});

redisClient.on('error', (err) => console.error('Redis Client Error', err));

let isConnected = false;

export async function connectRedis(): Promise<void> {
  if (isConnected) return;
  try {
    await redisClient.connect();
    isConnected = true;
    console.log('✅ Redis connected');
  } catch (error) {
    console.error('Failed to connect to Redis:', error);
    // In development, continue without Redis
    if (process.env.NODE_ENV === 'development') {
      console.warn('⚠️  Continuing without Redis (leaderboard features will be limited)');
    }
  }
}

export async function disconnectRedis(): Promise<void> {
  if (!isConnected) return;
  try {
    await redisClient.quit();
    isConnected = false;
  } catch (error) {
    console.error('Error disconnecting Redis:', error);
  }
}

export async function addToLeaderboard(
  contestId: string,
  userId: string,
  score: number
): Promise<void> {
  if (!isConnected) return;
  try {
    const key = `leaderboard:${contestId}`;
    await redisClient.zAdd(key, {
      score,
      value: userId,
    });
  } catch (error) {
    console.error('Redis error:', error);
  }
}

export async function getLeaderboard(
  contestId: string,
  limit: number = 100
): Promise<Array<{ userId: string; score: number; rank: number }>> {
  if (!isConnected) return [];
  try {
    const key = `leaderboard:${contestId}`;
    const results = await redisClient.zRangeWithScores(key, 0, limit - 1, {
      REV: true, // Descending order (highest score first)
    });

    return results.map((result, index) => ({
      userId: result.value,
      score: result.score,
      rank: index + 1,
    }));
  } catch (error) {
    console.error('Redis error:', error);
    return [];
  }
}

export async function getUserRank(contestId: string, userId: string): Promise<number | null> {
  if (!isConnected) return null;
  try {
    const key = `leaderboard:${contestId}`;
    const rank = await redisClient.zRevRank(key, userId);
    return rank !== null ? rank + 1 : null;
  } catch (error) {
    console.error('Redis error:', error);
    return null;
  }
}

export async function clearLeaderboard(contestId: string): Promise<void> {
  if (!isConnected) return;
  try {
    const key = `leaderboard:${contestId}`;
    await redisClient.del(key);
  } catch (error) {
    console.error('Redis error:', error);
  }
}

export { redisClient };


