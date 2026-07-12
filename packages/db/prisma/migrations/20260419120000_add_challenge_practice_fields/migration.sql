-- AlterTable
ALTER TABLE "Challenge" ADD COLUMN     "practiceLanguage" TEXT,
ADD COLUMN     "companies" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "estimatedTime" TEXT;

-- CreateIndex
CREATE INDEX "Challenge_practiceLanguage_idx" ON "Challenge"("practiceLanguage");
