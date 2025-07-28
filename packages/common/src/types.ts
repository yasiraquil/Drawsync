import { z } from "zod";
export const CreateUserSchema = z.object({
  email: z.string().min(5).max(100).email(),
  name: z.string().min(1).max(50),
  password: z.string().min(8).max(50),
});
export const SigninSchema = z.object({
  email: z.string().min(5).max(100).email(),
  password: z.string().min(8).max(50),
});

export const CreateRoomSchema = z.object({
  name: z.string().min(3).max(50),
  password: z.string().min(4).max(50).optional(),
  isPublic: z.boolean().default(false),
});

export const JoinRoomSchema = z.object({
  shortCode: z.string().min(6).max(6),
  password: z.string().min(4).max(50).optional(),
});

export const UpdateRoomSchema = z.object({
  name: z.string().min(3).max(50).optional(),
  password: z.string().min(4).max(50).optional(),
  isPublic: z.boolean().optional(),
});
