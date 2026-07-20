import { Router } from 'express';
import { contestController } from '../controllers/contestController';
import { authenticate, optionalAuthenticate, requireAdmin } from '../middleware/auth';

export const contestRoutes = Router();

// Public (optional auth enriches isRegistered)
contestRoutes.get('/', optionalAuthenticate, contestController.getAll);
contestRoutes.get('/:id', optionalAuthenticate, contestController.getById);
contestRoutes.get('/:id/challenges', contestController.getChallenges);

// Registration (auth required)
contestRoutes.get('/:id/me', authenticate, contestController.getMe);
contestRoutes.post('/:id/register', authenticate, contestController.register);
contestRoutes.delete('/:id/register', authenticate, contestController.unregister);

// Admin
contestRoutes.post('/', authenticate, requireAdmin, contestController.create);
contestRoutes.put('/:id', authenticate, requireAdmin, contestController.update);
contestRoutes.delete('/:id', authenticate, requireAdmin, contestController.delete);
