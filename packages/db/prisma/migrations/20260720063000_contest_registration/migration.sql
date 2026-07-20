-- AlterTable Contest
ALTER TABLE "Contest" ADD COLUMN IF NOT EXISTS "isPublished" BOOLEAN NOT NULL DEFAULT true;
CREATE INDEX IF NOT EXISTS "Contest_isPublished_idx" ON "Contest"("isPublished");

-- CreateTable ContestRegistration
CREATE TABLE IF NOT EXISTS "ContestRegistration" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "contestId" TEXT NOT NULL,
    "registeredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ContestRegistration_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "ContestRegistration_userId_contestId_key"
  ON "ContestRegistration"("userId", "contestId");
CREATE INDEX IF NOT EXISTS "ContestRegistration_contestId_idx" ON "ContestRegistration"("contestId");
CREATE INDEX IF NOT EXISTS "ContestRegistration_userId_idx" ON "ContestRegistration"("userId");

DO $$ BEGIN
  ALTER TABLE "ContestRegistration"
    ADD CONSTRAINT "ContestRegistration_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE "ContestRegistration"
    ADD CONSTRAINT "ContestRegistration_contestId_fkey"
    FOREIGN KEY ("contestId") REFERENCES "Contest"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
