import express from "express";
import protect from "../middleware/authMiddleware.js";
import { saveCollection, getCollectionByCheckin } from "../controllers/collectionController.js";

const router = express.Router();
router.post("/", protect, saveCollection);
router.get("/:checkinId", protect, getCollectionByCheckin);

export default router;