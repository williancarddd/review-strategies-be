import { z } from 'nestjs-zod/z';
import { createZodDto } from 'nestjs-zod';

export const LoginSchema = z.object({
  email: z.string().email().describe('User email'),
  password: z.string().min(6).describe('User password'),
});


export class LoginDto extends createZodDto(LoginSchema) {}