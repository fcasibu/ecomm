/*
  Warnings:

  - You are about to drop the column `password` on the `Address` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Customer` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Address" DROP COLUMN "password";

-- AlterTable
ALTER TABLE "Customer" DROP COLUMN "name",
ADD COLUMN     "birthDate" TEXT,
ADD COLUMN     "firstName" TEXT,
ADD COLUMN     "lastName" TEXT,
ADD COLUMN     "middleName" TEXT,
ADD COLUMN     "password" TEXT,
ALTER COLUMN "userId" DROP NOT NULL;
