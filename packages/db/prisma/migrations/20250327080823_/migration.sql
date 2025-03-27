/*
  Warnings:

  - You are about to drop the column `totalAmount` on the `Cart` table. All the data in the column will be lost.
  - You are about to drop the column `productId` on the `CartItem` table. All the data in the column will be lost.
  - You are about to drop the column `totalAmount` on the `Order` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[cartId,sku,size,color]` on the table `CartItem` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `color` to the `CartItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `image` to the `CartItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `CartItem` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "CartItem" DROP CONSTRAINT "CartItem_productId_fkey";

-- DropIndex
DROP INDEX "CartItem_cartId_sku_size_key";

-- AlterTable
ALTER TABLE "Cart" DROP COLUMN "totalAmount";

-- AlterTable
ALTER TABLE "CartItem" DROP COLUMN "productId",
ADD COLUMN     "color" TEXT NOT NULL,
ADD COLUMN     "image" TEXT NOT NULL,
ADD COLUMN     "price" DECIMAL(65,30) NOT NULL;

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "totalAmount";

-- CreateTable
CREATE TABLE "CartItemDeliveryPromise" (
    "id" TEXT NOT NULL,
    "cartItemId" TEXT NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,
    "estimatedMinDays" INTEGER NOT NULL,
    "estimatedMaxDays" INTEGER NOT NULL,
    "shippingMethod" "DeliveryPromiseShippingMethod" NOT NULL,
    "requiresShippingFee" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CartItemDeliveryPromise_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CartItem_cartId_sku_size_color_key" ON "CartItem"("cartId", "sku", "size", "color");

-- AddForeignKey
ALTER TABLE "CartItemDeliveryPromise" ADD CONSTRAINT "CartItemDeliveryPromise_cartItemId_fkey" FOREIGN KEY ("cartItemId") REFERENCES "CartItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
