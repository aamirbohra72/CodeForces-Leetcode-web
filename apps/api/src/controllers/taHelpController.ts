import { Response } from 'express';
import { z } from 'zod';
import { AuthRequest } from '../middleware/auth';
import { prisma } from '@codeforces/db';
import {
  claimTaHelpRequest,
  countWaitingVideoCalls,
  createTaHelpRequest,
  getTaHelpRequest,
  isStaffRole,
  listMyTaHelpRequests,
  listTaQueue,
  replyToTaHelpRequest,
  submitTaHelpFeedback,
  updateTaHelpStatus,
} from '../services/taHelpService';

function mapError(err: unknown): { status: number; message: string } {
  const msg = err instanceof Error ? err.message : 'Unknown error';
  if (msg === 'REQUEST_NOT_FOUND') return { status: 404, message: 'Help request not found' };
  if (msg === 'NOT_CLAIMABLE') return { status: 409, message: 'Request is not available to claim' };
  if (msg === 'FORBIDDEN') return { status: 403, message: 'Not allowed' };
  if (msg === 'EMPTY_REPLY') return { status: 400, message: 'Reply cannot be empty' };
  if (msg === 'USER_NOT_FOUND') return { status: 404, message: 'User not found' };
  return { status: 500, message: msg };
}

const createSchema = z.object({
  title: z.string().min(4).max(200),
  type: z.enum(['text', 'video']),
  problem: z.string().min(2).max(200),
  topic: z.string().min(1).max(80),
  language: z.string().min(1).max(40),
  description: z.string().min(20).max(5000),
  preferredSlot: z.string().max(120).optional(),
  source: z.enum(['web', 'companion']).optional(),
});

const replySchema = z.object({
  body: z.string().min(2).max(5000),
});

const statusSchema = z.object({
  status: z.enum(['OPEN_POOL', 'RESOLVED', 'WAITING']),
});

const feedbackSchema = z.object({
  satisfied: z.boolean().optional(),
  rating: z.number().int().min(1).max(5).optional(),
});

export const taHelpController = {
  async create(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user?.userId) {
        res.status(401).json({ error: 'Authentication required' });
        return;
      }
      const body = createSchema.parse(req.body);
      const request = await createTaHelpRequest({
        userId: req.user.userId,
        ...body,
      });
      res.status(201).json({ request });
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ error: err.errors[0]?.message ?? 'Invalid body' });
        return;
      }
      const mapped = mapError(err);
      res.status(mapped.status).json({ error: mapped.message });
    }
  },

  async mine(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user?.userId) {
        res.status(401).json({ error: 'Authentication required' });
        return;
      }
      const requests = await listMyTaHelpRequests(req.user.userId);
      const waitingVideo = await countWaitingVideoCalls(req.user.userId);
      res.json({ requests, waitingVideo });
    } catch (err) {
      const mapped = mapError(err);
      res.status(mapped.status).json({ error: mapped.message });
    }
  },

  async queue(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user?.userId || !isStaffRole(req.user.role)) {
        res.status(403).json({ error: 'TA or admin access required' });
        return;
      }
      const requests = await listTaQueue();
      res.json({ requests });
    } catch (err) {
      const mapped = mapError(err);
      res.status(mapped.status).json({ error: mapped.message });
    }
  },

  async getOne(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user?.userId) {
        res.status(401).json({ error: 'Authentication required' });
        return;
      }
      const detail = await getTaHelpRequest(String(req.params.id));
      if (!detail) {
        res.status(404).json({ error: 'Help request not found' });
        return;
      }
      const staff = isStaffRole(req.user.role);
      if (!staff && detail.userId !== req.user.userId) {
        res.status(403).json({ error: 'Not allowed' });
        return;
      }
      res.json({ request: detail });
    } catch (err) {
      const mapped = mapError(err);
      res.status(mapped.status).json({ error: mapped.message });
    }
  },

  async claim(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user?.userId || !isStaffRole(req.user.role)) {
        res.status(403).json({ error: 'TA or admin access required' });
        return;
      }
      const request = await claimTaHelpRequest(String(req.params.id), req.user.userId);
      res.json({ request });
    } catch (err) {
      const mapped = mapError(err);
      res.status(mapped.status).json({ error: mapped.message });
    }
  },

  async reply(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user?.userId) {
        res.status(401).json({ error: 'Authentication required' });
        return;
      }
      const body = replySchema.parse(req.body);
      const staff = isStaffRole(req.user.role);
      const request = await replyToTaHelpRequest({
        requestId: String(req.params.id),
        authorId: req.user.userId,
        authorRole: staff ? 'ta' : 'learner',
        body: body.body,
      });
      res.json({ request });
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ error: err.errors[0]?.message ?? 'Invalid body' });
        return;
      }
      const mapped = mapError(err);
      res.status(mapped.status).json({ error: mapped.message });
    }
  },

  async status(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user?.userId) {
        res.status(401).json({ error: 'Authentication required' });
        return;
      }
      const body = statusSchema.parse(req.body);
      const request = await updateTaHelpStatus({
        requestId: String(req.params.id),
        status: body.status,
        actorId: req.user.userId,
        asStaff: isStaffRole(req.user.role),
      });
      res.json({ request });
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ error: err.errors[0]?.message ?? 'Invalid body' });
        return;
      }
      const mapped = mapError(err);
      res.status(mapped.status).json({ error: mapped.message });
    }
  },

  async feedback(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user?.userId) {
        res.status(401).json({ error: 'Authentication required' });
        return;
      }
      const body = feedbackSchema.parse(req.body);
      const request = await submitTaHelpFeedback({
        requestId: String(req.params.id),
        userId: req.user.userId,
        satisfied: body.satisfied,
        rating: body.rating,
      });
      res.json({ request });
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ error: err.errors[0]?.message ?? 'Invalid body' });
        return;
      }
      const mapped = mapError(err);
      res.status(mapped.status).json({ error: mapped.message });
    }
  },

  /** Promote current user to TA (dev/admin helper — ADMIN only). */
  async promoteSelf(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user?.userId || req.user.role !== 'ADMIN') {
        res.status(403).json({ error: 'Admin only' });
        return;
      }
      const userId = String(req.body?.userId || req.user.userId);
      const user = await prisma.user.update({
        where: { id: userId },
        data: { role: 'TA' },
        select: { id: true, email: true, username: true, role: true },
      });
      res.json({ user });
    } catch (err) {
      const mapped = mapError(err);
      res.status(mapped.status).json({ error: mapped.message });
    }
  },
};
