'use client';

import { api } from '@/lib/api';
import { getToken } from '@/lib/auth';
import { markLocalEnrollment } from '@/lib/enrollment';

export type CreateOrderResponse = {
  orderId: string;
  amount: number;
  currency: string;
  productId: string;
  productTitle: string;
  keyId: string;
  paymentDbId: string;
};

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void };
  }
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve(false);
      return;
    }
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export async function startRazorpayCheckout(productId: string): Promise<{ productId: string }> {
  if (!getToken()) {
    throw new Error('Please sign in before paying');
  }

  const order = await api.post<CreateOrderResponse>('/payments/create-order', { productId });
  const ok = await loadRazorpayScript();
  if (!ok || !window.Razorpay) {
    throw new Error('Failed to load Razorpay checkout');
  }

  return new Promise((resolve, reject) => {
    const rzp = new window.Razorpay!({
      key: order.keyId || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: 'Codeforces Platform',
      description: order.productTitle,
      order_id: order.orderId,
      handler: async (response: {
        razorpay_order_id: string;
        razorpay_payment_id: string;
        razorpay_signature: string;
      }) => {
        try {
          await api.post('/payments/verify', {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });
          markLocalEnrollment(order.productId);
          resolve({ productId: order.productId });
        } catch (err) {
          reject(err instanceof Error ? err : new Error('Payment verification failed'));
        }
      },
      modal: {
        ondismiss: () => reject(new Error('Payment cancelled')),
      },
      theme: { color: '#22c55e' },
    });
    rzp.open();
  });
}
