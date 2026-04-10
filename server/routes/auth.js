import { Router } from "express";
import { register, login, googleCallback, getMe, updateProfile } from "../controllers/authController.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", authenticate, getMe);
router.put("/profile", authenticate, updateProfile);
router.get("/google/callback", googleCallback);

export default router;