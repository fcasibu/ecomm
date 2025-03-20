/*
  Warnings:

  - A unique constraint covering the columns `[sku]` on the table `CartItem` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "CartItem_sku_key" ON "CartItem"("sku");
