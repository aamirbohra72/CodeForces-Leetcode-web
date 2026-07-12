import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import {
  getCoursePack,
  getCourseTutorial,
  invalidateCoursePack,
  isLlmCourse,
  listLlmCourseIds,
} from '../services/courseLlmService';

function mapError(err: unknown): { status: number; message: string } {
  const msg = err instanceof Error ? err.message : 'Unknown error';
  if (msg === 'COURSE_NOT_LLM_ENABLED') {
    return { status: 404, message: 'This course is not configured for live LLM content.' };
  }
  if (msg === 'MISTRAL_API_KEY_MISSING' || msg.includes('MISTRAL_API_KEY')) {
    return { status: 503, message: 'Mistral is not configured (missing MISTRAL_API_KEY).' };
  }
  if (msg === 'TUTORIAL_NOT_FOUND') {
    return { status: 404, message: 'Tutorial not found in generated pack.' };
  }
  if (msg.includes('Zod') || msg.toLowerCase().includes('json')) {
    return { status: 502, message: `LLM returned invalid course JSON: ${msg}` };
  }
  return { status: 500, message: msg };
}

export const courseController = {
  async listLlmCourses(_req: AuthRequest, res: Response): Promise<void> {
    res.json({ courseIds: listLlmCourseIds() });
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
