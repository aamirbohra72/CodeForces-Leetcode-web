import { prisma } from '@codeforces/db';
import { codeExecutionService } from './codeExecutionService';

export interface CodeEvaluationResult {
  status: 'ACCEPTED' | 'WRONG_ANSWER' | 'TIME_LIMIT_EXCEEDED' | 'RUNTIME_ERROR' | 'COMPILATION_ERROR';
  score: number;
  feedback: string;
}

// Helper function to normalize output (trim whitespace, normalize line endings)
function normalizeOutput(output: string): string {
  return output.trim().replace(/\r\n/g, '\n').replace(/\r/g, '\n');
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
    // Fetch challenge to get sample input and output
    const challenge = await prisma.challenge.findUnique({
      where: { id: challengeId },
      select: {
        sampleInput: true,
        sampleOutput: true,
        title: true,
      },
    });

    if (!challenge) {
      return {
        status: 'RUNTIME_ERROR',
        score: 0,
        feedback: 'Challenge not found',
      };
    }

    // If no sample input/output, just check if code compiles/executes
    if (!challenge.sampleInput || !challenge.sampleOutput) {
      const result = await codeExecutionService.executeCode(sourceCode, language, 5000);
      
      if (result.error && result.exitCode !== 0) {
        // Check if it's a compilation error
        const errorLower = result.error.toLowerCase();
        if (errorLower.includes('syntax') || 
            errorLower.includes('compile') || 
            errorLower.includes('parse') ||
            errorLower.includes('unexpected')) {
          return {
            status: 'COMPILATION_ERROR',
            score: 0,
            feedback: `Compilation error: ${result.error}`,
          };
        }
        return {
          status: 'RUNTIME_ERROR',
          score: 0,
          feedback: `Runtime error: ${result.error}`,
        };
      }

      return {
        status: 'ACCEPTED',
        score: 100,
        feedback: 'Code executed successfully (no test cases available)',
      };
    }

    // Prepare code with input handling
    const codeWithInput = prepareCodeWithInput(sourceCode, language, challenge.sampleInput);
    
    // Execute code with timeout
    const result = await codeExecutionService.executeCode(codeWithInput, language, 10000);

    // Check for execution errors
    if (result.error && result.exitCode !== 0) {
      const errorLower = result.error.toLowerCase();
      
      // Check if it's a compilation error
      if (errorLower.includes('syntax') || 
          errorLower.includes('compile') || 
          errorLower.includes('parse') ||
          errorLower.includes('unexpected') ||
          errorLower.includes('javac') ||
          errorLower.includes('g++')) {
        return {
          status: 'COMPILATION_ERROR',
          score: 0,
          feedback: `Compilation error: ${result.error.substring(0, 500)}`,
        };
      }

      // Check for timeout
      if (errorLower.includes('timeout') || result.exitCode === 124) {
        return {
          status: 'TIME_LIMIT_EXCEEDED',
          score: 0,
          feedback: 'Code exceeded the time limit (10 seconds)',
        };
      }

      // Runtime error
      return {
        status: 'RUNTIME_ERROR',
        score: 0,
        feedback: `Runtime error: ${result.error.substring(0, 500)}`,
      };
    }

    // Compare output with expected output
    const actualOutput = normalizeOutput(result.output || '');
    const expectedOutput = normalizeOutput(challenge.sampleOutput);

    if (actualOutput === expectedOutput) {
      return {
        status: 'ACCEPTED',
        score: 100,
        feedback: 'Code passed the sample test case! ✅',
      };
    } else {
      return {
        status: 'WRONG_ANSWER',
        score: 0,
        feedback: `Wrong answer. Expected: "${expectedOutput}", Got: "${actualOutput.substring(0, 200)}"`,
      };
    }
  } catch (error) {
    console.error('Error evaluating code:', error);
    return {
      status: 'RUNTIME_ERROR',
      score: 0,
      feedback: `Evaluation error: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}


