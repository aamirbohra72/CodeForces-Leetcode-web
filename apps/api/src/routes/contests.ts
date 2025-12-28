import { Router } from 'express';
import { contestController } from '../controllers/contestController';
import { authenticate, requireAdmin } from '../middleware/auth';

export const contestRoutes = Router();

// Public routes
contestRoutes.get('/', contestController.getAll);
contestRoutes.get('/:id', contestController.getById);
contestRoutes.get('/:id/challenges', contestController.getChallenges);

// Admin routes
contestRoutes.post('/', authenticate, requireAdmin, contestController.create);
contestRoutes.put('/:id', authenticate, requireAdmin, contestController.update);
contestRoutes.delete('/:id', authenticate, requireAdmin, contestController.delete);


