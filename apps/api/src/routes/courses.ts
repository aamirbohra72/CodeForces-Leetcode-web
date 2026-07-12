import { Router } from 'express';
import { courseController } from '../controllers/courseController';

export const courseRoutes = Router();

courseRoutes.get('/llm-enabled', courseController.listLlmCourses);
courseRoutes.get('/:courseId/pack', courseController.getPack);
courseRoutes.post('/:courseId/pack/refresh', courseController.refreshPack);
courseRoutes.get('/:courseId/tutorials/:tutorialId', courseController.getTutorial);
