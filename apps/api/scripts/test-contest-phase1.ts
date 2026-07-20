/** Smoke test Phase 1 registration + lifecycle (run after API is up). */
import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(__dirname, '../.env') });

import { prisma } from '@codeforces/db';
import { generateToken } from '@codeforces/auth';
import { runContestLifecycleTick } from '../src/jobs/contestLifecycle';

const API = process.env.API_URL || 'http://localhost:3001/api';

async function main() {
  const user = await prisma.user.findUnique({ where: { email: 'user@codeforces.com' } });
  if (!user) throw new Error('seed user missing');

  const live = await prisma.contest.findUnique({ where: { slug: 'weekly-sprint-live' } });
  if (!live) throw new Error('live contest missing');

  const token = generateToken({ userId: user.id, email: user.email, role: user.role });

  // Clean prior registration for idempotent test
  await prisma.contestRegistration.deleteMany({
    where: { userId: user.id, contestId: live.id },
  });

  const listRes = await fetch(`${API}/contests?pageSize=5`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const list = (await listRes.json()) as { data: Array<{ slug: string; participantCount: number }> };
  console.log('list ok', list.data.map((c) => `${c.slug}:${c.participantCount}`));

  const regRes = await fetch(`${API}/contests/${live.id}/register`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
  });
  console.log('register', regRes.status, await regRes.json());

  const meRes = await fetch(`${API}/contests/${live.id}/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  console.log('me', await meRes.json());

  const tick = await runContestLifecycleTick();
  console.log('lifecycle tick', tick);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
