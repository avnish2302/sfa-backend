import express from "express";
import protect from "../middleware/authMiddleware.js";
import { saveMenu } from "../controllers/menuController.js";

const router = express.Router();
router.post("/", protect, saveMenu);

export default router;