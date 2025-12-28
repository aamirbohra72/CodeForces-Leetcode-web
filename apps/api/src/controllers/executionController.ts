import { Request, Response } from 'express';
import { z } from 'zod';
import { codeExecutionService } from '../services/codeExecutionService';

const executeCodeSchema = z.object({
  code: z.string().min(1, 'Code is required'),
  language: z.enum(['javascript', 'python', 'java', 'cpp']).default('javascript'),
  timeout: z.number().optional().default(5000),
});

export const executionController = {
  async execute(req: Request, res: Response): Promise<void> {
    try {
      const data = executeCodeSchema.parse(req.body);
      const { code, language, timeout } = data;

      // Security: Basic code validation
      if (code.length > 100000) {
        res.status(400).json({ error: 'Code is too long. Maximum 100KB allowed.' });
        return;
      }

      // Execute code
      const result = await codeExecutionService.executeCode(code, language, timeout);

      if (result.error && result.exitCode !== 0) {
        res.json({
          success: false,
          output: result.output,
          error: result.error,
          exitCode: result.exitCode,
        });
      } else {
        res.json({
          success: true,
          output: result.output || 'Code executed successfully (no output)',
          error: null,
          exitCode: 0,
        });
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: 'Validation error', details: error.errors });
        return;
      }
      throw error;
    }
  },
};

