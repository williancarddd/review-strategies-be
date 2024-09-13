import { Controller, Get, Post, Body, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { StudyThemesService } from './study-themes.service';
import { CreateStudyThemeDto } from './dto/create-study-theme.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@ApiTags('study-themes')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('study-themes')
export class StudyThemesController {
  constructor(private readonly studyThemesService: StudyThemesService) {}

  @ApiOperation({ summary: 'Create a new study theme' })
  @ApiResponse({ status: 201, description: 'The study theme has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  @Post()
  create(@Body() createStudyThemeDto: CreateStudyThemeDto) {
    return this.studyThemesService.create(createStudyThemeDto);
  }

  @ApiOperation({ summary: 'Get all study themes and their days for a user in a given month' })
  @ApiResponse({ status: 200, description: 'Returns the list of study themes and their days.' })
  @ApiResponse({ status: 404, description: 'No study themes found for the given user.' })
  @Get('user/:userId')
  findAllByUserAndMonth(
    @Param('userId') userId: string,
    @Query('date') date: string, // Recebe uma string que será convertida para Date
  ) {
    const parsedDate = new Date(date); // Converte string para Date
    return this.studyThemesService.findAllByUserAndMonth(userId, parsedDate);
  }

  @ApiOperation({ summary: 'Delete a study theme by ID' })
  @ApiResponse({ status: 200, description: 'The study theme has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Study theme not found.' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.studyThemesService.remove(id);
  }
}
