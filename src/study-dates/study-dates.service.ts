import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { CreateStudyDateDto } from './dto/create-study-date.dto';

@Injectable()
export class StudyDatesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createStudyDateDto: CreateStudyDateDto) {
    const studyDate = await this.prisma.studyDate.create({
      data: createStudyDateDto,
    });
    return studyDate;
  }

  // Busca todas as datas associadas a um tema
  async findAllByStudyTheme(studyThemeId: string) {
    return this.prisma.studyDate.findMany({
      where: { studyThemeId },
    });
  }

  async findOne(id: string) {
    const studyDate = await this.prisma.studyDate.findUnique({ where: { id } });
    if (!studyDate) {
      throw new NotFoundException('Study date not found');
    }
    return studyDate;
  }

  // Atualiza o status de uma data de estudo (marcar como COMPLETED ou SKIPPED)
  async updateStatus(id: string, status: 'COMPLETED' | 'SKIPPED') {
    const studyDate = await this.prisma.studyDate.update({
      where: { id },
      data: { status },
    });
    return studyDate;
  }

  // Exclui uma data de estudo por ID
  async remove(id: string) {
    return this.prisma.studyDate.delete({ where: { id } });
  }

  // Verifica se há revisões pendentes que passaram da data de revisão e as marca como SKIPPED
  async checkAndUpdatePendingReviews() {
    const currentDate = new Date();
    
    const pendingReviews = await this.prisma.studyDate.findMany({
      where: {
        status: 'PENDING',
        studyDate: {
          lt: currentDate, // Data de estudo menor que a data atual
        },
      },
    });

    // Atualiza o status para SKIPPED para todas as revisões atrasadas
    await Promise.all(pendingReviews.map(async (review) => {
      await this.prisma.studyDate.update({
        where: { id: review.id },
        data: { status: 'SKIPPED' },
      });
    }));

    return pendingReviews;
  }
}
