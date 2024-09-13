import { Module } from '@nestjs/common';
import { StudyThemesService } from './study-themes.service';
import { StudyThemesController } from './study-themes.controller';

@Module({
  controllers: [StudyThemesController],
  providers: [StudyThemesService],
})
export class StudyThemesModule {}
