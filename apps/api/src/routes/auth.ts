import { Router } from 'express';
import { authController } from '../controllers/authController';

export const authRoutes = Router();

/** Legacy OTP auth disabled — use Clerk on the web app. */
authRoutes.post('/request-otp', (_req, res) => {
  res.status(410).json({
    error: 'OTP login has been replaced by Clerk. Use /sign-in on the web app.',
  });
});
authRoutes.post('/verify-otp', (_req, res) => {
  res.status(410).json({
    error: 'OTP login has been replaced by Clerk. Use /sign-in on the web app.',
  });
});

authRoutes.post('/clerk-exchange', (req, res, next) => {
  void authController.clerkExchange(req, res).catch(next);
});
