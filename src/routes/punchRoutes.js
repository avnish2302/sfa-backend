import express from "express";
import { punchIn, punchOut, getPunchSummary } from "../controllers/punchController.js";
import { getTotalInventoryBeforePunchOut } from "../controllers/ownInventoryController.js";
import { getTotalCollectionBeforePunchOut } from "../controllers/collectionController.js";
import { getTotalPromotionBeforePunchOut } from "../controllers/promotionsController.js";

const router = express.Router();

// POST /api/punch/in
router.post("/in", punchIn);
router.post("/out", punchOut);
router.get("/inventory/:checkinId", getTotalInventoryBeforePunchOut);
router.get("/collection/:checkinId", getTotalCollectionBeforePunchOut);
router.get("/promotion/:checkinId", getTotalPromotionBeforePunchOut);

router.get("/summary", getPunchSummary);
export default router;