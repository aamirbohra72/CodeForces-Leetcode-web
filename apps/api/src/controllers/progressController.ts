import { Response } from 'express';
import { z } from 'zod';
import { AuthRequest } from '../middleware/auth';
import { markTopicComplete, scoreQuiz } from '../services/courseGeneratorService';

function mapError(err: unknown): { status: number; message: string } {
  const msg = err instanceof Error ? err.message : 'Unknown error';
  if (msg === 'TOPIC_NOT_FOUND') {
    return { status: 404, message: 'Topic not found' };
  }
  if (msg === 'TOPIC_NOT_QUIZ') {
    return { status: 400, message: 'This topic does not have a quiz' };
  }
  if (msg === 'NO_MCQS') {
    return { status: 400, message: 'No quiz questions available for this topic' };
  }
  return { status: 500, message: msg };
}

const quizBodySchema = z.object({
  answers: z.array(z.number().int().min(0).max(3)),
});

export const progressController = {
  async complete(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user?.userId) {
        res.status(401).json({ error: 'Authentication required' });
        return;
      }

      const { topicId } = req.params;
      await markTopicComplete(req.user.userId, topicId);
      res.json({ ok: true });
    } catch (err) {
      const mapped = mapError(err);
      res.status(mapped.status).json({ error: mapped.message });
    }
  },

  async submitQuiz(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user?.userId) {
        res.status(401).json({ error: 'Authentication required' });
        return;
      }

      const { topicId } = req.params;
      const body = quizBodySchema.parse(req.body);
      const result = await scoreQuiz(req.user.userId, topicId, body.answers);
      res.json(result);
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ error: err.errors[0]?.message ?? 'Invalid request body' });
        return;
      }
      const mapped = mapError(err);
      res.status(mapped.status).json({ error: mapped.message });
    }
  },
};
