import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Product name is required"],
            trim: true,
        },
        description: {
            type: String,
            required: [true, "Product description is required"],
            trim: true,
        },
        price: {
            type: Number,
            required: [true, "Product price is required"],
            min: [0, "Price cannot be negative"],
        },
        discountRate: {
            type: Number,
            default: 0,
            max: [100, "Discount rate can't be above 100"],
            min: [0, "Discount rate can't be negative"],
        },
        rating: {
            type: Number,
            default: 0,
        },
        images: {
            type: [String],
            required: [true, "At least one image is required"],
            validate: {
                validator: (value) => value.length >= 1,
                message: "At least one image is required",
            },
        },
        variants: [
            {
                size: {
                    type: String,
                    required: true,
                    trim: true,
                },
                quantity: {
                    type: Number,
                    required: true,
                    min: 0,
                },
            },
        ],
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: [true, "Category is required"],
        },
    },
    {
        timestamps: true,
    }
);

productSchema.index({ title: "text" });
productSchema.index({ category: 1, price: 1 });

const Product = mongoose.model("Product", productSchema);

export default Product;