import { prisma } from '../src/index';

async function main() {
  const tables = await prisma.$queryRaw<Array<{ tablename: string }>>`
    SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename`;
  console.log('Tables:', tables.map((t) => t.tablename).join(', '));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
