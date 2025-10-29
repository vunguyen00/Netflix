import { Router } from "express";
import { authenticate } from "../middleware/auth.js";
import {
  createOrder,
  localSavings,
  getOrders,
  extendOrder,
  sellAccount
} from "../controllers/orderController.js";
import { checkCookieSession } from "../services/warrantyService.js";
import Account50k from "../models/Account50k.js";
import Order from "../models/Order.js";

const router = Router();

/* ========== ORDERS ========== */
router.post("/", authenticate, createOrder);
router.get("/", authenticate, getOrders);

/* ========== ORDER ACTIONS ========== */
router.post("/local-savings", authenticate, localSavings);
router.post("/:id/extend", authenticate, extendOrder);
router.post("/:id/sell", authenticate, sellAccount);

router.post("/:id/warranty", authenticate, async (req, res) => {
  try {
    const orderCode = req.params.id;

    const order = await Order.findOne({ orderCode });
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    let account = await Account50k.findOne({ username: order.accountEmail });
    if (!account) {
      return res.status(404).json({ success: false, message: "Account not found" });
    }

    let progressLog = [];
    const pass = await checkCookieSession(
      account.cookies,
      account.username,
      account.password,
      (step) => progressLog.push(step)
    );

    // Nếu tài khoản chết
    if (!pass) {
      account.status = "dead";
      await account.save();

      const newAccount = await Account50k.findOne({
        $or: [
          { status: "available" },
          { status: { $exists: false } },
          { status: null }
        ]
      });

      if (newAccount) {
        progressLog.push("replace_account");

        order.accountEmail = newAccount.username;
        order.accountPassword = newAccount.password;
        await order.save();

        newAccount.status = "in_use";
        newAccount.lastUsed = new Date();
        await newAccount.save();

        return res.json({
          success: true,
          steps: progressLog,
          status: "replaced",
          newUsername: newAccount.username,
        });
      } else {
        return res.json({
          success: false,
          steps: progressLog,
          status: "no_available_account",
        });
      }
    }

    // Nếu tài khoản vẫn hoạt động
    res.json({
      success: true,
      steps: progressLog,
      status: "active",
    });

  } catch (err) {
    console.error("Warranty error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
