/*
  Warnings:

  - You are about to drop the column `value` on the `installment` table. All the data in the column will be lost.
  - Added the required column `installment` to the `installment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "installment" DROP COLUMN "value",
ADD COLUMN     "installment" INTEGER NOT NULL;
