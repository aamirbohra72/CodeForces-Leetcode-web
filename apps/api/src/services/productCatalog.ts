import { prisma } from '@codeforces/db';

export type ProductCatalogItem = {
  productId: string;
  title: string;
  description: string;
  amountPaise: number;
  currency: string;
};

/** Paid catalog / credits. Amounts are in paise (₹1 = 100). */
export const PRODUCT_CATALOG: Record<string, ProductCatalogItem> = {
  '1': {
    productId: '1',
    title: 'Salaam DSA',
    description: 'Full access to Salaam DSA course',
    amountPaise: 49900,
    currency: 'INR',
  },
  '2': {
    productId: '2',
    title: 'Salaam Node.js',
    description: 'Full access to Salaam Node.js course',
    amountPaise: 49900,
    currency: 'INR',
  },
  '3': {
    productId: '3',
    title: 'Salaam React',
    description: 'Full access to Salaam React course',
    amountPaise: 49900,
    currency: 'INR',
  },
  '5': {
    productId: '5',
    title: 'System Design',
    description: 'Full access to System Design course',
    amountPaise: 69900,
    currency: 'INR',
  },
  'ai-generate': {
    productId: 'ai-generate',
    title: 'AI Course Credit',
    description: 'Unlock AI course generation (1 credit)',
    amountPaise: 19900,
    currency: 'INR',
  },
};

export function getProduct(productId: string): ProductCatalogItem | null {
  return PRODUCT_CATALOG[productId] ?? null;
}

export function listProducts(): ProductCatalogItem[] {
  return Object.values(PRODUCT_CATALOG);
}

export async function userHasEnrollment(userId: string, productId: string): Promise<boolean> {
  const row = await prisma.enrollment.findUnique({
    where: { userId_productId: { userId, productId } },
  });
  return Boolean(row);
}

export async function listUserEnrollments(userId: string) {
  return prisma.enrollment.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
}

export async function listUserPayments(userId: string) {
  return prisma.paymentOrder.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
}
