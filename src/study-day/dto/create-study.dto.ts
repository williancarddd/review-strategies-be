import { createZodDto } from 'nestjs-zod';
import { StudyDay } from '../entities/study-day.entity';

const CreateStudyDaySchema = StudyDay.omit({ id: true});
export class CreateStudyDayDto extends createZodDto(CreateStudyDaySchema) {}
