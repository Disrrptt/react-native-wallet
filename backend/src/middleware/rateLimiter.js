// middleware/rateLimiter.js
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

// Ex.: 50 req a cada 10 segundos (ajuste conforme necessário)
const limiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(50, "10 s"),
});

export default async function rateLimiter(req, res, next) {
  try {
    // bypass para ambientes/local/health/options
    if (process.env.NODE_ENV !== "production") return next();
    if (req.method === "OPTIONS") return next();
    if (req.path === "/api/health") return next();

    // gere uma chave estável por usuário/rota/ip
    // se você usa Clerk no backend, passe userId em header (opcional)
    const userId = req.header("x-user-id") || "anon";
    const ip =
      req.header("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.ip ||
      "unknown";

    const key = `${userId}:${ip}:${req.method}:${req.path}`;

    const result = await limiter.limit(key);

    // Cabeçalhos úteis p/ observabilidade
    res.setHeader("X-RateLimit-Limit", result.limit.toString());
    res.setHeader("X-RateLimit-Remaining", result.remaining.toString());
    res.setHeader("X-RateLimit-Reset", result.reset.toString());

    if (!result.success) {
      return res.status(429).json({
        message: "Too many requests. Try again in a few seconds.",
      });
    }

    next();
  } catch (err) {
    // Se a Upstash der 503/timeout, NÃO quebra o app.
    console.error("Rate limit error (bypassed):", err?.message || err);
    next();
  }
}
