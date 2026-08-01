import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { taHelpController } from '../controllers/taHelpController';

export const taHelpRoutes = Router();

taHelpRoutes.post('/', authenticate, (req, res, next) => {
  void taHelpController.create(req, res).catch(next);
});
taHelpRoutes.get('/mine', authenticate, (req, res, next) => {
  void taHelpController.mine(req, res).catch(next);
});
taHelpRoutes.get('/queue', authenticate, (req, res, next) => {
  void taHelpController.queue(req, res).catch(next);
});
taHelpRoutes.get('/:id', authenticate, (req, res, next) => {
  void taHelpController.getOne(req, res).catch(next);
});
taHelpRoutes.post('/:id/claim', authenticate, (req, res, next) => {
  void taHelpController.claim(req, res).catch(next);
});
taHelpRoutes.post('/:id/reply', authenticate, (req, res, next) => {
  void taHelpController.reply(req, res).catch(next);
});
taHelpRoutes.post('/:id/status', authenticate, (req, res, next) => {
  void taHelpController.status(req, res).catch(next);
});
taHelpRoutes.post('/:id/feedback', authenticate, (req, res, next) => {
  void taHelpController.feedback(req, res).catch(next);
});
