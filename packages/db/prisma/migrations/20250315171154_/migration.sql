/*
  Warnings:

  - You are about to drop the column `storeId` on the `Cart` table. All the data in the column will be lost.
  - You are about to drop the column `storeId` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `storeId` on the `Customer` table. All the data in the column will be lost.
  - You are about to drop the column `storeId` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `storeId` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `storeId` on the `Product` table. All the data in the column will be lost.
  - Added the required column `locale` to the `Cart` table without a default value. This is not possible if the table is not empty.
  - Added the required column `locale` to the `Category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `locale` to the `Customer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `locale` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `locale` to the `Payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `locale` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Cart" DROP CONSTRAINT "Cart_storeId_fkey";

-- DropForeignKey
ALTER TABLE "Category" DROP CONSTRAINT "Category_storeId_fkey";

-- DropForeignKey
ALTER TABLE "Customer" DROP CONSTRAINT "Customer_storeId_fkey";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_storeId_fkey";

-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_storeId_fkey";

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_storeId_fkey";

-- DropIndex
DROP INDEX "Cart_storeId_idx";

-- DropIndex
DROP INDEX "Category_storeId_idx";

-- DropIndex
DROP INDEX "Customer_storeId_idx";

-- DropIndex
DROP INDEX "Order_storeId_idx";

-- DropIndex
DROP INDEX "Payment_storeId_idx";

-- DropIndex
DROP INDEX "Product_storeId_idx";

-- AlterTable
ALTER TABLE "Cart" DROP COLUMN "storeId",
ADD COLUMN     "locale" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Category" DROP COLUMN "storeId",
ADD COLUMN     "locale" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Customer" DROP COLUMN "storeId",
ADD COLUMN     "locale" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "storeId",
ADD COLUMN     "locale" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "storeId",
ADD COLUMN     "locale" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "storeId",
ADD COLUMN     "locale" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "Cart_locale_idx" ON "Cart"("locale");

-- CreateIndex
CREATE INDEX "Category_locale_idx" ON "Category"("locale");

-- CreateIndex
CREATE INDEX "Customer_locale_idx" ON "Customer"("locale");

-- CreateIndex
CREATE INDEX "Order_locale_idx" ON "Order"("locale");

-- CreateIndex
CREATE INDEX "Payment_locale_idx" ON "Payment"("locale");

-- CreateIndex
CREATE INDEX "Product_locale_idx" ON "Product"("locale");

-- AddForeignKey
ALTER TABLE "Customer" ADD CONSTRAINT "Customer_locale_fkey" FOREIGN KEY ("locale") REFERENCES "Store"("locale") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_locale_fkey" FOREIGN KEY ("locale") REFERENCES "Store"("locale") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_locale_fkey" FOREIGN KEY ("locale") REFERENCES "Store"("locale") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cart" ADD CONSTRAINT "Cart_locale_fkey" FOREIGN KEY ("locale") REFERENCES "Store"("locale") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_locale_fkey" FOREIGN KEY ("locale") REFERENCES "Store"("locale") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_locale_fkey" FOREIGN KEY ("locale") REFERENCES "Store"("locale") ON DELETE CASCADE ON UPDATE CASCADE;
