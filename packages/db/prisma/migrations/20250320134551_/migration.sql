/*
  Warnings:

  - You are about to drop the column `reserved` on the `ProductVariant` table. All the data in the column will be lost.
  - You are about to drop the column `stock` on the `ProductVariant` table. All the data in the column will be lost.
  - Added the required column `size` to the `CartItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sizes` to the `ProductVariant` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CartItem" ADD COLUMN     "size" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ProductVariant" DROP COLUMN "reserved",
DROP COLUMN "stock",
ADD COLUMN     "sizes" JSONB NOT NULL;
