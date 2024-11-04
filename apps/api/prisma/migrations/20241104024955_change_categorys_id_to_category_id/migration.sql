/*
  Warnings:

  - You are about to drop the column `categorysId` on the `transactions` table. All the data in the column will be lost.
  - Added the required column `categoryId` to the `transactions` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "transactions" DROP CONSTRAINT "transactions_categorysId_fkey";

-- AlterTable
ALTER TABLE "transactions" DROP COLUMN "categorysId",
ADD COLUMN     "categoryId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
