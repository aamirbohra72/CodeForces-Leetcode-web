import { Router } from 'express';
import { authController } from '../controllers/authController';

export const authRoutes = Router();

authRoutes.post('/request-otp', authController.requestOTP);
authRoutes.post('/verify-otp', authController.verifyOTP);
authRoutes.post('/clerk-exchange', (req, res, next) => {
  void authController.clerkExchange(req, res).catch(next);
});
