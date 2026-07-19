/**
 * Host-shell execution is disabled. All judging goes through Docker.
 * Kept as a thin compatibility shim for any lingering imports.
 */
import { DockerUnavailableError, runDockerJudge } from './dockerJudgeService';

interface ExecutionResult {
  output: string;
  error: string | null;
  exitCode: number;
}

export class CodeExecutionService {
  async executeCode(code: string, language: string, timeout: number = 5000): Promise<ExecutionResult> {
    try {
      const result = await runDockerJudge({
        mode: 'STDIN',
        language,
        sourceCode: code,
        cases: [{ name: 'smoke', input: '', expectedOutput: '', isSample: true, isHidden: false, order: 1 }],
        timeoutMs: timeout,
        sampleOnly: true,
      });
      if (result.status === 'ACCEPTED') {
        return { output: result.feedback, error: null, exitCode: 0 };
      }
      return { output: '', error: result.feedback, exitCode: 1 };
    } catch (err) {
      if (err instanceof DockerUnavailableError) {
        return { output: '', error: err.message, exitCode: 1 };
      }
      return {
        output: '',
        error: err instanceof Error ? err.message : 'Execution failed',
        exitCode: 1,
      };
    }
  }
}

export const codeExecutionService = new CodeExecutionService();
