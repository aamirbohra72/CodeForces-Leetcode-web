-- CreateEnum
CREATE TYPE "InterviewSessionStatus" AS ENUM ('IN_PROGRESS', 'COMPLETED', 'ABANDONED');

-- CreateEnum
CREATE TYPE "InterviewVerdict" AS ENUM ('SELECT', 'REJECT', 'BORDERLINE');

-- CreateTable
CREATE TABLE "InterviewSession" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "template" TEXT NOT NULL,
    "status" "InterviewSessionStatus" NOT NULL DEFAULT 'IN_PROGRESS',
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endsAt" TIMESTAMP(3) NOT NULL,
    "currentQuestion" INTEGER NOT NULL DEFAULT 0,
    "verdict" "InterviewVerdict",
    "overallScore" INTEGER,
    "summaryJson" TEXT,
    "reportDetail" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InterviewSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InterviewTurn" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "questionText" TEXT NOT NULL,
    "transcript" TEXT NOT NULL,
    "score" INTEGER NOT NULL DEFAULT 0,
    "llmFeedback" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InterviewTurn_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "InterviewSession_userId_idx" ON "InterviewSession"("userId");

-- CreateIndex
CREATE INDEX "InterviewSession_status_idx" ON "InterviewSession"("status");

-- CreateIndex
CREATE UNIQUE INDEX "InterviewTurn_sessionId_order_key" ON "InterviewTurn"("sessionId", "order");

-- CreateIndex
CREATE INDEX "InterviewTurn_sessionId_idx" ON "InterviewTurn"("sessionId");

-- AddForeignKey
ALTER TABLE "InterviewSession" ADD CONSTRAINT "InterviewSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "InterviewTurn" ADD CONSTRAINT "InterviewTurn_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "InterviewSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;
