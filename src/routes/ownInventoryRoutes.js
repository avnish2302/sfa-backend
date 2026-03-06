import express from "express";
import { saveOwnInventory } from "../controllers/ownInventoryController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/own", protect, saveOwnInventory);

export default router;