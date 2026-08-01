import { Response } from 'express';
import { z } from 'zod';
import { AuthRequest } from '../middleware/auth';
import { createPaymentOrder, verifyPayment } from '../services/razorpayService';
import {
  listProducts,
  listUserEnrollments,
  listUserPayments,
  userHasEnrollment,
} from '../services/productCatalog';

function mapError(err: unknown): { status: number; message: string } {
  const msg = err instanceof Error ? err.message : 'Unknown error';
  if (msg === 'RAZORPAY_KEYS_MISSING') {
    return { status: 503, message: 'Razorpay is not configured' };
  }
  if (msg === 'PRODUCT_NOT_FOUND') {
    return { status: 404, message: 'Product not found' };
  }
  if (msg === 'ALREADY_ENROLLED') {
    return { status: 409, message: 'Already enrolled in this product' };
  }
  if (msg === 'INVALID_SIGNATURE') {
    return { status: 400, message: 'Payment signature verification failed' };
  }
  if (msg === 'ORDER_NOT_FOUND') {
    return { status: 404, message: 'Payment order not found' };
  }
  return { status: 500, message: msg };
}

const createOrderSchema = z.object({
  productId: z.string().min(1),
});

const verifySchema = z.object({
  razorpay_order_id: z.string().min(1),
  razorpay_payment_id: z.string().min(1),
  razorpay_signature: z.string().min(1),
});

export const paymentController = {
  async listProducts(_req: AuthRequest, res: Response): Promise<void> {
    res.json({ products: listProducts() });
  },

  async createOrder(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user?.userId) {
        res.status(401).json({ error: 'Authentication required' });
        return;
      }
      const body = createOrderSchema.parse(req.body);
      const order = await createPaymentOrder(req.user.userId, body.productId);
      res.status(201).json(order);
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ error: err.errors[0]?.message ?? 'Invalid body' });
        return;
      }
      const mapped = mapError(err);
      res.status(mapped.status).json({ error: mapped.message });
    }
  },

  async verify(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user?.userId) {
        res.status(401).json({ error: 'Authentication required' });
        return;
      }
      const body = verifySchema.parse(req.body);
      const result = await verifyPayment({
        userId: req.user.userId,
        razorpayOrderId: body.razorpay_order_id,
        razorpayPaymentId: body.razorpay_payment_id,
        razorpaySignature: body.razorpay_signature,
      });
      res.json(result);
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ error: err.errors[0]?.message ?? 'Invalid body' });
        return;
      }
      const mapped = mapError(err);
      res.status(mapped.status).json({ error: mapped.message });
    }
  },

  async myEnrollments(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user?.userId) {
        res.status(401).json({ error: 'Authentication required' });
        return;
      }
      const enrollments = await listUserEnrollments(req.user.userId);
      res.json({ enrollments });
    } catch (err) {
      const mapped = mapError(err);
      res.status(mapped.status).json({ error: mapped.message });
    }
  },

  async myPayments(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user?.userId) {
        res.status(401).json({ error: 'Authentication required' });
        return;
      }
      const payments = await listUserPayments(req.user.userId);
      res.json({ payments });
    } catch (err) {
      const mapped = mapError(err);
      res.status(mapped.status).json({ error: mapped.message });
    }
  },

  async checkEnrollment(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user?.userId) {
        res.status(401).json({ error: 'Authentication required' });
        return;
      }
      const productId = req.params.productId;
      const enrolled = await userHasEnrollment(req.user.userId, productId);
      res.json({ enrolled });
    } catch (err) {
      const mapped = mapError(err);
      res.status(mapped.status).json({ error: mapped.message });
    }
  },
};
