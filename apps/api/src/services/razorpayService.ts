import Razorpay from 'razorpay';
import crypto from 'node:crypto';
import { prisma } from '@codeforces/db';
import {
  enrollmentIdsForProduct,
  getProduct,
  userHasEnrollment,
  userOwnsAllGrants,
} from './productCatalog';

function getRazorpay() {
  const key_id = process.env.RAZORPAY_KEY_ID?.trim();
  const key_secret = process.env.RAZORPAY_KEY_SECRET?.trim();
  if (!key_id || !key_secret) {
    throw new Error('RAZORPAY_KEYS_MISSING');
  }
  return new Razorpay({ key_id, key_secret });
}

export async function createPaymentOrder(userId: string, productId: string) {
  const product = getProduct(productId);
  if (!product) {
    throw new Error('PRODUCT_NOT_FOUND');
  }

  if (await userHasEnrollment(userId, productId)) {
    throw new Error('ALREADY_ENROLLED');
  }

  if (product.kind === 'bundle' && product.grantsProductIds?.length) {
    if (await userOwnsAllGrants(userId, product.grantsProductIds)) {
      throw new Error('ALREADY_ENROLLED');
    }
  }

  const razorpay = getRazorpay();
  const receipt = `rcpt_${Date.now().toString(36)}`;
  const order = await razorpay.orders.create({
    amount: product.amountPaise,
    currency: product.currency,
    receipt,
    notes: {
      productId: product.productId,
      userId,
      kind: product.kind,
    },
  });

  const payment = await prisma.paymentOrder.create({
    data: {
      userId,
      productId: product.productId,
      productTitle: product.title,
      amountPaise: product.amountPaise,
      currency: product.currency,
      status: 'CREATED',
      razorpayOrderId: order.id,
      updatedAt: new Date(),
    },
  });

  return {
    orderId: order.id,
    amount: product.amountPaise,
    currency: product.currency,
    productId: product.productId,
    productTitle: product.title,
    keyId: process.env.RAZORPAY_KEY_ID!,
    paymentDbId: payment.id,
    grantsProductIds: product.grantsProductIds ?? [],
  };
}

export async function verifyPayment(input: {
  userId: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}) {
  const secret = process.env.RAZORPAY_KEY_SECRET?.trim();
  if (!secret) {
    throw new Error('RAZORPAY_KEYS_MISSING');
  }

  const payload = `${input.razorpayOrderId}|${input.razorpayPaymentId}`;
  const expected = crypto.createHmac('sha256', secret).update(payload).digest('hex');
  if (expected !== input.razorpaySignature) {
    throw new Error('INVALID_SIGNATURE');
  }

  const payment = await prisma.paymentOrder.findUnique({
    where: { razorpayOrderId: input.razorpayOrderId },
  });
  if (!payment || payment.userId !== input.userId) {
    throw new Error('ORDER_NOT_FOUND');
  }

  const product = getProduct(payment.productId);
  const enrollIds = product
    ? enrollmentIdsForProduct(product)
    : [payment.productId];

  if (payment.status === 'PAID') {
    return {
      ok: true,
      alreadyPaid: true,
      productId: payment.productId,
      productIds: enrollIds,
    };
  }

  await prisma.$transaction([
    prisma.paymentOrder.update({
      where: { id: payment.id },
      data: {
        status: 'PAID',
        razorpayPaymentId: input.razorpayPaymentId,
        razorpaySignature: input.razorpaySignature,
      },
    }),
    ...enrollIds.map((id) =>
      prisma.enrollment.upsert({
        where: {
          userId_productId: { userId: input.userId, productId: id },
        },
        create: {
          userId: input.userId,
          productId: id,
          orderId: payment.id,
        },
        update: {},
      }),
    ),
  ]);

  return {
    ok: true,
    alreadyPaid: false,
    productId: payment.productId,
    productIds: enrollIds,
  };
}
