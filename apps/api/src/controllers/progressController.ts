import { Response } from 'express';
import { z } from 'zod';
import { AuthRequest } from '../middleware/auth';
import { markTopicComplete, scoreQuiz } from '../services/courseGeneratorService';
import {
  completeLearningItem,
  getCourseLearningProgress,
  getMyLearningSummary,
} from '../services/learningProgressService';

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

const completeItemSchema = z.object({
  courseId: z.string().min(1),
  courseKind: z.enum(['catalog', 'generated']).optional(),
  title: z.string().optional(),
  itemId: z.string().min(1),
  itemType: z.enum(['tutorial', 'module', 'topic', 'assignment']),
  itemTitle: z.string().optional(),
  itemHref: z.string().optional(),
  score: z.number().int().min(0).max(100).optional(),
  totalCount: z.number().int().min(1).max(500).optional(),
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
      const summary = await getMyLearningSummary(req.user.userId);
      res.json({ ok: true, streak: summary.streak });
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
      const summary = await getMyLearningSummary(req.user.userId);
      res.json({ ...result, streak: summary.streak });
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ error: err.errors[0]?.message ?? 'Invalid request body' });
        return;
      }
      const mapped = mapError(err);
      res.status(mapped.status).json({ error: mapped.message });
    }
  },

  async completeItem(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user?.userId) {
        res.status(401).json({ error: 'Authentication required' });
        return;
      }
      const body = completeItemSchema.parse(req.body);
      const result = await completeLearningItem({
        userId: req.user.userId,
        ...body,
      });
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

  async me(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user?.userId) {
        res.status(401).json({ error: 'Authentication required' });
        return;
      }
      const summary = await getMyLearningSummary(req.user.userId);
      res.json(summary);
    } catch (err) {
      const mapped = mapError(err);
      res.status(mapped.status).json({ error: mapped.message });
    }
  },

  async course(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user?.userId) {
        res.status(401).json({ error: 'Authentication required' });
        return;
      }
      const courseId = String(req.params.courseId || '');
      const progress = await getCourseLearningProgress(req.user.userId, courseId);
      res.json({ progress });
    } catch (err) {
      const mapped = mapError(err);
      res.status(mapped.status).json({ error: mapped.message });
    }
  },
};
