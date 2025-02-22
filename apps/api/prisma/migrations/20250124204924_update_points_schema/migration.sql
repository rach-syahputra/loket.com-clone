/*
  Warnings:

  - You are about to drop the column `referred_id` on the `points` table. All the data in the column will be lost.
  - You are about to drop the column `referrer_id` on the `points` table. All the data in the column will be lost.
  - Added the required column `user_id` to the `points` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "points" DROP CONSTRAINT "points_referred_id_fkey";

-- DropForeignKey
ALTER TABLE "points" DROP CONSTRAINT "points_referrer_id_fkey";

-- AlterTable
ALTER TABLE "points" DROP COLUMN "referred_id",
DROP COLUMN "referrer_id",
ADD COLUMN     "user_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "points" ADD CONSTRAINT "points_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
