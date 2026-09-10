import express from "express";
import {
    createOrderFromCart,
    getMyOrders,
    getOrderById,
    getAllOrdersAdmin,
    updateOrderStatusAdmin,
} from "../controllers/orderController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import roleMiddleware from "../middlewares/roleMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", createOrderFromCart);
router.get("/", getMyOrders);
router.get("/admin/all", roleMiddleware, getAllOrdersAdmin);
router.patch("/admin/:id/status", roleMiddleware, updateOrderStatusAdmin);

router.get("/:id", getOrderById);

export default router;
