-- AlterTable
ALTER TABLE "events" ADD COLUMN     "event_end_time" TEXT NOT NULL DEFAULT '00:00',
ADD COLUMN     "event_start_time" TEXT NOT NULL DEFAULT '00:00';
