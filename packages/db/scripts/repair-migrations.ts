/**
 * Repairs broken _prisma_migrations history when the DB was created via db push
 * and migrate dev fails on shadow DB (missing init migration) or has failed rows.
 *
 * Run: npx dotenv -e ../../.env -e ../../apps/api/.env -- tsx scripts/repair-migrations.ts
 */
import { prisma } from '../src/index';
import { readdirSync } from 'node:fs';
import path from 'node:path';
import { randomUUID } from 'node:crypto';

const MIGRATIONS_DIR = path.join(__dirname, '..', 'prisma', 'migrations');

async function main() {
  // Remove failed / rolled-back rows
  await prisma.$executeRaw`
    DELETE FROM "_prisma_migrations"
    WHERE finished_at IS NULL OR rolled_back_at IS NOT NULL`;

  const folders = readdirSync(MIGRATIONS_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort();

  const applied = await prisma.$queryRaw<Array<{ migration_name: string }>>`
    SELECT migration_name FROM "_prisma_migrations"`;

  const appliedSet = new Set(applied.map((r) => r.migration_name));

  for (const folder of folders) {
    if (appliedSet.has(folder)) {
      console.log(`skip (already applied): ${folder}`);
      continue;
    }

    const checksum = 'baseline';
    const id = randomUUID();
    await prisma.$executeRaw`
      INSERT INTO "_prisma_migrations" (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count)
      VALUES (
        ${id},
        ${checksum},
        NOW(),
        ${folder},
        NULL,
        NULL,
        NOW(),
        1
      )`;
    console.log(`marked applied: ${folder}`);
  }

  console.log('Migration history repaired.');
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
