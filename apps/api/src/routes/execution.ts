import { Router } from 'express';
import { executionController } from '../controllers/executionController';

export const executionRoutes = Router();

// Public route for code execution
executionRoutes.post('/execute', executionController.execute);

