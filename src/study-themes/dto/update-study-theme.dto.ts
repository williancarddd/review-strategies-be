import { PartialType } from '@nestjs/swagger';
import { CreateStudyThemeDto } from './create-study-theme.dto';

export class UpdateStudyThemeDto extends PartialType(CreateStudyThemeDto) {}
