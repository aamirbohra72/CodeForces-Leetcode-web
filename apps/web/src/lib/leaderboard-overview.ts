export type PracticeBucket = { solved: number; total: number };

export type LeaderboardOverviewResponse = {
  year: number;
  globalLeaderboard: {
    rank: number;
    userId: string;
    username: string;
    uniqueSolved: number;
    acceptedSubmissions: number;
    scoreSum: number;
  }[];
  me: null | {
    userId: string;
    username: string;
    rank: number | null;
    uniqueSolved: number;
    acceptedSubmissions: number;
    scoreSum: number;
    practiceByDifficulty: {
      total: PracticeBucket;
      easy: PracticeBucket;
      medium: PracticeBucket;
      hard: PracticeBucket;
    };
    contributions: {
      year: number;
      totalSubmissions: number;
      days: { date: string; count: number }[];
    };
    streak: { current: number; longest: number };
  };
  courseWatchTime: { course: string; hours: number }[];
};
