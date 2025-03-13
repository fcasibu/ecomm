/*
  Warnings:

  - Added the required column `billingAddressId` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shippingAddressId` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Address_anonymousId_key";

-- DropIndex
DROP INDEX "Address_customerId_key";

-- DropIndex
DROP INDEX "Cart_anonymousId_key";

-- DropIndex
DROP INDEX "Cart_customerId_key";

-- DropIndex
DROP INDEX "Order_anonymousId_key";

-- DropIndex
DROP INDEX "Order_customerId_key";

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "billingAddressId" TEXT NOT NULL,
ADD COLUMN     "shippingAddressId" TEXT NOT NULL;
