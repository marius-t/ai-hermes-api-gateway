// src/server.ts
import Koa from "koa";
import bodyParser from "koa-bodyparser";
import { config } from "./config";
import { errorHandler } from "./middleware/errorHandler";
import loginRouter from "./routes/login";
import messageRouter from "./routes/message";

const app = new Koa();

// Global error handler
app.use(errorHandler);

// Parse JSON bodies
app.use(bodyParser());

// Health check (no auth)
app.use(async (ctx, next) => {
  if (ctx.path === "/health") {
    ctx.body = { status: "ok" };
    return;
  }
  await next();
});

// Routes
app.use(loginRouter.routes()).use(loginRouter.allowedMethods());
app.use(messageRouter.routes()).use(messageRouter.allowedMethods());

app.listen(config.port, () => {
  console.log(`ai-api listening on :${config.port}`);
  console.log(`Hermes target: ${config.hermes.baseUrl}`);
});
