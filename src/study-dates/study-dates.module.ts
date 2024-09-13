import { Module } from '@nestjs/common';
import { StudyDatesService } from './study-dates.service';
import { StudyDatesController } from './study-dates.controller';

@Module({
  controllers: [StudyDatesController],
  providers: [StudyDatesService],
})
export class StudyDatesModule {}
