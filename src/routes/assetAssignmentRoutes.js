import express from "express";
import protect from "../middleware/authMiddleware.js";
import { saveAssetAssignment } from "../controllers/assetAssignmentController.js";

const router = express.Router();

router.post("/", protect, saveAssetAssignment);

export default router;