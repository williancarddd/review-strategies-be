import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { CreateStudyThemeDto } from './dto/create-study-theme.dto';
import { CreateStudyDateDto } from '../study-dates/dto/create-study-date.dto';
import { addDays, startOfMonth, endOfMonth } from 'date-fns'; // Biblioteca para manipulação de datas

@Injectable()
export class StudyThemesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createStudyThemeDto: CreateStudyThemeDto) {
    const studyTheme = await this.prisma.studyTheme.create({
      data: createStudyThemeDto,
    });

    // Regras para criar datas de estudo baseadas no modo
    let dates: CreateStudyDateDto[] = [];
    const { startDate, mode } = createStudyThemeDto;

    if (mode === '24x7x30') {
      dates = [
        { studyThemeId: studyTheme.id, studyDate: addDays(startDate, 7), status: 'PENDING' },
        { studyThemeId: studyTheme.id, studyDate: addDays(startDate, 30), status: 'PENDING' },
      ];
    } else if (mode === '24x3x7') {
      dates = [
        { studyThemeId: studyTheme.id, studyDate: addDays(startDate, 3), status: 'PENDING' },
        { studyThemeId: studyTheme.id, studyDate: addDays(startDate, 7), status: 'PENDING' },
      ];
    } else if (mode === '24x3x15') {
      dates = [
        { studyThemeId: studyTheme.id, studyDate: addDays(startDate, 3), status: 'PENDING' },
        { studyThemeId: studyTheme.id, studyDate: addDays(startDate, 15), status: 'PENDING' },
      ];
    }

    // Criar as datas de estudo
    await this.prisma.studyDate.createMany({
      data: dates,
    });

    return studyTheme;
  }

  // Função modificada para receber um tipo Date
  async findAllByUserAndMonth(userId: string, date: Date) {
    const startDate = startOfMonth(date);
    const endDate = endOfMonth(date);

    const studyThemes = await this.prisma.studyTheme.findMany({
      where: { userId },
      include: {
        studyDates: {
          where: {
            studyDate: {
              gte: startDate,
              lte: endDate,
            },
          },
        },
      },
    });

    return studyThemes.map((theme) => ({
      theme,
      themedays: theme.studyDates,
    }));
  }

  async findOne(id: string) {
    const studyTheme = await this.prisma.studyTheme.findUnique({ where: { id } });
    if (!studyTheme) {
      throw new NotFoundException('Study theme not found');
    }
    return studyTheme;
  }

  async remove(id: string) {
    // Deleta as datas de estudo relacionadas ao tema
    await this.prisma.studyDate.deleteMany({
      where: { studyThemeId: id },
    });

    // Deleta o tema
    return this.prisma.studyTheme.delete({ where: { id } });
  }
}
