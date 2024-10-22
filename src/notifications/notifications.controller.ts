import { Controller, Get, Query, Param } from '@nestjs/common';
import { ApiQuery, ApiTags, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { Notification } from '@prisma/client';
import { NotificationService } from './notifications.service';

@ApiTags('notifications')
@ApiBearerAuth('JWT-auth')
@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  // Buscar notificações por data e por usuário
  @Get(':id')
  @ApiParam({ name: 'id', description: 'ID do usuário' })
  @ApiQuery({ name: 'date', type: String, description: 'Data no formato ISO (YYYY-MM-DD)' })
  async getByDay(
    @Param('id') id: string,
    @Query('date') date: string,
  ): Promise<Notification[]> {
    console.log(date);
    const parsedDate = new Date(date); // Converte a string da query para uma data
    return this.notificationService.getByDay(parsedDate, id);
  }
}
