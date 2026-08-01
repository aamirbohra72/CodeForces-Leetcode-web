import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import {
  getBlogHub,
  getBlogPostFromHub,
  invalidateBlogHub,
} from '../services/blogLlmService';

function mapError(err: unknown): { status: number; message: string } {
  const msg = err instanceof Error ? err.message : 'Unknown error';
  if (msg.includes('MISTRAL_API_KEY')) {
    return { status: 503, message: 'Mistral is not configured (missing MISTRAL_API_KEY).' };
  }
  if (msg.toLowerCase().includes('json') || msg.toLowerCase().includes('zod') || msg.includes('too few')) {
    return { status: 502, message: `Invalid blog payload from Mistral: ${msg}` };
  }
  return { status: 500, message: msg };
}

export const blogController = {
  async getHub(req: AuthRequest, res: Response): Promise<void> {
    try {
      const refresh = String(req.query.refresh || '') === '1';
      const pack = await getBlogHub({ refresh });
      res.json(pack);
    } catch (err) {
      const mapped = mapError(err);
      res.status(mapped.status).json({ error: mapped.message });
    }
  },

  async refresh(_req: AuthRequest, res: Response): Promise<void> {
    try {
      await invalidateBlogHub();
      const pack = await getBlogHub({ refresh: true });
      res.json(pack);
    } catch (err) {
      const mapped = mapError(err);
      res.status(mapped.status).json({ error: mapped.message });
    }
  },

  async getPost(req: AuthRequest, res: Response): Promise<void> {
    try {
      const id = String(req.params.id || '');
      const post = await getBlogPostFromHub(id);
      if (!post) {
        res.status(404).json({ error: 'Post not found' });
        return;
      }
      res.json(post);
    } catch (err) {
      const mapped = mapError(err);
      res.status(mapped.status).json({ error: mapped.message });
    }
  },
};
