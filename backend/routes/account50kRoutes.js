import express from "express";
import {
  importAccounts,
  Accountsget,
  getAccountById,
  createAccount,
  updateAccount,
  deleteAccount,
  sellAccount,
  buyAccountGTK,
  startWarranty,
  getOrders,
  tvLogin,
  switchAccount,
  updateOrderExpiration,
} from "../controllers/account50kController.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

/* ========== ORDERS (Đơn hàng) ========== */
router.get("/orders", getOrders);

router.get("/orders/:orderId/warranty", authenticate, startWarranty);
router.post("/orders/buy", authenticate, buyAccountGTK);

router.post("/orders/:orderId/tv-login", authenticate, tvLogin);
router.patch("/orders/:id/expiration", updateOrderExpiration);
router.post("/orders/:orderId/switch", switchAccount);

/* ========== ACCOUNTS (Kho trống) ========== */
router.get("/", Accountsget);
router.post("/", createAccount);
router.post("/bulk", importAccounts);

// ✅ alias cho buy, cũng phải trước :id
router.post("/buy", authenticate, buyAccountGTK);

// ⚠️ Các route động để CUỐI
router.get("/:id", getAccountById);
router.put("/:id", updateAccount);
router.delete("/:id", deleteAccount);
router.put("/:id/sell", sellAccount);

export default router;
