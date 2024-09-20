import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  NotFoundException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { StudyDayService } from './study-day.service';
import { CreateStudyDayDto } from './dto/create-study.dto';
import { UpdateStudyDay } from './dto/update-study.dto';

@ApiTags('study-days')
@ApiBearerAuth('JWT-auth')
@Controller('study-days')
export class StudyDaysController {
  constructor(private readonly studyDayService: StudyDayService) {}

  @ApiOperation({ summary: 'Create multiple StudyDays based on the mode' })
  @ApiResponse({ status: 201, description: 'StudyDays created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid data' })
  @Post()
  async create(@Body() createStudyDayDto: CreateStudyDayDto) {
    return await this.studyDayService.create(createStudyDayDto);
  }

  @ApiOperation({ summary: 'Get all StudyDays by user for a given month' })
  @ApiQuery({ name: 'date', required: true, type: String, description: 'Date in the format YYYY-MM-DD' })
  @ApiQuery({ name: 'userId', required: true, type: String })
  @ApiResponse({ status: 200, description: 'StudyDays for the specified month' })
  @Get('month')
  async findAllByMonth(
    @Query('date') date: Date,
    @Query('userId') userId: string,
  ) {
    if (!userId) throw new NotFoundException('User ID is required');
    return this.studyDayService.findAllByMonth(date, userId);
  }

  @ApiOperation({ summary: 'Get all StudyDays by user for a given day' })
  @ApiQuery({ name: 'date', required: true, type: String, description: 'Date in the format YYYY-MM-DD' })
  @ApiQuery({ name: 'userId', required: true, type: String })
  @ApiResponse({ status: 200, description: 'StudyDays for the specified day' })
  @Get('day')
  async findAllByDay(
    @Query('date') date: Date,
    @Query('userId') userId: string,
  ) {
    if (!userId) throw new NotFoundException('User ID is required');
    return this.studyDayService.findAllByDay(date, userId);
  }

  @ApiOperation({ summary: 'Get a StudyDay by ID' })
  @ApiResponse({ status: 200, description: 'StudyDay found' })
  @ApiResponse({ status: 404, description: 'StudyDay not found' })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const studyDay = await this.studyDayService.findOne(id);
    return studyDay;
  }

  @ApiOperation({ summary: 'Update a StudyDay by ID' })
  @ApiResponse({ status: 200, description: 'StudyDay updated successfully' })
  @ApiResponse({ status: 404, description: 'StudyDay not found' })
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateStudyDayDto: UpdateStudyDay) {
    try {
      return await this.studyDayService.update(id, updateStudyDayDto);
    } catch (error) {
      throw new NotFoundException(`StudyDay with ID ${id} not found`);
    }
  }

  @ApiOperation({ summary: 'Delete a StudyDay by ID' })
  @ApiResponse({ status: 200, description: 'StudyDay deleted successfully' })
  @ApiResponse({ status: 404, description: 'StudyDay not found' })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.studyDayService.remove(id);
  }
}
