/*
  Warnings:

  - Added the required column `updated_at` to the `transactions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "transactions" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "installment" (
    "id" TEXT NOT NULL,
    "value" INTEGER NOT NULL,
    "status" "TransactionStatusType" NOT NULL,
    "pay_date" TIMESTAMP(3),
    "paid_at" TIMESTAMP(3),
    "transactionId" TEXT NOT NULL,

    CONSTRAINT "installment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "installment" ADD CONSTRAINT "installment_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "transactions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
