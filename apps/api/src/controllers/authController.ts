import { Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '@codeforces/db';
import { generateToken, generateOTP, getOTPExpiry, isOTPExpired } from '@codeforces/auth';
import { sendOTPEmail } from '../services/emailService';

const requestOTPSchema = z.object({
  email: z.string().email(),
});

const verifyOTPSchema = z.object({
  email: z.string().email(),
  code: z.string().length(6),
  username: z.string().min(3).max(30).optional(),
});

export const authController = {
  async requestOTP(req: Request, res: Response): Promise<void> {
    try {
      const data = requestOTPSchema.parse(req.body);
      const { email } = data;

      // Generate OTP
      const otp = generateOTP(6);
      const expiresAt = getOTPExpiry(10); // 10 minutes

      // Delete old OTPs for this email
      await prisma.oTP.deleteMany({
        where: { email },
      });

      // Store new OTP
      await prisma.oTP.create({
        data: {
          email,
          code: otp,
          expiresAt,
        },
      });

      // Send OTP via email
      await sendOTPEmail(email, otp);

      res.json({
        message: 'OTP sent to your email',
        expiresIn: 600, // 10 minutes in seconds
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: 'Validation error', details: error.errors });
        return;
      }
      throw error;
    }
  },

  async verifyOTP(req: Request, res: Response): Promise<void> {
    try {
      const data = verifyOTPSchema.parse(req.body);
      const { email, code, username } = data;

      // Find OTP
      const otpRecord = await prisma.oTP.findFirst({
        where: { email, code },
        orderBy: { createdAt: 'desc' },
      });

      if (!otpRecord) {
        res.status(401).json({ error: 'Invalid OTP' });
        return;
      }

      // Check if expired
      if (isOTPExpired(otpRecord.expiresAt)) {
        await prisma.oTP.delete({ where: { id: otpRecord.id } });
        res.status(401).json({ error: 'OTP expired' });
        return;
      }

      // Delete used OTP
      await prisma.oTP.delete({ where: { id: otpRecord.id } });

      // Find or create user
      let user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        // New user registration
        if (!username) {
          res.status(400).json({ error: 'Username required for new users' });
          return;
        }

        // Check if username is taken
        const existingUsername = await prisma.user.findUnique({
          where: { username },
        });

        if (existingUsername) {
          res.status(400).json({ error: 'Username already taken' });
          return;
        }

        user = await prisma.user.create({
          data: {
            email,
            username,
          },
        });
      }

      // Generate JWT token
      const token = generateToken({
        userId: user.id,
        email: user.email,
        role: user.role,
      });

      res.json({
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          role: user.role,
        },
        token,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: 'Validation error', details: error.errors });
        return;
      }
      throw error;
    }
  },
};
