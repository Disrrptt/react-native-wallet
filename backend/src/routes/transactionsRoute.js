import express from "express";
import {
  createTransaction,
  deleteTransaction,
  getSummaryByUserId,
  getTransactionsByUserId,
} from "../controllers/transactionsController.js";

const router = express.Router();

// health da feature (opcional)
router.get("/health", (_req, res) => res.json({ ok: true, feature: "transactions" }));

router.get("/summary/:userId", getSummaryByUserId); // <- antes
router.get("/:userId", getTransactionsByUserId);
router.post("/", createTransaction);
router.delete("/:id", deleteTransaction);

export default router;
