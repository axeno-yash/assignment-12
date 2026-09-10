import Category from "../models/category.model.js";
import Product from "../models/product.model.js";
import { z } from "zod";

const categorySchema = z.object({
    name: z.string().min(1, "Category name is required"),
}).strict();

function slugifyName(value = "") {
    return String(value).toLowerCase().trim().split(" ").filter(Boolean).join("-");
}

async function categoryNameTaken(name, ignoreId) {
    const all = await Category.find({});
    const slug = slugifyName(name);
    return all.some(
        (c) =>
            String(c._id) !== String(ignoreId || "") &&
            (c.name.toLowerCase() === name.toLowerCase() || (c.slug && c.slug === slug))
    );
}

export const getCategories = async (req, res) => {
    try {
        const categories = await Category.find({}).sort({ name: 1 });
        res.status(200).json({ categories });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createCategory = async (req, res) => {
    try {
        const { success, data, error } = categorySchema.safeParse(req.body);
        if (!success || error) {
            return res.status(400).json({ message: "Invalid category data", details: error.errors });
        }
        if (await categoryNameTaken(data.name.trim())) {
            return res.status(400).json({ message: "Category already exists" });
        }
        const category = await Category.create({ name: data.name.trim() });
        res.status(201).json({ message: "Category created", category });
    } catch (error) {
        if (error?.code === 11000) {
            return res.status(400).json({ message: "Category already exists" });
        }
        res.status(500).json({ message: error.message });
    }
};

export const updateCategory = async (req, res) => {
    try {
        const { success, data, error } = categorySchema.safeParse(req.body);
        if (!success || error) {
            return res.status(400).json({ message: "Invalid category data", details: error.errors });
        }
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }
        if (await categoryNameTaken(data.name.trim(), category._id)) {
            return res.status(400).json({ message: "Category already exists" });
        }
        category.name = data.name.trim();
        if (!category.slug) {
            category.slug = slugifyName(category.name);
        }
        await category.save();
        res.status(200).json({ message: "Category updated", category });
    } catch (error) {
        if (error?.code === 11000) {
            return res.status(400).json({ message: "Category already exists" });
        }
        res.status(500).json({ message: error.message });
    }
};

export const deleteCategory = async (req, res) => {
    try {
        const productCount = await Product.countDocuments({ category: req.params.id });
        if (productCount > 0) {
            return res.status(400).json({
                message: `Cannot delete category with ${productCount} product${productCount === 1 ? "" : "s"}. Move or delete those products first.`,
                productCount,
            });
        }
        const category = await Category.findByIdAndDelete(req.params.id);
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }
        res.status(200).json({ message: "Category deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
