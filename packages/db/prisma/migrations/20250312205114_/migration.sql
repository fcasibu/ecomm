/*
  Warnings:

  - A unique constraint covering the columns `[id,userId,anonymousId]` on the table `Customer` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Address" DROP CONSTRAINT "Address_customerId_anonymousId_fkey";

-- DropForeignKey
ALTER TABLE "Cart" DROP CONSTRAINT "Cart_customerId_anonymousId_fkey";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_customerId_anonymousId_fkey";

-- DropIndex
DROP INDEX "Customer_userId_anonymousId_key";

-- AlterTable
ALTER TABLE "Address" ADD COLUMN     "userId" TEXT;

-- AlterTable
ALTER TABLE "Cart" ADD COLUMN     "userId" TEXT;

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "userId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Customer_id_userId_anonymousId_key" ON "Customer"("id", "userId", "anonymousId");

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_customerId_anonymousId_userId_fkey" FOREIGN KEY ("customerId", "anonymousId", "userId") REFERENCES "Customer"("id", "anonymousId", "userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cart" ADD CONSTRAINT "Cart_customerId_anonymousId_userId_fkey" FOREIGN KEY ("customerId", "anonymousId", "userId") REFERENCES "Customer"("id", "anonymousId", "userId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_customerId_anonymousId_userId_fkey" FOREIGN KEY ("customerId", "anonymousId", "userId") REFERENCES "Customer"("id", "anonymousId", "userId") ON DELETE SET NULL ON UPDATE CASCADE;
