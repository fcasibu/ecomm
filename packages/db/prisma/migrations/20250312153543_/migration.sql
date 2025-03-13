/*
  Warnings:

  - You are about to drop the column `productId` on the `OrderItem` table. All the data in the column will be lost.
  - Added the required column `currencyCode` to the `OrderItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `image` to the `OrderItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `OrderItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sku` to the `OrderItem` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "OrderItem" DROP CONSTRAINT "OrderItem_orderId_fkey";

-- DropForeignKey
ALTER TABLE "OrderItem" DROP CONSTRAINT "OrderItem_productId_fkey";

-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "status" SET DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "OrderItem" DROP COLUMN "productId",
ADD COLUMN     "currencyCode" TEXT NOT NULL,
ADD COLUMN     "image" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "sku" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;
