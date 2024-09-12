import { z } from 'nestjs-zod/z';

export const UserSchema = z.object({
  id: z.string().cuid().optional().describe('The id of the user'),
  username: z.string({
    required_error: 'Username is required',
  }).min(3).describe('The username of the user'),
  name: z.string({
    required_error: 'Nome is required',
  }).min(3).describe('The nome of the user'),
  objective: z.string({
    required_error: 'Objective is required',
  }).min(3).describe('The objective of the user'),
  password: z.string({
    required_error: 'Password is required',
  }).min(6).describe('The password of the user'),
  email: z.string({
    required_error: 'Email is required',
  }).email().describe('The email of the user'),
  created_at: z.date().optional().describe('The date when the user was created'),
  updated_at: z.date().optional().describe('The date when the user was updated'),
});
