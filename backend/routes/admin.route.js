import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import roleMiddleware from "../middlewares/roleMiddleware.js";
import User from "../models/user.model.js";
import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import { z } from "zod";

const router = express.Router();

const updateRoleSchema = z.object({
    role: z.enum(["customer", "admin"]),
}).strict();

router.use(authMiddleware);
router.use(roleMiddleware);

router.get("/dashboard", async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalProducts = await Product.countDocuments();
        const totalOrders = await Order.countDocuments();
        const sales = await Order.aggregate([
            { $group: { _id: null, totalRevenue: { $sum: "$total" } } }
        ]);
        const totalRevenue = sales[0]?.totalRevenue || 0;

        res.status(200).json({
            stats: {
                totalUsers,
                totalProducts,
                totalOrders,
                totalRevenue,
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get("/users", async (req, res) => {
    try {
        const users = await User.find({}).sort({ createdAt: -1 });
        res.status(200).json({ users });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.patch("/users/:id/role", async (req, res) => {
    try {
        const { success, data, error } = updateRoleSchema.safeParse(req.body);
        if (!success || error) {
            return res.status(400).json({ message: "Invalid role data", details: error.errors });
        }

        const user = await User.findByIdAndUpdate(
            req.params.id,
            { role: data.role },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "User role updated", user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;