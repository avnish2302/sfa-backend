import express from "express";
import { register, login, refreshAccessToken } from "../controllers/authController.js";
import { getCurrentUser } from "../controllers/authController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();               // creates mini router

router.post("/register", register);            // POST request for registration. Calls register function
router.post("/login", login);                  // POST request for login. Calls login function   
router.post("/refresh", refreshAccessToken)

router.get("/me", protect, getCurrentUser);

export default router;