/*
  Warnings:

  - You are about to drop the column `discount_type` on the `vouchers` table. All the data in the column will be lost.
  - You are about to drop the column `voucher_code` on the `vouchers` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "vouchers_voucher_code_key";

-- AlterTable
ALTER TABLE "vouchers" DROP COLUMN "discount_type",
DROP COLUMN "voucher_code";

-- DropEnum
DROP TYPE "DiscountType";
