import { Router } from 'express';
import { progressController } from '../controllers/progressController';
import { authenticate } from '../middleware/auth';

export const progressRoutes = Router();

progressRoutes.post('/:topicId/complete', authenticate, (req, res, next) => {
  void progressController.complete(req, res).catch(next);
});
progressRoutes.post('/:topicId/quiz', authenticate, (req, res, next) => {
  void progressController.submitQuiz(req, res).catch(next);
});
