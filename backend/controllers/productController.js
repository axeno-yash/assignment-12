import Product from "../models/product.model.js";
import { z } from "zod";

const createProductSchema = z.object({
    title: z.string().min(1, "Product title is required"),
    description: z.string().min(1, "Description is required"),
    price: z.number().min(0, "Price cannot be negative"),
    discountRate: z.number().min(0).max(100).optional(),
    rating: z.number().min(0).max(5).optional(),
    images: z.array(z.string()).min(1, "At least one image is required"),
    variants: z.array(
        z.object({
            size: z.string().min(1),
            quantity: z.number().min(0),
        })
    ).min(1, "At least one variant is required"),
    category: z.string().min(1, "Category is required"),
}).strict();

const updateProductSchema = createProductSchema.partial();

const updateStockSchema = z.object({
    variants: z.array(
        z.object({
            size: z.string().min(1),
            quantity: z.number().min(0),
        })
    ).min(1, "At least one variant is required"),
}).strict();

export const getProducts = async (req, res) => {
    try {
        const { search, category, minPrice, maxPrice, size, inStock, sort, page = 1, limit = 9 } = req.query;
        const query = {};

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } },
            ];
        }

        if (category) {
            query.category = category;
        }

        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }

        if (size) {
            query["variants.size"] = new RegExp(`^${size}$`, "i");
        }

        if (inStock === "true") {
            query["variants.quantity"] = { $gt: 0 };
        }

        let sortOption = { createdAt: -1 };
        if (sort === "price_asc") sortOption = { price: 1 };
        if (sort === "price_desc") sortOption = { price: -1 };
        if (sort === "name") sortOption = { title: 1 };
        if (sort === "rating" || sort === "most_popular") sortOption = { rating: -1 };
        if (sort === "newest") sortOption = { createdAt: -1 };

        const pageNum = Math.max(1, Number(page));
        const limitNum = Math.max(1, Number(limit));
        const skip = (pageNum - 1) * limitNum;

        const totalProducts = await Product.countDocuments(query);
        const products = await Product.find(query)
            .populate("category", "name")
            .sort(sortOption)
            .skip(skip)
            .limit(limitNum);

        res.status(200).json({
            products,
            page: pageNum,
            totalPages: Math.ceil(totalProducts / limitNum),
            totalProducts,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate("category", "name");
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json({ product });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createProduct = async (req, res) => {
    try {
        const { success, data, error } = createProductSchema.safeParse(req.body);
        if (!success || error) {
            return res.status(400).json({ message: "Invalid product data", details: error.errors });
        }

        const product = new Product(data);
        const createdProduct = await product.save();
        res.status(201).json({ message: "Product created successfully", product: createdProduct });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const updateProduct = async (req, res) => {
    try {
        const { success, data, error } = updateProductSchema.safeParse(req.body);
        if (!success || error) {
            return res.status(400).json({ message: "Invalid product data", details: error.errors });
        }

        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, data, {
            new: true,
            runValidators: true,
        });

        if (!updatedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json({ message: "Product updated successfully", product: updatedProduct });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const updateProductStock = async (req, res) => {
    try {
        const { success, data, error } = updateStockSchema.safeParse(req.body);
        if (!success || error) {
            return res.status(400).json({ message: "Invalid stock data", details: error.errors });
        }

        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        product.variants = data.variants;
        await product.save();
        res.status(200).json({ message: "Product stock updated successfully", product });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        if (!deletedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
