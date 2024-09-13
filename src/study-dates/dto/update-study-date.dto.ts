import { PartialType } from '@nestjs/swagger';
import { CreateStudyDateDto } from './create-study-date.dto';

export class UpdateStudyDateDto extends PartialType(CreateStudyDateDto) {}
