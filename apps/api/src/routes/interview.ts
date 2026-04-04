import { Router } from 'express';
import multer from 'multer';
import { interviewController } from '../controllers/interviewController';
import { authenticate } from '../middleware/auth';
import { requireInterviewEnabled } from '../middleware/interviewFeatureGate';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 12 * 1024 * 1024 },
});

export const interviewRoutes = Router();

interviewRoutes.use(requireInterviewEnabled);
interviewRoutes.use(authenticate);

interviewRoutes.post('/sessions', (req, res, next) => {
  void interviewController.createSession(req, res).catch(next);
});

interviewRoutes.get('/sessions/:id', (req, res, next) => {
  void interviewController.getSession(req, res).catch(next);
});

interviewRoutes.post('/sessions/:id/answers', upload.single('audio'), (req, res, next) => {
  void interviewController.submitAnswer(req, res).catch(next);
});
