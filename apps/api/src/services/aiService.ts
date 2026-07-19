import { prisma, type JudgeMode } from '@codeforces/db';
import {
  DockerUnavailableError,
  runDockerJudge,
  type DockerJudgeResult,
  type JudgeCaseInput,
} from './dockerJudgeService';
import { generatePracticeHint } from './practiceHintService';

export interface CodeEvaluationResult {
  status: 'ACCEPTED' | 'WRONG_ANSWER' | 'TIME_LIMIT_EXCEEDED' | 'RUNTIME_ERROR' | 'COMPILATION_ERROR';
  score: number;
  feedback: string;
  passed: number;
  total: number;
  resultJson: string;
  hintText: string | null;
}

function redactResult(result: DockerJudgeResult): DockerJudgeResult {
  return {
    ...result,
    cases: (result.cases ?? []).map((c) => {
      if (c.isHidden) {
        return {
          name: 'hidden',
          order: c.order,
          isHidden: true,
          isSample: false,
          passed: c.passed,
          status: c.status,
          message: c.passed ? undefined : c.message || 'Hidden test case failed',
        };
      }
      return c;
    }),
  };
}

function deterministicHint(status: CodeEvaluationResult['status'], feedback: string): string {
  switch (status) {
    case 'WRONG_ANSWER':
      return 'Compare your output formatting and edge cases against the sample. Re-check empty inputs, boundaries, and off-by-one errors before resubmitting.';
    case 'COMPILATION_ERROR':
      return 'Fix syntax/compile errors first. Ensure your entrypoint matches the starter signature and allowed language APIs.';
    case 'RUNTIME_ERROR':
      return 'A runtime exception occurred. Guard against null/undefined, invalid indexes, and unhandled promise rejections.';
    case 'TIME_LIMIT_EXCEEDED':
      return 'Your solution is too slow for the hidden cases. Look for O(n^2) patterns you can replace with hashing, two pointers, or binary search.';
    default:
      return feedback;
  }
}

export async function evaluateCode(
  sourceCode: string,
  language: string,
  challengeId: string,
  options?: { sampleOnly?: boolean },
): Promise<CodeEvaluationResult> {
  const challenge = await prisma.challenge.findUnique({
    where: { id: challengeId },
    select: {
      id: true,
      title: true,
      description: true,
      inputFormat: true,
      outputFormat: true,
      constraints: true,
      judgeMode: true,
      allowedLanguages: true,
      judgeReady: true,
      sampleInput: true,
      sampleOutput: true,
      testCases: {
        select: {
          name: true,
          input: true,
          expectedOutput: true,
          specJson: true,
          isHidden: true,
          isSample: true,
          order: true,
        },
        orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
      },
    },
  });

  if (!challenge) {
    return {
      status: 'RUNTIME_ERROR',
      score: 0,
      feedback: 'Challenge not found',
      passed: 0,
      total: 0,
      resultJson: JSON.stringify({ status: 'RUNTIME_ERROR', feedback: 'Challenge not found' }),
      hintText: null,
    };
  }

  if (!challenge.judgeReady) {
    return {
      status: 'RUNTIME_ERROR',
      score: 0,
      feedback: 'This challenge is visible but judging is not ready yet.',
      passed: 0,
      total: 0,
      resultJson: JSON.stringify({ status: 'RUNTIME_ERROR', feedback: 'Judge not ready' }),
      hintText: null,
    };
  }

  const lang = language.toLowerCase();
  if (!challenge.allowedLanguages.map((l) => l.toLowerCase()).includes(lang)) {
    return {
      status: 'COMPILATION_ERROR',
      score: 0,
      feedback: `Language ${language} is not allowed for this challenge. Allowed: ${challenge.allowedLanguages.join(', ')}`,
      passed: 0,
      total: 0,
      resultJson: JSON.stringify({ status: 'COMPILATION_ERROR', feedback: 'Language not allowed' }),
      hintText: 'Pick an allowed language from the dropdown and use the provided starter code.',
    };
  }

  const cases: JudgeCaseInput[] = challenge.testCases.map((tc) => ({
    name: tc.name,
    input: tc.input,
    expectedOutput: tc.expectedOutput,
    specJson: tc.specJson,
    isHidden: tc.isHidden,
    isSample: tc.isSample,
    order: tc.order,
  }));

  if (cases.length === 0) {
    return {
      status: 'RUNTIME_ERROR',
      score: 0,
      feedback: 'No test cases configured for this challenge',
      passed: 0,
      total: 0,
      resultJson: JSON.stringify({ status: 'RUNTIME_ERROR', feedback: 'No test cases' }),
      hintText: null,
    };
  }

  let raw: DockerJudgeResult;
  try {
    raw = await runDockerJudge({
      mode: challenge.judgeMode as JudgeMode,
      language: lang,
      sourceCode,
      cases,
      timeoutMs: challenge.judgeMode === 'REACT_COMPONENT' ? 10000 : 5000,
      sampleOnly: Boolean(options?.sampleOnly),
    });
  } catch (err) {
    if (err instanceof DockerUnavailableError) {
      return {
        status: 'RUNTIME_ERROR',
        score: 0,
        feedback: 'Judge unavailable: Docker is required but not running.',
        passed: 0,
        total: cases.length,
        resultJson: JSON.stringify({
          status: 'RUNTIME_ERROR',
          feedback: 'Docker judge unavailable',
        }),
        hintText: 'Start Docker Desktop and rebuild the judge image (codeforces-judge:1), then retry.',
      };
    }
    throw err;
  }

  const safe = redactResult(raw);
  const status = safe.status;
  let hintText: string | null = null;
  if (status !== 'ACCEPTED') {
    hintText = await generatePracticeHint({
      title: challenge.title,
      description: challenge.description,
      inputFormat: challenge.inputFormat,
      outputFormat: challenge.outputFormat,
      constraints: challenge.constraints,
      language: lang,
      sourceCode,
      status,
      feedback: safe.feedback,
      publicCases: safe.cases.filter((c) => !c.isHidden),
    }).catch(() => deterministicHint(status, safe.feedback));
    if (!hintText) hintText = deterministicHint(status, safe.feedback);
  }

  return {
    status,
    score: safe.score,
    feedback: safe.feedback,
    passed: safe.passed,
    total: safe.total,
    resultJson: JSON.stringify(safe),
    hintText,
  };
}
