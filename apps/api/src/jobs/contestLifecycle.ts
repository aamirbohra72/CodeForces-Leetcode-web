import { prisma, ContestStatus, ContestKind } from '@codeforces/db';
import { determineStatus } from '../utils/contestRules';
import { finalizeContestLeaderboard } from '../services/leaderboardService';

const INTERVAL_MS = Number(process.env.CONTEST_LIFECYCLE_INTERVAL_MS || 30_000);

let timer: ReturnType<typeof setInterval> | null = null;
let running = false;

/**
 * Transitions contest status by wall clock and finalizes leaderboards when contests end.
 * Idempotent: only acts when stored status differs from effective status.
 */
export async function runContestLifecycleTick(now = new Date()): Promise<{
  flipped: number;
  finalized: number;
}> {
  if (running) return { flipped: 0, finalized: 0 };
  running = true;

  let flipped = 0;
  let finalized = 0;

  try {
    const contests = await prisma.contest.findMany({
      where: {
        kind: { not: ContestKind.PRACTICE },
        status: { not: ContestStatus.ENDED },
      },
      select: {
        id: true,
        name: true,
        startTime: true,
        endTime: true,
        status: true,
      },
    });

    for (const contest of contests) {
      const next = determineStatus(contest.startTime, contest.endTime, now);
      if (next === contest.status) continue;

      await prisma.contest.update({
        where: { id: contest.id },
        data: { status: next },
      });
      flipped += 1;
      console.log(
        `[contest-lifecycle] ${contest.name} (${contest.id}): ${contest.status} → ${next}`,
      );

      if (next === ContestStatus.ENDED && contest.status !== ContestStatus.ENDED) {
        try {
          await finalizeContestLeaderboard(contest.id);
          finalized += 1;
          console.log(`[contest-lifecycle] Finalized leaderboard for ${contest.id}`);
        } catch (err) {
          console.error(`[contest-lifecycle] Finalize failed for ${contest.id}:`, err);
        }
      }
    }

    // Also catch contests already past endTime but still marked LIVE/UPCOMING
    // (covered above). PRACTICE is skipped intentionally.
  } finally {
    running = false;
  }

  return { flipped, finalized };
}

export function startContestLifecycleJob(): void {
  if (timer) return;

  // Kick once shortly after boot, then on interval.
  setTimeout(() => {
    runContestLifecycleTick().catch((err) =>
      console.error('[contest-lifecycle] initial tick failed:', err),
    );
  }, 2_000);

  timer = setInterval(() => {
    runContestLifecycleTick().catch((err) =>
      console.error('[contest-lifecycle] tick failed:', err),
    );
  }, INTERVAL_MS);

  if (typeof timer.unref === 'function') timer.unref();
  console.log(`[contest-lifecycle] started (every ${INTERVAL_MS}ms)`);
}

export function stopContestLifecycleJob(): void {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
}
