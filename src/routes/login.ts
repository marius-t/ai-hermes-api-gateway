// src/routes/login.ts
import Router from "@koa/router";
import { config } from "../config";
import { loginSchema } from "../schemas";

const router = new Router();

/**
 * POST /login
 * Body: { token: string }
 * Returns a session bearer <REDACTED> if token matches API_TOKEN.
 */
router.post("/login", (ctx) => {
  const parsed = loginSchema.safeParse(ctx.request.body);
  if (!parsed.success) {
    ctx.status = 400;
    ctx.body = { error: parsed.error.issues[0].message };
    return;
  }

  if (parsed.data.token !== config.apiToken) {
    ctx.status = 401;
    ctx.body = { error: "Invalid API token" };
    return;
  }

  ctx.status = 200;
  ctx.body = {
    token: config.sessionToken,
    tokenType: "Bearer",
  };
});

export default router;
