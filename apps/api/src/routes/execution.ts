import { Router } from 'express';
import { executionController } from '../controllers/executionController';
import { authenticate } from '../middleware/auth';

export const executionRoutes = Router();

executionRoutes.use(authenticate);
executionRoutes.post('/execute', (req, res, next) => {
  void executionController.execute(req, res).catch(next);
});
