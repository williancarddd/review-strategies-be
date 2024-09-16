import { z } from 'nestjs-zod/z';

export const TicketSchema = z.object({
  id: z.string().cuid().describe('ID do ticket'),
  type: z.string().min(3, 'Tipo deve ter no mínimo 3 caracteres').describe('Tipo do ticket'),
  description: z.string().min(3, 'Descrição deve ter no mínimo 3 caracteres').describe('Descrição do ticket'),
  email: z.string().email().describe('Email do ticket'),
  createdAt: z.date().describe('Data de criação'),
  updatedAt: z.date().describe('Data de atualização'),
});

export const CreateTicketSchema = TicketSchema.omit({ id: true, createdAt: true, updatedAt: true });