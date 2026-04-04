import {
  prisma,
  InterviewSessionStatus,
  InterviewVerdict,
  type InterviewSession,
} from '@codeforces/db';
import { transcribeAudio, gradeTurn, generateFinalReport } from './mistralInterviewService';

export const INTERVIEW_TEMPLATE_JS_10M = 'JS_ENGINEER_10M';

/** Wall-clock duration for the interview slot (ms). */
export const INTERVIEW_DURATION_MS = 10 * 60 * 1000;

export const JS_ENGINEER_QUESTIONS: readonly string[] = [
  'Explain closures in JavaScript and give one practical example where they matter in real code.',
  'What is the event loop, and how do the microtask queue and macrotasks (like setTimeout) interact?',
  'How is the value of `this` determined in JavaScript? Cover at least regular functions and arrow functions.',
  'Compare async/await with Promise chains. When would you choose one over the other?',
  'What are ES modules, and how do they differ from CommonJS `require`?',
  'How would you structure error handling in an async Express route handler?',
] as const;

function assertMistralConfigured(): void {
  if (!process.env.MISTRAL_API_KEY?.trim()) {
    throw new Error('MISTRAL_API_KEY_MISSING');
  }
}

async function loadSessionForUser(
  sessionId: string,
  userId: string
): Promise<InterviewSession | null> {
  return prisma.interviewSession.findFirst({
    where: { id: sessionId, userId },
  });
}

export function sessionPublicState(session: InterviewSession) {
  const total = JS_ENGINEER_QUESTIONS.length;
  const now = new Date();
  const expired = now > session.endsAt;
  const currentQuestion =
    session.status === InterviewSessionStatus.IN_PROGRESS && session.currentQuestion < total
      ? JS_ENGINEER_QUESTIONS[session.currentQuestion]
      : null;

  return {
    id: session.id,
    template: session.template,
    status: session.status,
    startedAt: session.startedAt.toISOString(),
    endsAt: session.endsAt.toISOString(),
    serverNow: now.toISOString(),
    timeExpired: expired,
    currentQuestionIndex: session.currentQuestion,
    totalQuestions: total,
    currentQuestion,
    verdict: session.verdict,
    overallScore: session.overallScore,
    summaryJson: session.summaryJson,
    reportDetail: session.reportDetail,
  };
}

export async function createInterviewSession(
  userId: string,
  template: string = INTERVIEW_TEMPLATE_JS_10M
): Promise<ReturnType<typeof sessionPublicState>> {
  if (template !== INTERVIEW_TEMPLATE_JS_10M) {
    throw new Error('UNKNOWN_TEMPLATE');
  }

  const startedAt = new Date();
  const endsAt = new Date(startedAt.getTime() + INTERVIEW_DURATION_MS);

  const session = await prisma.interviewSession.create({
    data: {
      userId,
      template,
      startedAt,
      endsAt,
      currentQuestion: 0,
      status: InterviewSessionStatus.IN_PROGRESS,
    },
  });

  return sessionPublicState(session);
}

export async function getInterviewSession(sessionId: string, userId: string) {
  const session = await loadSessionForUser(sessionId, userId);
  if (!session) return null;
  return sessionPublicState(session);
}

export async function submitInterviewAnswer(
  sessionId: string,
  userId: string,
  input: { audioBuffer?: Buffer; audioFilename?: string; transcript?: string }
) {
  assertMistralConfigured();

  const session = await loadSessionForUser(sessionId, userId);
  if (!session) {
    throw new Error('SESSION_NOT_FOUND');
  }
  if (session.status !== InterviewSessionStatus.IN_PROGRESS) {
    throw new Error('SESSION_NOT_ACTIVE');
  }

  const now = new Date();
  if (now > session.endsAt) {
    throw new Error('TIME_EXPIRED');
  }

  const qIndex = session.currentQuestion;
  if (qIndex >= JS_ENGINEER_QUESTIONS.length) {
    throw new Error('NO_MORE_QUESTIONS');
  }

  const questionText = JS_ENGINEER_QUESTIONS[qIndex];

  let transcript = input.transcript?.trim() ?? '';
  if (input.audioBuffer && input.audioBuffer.length > 0) {
    transcript = await transcribeAudio(input.audioBuffer, input.audioFilename ?? 'recording.webm');
  }

  if (!transcript) {
    throw new Error('EMPTY_TRANSCRIPT');
  }

  const grade = await gradeTurn(questionText, transcript);

  const nextIndex = qIndex + 1;
  const isLast = nextIndex >= JS_ENGINEER_QUESTIONS.length;

  await prisma.interviewTurn.create({
    data: {
      sessionId: session.id,
      order: qIndex,
      questionText,
      transcript,
      score: Math.round(grade.score),
      llmFeedback: JSON.stringify({
        feedback: grade.feedback,
        keyPointsMissing: grade.keyPointsMissing ?? [],
      }),
    },
  });

  if (isLast) {
    const turns = await prisma.interviewTurn.findMany({
      where: { sessionId: session.id },
      orderBy: { order: 'asc' },
      select: { questionText: true, transcript: true, score: true },
    });

    const report = await generateFinalReport(turns);

    const summaryPayload = {
      verdict: report.verdict,
      overallScore: report.overallScore,
      dimensions: report.dimensions ?? {},
      weakTopics: report.weakTopics,
      improvementPlan: report.improvementPlan,
      strengths: report.strengths,
    };

    await prisma.interviewSession.update({
      where: { id: session.id },
      data: {
        status: InterviewSessionStatus.COMPLETED,
        currentQuestion: nextIndex,
        verdict: report.verdict as InterviewVerdict,
        overallScore: Math.round(report.overallScore),
        summaryJson: JSON.stringify(summaryPayload),
        reportDetail: report.detailedMarkdown,
      },
    });
  } else {
    await prisma.interviewSession.update({
      where: { id: session.id },
      data: { currentQuestion: nextIndex },
    });
  }

  const updated = await prisma.interviewSession.findUniqueOrThrow({ where: { id: session.id } });
  return {
    ...sessionPublicState(updated),
    lastTurn: {
      score: Math.round(grade.score),
      feedback: grade.feedback,
      keyPointsMissing: grade.keyPointsMissing ?? [],
    },
    completed: isLast,
  };
}
