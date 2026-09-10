import Order from "../models/order.model.js";
import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js";
import { z } from "zod";

const createOrderSchema = z.object({
    shippingInfo: z.string().min(5, "Shipping address must be at least 5 characters long"),
    couponApplied: z.enum(["SAVE10", "SAVE20"]).optional(),
}).strict();

const updateOrderStatusSchema = z.object({
    status: z.enum(["pending", "shipped", "delivered"]),
}).strict();

// Flat delivery charge for every non-empty order (same rule as the cart page).
const DELIVERY_FEE = 15;

export const createOrderFromCart = async (req, res) => {
    try {
        const { success, data, error } = createOrderSchema.safeParse(req.body);
        if (!success || error) {
            return res.status(400).json({ message: "Invalid order data", details: error.errors });
        }

        const cart = await Cart.findOne({ user: req.user._id }).populate("items.product");
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: "Your cart is empty" });
        }

        let subtotal = 0;
        const orderItems = [];

        for (const item of cart.items) {
            const product = item.product;
            if (!product) {
                return res.status(400).json({ message: "One or more products in cart no longer exist" });
            }

            const variant = product.variants.find((v) => v.size === item.size);
            if (!variant || variant.quantity < item.quantity) {
                return res.status(400).json({
                    message: `Insufficient stock for ${product.title} (Size: ${item.size}). Requested: ${item.quantity}, Available: ${variant ? variant.quantity : 0}`,
                });
            }

            const discountedPrice = product.price * (1 - (product.discountRate || 0) / 100);
            const itemTotal = Math.round(discountedPrice) * item.quantity;
            subtotal += itemTotal;

            orderItems.push({
                product: product._id,
                title: product.title,
                size: item.size,
                priceAtPurchase: Math.round(discountedPrice),
                quantity: item.quantity,
            });
        }

        const coupon = data.couponApplied || cart.couponApplied;
        const roundedSubtotal = Math.round(subtotal);
        let discount = 0;

        if (coupon === "SAVE10") {
            discount = Math.round(roundedSubtotal * 0.1);
        } else if (coupon === "SAVE20") {
            discount = Math.round(roundedSubtotal * 0.2);
        }

        const deliveryFee = roundedSubtotal > 0 ? DELIVERY_FEE : 0;
        const total = roundedSubtotal - discount + deliveryFee;

        for (const item of cart.items) {
            await Product.updateOne(
                { _id: item.product._id, "variants.size": item.size },
                { $inc: { "variants.$.quantity": -item.quantity } }
            );
        }

        const order = await Order.create({
            user: req.user._id,
            items: orderItems,
            subtotal: roundedSubtotal,
            discount,
            deliveryFee,
            couponApplied: coupon,
            total,
            shippingInfo: data.shippingInfo,
            status: "pending",
        });

        cart.items = [];
        cart.couponApplied = undefined;
        await cart.save();

        res.status(201).json({ message: "Order placed successfully", order });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.status(200).json({ orders });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getOrderById = async (req, res) => {
    try {
        const order = await Order.findOne({ _id: req.params.id, user: req.user._id }).populate("items.product", "title images price");
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        res.status(200).json({ order });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getAllOrdersAdmin = async (req, res) => {
    try {
        const orders = await Order.find({})
            .populate("user", "name email")
            .populate("items.product", "title images price")
            .sort({ createdAt: -1 });
        res.status(200).json({ orders });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateOrderStatusAdmin = async (req, res) => {
    try {
        const { success, data, error } = updateOrderStatusSchema.safeParse(req.body);
        if (!success || error) {
            return res.status(400).json({ message: "Invalid status data", details: error.errors });
        }

        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { status: data.status },
            { new: true, runValidators: true }
        );

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        res.status(200).json({ message: "Order status updated", order });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
