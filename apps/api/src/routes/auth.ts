import { Router } from 'express';
import { authController } from '../controllers/authController';

export const authRoutes = Router();

authRoutes.post('/request-otp', authController.requestOTP);
authRoutes.post('/verify-otp', authController.verifyOTP);
