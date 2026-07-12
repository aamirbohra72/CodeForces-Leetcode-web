import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { getCareersHub, invalidateCareersHub } from '../services/careersLlmService';
import { suggestResumeImprovements, type ResumeData } from '../services/resumeLlmService';

function mapError(err: unknown): { status: number; message: string } {
  const msg = err instanceof Error ? err.message : 'Unknown error';
  if (msg === 'MISTRAL_API_KEY_MISSING' || msg.includes('MISTRAL_API_KEY')) {
    return { status: 503, message: 'Mistral is not configured (missing MISTRAL_API_KEY).' };
  }
  if (msg.toLowerCase().includes('json') || msg.includes('Zod')) {
    return { status: 502, message: `LLM returned invalid careers JSON: ${msg}` };
  }
  return { status: 500, message: msg };
}

export const careersController = {
  async getHub(req: AuthRequest, res: Response): Promise<void> {
    try {
      const refresh = String(req.query.refresh || '') === '1';
      const pack = await getCareersHub({ refresh });
      res.json(pack);
    } catch (err) {
      const mapped = mapError(err);
      res.status(mapped.status).json({ error: mapped.message });
    }
  },

  async refreshHub(_req: AuthRequest, res: Response): Promise<void> {
    try {
      await invalidateCareersHub();
      const pack = await getCareersHub({ refresh: true });
      res.json(pack);
    } catch (err) {
      const mapped = mapError(err);
      res.status(mapped.status).json({ error: mapped.message });
    }
  },

  async suggestResume(req: AuthRequest, res: Response): Promise<void> {
    try {
      const body = (req.body ?? {}) as ResumeData;
      const suggestions = await suggestResumeImprovements(body);
      res.json(suggestions);
    } catch (err) {
      const mapped = mapError(err);
      res.status(mapped.status).json({ error: mapped.message });
    }
  },
};
