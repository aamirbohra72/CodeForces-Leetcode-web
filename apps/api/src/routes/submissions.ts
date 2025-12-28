import { Router } from 'express';
import { submissionController } from '../controllers/submissionController';
import { authenticate, requireAdmin } from '../middleware/auth';

export const submissionRoutes = Router();

// All submission routes require authentication
submissionRoutes.use(authenticate);

submissionRoutes.get('/', submissionController.getAll);
submissionRoutes.get('/:id', submissionController.getById);
submissionRoutes.post('/', submissionController.create);

// Admin route
submissionRoutes.get('/admin/all', requireAdmin, submissionController.getAllAdmin);


