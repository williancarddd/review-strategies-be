-- AlterTable
ALTER TABLE "StudyDay" ADD COLUMN     "firstStudyDayId" TEXT;

-- AddForeignKey
ALTER TABLE "StudyDay" ADD CONSTRAINT "StudyDay_firstStudyDayId_fkey" FOREIGN KEY ("firstStudyDayId") REFERENCES "StudyDay"("id") ON DELETE SET NULL ON UPDATE CASCADE;
