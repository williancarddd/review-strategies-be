import { Injectable } from '@nestjs/common';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { CreateTicketSchema } from './entities/ticket.entity';
import { MailService } from 'src/notifications/mail.service';

@Injectable()
export class TicketsService {
  constructor(
    private readonly notificationService: MailService,
  ) { }

  create(
    createTicketDto: CreateTicketDto,

  ) {
    const parseTicket = CreateTicketSchema.parse(createTicketDto);
    this.notificationService.newTicket(parseTicket);
  }
}
