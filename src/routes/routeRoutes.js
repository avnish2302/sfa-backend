import express from "express";
import protect from "../middleware/authMiddleware.js";
import {
  createRoutes,
  getRoutes,
  approveRoutes,
  createManagerRoutes
} from "../controllers/routesController.js";

const router = express.Router();


router.post("/", protect, createRoutes);

router.get("/", protect, getRoutes);

router.post("/approve", protect, approveRoutes);

router.post("/manager", protect, createManagerRoutes);


export default router;