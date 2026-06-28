// src/config.ts
import dotenv from "dotenv";
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || "3000", 10),
  apiToken: process.env.API_TOKEN || "",
  sessionToken: process.env.SESSION_TOKEN || "",
  hermes: {
    baseUrl: process.env.HERMES_BASE_URL || "http://localhost:8000",
    timeoutMs: parseInt(process.env.HERMES_TIMEOUT_MS || "120000", 10),
    retries: parseInt(process.env.HERMES_RETRIES || "2", 10),
  },
};
