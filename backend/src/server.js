import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { initDB } from "./config/db.js";
import rateLimiter from "./middleware/rateLimiter.js";
import transactionsRoute from "./routes/transactionsRoute.js";
import job from "./config/cron.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Render/Proxy friendly
app.set("trust proxy", 1); // importante no Render p/ capturar IP correto
app.use(rateLimiter);


// (Opcional) cron só em produção
if (process.env.NODE_ENV === "production") job.start();

// ===== Middlewares globais =====
app.use(
  cors({
    origin: [
      "http://localhost:19006",
      "http://localhost:8081",
      "exp://localhost",
      // se usar IP local:
      // /^http:\/\/192\.168\.\d+\.\d+(:\d+)?$/,
      // domínio do teu front web (se existir):
      // "https://seu-frontend.com",
    ],
    credentials: true,
  })
);

app.use(express.json());

// Health check (sempre JSON)
app.get("/api/health", (req, res) => {
  res.status(200).json({ ok: true, env: process.env.NODE_ENV || "local" });
});

// ===== Só aplica rate limit nas rotas da API =====
// (evita bloquear /api/health e garante que sem env de Upstash nada quebre)
app.use("/api", rateLimiter);

// ===== Rotas da API =====
app.use("/api/transactions", transactionsRoute);

// ===== 404 JSON (evita HTML “Not Found”) =====
app.use((req, res, _next) => {
  res.status(404).json({
    message: "Route not found",
    method: req.method,
    path: req.originalUrl,
  });
});

// ===== Handler de erro padronizado =====
app.use((err, _req, res, _next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ message: "Internal server error" });
});

// ===== Start =====
initDB().then(() => {
  app.listen(PORT, "0.0.0.0", () => {
    console.log("Server is up and running on PORT:", PORT);
  });
});
