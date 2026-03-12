import express from "express";
import protect from "../middleware/authMiddleware.js";
import { getPromotionsByCheckin, savePromotions } from "../controllers/promotionsController.js";

const router = express.Router();
router.post("/", protect, savePromotions);
router.get("/:checkinId", protect, getPromotionsByCheckin);

export default router;