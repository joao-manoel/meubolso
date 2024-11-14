/*
  Warnings:

  - You are about to drop the column `icon` on the `Card` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "BrandCardType" AS ENUM ('CARTEIRA', 'NUBANK', 'BB', 'ITAU', 'SICREDI', 'BRADESCO', 'SANTANDER', 'CAIXA', 'INTER', 'C6BANK', 'NEXT', 'NEON', 'PAN', 'PICPAY', 'INFINITYPAY', 'ITI', 'MERCADOPAGO', 'PAGSEGURO');

-- AlterTable
ALTER TABLE "Card" DROP COLUMN "icon",
ADD COLUMN     "brand" "BrandCardType" NOT NULL DEFAULT 'CARTEIRA';

-- DropEnum
DROP TYPE "IconCardType";
