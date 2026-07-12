import { prisma } from '@codeforces/db';
import { codeExecutionService } from './codeExecutionService';

export interface CodeEvaluationResult {
  status: 'ACCEPTED' | 'WRONG_ANSWER' | 'TIME_LIMIT_EXCEEDED' | 'RUNTIME_ERROR' | 'COMPILATION_ERROR';
  score: number;
  feedback: string;
}

type JudgeCase = {
  input: string;
  expectedOutput: string;
  isHidden: boolean;
  order: number;
};

// Helper function to normalize output (trim whitespace, normalize line endings)
function normalizeOutput(output: string): string {
  return output.trim().replace(/\r\n/g, '\n').replace(/\r/g, '\n');
}

function classifyExecutionFailure(errorMessage: string, exitCode: number): CodeEvaluationResult['status'] {
  const errorLower = errorMessage.toLowerCase();
  if (
    errorLower.includes('syntax') ||
    errorLower.includes('compile') ||
    errorLower.includes('parse') ||
    errorLower.includes('unexpected') ||
    errorLower.includes('javac') ||
    errorLower.includes('g++')
  ) {
    return 'COMPILATION_ERROR';
  }
  if (errorLower.includes('timeout') || exitCode === 124) {
    return 'TIME_LIMIT_EXCEEDED';
  }
  return 'RUNTIME_ERROR';
}

// Helper function to prepare code with input handling
// This is a simplified version - in production, you'd use proper stdin/stdout handling
function prepareCodeWithInput(sourceCode: string, language: string, input: string): string {
  const normalizedInput = input.trim();
  const inputLines = normalizedInput.split('\n').filter(line => line.trim() !== '');
  
  switch (language.toLowerCase()) {
    case 'javascript':
      // For JavaScript, inject input as a variable and provide a simple readLine function
      // This is a simplified approach - in production, use proper stdin handling
      return `
// Input data
const inputLines = ${JSON.stringify(inputLines)};
let inputIndex = 0;

// Simple input reading function
function readLine() {
  if (inputIndex < inputLines.length) {
    return inputLines[inputIndex++];
  }
  return '';
}

// User code
${sourceCode}
`;
    
    case 'python':
      // For Python, inject input as a list
      return `
# Input data
input_lines = ${JSON.stringify(inputLines)}
input_index = 0

# Simple input reading function
def input_line():
    global input_index
    if input_index < len(input_lines):
        line = input_lines[input_index]
        input_index += 1
        return line
    return ''

# User code
${sourceCode}
`;
    
    case 'java':
    case 'cpp':
      // For Java and C++, just execute the code as-is
      // Proper input handling would require more complex wrapping
      return sourceCode;
    
    default:
      return sourceCode;
  }
}

export async function evaluateCode(
  sourceCode: string,
  language: string,
  challengeId: string
): Promise<CodeEvaluationResult> {
  try {
    // Fetch challenge + dedicated test cases (sample + hidden).
    const challenge = await prisma.challenge.findUnique({
      where: { id: challengeId },
      select: {
        sampleInput: true,
        sampleOutput: true,
        title: true,
        testCases: {
          select: {
            input: true,
            expectedOutput: true,
            isHidden: true,
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
      };
    }

    const cases: JudgeCase[] =
      challenge.testCases.length > 0
        ? challenge.testCases
        : challenge.sampleOutput
          ? [
              {
                input: challenge.sampleInput ?? '',
                expectedOutput: challenge.sampleOutput,
                isHidden: false,
                order: 1,
              },
            ]
          : [];

    // No available test case -> compile/run health check only.
    if (cases.length === 0) {
      const result = await codeExecutionService.executeCode(sourceCode, language, 5000);

      if (result.error && result.exitCode !== 0) {
        const status = classifyExecutionFailure(result.error, result.exitCode);
        return {
          status,
          score: 0,
          feedback: `${status === 'COMPILATION_ERROR' ? 'Compilation' : 'Runtime'} error: ${result.error}`,
        };
      }

      return {
        status: 'ACCEPTED',
        score: 100,
        feedback: 'Code executed successfully (no test cases available)',
      };
    }

    let passed = 0;
    for (let idx = 0; idx < cases.length; idx += 1) {
      const judgeCase = cases[idx];
      const codeWithInput = prepareCodeWithInput(sourceCode, language, judgeCase.input);
      const result = await codeExecutionService.executeCode(codeWithInput, language, 10000);

      if (result.error && result.exitCode !== 0) {
        const status = classifyExecutionFailure(result.error, result.exitCode);
        const visibleCaseNo = judgeCase.isHidden ? 'hidden' : `${idx + 1}`;
        return {
          status,
          score: Math.round((passed / cases.length) * 100),
          feedback:
            status === 'TIME_LIMIT_EXCEEDED'
              ? `Time limit exceeded on test case #${visibleCaseNo}`
              : `${status === 'COMPILATION_ERROR' ? 'Compilation' : 'Runtime'} error on test case #${visibleCaseNo}: ${result.error.substring(0, 400)}`,
        };
      }

      const actualOutput = normalizeOutput(result.output || '');
      const expectedOutput = normalizeOutput(judgeCase.expectedOutput);
      if (actualOutput !== expectedOutput) {
        const caseLabel = judgeCase.isHidden ? 'hidden case' : `case #${idx + 1}`;
        const details = judgeCase.isHidden
          ? `Expected output does not match for ${caseLabel}.`
          : `Expected "${expectedOutput}", got "${actualOutput.substring(0, 200)}".`;
        return {
          status: 'WRONG_ANSWER',
          score: Math.round((passed / cases.length) * 100),
          feedback: `Wrong answer on ${caseLabel}. ${details}`,
        };
      }

      passed += 1;
    }

    if (passed === cases.length) {
      const hiddenCount = cases.filter((c) => c.isHidden).length;
      return {
        status: 'ACCEPTED',
        score: 100,
        feedback: `Accepted. Passed ${cases.length} / ${cases.length} test cases (${hiddenCount} hidden).`,
      };
    }

    // Defensive fallback (shouldn't happen due to returns inside loop).
    return {
      status: 'RUNTIME_ERROR',
      score: Math.round((passed / cases.length) * 100),
      feedback: 'Unexpected judge state.',
    };
  } catch (error) {
    console.error('Error evaluating code:', error);
    return {
      status: 'RUNTIME_ERROR',
      score: 0,
      feedback: `Evaluation error: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}


