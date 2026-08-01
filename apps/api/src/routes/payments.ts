import { Router } from 'express';
import { paymentController } from '../controllers/paymentController';
import { authenticate, optionalAuthenticate } from '../middleware/auth';

export const paymentRoutes = Router();

paymentRoutes.get('/products', optionalAuthenticate, (req, res, next) => {
  void paymentController.listProducts(req, res).catch(next);
});
paymentRoutes.post('/create-order', authenticate, (req, res, next) => {
  void paymentController.createOrder(req, res).catch(next);
});
paymentRoutes.post('/verify', authenticate, (req, res, next) => {
  void paymentController.verify(req, res).catch(next);
});
paymentRoutes.get('/enrollments', authenticate, (req, res, next) => {
  void paymentController.myEnrollments(req, res).catch(next);
});
paymentRoutes.get('/history', authenticate, (req, res, next) => {
  void paymentController.myPayments(req, res).catch(next);
});
paymentRoutes.get('/enrollments/:productId', authenticate, (req, res, next) => {
  void paymentController.checkEnrollment(req, res).catch(next);
});
