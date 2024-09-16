import { Injectable } from '@nestjs/common';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { CreateTicketSchema } from './entities/ticket.entity';

@Injectable()
export class TicketsService {
  create(createTicketDto: CreateTicketDto) {
    const parseTicket = CreateTicketSchema.parse(createTicketDto);
    console.log(parseTicket);
  }
}
