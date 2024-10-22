import { z } from 'nestjs-zod/z';


export const StudyDay = z.object({
  id: z.string().cuid().optional(),
  userId: z.string().cuid(),
  title: z.string().min(3),
  mode: z.enum(['24x7x30', '24x3x7', '24x3x15']),
  description: z.string().optional(),
  color: z.string().optional(),
  studyStart: z.date(),
  studyEnd: z.date(),
  lastNotified: z.date().optional(),
  status: z.enum(["PENDING", "COMPLETED", "SKIPPED"]).optional(),
});
