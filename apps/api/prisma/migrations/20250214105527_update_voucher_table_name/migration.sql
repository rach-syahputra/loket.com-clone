/*
  Warnings:

  - You are about to drop the `promotions` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "promotions" DROP CONSTRAINT "promotions_event_id_fkey";

-- DropTable
DROP TABLE "promotions";

-- CreateTable
CREATE TABLE "vouchers" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "event_id" INTEGER NOT NULL,
    "voucher_code" TEXT NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "discount_amount" INTEGER NOT NULL,
    "discount_type" "DiscountType" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "vouchers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "vouchers_voucher_code_key" ON "vouchers"("voucher_code");

-- AddForeignKey
ALTER TABLE "vouchers" ADD CONSTRAINT "vouchers_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;
