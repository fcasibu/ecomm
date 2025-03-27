/*
  Warnings:

  - A unique constraint covering the columns `[cartId,sku,size,color,name]` on the table `CartItem` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `CartItem` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "CartItem_cartId_sku_size_color_key";

-- AlterTable
ALTER TABLE "CartItem" ADD COLUMN     "name" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "CartItem_cartId_sku_size_color_name_key" ON "CartItem"("cartId", "sku", "size", "color", "name");
