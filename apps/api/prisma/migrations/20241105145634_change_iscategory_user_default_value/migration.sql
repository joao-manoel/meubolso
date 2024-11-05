/*
  Warnings:

  - You are about to drop the `category` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "category" DROP CONSTRAINT "category_userId_fkey";

-- DropForeignKey
ALTER TABLE "category" DROP CONSTRAINT "category_walletId_fkey";

-- DropForeignKey
ALTER TABLE "transactions" DROP CONSTRAINT "transactions_categoryId_fkey";

-- DropTable
DROP TABLE "category";

-- CreateTable
CREATE TABLE "categorys" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "transaction_type" "TransactionType" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "is_category_user" BOOLEAN NOT NULL DEFAULT false,
    "userId" TEXT,
    "walletId" TEXT,

    CONSTRAINT "categorys_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categorys"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "categorys" ADD CONSTRAINT "categorys_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "categorys" ADD CONSTRAINT "categorys_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "wallets"("id") ON DELETE CASCADE ON UPDATE CASCADE;
