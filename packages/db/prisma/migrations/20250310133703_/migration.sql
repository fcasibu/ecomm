/*
  Warnings:

  - The `birthDate` column on the `Customer` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Customer" DROP COLUMN "birthDate",
ADD COLUMN     "birthDate" TIMESTAMP(3);
