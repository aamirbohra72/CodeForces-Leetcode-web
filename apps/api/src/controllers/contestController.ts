import { Response } from 'express';
import { z } from 'zod';
import { prisma, ContestStatus } from '@codeforces/db';
import { AuthRequest } from '../middleware/auth';

const createContestSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
});

const updateContestSchema = createContestSchema.partial();

function determineStatus(startTime: Date, endTime: Date): ContestStatus {
  const now = new Date();
  if (now < startTime) return ContestStatus.UPCOMING;
  if (now > endTime) return ContestStatus.ENDED;
  return ContestStatus.LIVE;
}

export const contestController = {
  async getAll(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { status, page = '1', pageSize = '10' } = req.query;
      const skip = (Number(page) - 1) * Number(pageSize);
      const take = Number(pageSize);

      const where: { status?: ContestStatus } = {};
      if (status && typeof status === 'string') {
        where.status = status as ContestStatus;
      }

      const [contests, total] = await Promise.all([
        prisma.contest.findMany({
          where,
          skip,
          take,
          orderBy: { startTime: 'desc' },
        }),
        prisma.contest.count({ where }),
      ]);

      res.json({
        data: contests,
        total,
        page: Number(page),
        pageSize: Number(pageSize),
        totalPages: Math.ceil(total / Number(pageSize)),
      });
    } catch (error) {
      throw error;
    }
  },

  async getById(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const contest = await prisma.contest.findUnique({
        where: { id },
        include: {
          challenges: true,
        },
      });

      if (!contest) {
        res.status(404).json({ error: 'Contest not found' });
        return;
      }

      res.json(contest);
    } catch (error) {
      throw error;
    }
  },

  async getChallenges(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const challenges = await prisma.challenge.findMany({
        where: { contestId: id },
        orderBy: { createdAt: 'asc' },
      });

      res.json(challenges);
    } catch (error) {
      throw error;
    }
  },

  async create(req: AuthRequest, res: Response): Promise<void> {
    try {
      const data = createContestSchema.parse(req.body);
      const startTime = new Date(data.startTime);
      const endTime = new Date(data.endTime);

      if (endTime <= startTime) {
        res.status(400).json({ error: 'End time must be after start time' });
        return;
      }

      const status = determineStatus(startTime, endTime);

      const contest = await prisma.contest.create({
        data: {
          name: data.name,
          description: data.description,
          startTime,
          endTime,
          status,
        },
      });

      res.status(201).json(contest);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: 'Validation error', details: error.errors });
        return;
      }
      throw error;
    }
  },

  async update(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const data = updateContestSchema.parse(req.body);

      const existing = await prisma.contest.findUnique({ where: { id } });
      if (!existing) {
        res.status(404).json({ error: 'Contest not found' });
        return;
      }

      const updateData: {
        name?: string;
        description?: string;
        startTime?: Date;
        endTime?: Date;
        status?: ContestStatus;
      } = {};

      if (data.name) updateData.name = data.name;
      if (data.description !== undefined) updateData.description = data.description;

      const startTime = data.startTime ? new Date(data.startTime) : existing.startTime;
      const endTime = data.endTime ? new Date(data.endTime) : existing.endTime;

      if (endTime <= startTime) {
        res.status(400).json({ error: 'End time must be after start time' });
        return;
      }

      updateData.startTime = startTime;
      updateData.endTime = endTime;
      const newStatus = determineStatus(startTime, endTime);
      updateData.status = newStatus;

      // If contest is ending, finalize leaderboard
      if (newStatus === 'ENDED' && existing.status !== 'ENDED') {
        const { finalizeContestLeaderboard } = await import('../services/leaderboardService');
        // Don't await - run in background
        finalizeContestLeaderboard(id).catch(console.error);
      }

      const contest = await prisma.contest.update({
        where: { id },
        data: updateData,
      });

      res.json(contest);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: 'Validation error', details: error.errors });
        return;
      }
      throw error;
    }
  },

  async delete(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await prisma.contest.delete({ where: { id } });
      res.status(204).send();
    } catch (error) {
      throw error;
    }
  },
};

