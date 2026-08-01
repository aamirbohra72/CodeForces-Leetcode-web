-- Learning progress for catalog + generated courses, plus activity streak.

CREATE TABLE IF NOT EXISTS "CourseLearningProgress" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "courseId" TEXT NOT NULL,
  "courseKind" TEXT NOT NULL DEFAULT 'catalog',
  "title" TEXT,
  "completedCount" INTEGER NOT NULL DEFAULT 0,
  "totalCount" INTEGER NOT NULL DEFAULT 0,
  "percent" INTEGER NOT NULL DEFAULT 0,
  "completed" BOOLEAN NOT NULL DEFAULT false,
  "lastItemId" TEXT,
  "lastItemTitle" TEXT,
  "lastItemHref" TEXT,
  "lastActivityAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "CourseLearningProgress_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "CourseLearningProgress_userId_courseId_key"
  ON "CourseLearningProgress"("userId", "courseId");
CREATE INDEX IF NOT EXISTS "CourseLearningProgress_userId_lastActivityAt_idx"
  ON "CourseLearningProgress"("userId", "lastActivityAt");
CREATE INDEX IF NOT EXISTS "CourseLearningProgress_courseId_idx"
  ON "CourseLearningProgress"("courseId");

ALTER TABLE "CourseLearningProgress"
  DROP CONSTRAINT IF EXISTS "CourseLearningProgress_userId_fkey";
ALTER TABLE "CourseLearningProgress"
  ADD CONSTRAINT "CourseLearningProgress_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE IF NOT EXISTS "CourseLearningItem" (
  "id" TEXT NOT NULL,
  "progressId" TEXT NOT NULL,
  "itemId" TEXT NOT NULL,
  "itemType" TEXT NOT NULL,
  "title" TEXT,
  "completed" BOOLEAN NOT NULL DEFAULT false,
  "score" INTEGER,
  "completedAt" TIMESTAMP(3),
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "CourseLearningItem_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "CourseLearningItem_progressId_itemId_key"
  ON "CourseLearningItem"("progressId", "itemId");
CREATE INDEX IF NOT EXISTS "CourseLearningItem_progressId_idx"
  ON "CourseLearningItem"("progressId");

ALTER TABLE "CourseLearningItem"
  DROP CONSTRAINT IF EXISTS "CourseLearningItem_progressId_fkey";
ALTER TABLE "CourseLearningItem"
  ADD CONSTRAINT "CourseLearningItem_progressId_fkey"
  FOREIGN KEY ("progressId") REFERENCES "CourseLearningProgress"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE IF NOT EXISTS "LearningStreak" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "currentStreak" INTEGER NOT NULL DEFAULT 0,
  "longestStreak" INTEGER NOT NULL DEFAULT 0,
  "lastActiveDate" TEXT,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "LearningStreak_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "LearningStreak_userId_key" ON "LearningStreak"("userId");

ALTER TABLE "LearningStreak"
  DROP CONSTRAINT IF EXISTS "LearningStreak_userId_fkey";
ALTER TABLE "LearningStreak"
  ADD CONSTRAINT "LearningStreak_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
