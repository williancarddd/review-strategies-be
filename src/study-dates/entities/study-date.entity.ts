import { z } from 'nestjs-zod/z';

export const StudyDateSchema = z.object({
  id: z.string().cuid().describe('ID da data de estudo'),
  studyThemeId: z.string().cuid().describe('ID do tema de estudo'),
  studyDate: z.date().describe('Data da revisão'),
  status: z.enum(['PENDING', 'COMPLETED', 'SKIPPED']).describe('Status da revisão'),
  createdAt: z.date().describe('Data de criação'),
  updatedAt: z.date().describe('Data de atualização'),
});

export const CreateStudyDateSchema = StudyDateSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
