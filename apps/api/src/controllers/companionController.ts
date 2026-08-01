import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { chatWithCompanion, parseCompanionRequest } from '../services/companionService';

function mapError(err: unknown): { status: number; message: string } {
  const msg = err instanceof Error ? err.message : 'Unknown error';
  if (msg.includes('MISTRAL_API_KEY')) {
    return { status: 503, message: 'Mistral is not configured (missing MISTRAL_API_KEY).' };
  }
  if (msg.toLowerCase().includes('zod') || msg.includes('Required') || msg.includes('Too small')) {
    return { status: 400, message: msg };
  }
  return { status: 500, message: msg };
}

export const companionController = {
  async chat(req: AuthRequest, res: Response): Promise<void> {
    try {
      const input = parseCompanionRequest(req.body);
      const result = await chatWithCompanion(input);
      res.json(result);
    } catch (err) {
      const mapped = mapError(err);
      res.status(mapped.status).json({ error: mapped.message });
    }
  },
};
