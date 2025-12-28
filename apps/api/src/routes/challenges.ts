import { Router } from 'express';
import { challengeController } from '../controllers/challengeController';
import { authenticate, requireAdmin } from '../middleware/auth';

export const challengeRoutes = Router();

// Public routes
challengeRoutes.get('/', challengeController.getAll);
challengeRoutes.get('/:id', challengeController.getById);

// Admin routes
challengeRoutes.post('/', authenticate, requireAdmin, challengeController.create);
challengeRoutes.put('/:id', authenticate, requireAdmin, challengeController.update);
challengeRoutes.delete('/:id', authenticate, requireAdmin, challengeController.delete);

