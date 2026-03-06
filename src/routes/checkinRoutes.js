import express from "express";
import { createCheckin } from "../controllers/checkinController.js";

const router = express.Router();

router.post("/", createCheckin);

export default router;