import { z } from 'nestjs-zod/z';

export const StudyThemeSchema = z.object({
  id: z.string().cuid().describe('ID do tema de estudo'),
  userId: z.string().cuid().describe('ID do usuário'),
  title: z.string().min(3, 'Título deve ter no mínimo 3 caracteres').describe('Título do tema de estudo'),
  mode: z.enum(['24x3x7', '24x3x15', '24x7x30']).describe('Modo de estudo'),
  startDate: z.date().describe('Data inicial do tema de estudo'),
  createdAt: z.date().describe('Data de criação'),
  updatedAt: z.date().describe('Data de atualização'),
});

export const CreateStudyThemeSchema = StudyThemeSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
