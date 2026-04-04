import { Response } from 'express';
import { z } from 'zod';
import { AuthRequest } from '../middleware/auth';
import {
  createInterviewSession,
  getInterviewSession,
  submitInterviewAnswer,
  INTERVIEW_TEMPLATE_JS_10M,
} from '../services/interviewService';

const createSessionBodySchema = z.object({
  template: z.string().optional(),
});

const transcriptBodySchema = z.object({
  transcript: z.string().min(1, 'Transcript cannot be empty'),
});

function mapInterviewError(err: unknown): { status: number; message: string } | null {
  if (!(err instanceof Error)) return null;
  switch (err.message) {
    case 'MISTRAL_API_KEY_MISSING':
      return { status: 503, message: 'Mistral is not configured (missing MISTRAL_API_KEY).' };
    case 'UNKNOWN_TEMPLATE':
      return { status: 400, message: 'Unknown interview template.' };
    case 'SESSION_NOT_FOUND':
      return { status: 404, message: 'Interview session not found.' };
    case 'SESSION_NOT_ACTIVE':
      return { status: 400, message: 'This interview is no longer active.' };
    case 'TIME_EXPIRED':
      return { status: 400, message: 'Interview time has expired.' };
    case 'NO_MORE_QUESTIONS':
      return { status: 400, message: 'No further questions for this session.' };
    case 'EMPTY_TRANSCRIPT':
      return { status: 400, message: 'Could not use an empty answer. Record audio or type a transcript.' };
    default:
      return null;
  }
}

export const interviewController = {
  async createSession(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }
      const body = createSessionBodySchema.parse(req.body ?? {});
      const template = body.template ?? INTERVIEW_TEMPLATE_JS_10M;
      const state = await createInterviewSession(req.user.userId, template);
      res.status(201).json(state);
    } catch (err) {
      const mapped = mapInterviewError(err);
      if (mapped) {
        res.status(mapped.status).json({ error: mapped.message });
        return;
      }
      throw err;
    }
  },

  async getSession(req: AuthRequest, res: Response): Promise<void> {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    const { id } = req.params;
    const state = await getInterviewSession(id, req.user.userId);
    if (!state) {
      res.status(404).json({ error: 'Interview session not found.' });
      return;
    }
    res.json(state);
  },

  async submitAnswer(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const { id } = req.params;
      const file = req.file;

      let transcript: string | undefined;
      if (!file) {
        const raw = typeof req.body?.transcript === 'string' ? req.body.transcript : undefined;
        if (raw !== undefined) {
          const parsed = transcriptBodySchema.safeParse({ transcript: raw });
          if (!parsed.success) {
            res.status(400).json({ error: 'Invalid transcript', details: parsed.error.flatten() });
            return;
          }
          transcript = parsed.data.transcript;
        }
      }

      const result = await submitInterviewAnswer(id, req.user.userId, {
        audioBuffer: file?.buffer,
        audioFilename: file?.originalname,
        transcript,
      });

      res.json(result);
    } catch (err) {
      const mapped = mapInterviewError(err);
      if (mapped) {
        res.status(mapped.status).json({ error: mapped.message });
        return;
      }
      console.error('[interview] submitAnswer', err);
      res.status(500).json({
        error: 'Failed to process answer',
        message: process.env.NODE_ENV === 'development' && err instanceof Error ? err.message : undefined,
      });
    }
  },
};
