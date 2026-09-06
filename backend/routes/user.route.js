import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import {
    getUserProfile,
    updateUserProfile,
} from "../controllers/userController.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/profile", getUserProfile);
router.put("/profile", updateUserProfile);

export default router;