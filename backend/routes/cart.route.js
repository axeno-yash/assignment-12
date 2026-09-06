import express from "express";
import {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    applyCoupon,
    clearCart,
} from "../controllers/cartControllers.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", getCart);
router.post("/items", addToCart);
router.put("/items", updateCartItem);
router.delete("/items/:productId/:size", removeFromCart);
router.post("/coupon", applyCoupon);
router.delete("/clear", clearCart);

export default router;
