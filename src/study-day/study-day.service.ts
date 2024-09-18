import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { CreateStudyDayDto } from './dto/create-study.dto';
import { UpdateStudyDay } from './dto/update-study.dto';

@Injectable()
export class StudyDayService {
  constructor(private readonly prisma: PrismaService) {}

  // Criar um novo StudyDay
  async create(createStudyDayDto: CreateStudyDayDto) {
    const { studyStart, mode } = createStudyDayDto;
    const studyDaysData: CreateStudyDayDto[] = [];
    let firstStudyDayId: string | null = null;

    // Definir os intervalos com base no modo
    let intervals: number[] = [];

    switch (mode) {
      case '24x7x30':
        intervals = [0, 7, 30]; // Cria três StudyDays com 0, +7, +30 dias
        break;
      case '24x3x7':
        intervals = [0, 3, 7]; // Cria três StudyDays com 0, +3, +7 dias
        break;
      case '24x3x15':
        intervals = [0, 3, 15]; // Cria três StudyDays com 0, +3, +15 dias
        break;
      default:
        throw new BadRequestException('Invalid mode. Valid modes are 24x7x30, 24x3x7, or 24x3x15.');
    }

    // Criação dos StudyDays com referência ao primeiro dia
    for (const interval of intervals) {
      const start = new Date(studyStart);
      start.setDate(start.getDate() + interval);

      const end = new Date(start);
      end.setDate(start.getDate() + 1);

      // Cria o StudyDay com referência ao primeiro StudyDay
      const newStudyDay = await this.prisma.studyDay.create({
        data: {
          ...createStudyDayDto,
          studyStart: start,
          studyEnd: end,
          firstStudyDayId,
          status: 'PENDING',
        },
      });

      // O primeiro dia criado
      if (!firstStudyDayId) {
        firstStudyDayId = newStudyDay.id;
      } else {
        // Atualizar os StudyDays seguintes com a referência ao primeiro
        await this.prisma.studyDay.update({
          where: { id: newStudyDay.id },
          data: { firstStudyDayId },
        });
      }

      studyDaysData.push(newStudyDay);
    }

    return studyDaysData;
  }

  async findAllByMonth(date: Date, userId: string) {
    const start = new Date(date);
    start.setDate(1);

    const end = new Date(start);
    end.setMonth(end.getMonth() + 1);

    return await this.prisma.studyDay.findMany({
      where: {
        userId,
        studyStart: {
          gte: start,
          lt: end,
        },
      },
    });
  }

  async findAllByDay(date: Date, userId: string) {
    const start = new Date(date);
    const end = new Date(start);
    end.setDate(end.getDate() + 1);

    return await this.prisma.studyDay.findMany({
      where: {
        userId,
        studyStart: {
          gte: start,
          lt: end,
        },
      },
    });
  }

  async findOne(id: string) {
    const studyDay = await this.prisma.studyDay.findUnique({
      where: { id },
    });
    if (!studyDay) {
      throw new NotFoundException(`StudyDay with ID ${id} not found`);
    }
    return studyDay;
  }

  async update(id: string, updateStudyDayDto: UpdateStudyDay) {
    const studyDay = await this.prisma.studyDay.findUnique({ where: { id } });
    if (!studyDay) {
      throw new NotFoundException(`StudyDay with ID ${id} not found`);
    }

    return await this.prisma.studyDay.update({
      where: { id },
      data: updateStudyDayDto,
    });
  }

  async remove(id: string) {
    const studyDay = await this.prisma.studyDay.findUnique({ where: { id } });
    if (!studyDay) {
      throw new NotFoundException(`StudyDay with ID ${id} not found`);
    }

    return await this.prisma.studyDay.delete({ where: { id } });
  }
}
