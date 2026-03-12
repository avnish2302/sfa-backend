import express from "express";
import { saveOwnInventory, getOwnInventoryByCheckin } from "../controllers/ownInventoryController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/own", protect, saveOwnInventory);
router.get("/:checkinId", protect, getOwnInventoryByCheckin)

export default router;