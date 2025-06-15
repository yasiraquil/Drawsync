import { z } from "zod";
export const CreateUserSchema = z.object({
  email: z.string().min(5).max(100).email(),
  name: z.string().min(6).max(50),
  password: z.string().min(8).max(50),
});
export const SigninSchema = z.object({
  email: z.string().min(5).max(100).email(),
  password: z.string().min(8).max(50),
});

export const CreateRoomSchema = z.object({
  name: z.string().min(3).max(20),
});
