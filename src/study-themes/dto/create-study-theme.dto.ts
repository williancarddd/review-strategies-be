import { createZodDto } from 'nestjs-zod';
import { CreateStudyThemeSchema } from '../entities/study-theme.entity';

export class CreateStudyThemeDto extends createZodDto(CreateStudyThemeSchema) {}
