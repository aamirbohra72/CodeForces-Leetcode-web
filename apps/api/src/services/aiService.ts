// Mock AI code evaluation service
// In production, this would call an actual AI service (OpenAI, Anthropic, etc.)

export interface CodeEvaluationResult {
  status: 'ACCEPTED' | 'WRONG_ANSWER' | 'TIME_LIMIT_EXCEEDED' | 'RUNTIME_ERROR' | 'COMPILATION_ERROR';
  score: number;
  feedback: string;
}

export async function evaluateCode(
  sourceCode: string,
  language: string,
  challengeId: string
): Promise<CodeEvaluationResult> {
  // Simulate AI evaluation delay
  await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 2000));

  // Mock evaluation logic
  // In production, this would:
  // 1. Send code to AI service (OpenAI, Anthropic, etc.)
  // 2. Get evaluation result
  // 3. Return structured response

  const random = Math.random();

  if (random > 0.7) {
    // 30% chance of acceptance
    return {
      status: 'ACCEPTED',
      score: 100,
      feedback: 'Code passed all test cases. Excellent solution!',
    };
  } else if (random > 0.5) {
    // 20% chance of wrong answer
    return {
      status: 'WRONG_ANSWER',
      score: 0,
      feedback: 'Code produces incorrect output for some test cases.',
    };
  } else if (random > 0.3) {
    // 20% chance of runtime error
    return {
      status: 'RUNTIME_ERROR',
      score: 0,
      feedback: 'Code encountered a runtime error during execution.',
    };
  } else if (random > 0.15) {
    // 15% chance of time limit exceeded
    return {
      status: 'TIME_LIMIT_EXCEEDED',
      score: 0,
      feedback: 'Code exceeded the time limit for some test cases.',
    };
  } else {
    // 15% chance of compilation error
    return {
      status: 'COMPILATION_ERROR',
      score: 0,
      feedback: 'Code failed to compile. Please check syntax errors.',
    };
  }
}


