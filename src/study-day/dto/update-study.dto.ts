import { PartialType } from '@nestjs/swagger';
import { CreateStudyDayDto } from './create-study.dto';

export class UpdateStudyDay extends PartialType(CreateStudyDayDto) {}
