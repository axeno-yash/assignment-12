import express from "express";
import { signup, signin, logout } from "../controllers/authController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.get("/logout", authMiddleware, logout);

export default router;
