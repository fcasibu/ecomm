-- AlterTable
ALTER TABLE "CartItemDeliveryPromise" ALTER COLUMN "shippingMethod" SET DEFAULT 'STANDARD',
ALTER COLUMN "requiresShippingFee" DROP NOT NULL,
ALTER COLUMN "requiresShippingFee" SET DEFAULT false;
