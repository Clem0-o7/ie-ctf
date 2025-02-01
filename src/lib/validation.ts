// @/lib/validation.ts
import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(4, "Name must be at least 4 characters"),
  registerNumber: z.string().min(6, "Register number must be at least 6 characters"),
  department: z.string().min(2, "Department must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;