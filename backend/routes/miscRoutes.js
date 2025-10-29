// routes/miscRoutes.js
import { Router } from "express";
import { recordVisit } from "../controllers/miscController.js";

const router = Router();

// Ghi nhận lượt truy cập
router.post("/visit", recordVisit);
router.get("/visit", (req, res) => {
  res.json({ success: true, message: "GET visit recorded (debug)" });
});

export default router;
