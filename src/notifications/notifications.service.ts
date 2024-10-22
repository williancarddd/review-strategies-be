import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { Notification, Prisma } from '@prisma/client';
import { startOfDay, endOfDay } from 'date-fns';

@Injectable()
export class NotificationService {
  constructor(private readonly prisma: PrismaService) { }

  // Buscar notificações por data
  async getByDay(date: Date, id: string): Promise<Notification[]> {
    const start = startOfDay(date); // Definir o início do dia
    const end = endOfDay(date); // Definir o final do dia

    return this.prisma.notification.findMany({
      where: {
        userId: id,
        sentAt: {
          gte: start,
          lte: end,
        },
      },
      include: {
        user: true,
        studyDay: true,
      }
    });
  }

  async createMany(notifications: Prisma.NotificationCreateManyInput[]) {
    return await this.prisma.notification.createMany({
      data: notifications,
    });
  }
}
