import { Router } from 'express';
import { companionController } from '../controllers/companionController';

export const companionRoutes = Router();

companionRoutes.post('/chat', (req, res, next) => {
  void companionController.chat(req, res).catch(next);
});
