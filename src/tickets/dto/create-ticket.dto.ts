import { createZodDto } from 'nestjs-zod';
import { CreateTicketSchema } from '../entities/ticket.entity';


export class CreateTicketDto extends createZodDto(CreateTicketSchema) {}