-- TA Help queue (DB-backed requests + replies)

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_enum e
    JOIN pg_type t ON e.enumtypid = t.oid
    WHERE t.typname = 'UserRole' AND e.enumlabel = 'TA'
  ) THEN
    ALTER TYPE "UserRole" ADD VALUE 'TA';
  END IF;
END $$;

DO $$ BEGIN
  CREATE TYPE "TaHelpStatus" AS ENUM ('WAITING', 'CLAIMED', 'REPLIED', 'RESOLVED', 'OPEN_POOL');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE "TaHelpType" AS ENUM ('TEXT', 'VIDEO');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS "TaHelpRequest" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "type" "TaHelpType" NOT NULL,
  "status" "TaHelpStatus" NOT NULL DEFAULT 'WAITING',
  "problem" TEXT NOT NULL,
  "topic" TEXT NOT NULL,
  "language" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "preferredSlot" TEXT,
  "source" TEXT NOT NULL DEFAULT 'web',
  "assignedToId" TEXT,
  "assignedToName" TEXT,
  "rating" INTEGER,
  "satisfied" BOOLEAN,
  "claimedAt" TIMESTAMP(3),
  "resolvedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "TaHelpRequest_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "TaHelpRequest_userId_status_idx" ON "TaHelpRequest"("userId", "status");
CREATE INDEX IF NOT EXISTS "TaHelpRequest_status_createdAt_idx" ON "TaHelpRequest"("status", "createdAt");
CREATE INDEX IF NOT EXISTS "TaHelpRequest_assignedToId_idx" ON "TaHelpRequest"("assignedToId");
CREATE INDEX IF NOT EXISTS "TaHelpRequest_type_status_idx" ON "TaHelpRequest"("type", "status");

DO $$ BEGIN
  ALTER TABLE "TaHelpRequest"
    ADD CONSTRAINT "TaHelpRequest_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE "TaHelpRequest"
    ADD CONSTRAINT "TaHelpRequest_assignedToId_fkey"
    FOREIGN KEY ("assignedToId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS "TaHelpReply" (
  "id" TEXT NOT NULL,
  "requestId" TEXT NOT NULL,
  "authorId" TEXT NOT NULL,
  "authorRole" TEXT NOT NULL,
  "body" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "TaHelpReply_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "TaHelpReply_requestId_createdAt_idx" ON "TaHelpReply"("requestId", "createdAt");
CREATE INDEX IF NOT EXISTS "TaHelpReply_authorId_idx" ON "TaHelpReply"("authorId");

DO $$ BEGIN
  ALTER TABLE "TaHelpReply"
    ADD CONSTRAINT "TaHelpReply_requestId_fkey"
    FOREIGN KEY ("requestId") REFERENCES "TaHelpRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE "TaHelpReply"
    ADD CONSTRAINT "TaHelpReply_authorId_fkey"
    FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;
