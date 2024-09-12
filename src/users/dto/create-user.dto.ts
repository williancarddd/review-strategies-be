import { createZodDto } from "nestjs-zod";
import { UserSchema } from "../entities/user.entity";

export const CreateUserSchema = UserSchema.omit({ id: true, created_at: true, updated_at: true});

export class CreateUserDto extends createZodDto(CreateUserSchema) {}
