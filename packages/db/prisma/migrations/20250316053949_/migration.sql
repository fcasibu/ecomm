-- CreateEnum
CREATE TYPE "DeliveryPromiseShippingMethod" AS ENUM ('STANDARD', 'EXPRESS', 'NEXT_DAY');

-- CreateTable
CREATE TABLE "DeliveryPromise" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,
    "estimatedMinDays" INTEGER NOT NULL,
    "estimatedMaxDays" INTEGER NOT NULL,
    "shippingMethod" "DeliveryPromiseShippingMethod" NOT NULL DEFAULT 'STANDARD',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DeliveryPromise_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "DeliveryPromise" ADD CONSTRAINT "DeliveryPromise_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
