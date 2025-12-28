import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as os from 'os';

const execAsync = promisify(exec);

interface ExecutionResult {
  output: string;
  error: string | null;
  exitCode: number;
}

export class CodeExecutionService {
  private tempDir: string;

  constructor() {
    this.tempDir = path.join(os.tmpdir(), 'code-execution');
    this.ensureTempDir();
  }

  private async ensureTempDir() {
    try {
      await fs.mkdir(this.tempDir, { recursive: true });
    } catch (error) {
      console.error('Failed to create temp directory:', error);
    }
  }

  private getFileExtension(language: string): string {
    const extensions: Record<string, string> = {
      javascript: 'js',
      python: 'py',
      java: 'java',
      cpp: 'cpp',
      c: 'c',
    };
    return extensions[language.toLowerCase()] || 'js';
  }

  private prepareCode(code: string, language: string, filePath: string): string {
    switch (language.toLowerCase()) {
      case 'javascript':
        // Node.js automatically captures console.log to stdout
        return code;
      
      case 'python':
        // Python code can run as-is
        return code;
      
      case 'java':
        // Wrap in a class if not already wrapped
        const trimmedCode = code.trim();
        if (trimmedCode.includes('public class') || trimmedCode.includes('class ')) {
          return code;
        }
        // Extract class name from filename
        const className = path.basename(filePath, '.java');
        return `public class ${className} {\n    public static void main(String[] args) {\n        ${code.split('\n').join('\n        ')}\n    }\n}`;
      
      case 'cpp':
        // Check if code has main function
        if (code.includes('int main') || code.includes('void main') || code.includes('main(')) {
          // Add necessary includes if not present
          if (!code.includes('#include')) {
            return `#include <iostream>\nusing namespace std;\n\n${code}`;
          }
          return code;
        }
        // Wrap in main function - handle cout, printf, etc.
        const lines = code.split('\n');
        const indentedLines = lines.map(line => `    ${line}`).join('\n');
        return `#include <iostream>\nusing namespace std;\n\nint main() {\n${indentedLines}\n    return 0;\n}`;
      
      default:
        return code;
    }
  }

  private getExecutionCommand(language: string, filePath: string): string {
    const isWindows = process.platform === 'win32';
    const dir = path.dirname(filePath);
    const baseName = path.basename(filePath, path.extname(filePath));
    
    switch (language.toLowerCase()) {
      case 'javascript':
        return `node "${filePath}"`;
      
      case 'python':
        // Try python3 first, fallback to python
        return isWindows ? `python "${filePath}"` : `python3 "${filePath}" 2>&1 || python "${filePath}"`;
      
      case 'java':
        if (isWindows) {
          return `cd /d "${dir}" && javac "${filePath}" && java ${baseName}`;
        }
        return `cd "${dir}" && javac "${filePath}" && java ${baseName}`;
      
      case 'cpp':
        const outputFile = isWindows ? `${baseName}.exe` : baseName;
        const outputPath = path.join(dir, outputFile);
        if (isWindows) {
          // On Windows, use proper path handling
          // Try g++ (MinGW) first
          return `cd /d "${dir}" && g++ "${filePath}" -o "${outputPath}" && "${outputPath}"`;
        }
        return `cd "${dir}" && g++ "${filePath}" -o "${outputPath}" && "${outputPath}"`;
      
      default:
        return `node "${filePath}"`;
    }
  }

  async executeCode(code: string, language: string, timeout: number = 5000): Promise<ExecutionResult> {
    const timestamp = Date.now();
    const extension = this.getFileExtension(language);
    const fileName = `code_${timestamp}.${extension}`;
    const filePath = path.join(this.tempDir, fileName);

    try {
      // Prepare code for execution (wrap in proper structure if needed)
      const codeToWrite = this.prepareCode(code, language, filePath);

      // Write code to temporary file
      await fs.writeFile(filePath, codeToWrite, 'utf-8');

      // Get execution command
      const command = this.getExecutionCommand(language, filePath);

      // Execute code with timeout
      try {
        const isWindows = process.platform === 'win32';
        const { stdout, stderr } = await Promise.race([
          execAsync(command, {
            maxBuffer: 1024 * 1024, // 1MB
            timeout,
            shell: isWindows ? 'cmd.exe' : '/bin/bash', // Use cmd.exe on Windows
          }),
          new Promise<{ stdout: string; stderr: string }>((_, reject) =>
            setTimeout(() => reject(new Error('Execution timeout')), timeout)
          ),
        ]) as { stdout: string; stderr: string };

        // Clean up file
        await this.cleanup(filePath);

        return {
          output: stdout || stderr || '',
          error: stderr || null,
          exitCode: 0,
        };
      } catch (execError: any) {
        // Clean up file
        await this.cleanup(filePath);

        // Handle timeout
        if (execError.message === 'Execution timeout' || execError.code === 'ETIMEDOUT') {
          return {
            output: '',
            error: 'Execution timeout: Code took too long to execute',
            exitCode: 124,
          };
        }

        // Handle other execution errors
        let errorMessage = execError.stderr || execError.stdout || execError.message || 'Unknown error';
        
        // Provide helpful error messages for missing compilers
        if (errorMessage.includes("'g++' is not recognized") || errorMessage.includes('g++: command not found')) {
          errorMessage = 'C++ compiler (g++) is not installed or not in PATH. Please install MinGW or use an online C++ compiler.';
        } else if (errorMessage.includes("'javac' is not recognized") || errorMessage.includes('javac: command not found')) {
          errorMessage = 'Java compiler (javac) is not installed or not in PATH. Please install JDK.';
        } else if (errorMessage.includes("'python' is not recognized") || errorMessage.includes('python: command not found')) {
          errorMessage = 'Python is not installed or not in PATH. Please install Python.';
        }
        
        return {
          output: '',
          error: errorMessage,
          exitCode: execError.code || 1,
        };
      }
    } catch (error) {
      // Clean up on any error
      await this.cleanup(filePath).catch(() => {});

      return {
        output: '',
        error: error instanceof Error ? error.message : 'Failed to execute code',
        exitCode: 1,
      };
    }
  }

  private async cleanup(filePath: string) {
    try {
      const dir = path.dirname(filePath);
      const baseName = path.basename(filePath, path.extname(filePath));
      
      // Clean up source file
      try {
        await fs.unlink(filePath);
      } catch {
        // File doesn't exist, ignore
      }
      
      // Clean up compiled files
      const possibleFiles = [
        path.join(dir, `${baseName}.class`), // Java
        path.join(dir, baseName), // C++ executable (Unix)
        path.join(dir, `${baseName}.exe`), // C++ executable (Windows)
        path.join(dir, `${baseName}.obj`), // C++ object file (Windows)
      ];

      for (const file of possibleFiles) {
        try {
          await fs.unlink(file);
        } catch {
          // File doesn't exist, ignore
        }
      }
    } catch (error) {
      console.error('Failed to cleanup:', error);
    }
  }
}

export const codeExecutionService = new CodeExecutionService();

