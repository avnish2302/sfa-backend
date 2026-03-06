import express from "express";
import { getProducts, getCategories } from "../controllers/productsController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getProducts);
router.get("/categories", protect, getCategories);

export default router;