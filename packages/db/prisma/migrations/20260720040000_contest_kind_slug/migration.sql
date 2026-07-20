-- CreateEnum
CREATE TYPE "ContestKind" AS ENUM ('PRACTICE', 'RATED', 'UNRATED');

-- AlterTable Contest
ALTER TABLE "Contest" ADD COLUMN IF NOT EXISTS "slug" TEXT;
ALTER TABLE "Contest" ADD COLUMN IF NOT EXISTS "kind" "ContestKind" NOT NULL DEFAULT 'UNRATED';

CREATE UNIQUE INDEX IF NOT EXISTS "Contest_slug_key" ON "Contest"("slug");
CREATE INDEX IF NOT EXISTS "Contest_kind_idx" ON "Contest"("kind");
