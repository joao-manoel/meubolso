/*
  Warnings:

  - You are about to drop the column `transactionType` on the `category` table. All the data in the column will be lost.
  - Added the required column `transaction_type` to the `category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `category` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "category" DROP COLUMN "transactionType",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "is_category_user" BOOLEAN,
ADD COLUMN     "transaction_type" "TransactionType" NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "userId" TEXT,
ADD COLUMN     "walletId" TEXT;

-- AddForeignKey
ALTER TABLE "category" ADD CONSTRAINT "category_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "category" ADD CONSTRAINT "category_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "wallets"("id") ON DELETE CASCADE ON UPDATE CASCADE;
