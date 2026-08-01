import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { getProjectsHub, invalidateProjectsHub } from '../services/projectsLlmService';

function mapError(err: unknown): { status: number; message: string } {
  const msg = err instanceof Error ? err.message : 'Unknown error';
  if (msg.includes('MISTRAL_API_KEY')) {
    return { status: 503, message: 'Mistral is not configured (missing MISTRAL_API_KEY).' };
  }
  if (msg.toLowerCase().includes('json') || msg.includes('Zod')) {
    return { status: 502, message: `Invalid projects payload from Mistral: ${msg}` };
  }
  return { status: 500, message: msg };
}

export const projectsController = {
  async getHub(req: AuthRequest, res: Response): Promise<void> {
    try {
      const refresh = String(req.query.refresh || '') === '1';
      const pack = await getProjectsHub({ refresh });
      res.json(pack);
    } catch (err) {
      const mapped = mapError(err);
      res.status(mapped.status).json({ error: mapped.message });
    }
  },

  async refresh(_req: AuthRequest, res: Response): Promise<void> {
    try {
      await invalidateProjectsHub();
      const pack = await getProjectsHub({ refresh: true });
      res.json(pack);
    } catch (err) {
      const mapped = mapError(err);
      res.status(mapped.status).json({ error: mapped.message });
    }
  },
};
