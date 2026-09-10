import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        items: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                    required: true,
                },
                title: {
                    type: String,
                    required: true,
                },
                size: {
                    type: String,
                    required: true,
                },
                priceAtPurchase: {
                    type: Number,
                    required: true,
                },
                quantity: {
                    type: Number,
                    required: true,
                    min: 1,
                },
            },
        ],
        subtotal: {
            type: Number,
            required: true,
        },
        discount: {
            type: Number,
            default: 0,
        },
        deliveryFee: {
            type: Number,
            default: 0,
        },
        couponApplied: {
            type: String,
            enum: ["SAVE10", "SAVE20"],
        },
        total: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            enum: ["pending", "shipped", "delivered"],
            default: "pending",
        },
        shippingInfo: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;