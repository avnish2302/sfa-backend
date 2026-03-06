import express from "express";
import protect from "../middleware/authMiddleware.js";
import { saveCompetitorInventory } from "../controllers/competitorInventoryController.js";

const router = express.Router();

router.post("/competitor", protect, saveCompetitorInventory);

export default router;