import { z } from 'nestjs-zod/z';
import { createZodDto } from 'nestjs-zod';
import { UserSchema } from 'src/users/entities/user.entity';

export const AuthResponseSchema = z.object({
  access_token: z.string().describe('JWT token'),
  email:  UserSchema.shape.email.describe('User email'),
  sub: UserSchema.shape.id.describe('User ID'),
});

export type AuthResponseDtoType = z.infer<typeof AuthResponseSchema>;

export class AuthResponseDto extends createZodDto(AuthResponseSchema) {}