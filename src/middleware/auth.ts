// src/middleware/auth.ts
import { Context, Next } from "koa";
import { config } from "../config";

/**
 * Bearer <REDACTED> — rejects any request without
 * Authorization: Bearer <config.sessionToken>
 */
export async function authMiddleware(ctx: Context, next: Next): Promise<void> {
  const header = ctx.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    ctx.status = 401;
    ctx.body = { error: "Missing or malformed Authorization header" };
    return;
  }

  const token = header.slice(7).trim();

  if (token !== config.sessionToken) {
    ctx.status = 401;
    ctx.body = { error: "Invalid bearer <REDACTED>" };
    return;
  }

  await next();
}
