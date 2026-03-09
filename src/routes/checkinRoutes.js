import express from "express";
import { createCheckin, getActiveCheckin } from "../controllers/checkinController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createCheckin)
router.get("/active", protect, getActiveCheckin);

export default router;