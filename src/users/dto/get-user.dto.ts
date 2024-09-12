import { createZodDto } from "nestjs-zod";
import { UserSchema } from "../entities/user.entity";

export  const GetUserSchema = UserSchema;

export class GetUserDto extends createZodDto(GetUserSchema) {}