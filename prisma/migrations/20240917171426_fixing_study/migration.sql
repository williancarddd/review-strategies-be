/*
  Warnings:

  - You are about to drop the column `studyDate` on the `StudyDate` table. All the data in the column will be lost.
  - Added the required column `studyEnd` to the `StudyDate` table without a default value. This is not possible if the table is not empty.
  - Added the required column `studyStart` to the `StudyDate` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "StudyDate" DROP COLUMN "studyDate",
ADD COLUMN     "studyEnd" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "studyStart" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "StudyTheme" ADD COLUMN     "description" TEXT;
