import express from "express";
import { punchIn, punchOut, getPunchSummary } from "../controllers/punchController.js";
import { getInventoryBeforePunchOut } from "../controllers/ownInventoryController.js";
import { getCollectionBeforePunchOut } from "../controllers/collectionController.js";
import { getPromotionBeforePunchOut } from "../controllers/promotionsController.js";

const router = express.Router();

router.post("/in", punchIn);
router.post("/out", punchOut);

router.get("/inventory", getInventoryBeforePunchOut);
router.get("/collection", getCollectionBeforePunchOut);
router.get("/promotion", getPromotionBeforePunchOut);

router.get("/summary", getPunchSummary);

export default router;