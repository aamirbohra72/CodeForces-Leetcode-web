import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { progressController } from '../controllers/progressController';

export const progressRoutes = Router();

progressRoutes.get('/me', authenticate, (req, res, next) => {
  void progressController.me(req, res).catch(next);
});
progressRoutes.get('/course/:courseId', authenticate, (req, res, next) => {
  void progressController.course(req, res).catch(next);
});
progressRoutes.post('/item/complete', authenticate, (req, res, next) => {
  void progressController.completeItem(req, res).catch(next);
});
progressRoutes.post('/:topicId/complete', authenticate, (req, res, next) => {
  void progressController.complete(req, res).catch(next);
});
progressRoutes.post('/:topicId/quiz', authenticate, (req, res, next) => {
  void progressController.submitQuiz(req, res).catch(next);
});
