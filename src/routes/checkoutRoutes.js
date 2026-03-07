import express from "express";
import { getCheckinSummary, checkoutController } from "../controllers/checkoutController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/summary/:checkinId", protect, getCheckinSummary);
router.post("/:checkinId", protect, checkoutController);

export default router;