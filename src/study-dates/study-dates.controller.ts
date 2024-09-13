import { Controller, Get, Post, Body, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { StudyDatesService } from './study-dates.service';
import { CreateStudyDateDto } from './dto/create-study-date.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@ApiTags('study-dates')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('study-dates')
export class StudyDatesController {
  constructor(private readonly studyDatesService: StudyDatesService) {}

  @ApiOperation({ summary: 'Create a new study date' })
  @ApiResponse({ status: 201, description: 'The study date has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  @Post()
  create(@Body() createStudyDateDto: CreateStudyDateDto) {
    return this.studyDatesService.create(createStudyDateDto);
  }

  @ApiOperation({ summary: 'Get all study dates by study theme ID' })
  @ApiResponse({ status: 200, description: 'Returns the list of study dates for the theme.' })
  @ApiResponse({ status: 404, description: 'Study theme not found.' })
  @Get('theme/:studyThemeId')
  findAllByStudyTheme(@Param('studyThemeId') studyThemeId: string) {
    return this.studyDatesService.findAllByStudyTheme(studyThemeId);
  }

  @ApiOperation({ summary: 'Get a study date by ID' })
  @ApiResponse({ status: 200, description: 'Returns the study date by ID.' })
  @ApiResponse({ status: 404, description: 'Study date not found.' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.studyDatesService.findOne(id);
  }

  @ApiOperation({ summary: 'Delete a study date by ID' })
  @ApiResponse({ status: 200, description: 'The study date has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Study date not found.' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.studyDatesService.remove(id);
  }
}
