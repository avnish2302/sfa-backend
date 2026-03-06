import express from "express";
import protect from "../middleware/authMiddleware.js";
import { savePromotions } from "../controllers/promotionsController.js";

const router = express.Router();
router.post("/", protect, savePromotions);

export default router;