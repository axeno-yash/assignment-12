import Category from "../models/category.model.js";
import { z } from "zod";

const categorySchema = z.object({
    name: z.string().min(1, "Category name is required"),
}).strict();

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
        const existing = await Category.findOne({ name: data.name });
        if (existing) {
            return res.status(400).json({ message: "Category already exists" });
        }
        const category = await Category.create(data);
        res.status(201).json({ message: "Category created", category });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateCategory = async (req, res) => {
    try {
        const { success, data, error } = categorySchema.safeParse(req.body);
        if (!success || error) {
            return res.status(400).json({ message: "Invalid category data", details: error.errors });
        }
        const category = await Category.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }
        res.status(200).json({ message: "Category updated", category });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteCategory = async (req, res) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id);
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }
        res.status(200).json({ message: "Category deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
