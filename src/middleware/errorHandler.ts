// src/middleware/errorHandler.ts
import { Context, Next } from "koa";

export async function errorHandler(ctx: Context, next: Next): Promise<void> {
  try {
    await next();
  } catch (err: any) {
    const status = err.status || 500;
    ctx.status = status;
    ctx.body = {
      error: err.message || "Internal Server Error",
    };
    if (status >= 500) {
      console.error("[error]", err);
    }
  }
}
