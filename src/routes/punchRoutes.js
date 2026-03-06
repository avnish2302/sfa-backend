import express from "express";
import { punchIn, punchOut, getPunchSummary } from "../controllers/punchController.js";

const router = express.Router();

// POST /api/punch/in
router.post("/in", punchIn);
router.post("/out", punchOut);

router.get("/summary", getPunchSummary);
export default router;