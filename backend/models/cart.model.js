import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true
        },
        items: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                    required: true
                },
                size: {
                    type: String,
                    required: true,
                    trim: true
                },
                quantity: {
                    type: Number,
                    required: true,
                    min: 1
                },
            },
        ],
        couponApplied: {
            type: String,
            enum: ["SAVE10", "SAVE20"],
            uppercase: true,
            trim: true
        },
    },
    {
        timestamps: true
    }
);

const Cart = mongoose.model("Cart", cartSchema);

export default Cart;