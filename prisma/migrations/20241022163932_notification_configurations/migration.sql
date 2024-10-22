-- AlterTable
ALTER TABLE "StudyDay" ADD COLUMN     "lastNotified" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "notification" BOOLEAN NOT NULL DEFAULT true;
