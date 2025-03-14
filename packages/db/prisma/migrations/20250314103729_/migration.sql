/*
  Warnings:

  - You are about to drop the column `image` on the `ProductVariant` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ProductVariant" DROP COLUMN "image",
ADD COLUMN     "images" TEXT[],
ADD COLUMN     "reserved" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "stock" SET DEFAULT 0;
