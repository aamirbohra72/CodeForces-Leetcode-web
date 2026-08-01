-- AlterTable
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "clerkUserId" TEXT;

-- CreateEnum
DO $$ BEGIN
  CREATE TYPE "PaymentStatus" AS ENUM ('CREATED', 'PAID', 'FAILED');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "User_clerkUserId_key" ON "User"("clerkUserId");
CREATE INDEX IF NOT EXISTS "User_clerkUserId_idx" ON "User"("clerkUserId");

-- CreateTable
CREATE TABLE IF NOT EXISTS "PaymentOrder" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "productTitle" TEXT NOT NULL,
    "amountPaise" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "status" "PaymentStatus" NOT NULL DEFAULT 'CREATED',
    "razorpayOrderId" TEXT NOT NULL,
    "razorpayPaymentId" TEXT,
    "razorpaySignature" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "PaymentOrder_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "PaymentOrder_razorpayOrderId_key" ON "PaymentOrder"("razorpayOrderId");
CREATE INDEX IF NOT EXISTS "PaymentOrder_userId_idx" ON "PaymentOrder"("userId");
CREATE INDEX IF NOT EXISTS "PaymentOrder_productId_idx" ON "PaymentOrder"("productId");
CREATE INDEX IF NOT EXISTS "PaymentOrder_status_idx" ON "PaymentOrder"("status");

DO $$ BEGIN
  ALTER TABLE "PaymentOrder" ADD CONSTRAINT "PaymentOrder_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- CreateTable
CREATE TABLE IF NOT EXISTS "Enrollment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "orderId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Enrollment_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "Enrollment_userId_productId_key" ON "Enrollment"("userId", "productId");
CREATE INDEX IF NOT EXISTS "Enrollment_userId_idx" ON "Enrollment"("userId");
CREATE INDEX IF NOT EXISTS "Enrollment_productId_idx" ON "Enrollment"("productId");

DO $$ BEGIN
  ALTER TABLE "Enrollment" ADD CONSTRAINT "Enrollment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
