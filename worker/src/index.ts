interface Env {
  MISTRAL_API_KEY: string;
  ALLOWED_ORIGIN: string;
}

const MISTRAL_API_URL = "https://api.mistral.ai/v1/chat/completions";
const RATE_LIMIT = 10; // max requests per IP per window
const RATE_WINDOW_MS = 60_000; // 1 minute

// In-memory rate limiter (resets on cold start, good enough for side project)
const ipCounts = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = ipCounts.get(ip);

  if (!entry || now > entry.resetAt) {
    ipCounts.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return false;
  }

  entry.count++;
  return entry.count > RATE_LIMIT;
}

function corsHeaders(origin: string, allowedOrigin: string): Record<string, string> {
  const isAllowed = origin === allowedOrigin || allowedOrigin === "*";
  return {
    "Access-Control-Allow-Origin": isAllowed ? origin : "",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const origin = request.headers.get("Origin") || "";
    const headers = corsHeaders(origin, env.ALLOWED_ORIGIN);

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers });
    }

    if (request.method !== "POST") {
      return new Response("Method not allowed", { status: 405, headers });
    }

    // Rate limit by IP
    const ip = request.headers.get("CF-Connecting-IP") || "unknown";
    if (isRateLimited(ip)) {
      return new Response(
        JSON.stringify({ error: "Too many requests. Please wait a moment." }),
        { status: 429, headers: { ...headers, "Content-Type": "application/json" } }
      );
    }

    try {
      const body = await request.json() as { messages: unknown[] };

      if (!body.messages || !Array.isArray(body.messages)) {
        return new Response(
          JSON.stringify({ error: "messages array is required" }),
          { status: 400, headers: { ...headers, "Content-Type": "application/json" } }
        );
      }

      const mistralResponse = await fetch(MISTRAL_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${env.MISTRAL_API_KEY}`,
        },
        body: JSON.stringify({
          model: "mistral-small-latest",
          messages: body.messages,
        }),
      });

      const data = await mistralResponse.text();

      return new Response(data, {
        status: mistralResponse.status,
        headers: { ...headers, "Content-Type": "application/json" },
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      return new Response(
        JSON.stringify({ error: message }),
        { status: 500, headers: { ...headers, "Content-Type": "application/json" } }
      );
    }
  },
};
