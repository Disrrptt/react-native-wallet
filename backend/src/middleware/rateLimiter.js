// middleware/rateLimiter.js
import ratelimit from "../config/upstash.js";

const isDev = process.env.NODE_ENV !== "production";

// helper para identificar o cliente
function getIdentifier(req) {
  // se você tiver auth no backend, use o id do usuário autenticado
  const userId =
    req.headers["x-user-id"] || req.body?.user_id || req.query?.user_id || null;

  // fallback por IP (Render/Proxy)
  const ip =
    req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
    req.ip ||
    req.connection?.remoteAddress ||
    "unknown";

  return userId || ip;
}

const rateLimiter = async (req, res, next) => {
  try {
    // bypass em dev e rota de health
    if (isDev || req.path === "/api/health") return next();

    const id = getIdentifier(req);
    // chave por cliente + método + caminho (assim POST /transactions não “gasta” o GET /transactions)
    const key = `rl:${id}:${req.method}:${req.path}`;

    const result = await ratelimit.limit(key);
    const { success, limit, remaining, reset } = result ?? {};

    // adiciona headers padrão de rate limit
    if (limit != null) res.setHeader("X-RateLimit-Limit", limit);
    if (remaining != null) res.setHeader("X-RateLimit-Remaining", remaining);
    if (reset != null) {
      // segundos até reset
      const retryAfter = Math.max(0, Math.ceil(reset - Date.now() / 1000));
      res.setHeader("X-RateLimit-Reset", reset);
      res.setHeader("Retry-After", retryAfter);
    }

    if (!success) {
      return res.status(429).json({
        message: "Too many requests, please try again later.",
      });
    }

    next();
  } catch (error) {
    console.error("Rate limit error:", error);
    // garante JSON mesmo se o Upstash falhar
    return res.status(503).json({
      message: "Rate limit service unavailable. Please try again shortly.",
    });
  }
};

export default rateLimiter;
