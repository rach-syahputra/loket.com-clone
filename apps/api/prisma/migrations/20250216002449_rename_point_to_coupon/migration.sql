/*
  Warnings:

  - You are about to drop the `points` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "CouponStatus" AS ENUM ('ACTIVE', 'USED', 'EXPIRED');

-- DropForeignKey
ALTER TABLE "points" DROP CONSTRAINT "points_user_id_fkey";

-- DropTable
DROP TABLE "points";

-- DropEnum
DROP TYPE "PointStatus";

-- CreateTable
CREATE TABLE "coupons" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "discount_amount" INTEGER NOT NULL,
    "expiry_date" TIMESTAMP(3) NOT NULL,
    "status" "CouponStatus" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "coupons_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "coupons" ADD CONSTRAINT "coupons_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
