/*
  Warnings:

  - You are about to drop the `StudyDate` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `StudyTheme` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "StudyDate" DROP CONSTRAINT "StudyDate_studyThemeId_fkey";

-- DropForeignKey
ALTER TABLE "StudyTheme" DROP CONSTRAINT "StudyTheme_userId_fkey";

-- DropTable
DROP TABLE "StudyDate";

-- DropTable
DROP TABLE "StudyTheme";

-- CreateTable
CREATE TABLE "StudyDay" (
    "id" TEXT NOT NULL,
    "studyThemeId" TEXT NOT NULL,
    "studyStart" TIMESTAMP(3) NOT NULL,
    "studyEnd" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL,
    "mode" TEXT NOT NULL,
    "color" TEXT,
    "description" TEXT,
    "status" "StudyStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StudyDay_pkey" PRIMARY KEY ("id")
);
