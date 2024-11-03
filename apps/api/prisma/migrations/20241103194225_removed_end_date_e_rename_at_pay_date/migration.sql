/*
  Warnings:

  - You are about to drop the column `end_date` on the `transactions` table. All the data in the column will be lost.
  - You are about to drop the column `start_date` on the `transactions` table. All the data in the column will be lost.
  - Added the required column `pay_date` to the `transactions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "transactions" DROP COLUMN "end_date",
DROP COLUMN "start_date",
ADD COLUMN     "pay_date" TIMESTAMP(3) NOT NULL;
