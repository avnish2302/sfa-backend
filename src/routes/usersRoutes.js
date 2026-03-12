import express from "express";
import protect from "../middleware/authMiddleware.js";
import { getSalesmen } from "../controllers/usersController.js";

const router = express.Router();

router.get("/salesmen", protect, getSalesmen);

export default router;