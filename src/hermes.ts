// src/hermes.ts
import axios, { AxiosError } from "axios";
import { config } from "./config";

/**
 * Forward a formatted message to the Hermes agent and return only
 * the final output (no intermediary steps).
 *
 * Retries up to config.hermes.retries on network-level failures.
 */
export async function forwardToHermes(
  message: string,
  agentId?: string,
  context?: Record<string, unknown>,
): Promise<string> {
  const url = `${config.hermes.baseUrl}/api/v1/messages`;

  const payload: Record<string, unknown> = {
    messages: [{ role: "user", content: message }],
    stream: false,
  };
  if (agentId) payload.agent_id = agentId;
  if (context) payload.metadata = context;

  let lastErr: unknown;

  for (let attempt = 0; attempt <= config.hermes.retries; attempt++) {
    try {
      const resp = await axios.post(url, payload, {
        timeout: config.hermes.timeoutMs,
        headers: { "Content-Type": "application/json" },
      });

      // Expect Hermes to return either:
      //   { output: "..." }  or  { content: [{ type: "text", text: "..." }] }
      const data = resp.data;
      const output =
        data.output ??
        data.content?.find((c: any) => c.type === "text")?.text ??
        data.result ??
        null;

      if (output == null) {
        throw new Error("Hermes response missing output field");
      }

      return String(output);
    } catch (err) {
      lastErr = err;
      const axiosErr = err as AxiosError;
      // Don't retry on 4xx client errors (except 429)
      if (
        axiosErr.response &&
        axiosErr.response.status < 500 &&
        axiosErr.response.status !== 429
      ) {
        break;
      }
      if (attempt < config.hermes.retries) {
        await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)));
      }
    }
  }

  const axiosErr = lastErr as AxiosError;
  if (axiosErr?.code === "ECONNREFUSED" || axiosErr?.code === "ENOTFOUND") {
    throw Object.assign(new Error("Hermes agent unreachable"), { status: 502 });
  }
  if (axiosErr?.response) {
    throw Object.assign(
      new Error(`Hermes error: ${axiosErr.response.status}`),
      { status: 502 },
    );
  }
  throw Object.assign(new Error("Failed to reach Hermes agent"), {
    status: 502,
  });
}
