import express from "express";
import protect from "../middleware/authMiddleware.js";
import { saveShowcase } from "../controllers/showcaseController.js";

const router = express.Router();

router.post("/", protect, saveShowcase);

export default router;