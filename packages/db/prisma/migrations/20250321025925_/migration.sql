/*
  Warnings:

  - A unique constraint covering the columns `[cartId,sku,size]` on the table `CartItem` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "CartItem_sku_key";

-- CreateIndex
CREATE UNIQUE INDEX "CartItem_cartId_sku_size_key" ON "CartItem"("cartId", "sku", "size");
