import { spawn } from 'child_process';
import { promises as fs } from 'fs';
import * as os from 'os';
import * as path from 'path';
import { randomUUID } from 'crypto';

export type JudgeCaseInput = {
  name?: string;
  input: string;
  expectedOutput: string;
  isSample?: boolean;
  isHidden?: boolean;
  order?: number;
  specJson?: string | null;
};

export type JudgeCaseResult = {
  name: string;
  order: number;
  isHidden: boolean;
  isSample: boolean;
  passed: boolean;
  status: string;
  expected?: string;
  actual?: string;
  message?: string;
};

export type DockerJudgeResult = {
  status: 'ACCEPTED' | 'WRONG_ANSWER' | 'TIME_LIMIT_EXCEEDED' | 'RUNTIME_ERROR' | 'COMPILATION_ERROR';
  score: number;
  feedback: string;
  passed: number;
  total: number;
  cases: JudgeCaseResult[];
};

export type DockerJudgeRequest = {
  mode: 'STDIN' | 'JS_FUNCTION' | 'REACT_COMPONENT';
  language: string;
  sourceCode: string;
  cases: JudgeCaseInput[];
  timeoutMs?: number;
  sampleOnly?: boolean;
};

const IMAGE = process.env.JUDGE_DOCKER_IMAGE?.trim() || 'codeforces-judge:1';
const DOCKER_BIN = process.env.DOCKER_BIN?.trim() || 'docker';

export class DockerUnavailableError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DockerUnavailableError';
  }
}

async function ensureDocker(): Promise<void> {
  await new Promise<void>((resolve, reject) => {
    const child = spawn(DOCKER_BIN, ['info'], { stdio: ['ignore', 'ignore', 'pipe'] });
    let err = '';
    child.stderr.on('data', (d) => {
      err += d.toString();
    });
    child.on('error', () => reject(new DockerUnavailableError('Docker CLI is not available')));
    child.on('close', (code) => {
      if (code === 0) resolve();
      else reject(new DockerUnavailableError(err.trim() || 'Docker daemon is not running'));
    });
  });
}

function runDocker(args: string[], timeoutMs: number): Promise<{ stdout: string; stderr: string; code: number }> {
  return new Promise((resolve, reject) => {
    const child = spawn(DOCKER_BIN, args, { stdio: ['ignore', 'pipe', 'pipe'] });
    let stdout = '';
    let stderr = '';
    const timer = setTimeout(() => {
      child.kill('SIGKILL');
      reject(new Error('Docker judge timed out'));
    }, timeoutMs);

    child.stdout.on('data', (d) => {
      stdout += d.toString();
    });
    child.stderr.on('data', (d) => {
      stderr += d.toString();
    });
    child.on('error', (err) => {
      clearTimeout(timer);
      reject(err);
    });
    child.on('close', (code) => {
      clearTimeout(timer);
      resolve({ stdout, stderr, code: code ?? 1 });
    });
  });
}

export async function runDockerJudge(request: DockerJudgeRequest): Promise<DockerJudgeResult> {
  await ensureDocker();

  const workDir = await fs.mkdtemp(path.join(os.tmpdir(), 'cf-judge-'));
  const requestPath = path.join(workDir, 'request.json');
  const resultPath = path.join(workDir, 'result.json');

  try {
    await fs.writeFile(requestPath, JSON.stringify(request), 'utf8');

    const memory = process.env.JUDGE_MEMORY_LIMIT?.trim() || '256m';
    const cpus = process.env.JUDGE_CPUS?.trim() || '1';
    const pids = process.env.JUDGE_PIDS_LIMIT?.trim() || '64';
    const outerTimeout =
      (request.timeoutMs ?? 5000) * Math.max(1, request.cases.length) + 30_000;

    const args = [
      'run',
      '--rm',
      '--network',
      'none',
      '--read-only',
      '--tmpfs',
      '/workspace:rw,size=64m,uid=10001,gid=10001,mode=1777',
      '--tmpfs',
      '/tmp:rw,size=32m,uid=10001,gid=10001,mode=1777',
      '--memory',
      memory,
      '--cpus',
      cpus,
      '--pids-limit',
      pids,
      '--user',
      '10001:10001',
      '--security-opt',
      'no-new-privileges',
      '--cap-drop',
      'ALL',
      '-v',
      `${requestPath}:/workspace/request.json:ro`,
      IMAGE,
    ];

    // Mount request then copy into writable tmpfs via a tiny wrapper is hard with --read-only + tmpfs.
    // Simpler: pass request via env base64 (size-limited) OR use writable bind mount for workDir.
    // Prefer bind-mount workDir as /workspace (not read-only root for that path).
    const bindArgs = [
      'run',
      '--rm',
      '--network',
      'none',
      '--memory',
      memory,
      '--cpus',
      cpus,
      '--pids-limit',
      pids,
      '--user',
      '10001:10001',
      '--security-opt',
      'no-new-privileges',
      '--cap-drop',
      'ALL',
      '-v',
      `${workDir}:/workspace`,
      IMAGE,
    ];

    const { stdout, stderr, code } = await runDocker(bindArgs, outerTimeout);

    let parsed: DockerJudgeResult | null = null;
    try {
      const raw = await fs.readFile(resultPath, 'utf8');
      parsed = JSON.parse(raw) as DockerJudgeResult;
    } catch {
      try {
        parsed = JSON.parse(stdout) as DockerJudgeResult;
      } catch {
        parsed = null;
      }
    }

    if (!parsed) {
      return {
        status: 'RUNTIME_ERROR',
        score: 0,
        feedback: stderr || stdout || `Judge container failed (exit ${code})`,
        passed: 0,
        total: request.cases.length,
        cases: [],
      };
    }

    return parsed;
  } finally {
    await fs.rm(workDir, { recursive: true, force: true }).catch(() => undefined);
  }
}

export async function isDockerJudgeAvailable(): Promise<boolean> {
  try {
    await ensureDocker();
    return true;
  } catch {
    return false;
  }
}

// Keep a unique id helper for future job tracking
export function newJudgeJobId(): string {
  return randomUUID();
}
