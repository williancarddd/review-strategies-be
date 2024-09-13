import { UserSchema } from "../entities/user.entity";
import { createZodDto } from "nestjs-zod";

export const UpdateUserSchema = UserSchema.partial().omit({ id: true, createdAt: true, updatedAt: true});

export class UpdateUserDto extends createZodDto(UpdateUserSchema) {}
