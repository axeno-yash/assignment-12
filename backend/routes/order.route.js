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
router.get("/:id", getOrderById);

router.get("/admin/all", roleMiddleware, getAllOrdersAdmin);
router.patch("/admin/:id/status", roleMiddleware, updateOrderStatusAdmin);

export default router;
