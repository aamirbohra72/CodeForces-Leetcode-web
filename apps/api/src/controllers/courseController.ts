import { Response } from 'express';
import { z } from 'zod';
import { AuthRequest } from '../middleware/auth';
import {
  getCoursePack,
  getCourseTutorial,
  invalidateCoursePack,
  isLlmCourse,
  listLlmCourseIds,
} from '../services/courseLlmService';
import {
  generateAndPersistCourse,
  getCourseById,
  type SourceType,
} from '../services/courseGeneratorService';

function mapError(err: unknown): { status: number; message: string } {
  const msg = err instanceof Error ? err.message : 'Unknown error';
  if (msg === 'COURSE_NOT_LLM_ENABLED') {
    return { status: 404, message: 'This course is not configured for live LLM content.' };
  }
  if (msg === 'MISTRAL_API_KEY_MISSING' || msg.includes('MISTRAL_API_KEY')) {
    return { status: 503, message: 'Mistral is not configured (missing MISTRAL_API_KEY).' };
  }
  if (msg === 'TUTORIAL_NOT_FOUND' || msg === 'TOPIC_NOT_FOUND') {
    return { status: 404, message: 'Resource not found.' };
  }
  if (msg.includes('Zod') || msg.toLowerCase().includes('json')) {
    return { status: 502, message: `LLM returned invalid course JSON: ${msg}` };
  }
  return { status: 500, message: msg };
}

const generateBodySchema = z.object({
  sourceType: z.enum(['text', 'pdf', 'topic']),
  sourceContent: z.string().min(1),
  goal: z.string().optional(),
});

export const courseController = {
  async listLlmCourses(_req: AuthRequest, res: Response): Promise<void> {
    res.json({ courseIds: listLlmCourseIds() });
  },

  async generate(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user?.userId) {
        res.status(401).json({ error: 'Authentication required' });
        return;
      }

      console.log('[courses] generate started for user', req.user.userId);
      const body = generateBodySchema.parse(req.body);
      const course = await generateAndPersistCourse({
        sourceType: body.sourceType as SourceType,
        sourceContent: body.sourceContent,
        goal: body.goal,
        userId: req.user.userId,
      });
      console.log('[courses] generate completed', course.id);
      res.status(201).json(course);
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ error: err.errors[0]?.message ?? 'Invalid request body' });
        return;
      }
      const mapped = mapError(err);
      res.status(mapped.status).json({ error: mapped.message });
    }
  },

  async getById(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const course = await getCourseById(id, req.user?.userId);
      if (!course) {
        res.status(404).json({ error: 'Course not found' });
        return;
      }
      res.json(course);
    } catch (err) {
      const mapped = mapError(err);
      res.status(mapped.status).json({ error: mapped.message });
    }
  },

  async extractPdf(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.file) {
        res.status(400).json({ error: 'PDF file is required' });
        return;
      }

      const pdfParse = (await import('pdf-parse')).default as (
        buffer: Buffer,
      ) => Promise<{ text: string }>;
      const result = await pdfParse(req.file.buffer);
      const text = (result.text ?? '').trim();
      if (!text) {
        res.status(400).json({ error: 'Could not extract text from PDF' });
        return;
      }
      res.json({ text });
    } catch (err) {
      const mapped = mapError(err);
      res.status(mapped.status).json({ error: mapped.message });
    }
  },

  async getPack(req: AuthRequest, res: Response): Promise<void> {
    try {
      const courseId = req.params.courseId;
      const refresh = String(req.query.refresh || '') === '1';
      if (!isLlmCourse(courseId)) {
        res.status(404).json({ error: 'This course is not configured for live LLM content.' });
        return;
      }
      const pack = await getCoursePack(courseId, { refresh });
      res.json(pack);
    } catch (err) {
      const mapped = mapError(err);
      res.status(mapped.status).json({ error: mapped.message });
    }
  },

  async getTutorial(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { courseId, tutorialId } = req.params;
      const refresh = String(req.query.refresh || '') === '1';
      const data = await getCourseTutorial(courseId, tutorialId, refresh);
      res.json(data);
    } catch (err) {
      const mapped = mapError(err);
      res.status(mapped.status).json({ error: mapped.message });
    }
  },

  async refreshPack(req: AuthRequest, res: Response): Promise<void> {
    try {
      const courseId = req.params.courseId;
      await invalidateCoursePack(courseId);
      const pack = await getCoursePack(courseId, { refresh: true });
      res.json(pack);
    } catch (err) {
      const mapped = mapError(err);
      res.status(mapped.status).json({ error: mapped.message });
    }
  },
};
