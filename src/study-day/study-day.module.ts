import { Module } from '@nestjs/common';
import { StudyDaysController } from './study-day.controller';
import { StudyDayService } from './study-day.service';

@Module({
  controllers: [StudyDaysController],
  providers: [StudyDayService],
})
export class StudyThemesModule {}
