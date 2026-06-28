// src/routes/message.ts
import Router from "@koa/router";
import { authMiddleware } from "../middleware/auth";
import { messageSchema } from "../schemas";
import { forwardToHermes } from "../hermes";

const router = new Router();

// All routes in this router require bearer <REDACTED>
router.use(authMiddleware);

/**
 * POST /message
 * Body: { message: string, agentId?: string, context?: object }
 * Forwards to Hermes, returns only the final output.
 */
router.post("/message", async (ctx) => {
  const parsed = messageSchema.safeParse(ctx.request.body);
  if (!parsed.success) {
    ctx.status = 400;
    ctx.body = { error: parsed.error.issues[0].message };
    return;
  }

  const { message, agentId, context } = parsed.data;

  const output = await forwardToHermes(message, agentId, context);

  ctx.status = 200;
  ctx.body = { output };
});

export default router;
