import { Router } from 'express';
import { careersController } from '../controllers/careersController';

export const careersRoutes = Router();

careersRoutes.get('/hub', careersController.getHub);
careersRoutes.post('/hub/refresh', careersController.refreshHub);
careersRoutes.post('/resume/suggest', careersController.suggestResume);
