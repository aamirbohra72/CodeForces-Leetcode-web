-- Persist the generated follow-up so refreshes and reconnects return the same question.
ALTER TABLE "InterviewSession" ADD COLUMN "currentQuestionText" TEXT;
