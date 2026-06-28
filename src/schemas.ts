// src/schemas.ts
import { z } from "zod";

export const loginSchema = z.object({
  token: z.string().min(1, "token is required"),
});

export const messageSchema = z.object({
  message: z.string().min(1, "message is required"),
  agentId: z.string().optional(),
  context: z.record(z.unknown()).optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type MessageInput = z.infer<typeof messageSchema>;
