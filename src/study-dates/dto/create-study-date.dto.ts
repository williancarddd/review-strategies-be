import { createZodDto } from 'nestjs-zod';
import { CreateStudyDateSchema } from '../entities/study-date.entity';

export class CreateStudyDateDto extends createZodDto(CreateStudyDateSchema) {}
