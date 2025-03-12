/*
  Warnings:

  - You are about to drop the `Wishlist` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `WishlistItem` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[customerId]` on the table `Address` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[anonymousId]` on the table `Address` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[customerId]` on the table `Cart` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[anonymousId]` on the table `Cart` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[anonymousId]` on the table `Customer` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,anonymousId]` on the table `Customer` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[customerId]` on the table `Order` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[anonymousId]` on the table `Order` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `paymentMethod` to the `Payment` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PaymentMethodType" AS ENUM ('CARD', 'APPLE_PAY', 'GOOGLE_PAY', 'PAYPAL');

-- DropForeignKey
ALTER TABLE "Address" DROP CONSTRAINT "Address_customerId_fkey";

-- DropForeignKey
ALTER TABLE "Cart" DROP CONSTRAINT "Cart_customerId_fkey";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_customerId_fkey";

-- DropForeignKey
ALTER TABLE "Wishlist" DROP CONSTRAINT "Wishlist_customerId_fkey";

-- DropForeignKey
ALTER TABLE "WishlistItem" DROP CONSTRAINT "WishlistItem_productId_fkey";

-- DropForeignKey
ALTER TABLE "WishlistItem" DROP CONSTRAINT "WishlistItem_wishlistId_fkey";

-- AlterTable
ALTER TABLE "Address" ADD COLUMN     "anonymousId" TEXT,
ALTER COLUMN "customerId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Cart" ADD COLUMN     "anonymousId" TEXT;

-- AlterTable
ALTER TABLE "Customer" ADD COLUMN     "anonymousId" TEXT;

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "anonymousId" TEXT,
ALTER COLUMN "customerId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "paymentMethod" "PaymentMethodType" NOT NULL;

-- DropTable
DROP TABLE "Wishlist";

-- DropTable
DROP TABLE "WishlistItem";

-- CreateIndex
CREATE UNIQUE INDEX "Address_customerId_key" ON "Address"("customerId");

-- CreateIndex
CREATE UNIQUE INDEX "Address_anonymousId_key" ON "Address"("anonymousId");

-- CreateIndex
CREATE UNIQUE INDEX "Cart_customerId_key" ON "Cart"("customerId");

-- CreateIndex
CREATE UNIQUE INDEX "Cart_anonymousId_key" ON "Cart"("anonymousId");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_anonymousId_key" ON "Customer"("anonymousId");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_userId_anonymousId_key" ON "Customer"("userId", "anonymousId");

-- CreateIndex
CREATE UNIQUE INDEX "Order_customerId_key" ON "Order"("customerId");

-- CreateIndex
CREATE UNIQUE INDEX "Order_anonymousId_key" ON "Order"("anonymousId");

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_customerId_anonymousId_fkey" FOREIGN KEY ("customerId", "anonymousId") REFERENCES "Customer"("userId", "anonymousId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cart" ADD CONSTRAINT "Cart_customerId_anonymousId_fkey" FOREIGN KEY ("customerId", "anonymousId") REFERENCES "Customer"("userId", "anonymousId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_customerId_anonymousId_fkey" FOREIGN KEY ("customerId", "anonymousId") REFERENCES "Customer"("userId", "anonymousId") ON DELETE SET NULL ON UPDATE CASCADE;
