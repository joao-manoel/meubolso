/*
  Warnings:

  - Added the required column `categorysId` to the `transactions` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "RecurrenceType" AS ENUM ('VARIABLE', 'MONTH', 'YEAR');

-- AlterTable
ALTER TABLE "transactions" ADD COLUMN     "categorysId" TEXT NOT NULL,
ADD COLUMN     "recurrence" "RecurrenceType" NOT NULL DEFAULT 'VARIABLE';

-- CreateTable
CREATE TABLE "category" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "slug" TEXT NOT NULL,

    CONSTRAINT "category_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_categorysId_fkey" FOREIGN KEY ("categorysId") REFERENCES "category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
