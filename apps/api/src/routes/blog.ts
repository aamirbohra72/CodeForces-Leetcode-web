import { Router } from 'express';
import { blogController } from '../controllers/blogController';

export const blogRoutes = Router();

blogRoutes.get('/', (req, res, next) => {
  void blogController.getHub(req, res).catch(next);
});
blogRoutes.post('/refresh', (req, res, next) => {
  void blogController.refresh(req, res).catch(next);
});
blogRoutes.get('/:id', (req, res, next) => {
  void blogController.getPost(req, res).catch(next);
});
