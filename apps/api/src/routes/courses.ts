import { Router } from 'express';
import multer from 'multer';
import { courseController } from '../controllers/courseController';
import { authenticate, optionalAuthenticate } from '../middleware/auth';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
});

export const courseRoutes = Router();

courseRoutes.get('/llm-enabled', courseController.listLlmCourses);
const GENERATE_TIMEOUT_MS = 10 * 60 * 1000; // 10 minutes — LLM course generation is slow

courseRoutes.post('/generate', authenticate, (req, res, next) => {
  req.setTimeout(GENERATE_TIMEOUT_MS);
  res.setTimeout(GENERATE_TIMEOUT_MS);
  void courseController.generate(req, res).catch(next);
});
courseRoutes.post('/extract-pdf', authenticate, upload.single('file'), (req, res, next) => {
  void courseController.extractPdf(req, res).catch(next);
});
courseRoutes.get('/:id', optionalAuthenticate, (req, res, next) => {
  void courseController.getById(req, res).catch(next);
});
courseRoutes.get('/:courseId/pack', courseController.getPack);
courseRoutes.post('/:courseId/pack/refresh', courseController.refreshPack);
courseRoutes.get('/:courseId/tutorials/:tutorialId', courseController.getTutorial);
