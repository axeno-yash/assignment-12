import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import Category from "../models/category.model.js";
import Product from "../models/product.model.js";
import Cart from "../models/cart.model.js";
import Order from "../models/order.model.js";
import { categoriesData, usersData, getProductsData } from "./data.js";

const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to Database for seeding");

        await Cart.deleteMany({});
        await Order.deleteMany({});
        await Product.deleteMany({});
        await Category.deleteMany({});
        await User.deleteMany({});
        console.log("Cleared existing data");

        const createdCategories = await Category.insertMany(categoriesData);
        console.log(`Inserted ${createdCategories.length} categories`);

        const categoryMap = {};
        createdCategories.forEach((cat) => {
            categoryMap[cat.name] = cat._id;
        });

        const saltRounds = 10;
        const hashedUsers = await Promise.all(
            usersData.map(async (u) => {
                const salt = await bcrypt.genSalt(saltRounds);
                const hashedPassword = await bcrypt.hash(u.password, salt);
                return {
                    ...u,
                    password: hashedPassword,
                };
            })
        );

        const createdUsers = await User.insertMany(hashedUsers);
        console.log(`Inserted ${createdUsers.length} users`);

        const productsToInsert = getProductsData(categoryMap);
        const createdProducts = await Product.insertMany(productsToInsert);
        console.log(`Inserted ${createdProducts.length} products`);

        const customerUser = createdUsers.find((u) => u.role === "customer");
        if (customerUser && createdProducts.length >= 2) {
            const p1 = createdProducts[0];
            const p2 = createdProducts[1];

            const sampleOrder = {
                user: customerUser._id,
                items: [
                    {
                        product: p1._id,
                        title: p1.title,
                        size: p1.variants[0].size,
                        priceAtPurchase: p1.price,
                        quantity: 1,
                    },
                    {
                        product: p2._id,
                        title: p2.title,
                        size: p2.variants[0].size,
                        priceAtPurchase: p2.price,
                        quantity: 2,
                    },
                ],
                subtotal: p1.price + p2.price * 2,
                discount: 10,
                couponApplied: "SAVE10",
                total: p1.price + p2.price * 2 - 10,
                status: "pending",
                shippingInfo: customerUser.address,
            };

            await Order.create(sampleOrder);
            console.log("Inserted sample order");
        }

        console.log("Database seeded successfully!");
        process.exit(0);
    } catch (error) {
        console.error("Error seeding database:", error.message);
        process.exit(1);
    }
};

seedDatabase();
