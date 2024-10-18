-- AlterTable
ALTER TABLE "User" ADD COLUMN     "expiresCodePasswordAt" TIMESTAMP(3),
ADD COLUMN     "recoveryPasswordCode" TEXT;
