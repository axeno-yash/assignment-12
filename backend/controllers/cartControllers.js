import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js";
import { z } from "zod";

const addToCartSchema = z.object({
    productId: z.string().min(1, "Product ID is required"),
    size: z.string().min(1, "Size is required"),
    quantity: z.number().min(1, "Quantity must be at least 1"),
}).strict();

const updateCartItemSchema = z.object({
    productId: z.string().min(1, "Product ID is required"),
    size: z.string().min(1, "Size is required"),
    quantity: z.number().min(0, "Quantity cannot be negative"),
}).strict();

const couponSchema = z.object({
    coupon: z.enum(["SAVE10", "SAVE20"]),
}).strict();

export const getCart = async (req, res) => {
    try {
        let cart = await Cart.findOne({ user: req.user._id }).populate("items.product", "title price images discountRate variants");
        if (!cart) {
            cart = await Cart.create({ user: req.user._id, items: [] });
        }
        res.status(200).json({ cart });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const addToCart = async (req, res) => {
    try {
        const { success, data: { productId, size, quantity }, error } = addToCartSchema.safeParse(req.body);
        if (!success || error) {
            return res.status(400).json({ message: "Invalid cart data", details: error.errors });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        const variant = product.variants.find((v) => v.size === size);
        if (!variant) {
            return res.status(400).json({ message: "Selected variant size not available" });
        }

        let cart = await Cart.findOne({ user: req.user._id });
        if (!cart) {
            cart = new Cart({ user: req.user._id, items: [] });
        }

        const itemIndex = cart.items.findIndex(
            (item) => item.product.toString() === productId && item.size === size
        );

        if (itemIndex > -1) {
            const newQuantity = cart.items[itemIndex].quantity + quantity;
            if (newQuantity > variant.quantity) {
                return res.status(400).json({ message: `Insufficient stock. Only ${variant.quantity} items available.` });
            }
            cart.items[itemIndex].quantity = newQuantity;
        } else {
            if (quantity > variant.quantity) {
                return res.status(400).json({ message: `Insufficient stock. Only ${variant.quantity} items available.` });
            }
            cart.items.push({ product: productId, size: size, quantity: quantity });
        }

        await cart.save();
        const updatedCart = await Cart.findById(cart._id).populate("items.product", "title price images discountRate variants");
        res.status(200).json({ message: "Item added to cart", cart: updatedCart });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateCartItem = async (req, res) => {
    try {
        const { success, data: { productId, size, quantity }, error } = updateCartItemSchema.safeParse(req.body);
        if (!success || error) {
            return res.status(400).json({ message: "Invalid cart data", details: error.errors });
        }

        let cart = await Cart.findOne({ user: req.user._id });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }  

        const itemIndex = cart.items.findIndex(
            (item) => item.product.toString() === productId && item.size === size
        );

        if (itemIndex === -1) {
            return res.status(404).json({ message: "Item not in cart" });
        }

        if (quantity === 0) {
            cart.items.splice(itemIndex, 1);
        } else {
            const product = await Product.findById(productId);
            const variant = product?.variants.find((v) => v.size === size);
            if (variant && quantity > variant.quantity) {
                return res.status(400).json({ message: `Insufficient stock. Only ${variant.quantity} items available.` });
            }
            cart.items[itemIndex].quantity = quantity;
        }

        await cart.save();
        const updatedCart = await Cart.findById(cart._id).populate("items.product", "title price images discountRate variants");
        res.status(200).json({ message: "Cart updated", cart: updatedCart });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const removeFromCart = async (req, res) => {
    try {
        const { productId, size } = req.params;
        let cart = await Cart.findOne({ user: req.user._id });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        cart.items = cart.items.filter(
            (item) => !(item.product.toString() === productId && item.size === size)
        );

        await cart.save();
        const updatedCart = await Cart.findById(cart._id).populate("items.product", "title price images discountRate variants");
        res.status(200).json({ message: "Item removed from cart", cart: updatedCart });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const applyCoupon = async (req, res) => {
    try {
        const { success, data: { coupon }, error } = couponSchema.safeParse(req.body);
        if (!success || error) {
            return res.status(400).json({ message: "Invalid coupon code", details: error.errors });
        }

        let cart = await Cart.findOne({ user: req.user._id });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        cart.couponApplied = coupon;
        await cart.save();

        res.status(200).json({ message: `Coupon ${coupon} applied successfully`, cart });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const clearCart = async (req, res) => {
    try {
        let cart = await Cart.findOne({ user: req.user._id });
        if (cart) {
            cart.items = [];
            cart.couponApplied = undefined;
            await cart.save();
        }
        res.status(200).json({ message: "Cart cleared successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
