import express from "express";
import protect from "../middleware/authMiddleware.js";
import { saveCollection } from "../controllers/collectionController.js";

const router = express.Router();
router.post("/", protect, saveCollection);

export default router;