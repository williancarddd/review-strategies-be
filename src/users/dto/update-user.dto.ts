import { UserSchema } from "../entities/user.entity";
import { createZodDto } from "nestjs-zod";

export const UpdateUserSchema = UserSchema.partial().omit({ id: true, created_at: true, updated_at: true});

export class UpdateUserDto extends createZodDto(UpdateUserSchema) {}
