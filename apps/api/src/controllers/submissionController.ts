import { Response } from 'express';
import { z } from 'zod';
import { prisma, SubmissionStatus } from '@codeforces/db';
import { AuthRequest } from '../middleware/auth';
import { evaluateCode } from '../services/aiService';
import { addToLeaderboard } from '../services/redisService';

const createSubmissionSchema = z.object({
  challengeId: z.string(),
  language: z.string(),
  sourceCode: z.string().min(1),
});

export const submissionController = {
  async getAll(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const { page = '1', pageSize = '10', challengeId, status } = req.query;
      const skip = (Number(page) - 1) * Number(pageSize);
      const take = Number(pageSize);

      const where: {
        userId: string;
        challengeId?: string;
        status?: SubmissionStatus;
      } = {
        userId: req.user.userId,
      };

      if (challengeId && typeof challengeId === 'string') {
        where.challengeId = challengeId;
      }

      if (status && typeof status === 'string') {
        where.status = status as SubmissionStatus;
      }

      const [submissions, total] = await Promise.all([
        prisma.submission.findMany({
          where,
          skip,
          take,
          orderBy: { submittedAt: 'desc' },
          include: {
            challenge: {
              select: {
                id: true,
                title: true,
                contest: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
          },
        }),
        prisma.submission.count({ where }),
      ]);

      res.json({
        data: submissions,
        total,
        page: Number(page),
        pageSize: Number(pageSize),
        totalPages: Math.ceil(total / Number(pageSize)),
      });
    } catch (error) {
      throw error;
    }
  },

  async getAllAdmin(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { page = '1', pageSize = '10', challengeId, status, userId } = req.query;
      const skip = (Number(page) - 1) * Number(pageSize);
      const take = Number(pageSize);

      const where: {
        challengeId?: string;
        status?: SubmissionStatus;
        userId?: string;
      } = {};

      if (challengeId && typeof challengeId === 'string') {
        where.challengeId = challengeId;
      }

      if (status && typeof status === 'string') {
        where.status = status as SubmissionStatus;
      }

      if (userId && typeof userId === 'string') {
        where.userId = userId;
      }

      const [submissions, total] = await Promise.all([
        prisma.submission.findMany({
          where,
          skip,
          take,
          orderBy: { submittedAt: 'desc' },
          include: {
            user: {
              select: {
                id: true,
                username: true,
                email: true,
              },
            },
            challenge: {
              select: {
                id: true,
                title: true,
                contest: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
          },
        }),
        prisma.submission.count({ where }),
      ]);

      res.json({
        data: submissions,
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
      if (!req.user) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const { id } = req.params;
      const submission = await prisma.submission.findUnique({
        where: { id },
        include: {
          challenge: {
            include: {
              contest: true,
            },
          },
          user: {
            select: {
              id: true,
              username: true,
            },
          },
        },
      });

      if (!submission) {
        res.status(404).json({ error: 'Submission not found' });
        return;
      }

      // Users can only view their own submissions unless admin
      if (submission.userId !== req.user.userId && req.user.role !== 'ADMIN') {
        res.status(403).json({ error: 'Forbidden' });
        return;
      }

      res.json(submission);
    } catch (error) {
      throw error;
    }
  },

  async create(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const data = createSubmissionSchema.parse(req.body);

      // Verify challenge exists and get contest info
      const challenge = await prisma.challenge.findUnique({
        where: { id: data.challengeId },
        include: {
          contest: true,
        },
      });

      if (!challenge) {
        res.status(404).json({ error: 'Challenge not found' });
        return;
      }

      // Check if contest is LIVE
      if (challenge.contest.status !== 'LIVE') {
        res.status(400).json({ error: 'Contest is not currently live' });
        return;
      }

      // Check if contest has started
      const now = new Date();
      if (now < challenge.contest.startTime || now > challenge.contest.endTime) {
        res.status(400).json({ error: 'Contest is not currently active' });
        return;
      }

      // Create submission with PENDING status
      const submission = await prisma.submission.create({
        data: {
          userId: req.user.userId,
          challengeId: data.challengeId,
          language: data.language,
          sourceCode: data.sourceCode,
          status: SubmissionStatus.PENDING,
        },
        include: {
          challenge: {
            select: {
              id: true,
              title: true,
              contest: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      });

      // Evaluate code with AI (async, don't wait)
      evaluateCode(data.sourceCode, data.language, data.challengeId)
        .then(async (result) => {
          // Update submission with result
          await prisma.submission.update({
            where: { id: submission.id },
            data: {
              status: result.status as SubmissionStatus,
              score: result.score,
              aiResponse: result.feedback,
            },
          });

          // If accepted, update leaderboard in Redis
          if (result.status === 'ACCEPTED') {
            await addToLeaderboard(challenge.contest.id, req.user.userId, result.score);
          }
        })
        .catch((error) => {
          console.error('Error evaluating submission:', error);
          // Update submission to show error
          prisma.submission
            .update({
              where: { id: submission.id },
              data: {
                status: SubmissionStatus.RUNTIME_ERROR,
                aiResponse: 'Error during code evaluation',
              },
            })
            .catch(console.error);
        });

      res.status(201).json(submission);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: 'Validation error', details: error.errors });
        return;
      }
      throw error;
    }
  },
};
