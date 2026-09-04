import express from "express";
import roleMiddleware from "../middlewares/roleMiddleware.js";
const router = express.Router();

router.get("/dashboard", roleMiddleware, (req, res) => {
    res.status(200).json({
        message: "I am the Admin!",
    })
});

export default router;