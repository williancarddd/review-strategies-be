import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { MailService } from './mail.service';
import { NotificationType } from '@prisma/client';
import { NotificationService } from './notifications.service';

@Injectable()
export class StudyNotificationService {
  private readonly logger = new Logger(StudyNotificationService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
    private readonly notificationService: NotificationService,
  ) { }

  // Função que roda a cada 5 minutos
  @Cron(CronExpression.EVERY_5_MINUTES)
  async handleStudyNotifications() {
    const now = new Date();
    const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000); // Agora + 1 hora

    // Buscar todos os StudyDays que ainda não foram notificados e o estudo começa em menos de 1 hora
    const studyDays = await this.prisma.studyDay.findMany({
      where: {
        studyStart: {
          gte: now,
          lte: oneHourLater,
        },
        lastNotified: null,
        user: {
          notification: true, // Apenas usuários com notificações habilitadas
        },
      },
      include: {
        user: true, // Incluir os detalhes do usuário
      },
    });

    if (studyDays.length === 0) {
      // Não há notificações pendentes
      this.logger.log('Nenhuma notificação de estudo pendente.');
      return;
    }

    // Preparar notificações por email
    const notifications = studyDays.map(studyDay => ({
      discipline: studyDay.title,
      hour: studyDay.studyStart,
      studentName: studyDay.user.name,
      email: studyDay.user.email,
    }));

    // Enviar as notificações
    await this.mailService.studyReminder(notifications);

    // Atualizar lastNotified após enviar as notificações
    await this.prisma.studyDay.updateMany({
      where: {
        id: {
          in: studyDays.map(studyDay => studyDay.id),
        },
      },
      data: {
        lastNotified: now,
      },
    });

    // Registrar as notificações no banco de dados
    const notificationDataLogs = studyDays.map(studyDay => {
      return {
        userId: studyDay.userId,
        studyDayId: studyDay.id,
        type: NotificationType['EMAIL'],
        message: `Lembrete de estudo: ${studyDay.title} às ${studyDay.studyStart.toLocaleString()}`,
        sentAt: new Date(),
      };
    });

    await this.notificationService.createMany(
      notificationDataLogs
    );


    // Log com a quantidade de envios
    this.logger.log(`${notifications.length} notificações de estudo enviadas com sucesso.`);
  }
}
