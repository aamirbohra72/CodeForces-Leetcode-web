-- CreateTable
CREATE TABLE "ChallengeTestCase" (
    "id" TEXT NOT NULL,
    "challengeId" TEXT NOT NULL,
    "input" TEXT NOT NULL,
    "expectedOutput" TEXT NOT NULL,
    "isSample" BOOLEAN NOT NULL DEFAULT false,
    "isHidden" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ChallengeTestCase_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ChallengeTestCase_challengeId_idx" ON "ChallengeTestCase"("challengeId");

-- CreateIndex
CREATE INDEX "ChallengeTestCase_challengeId_order_idx" ON "ChallengeTestCase"("challengeId", "order");

-- AddForeignKey
ALTER TABLE "ChallengeTestCase"
ADD CONSTRAINT "ChallengeTestCase_challengeId_fkey"
FOREIGN KEY ("challengeId") REFERENCES "Challenge"("id") ON DELETE CASCADE ON UPDATE CASCADE;
