import { Router } from 'express';
import { projectsController } from '../controllers/projectsController';

export const projectsRoutes = Router();

projectsRoutes.get('/', (req, res, next) => {
  void projectsController.getHub(req, res).catch(next);
});
projectsRoutes.post('/refresh', (req, res, next) => {
  void projectsController.refresh(req, res).catch(next);
});
