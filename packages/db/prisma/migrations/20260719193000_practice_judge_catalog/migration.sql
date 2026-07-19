-- CreateEnum
CREATE TYPE "JudgeMode" AS ENUM ('STDIN', 'JS_FUNCTION', 'REACT_COMPONENT');

-- AlterTable Challenge
ALTER TABLE "Challenge" ADD COLUMN IF NOT EXISTS "slug" TEXT;
ALTER TABLE "Challenge" ADD COLUMN IF NOT EXISTS "judgeMode" "JudgeMode" NOT NULL DEFAULT 'STDIN';
ALTER TABLE "Challenge" ADD COLUMN IF NOT EXISTS "allowedLanguages" TEXT[] DEFAULT ARRAY['javascript']::TEXT[];
ALTER TABLE "Challenge" ADD COLUMN IF NOT EXISTS "starterCode" TEXT;
ALTER TABLE "Challenge" ADD COLUMN IF NOT EXISTS "judgeReady" BOOLEAN NOT NULL DEFAULT true;

CREATE UNIQUE INDEX IF NOT EXISTS "Challenge_slug_key" ON "Challenge"("slug");
CREATE INDEX IF NOT EXISTS "Challenge_judgeMode_idx" ON "Challenge"("judgeMode");
CREATE INDEX IF NOT EXISTS "Challenge_judgeReady_idx" ON "Challenge"("judgeReady");

-- AlterTable ChallengeTestCase
ALTER TABLE "ChallengeTestCase" ADD COLUMN IF NOT EXISTS "name" TEXT NOT NULL DEFAULT 'case';
ALTER TABLE "ChallengeTestCase" ADD COLUMN IF NOT EXISTS "specJson" TEXT;

-- AlterTable Submission
ALTER TABLE "Submission" ADD COLUMN IF NOT EXISTS "resultJson" TEXT;
ALTER TABLE "Submission" ADD COLUMN IF NOT EXISTS "hintText" TEXT;
