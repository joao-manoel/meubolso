/*
  Warnings:

  - Added the required column `transactionType` to the `category` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "category" ADD COLUMN     "transactionType" "TransactionType" NOT NULL;

-- AlterTable
ALTER TABLE "transactions" ALTER COLUMN "type" SET DEFAULT 'INCOME';
