import { createZodDto } from "nestjs-zod";
import { UserSchema } from "../entities/user.entity";

export const CreateUserSchema = UserSchema.omit({ id: true, createdAt: true, updatedAt: true});

export class CreateUserDto extends createZodDto(CreateUserSchema) {}
