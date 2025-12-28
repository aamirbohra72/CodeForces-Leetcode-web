import { Response } from 'express';
import { z } from 'zod';
import { prisma } from '@codeforces/db';
import { AuthRequest } from '../middleware/auth';

const createChallengeSchema = z.object({
  contestId: z.string(),
  title: z.string().min(1),
  description: z.string().min(1),
  difficulty: z.string(),
  inputFormat: z.string(),
  outputFormat: z.string(),
  constraints: z.string(),
  sampleInput: z.string(),
  sampleOutput: z.string(),
});

const updateChallengeSchema = createChallengeSchema.partial().omit({ contestId: true });

export const challengeController = {
  async getAll(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { difficulty, search } = req.query;

      const where: any = {};

      if (difficulty && difficulty !== 'All') {
        where.difficulty = difficulty;
      }

      if (search) {
        where.OR = [
          { title: { contains: search as string, mode: 'insensitive' } },
          { description: { contains: search as string, mode: 'insensitive' } },
        ];
      }

      // For practice, show challenges from contests that have started or ended
      // This allows users to practice even if contest is upcoming (for learning purposes)
      const now = new Date();
      where.contest = {
        OR: [
          { status: 'LIVE' },
          { status: 'ENDED' },
          { startTime: { lte: now } },
          // Allow practice on upcoming contests too (for learning)
          { status: 'UPCOMING' },
        ],
      };

      const challenges = await prisma.challenge.findMany({
        where,
        include: {
          contest: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      res.json(challenges);
    } catch (error) {
      throw error;
    }
  },

  async getById(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const challenge = await prisma.challenge.findUnique({
        where: { id },
        include: {
          contest: true,
        },
      });

      if (!challenge) {
        res.status(404).json({ error: 'Challenge not found' });
        return;
      }

      // Check if contest has started
      const now = new Date();
      if (challenge.contest.status === 'UPCOMING' || now < challenge.contest.startTime) {
        res.status(403).json({ error: 'Challenge is not available yet. Contest has not started.' });
        return;
      }

      res.json(challenge);
    } catch (error) {
      throw error;
    }
  },

  async create(req: AuthRequest, res: Response): Promise<void> {
    try {
      const data = createChallengeSchema.parse(req.body);

      // Verify contest exists
      const contest = await prisma.contest.findUnique({
        where: { id: data.contestId },
      });

      if (!contest) {
        res.status(404).json({ error: 'Contest not found' });
        return;
      }

      const challenge = await prisma.challenge.create({
        data: {
          contestId: data.contestId,
          title: data.title,
          description: data.description,
          difficulty: data.difficulty,
          inputFormat: data.inputFormat,
          outputFormat: data.outputFormat,
          constraints: data.constraints,
          sampleInput: data.sampleInput,
          sampleOutput: data.sampleOutput,
        },
      });

      res.status(201).json(challenge);
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
      const data = updateChallengeSchema.parse(req.body);

      const existing = await prisma.challenge.findUnique({ where: { id } });
      if (!existing) {
        res.status(404).json({ error: 'Challenge not found' });
        return;
      }

      const challenge = await prisma.challenge.update({
        where: { id },
        data,
      });

      res.json(challenge);
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
      await prisma.challenge.delete({ where: { id } });
      res.status(204).send();
    } catch (error) {
      throw error;
    }
  },
};

