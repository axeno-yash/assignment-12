import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import connectionDB from "./config/db.js";

import authRoute from "./routes/auth.route.js";
import userRoute from "./routes/user.route.js";
import productsRoute from "./routes/products.route.js";
import categoryRoute from "./routes/category.route.js";
import cartRoute from "./routes/cart.route.js";
import orderRoute from "./routes/order.route.js";
import adminRoute from "./routes/admin.route.js";
import reviewsRoute from "./routes/reviews.route.js";

const app = express();
const PORT = process.env.PORT || 3000;
connectionDB();

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use("/public", express.static("public"));

app.get("/", (req, res) => {
    res.status(200).json({
        status: "Everything is working fine."
    });
});

app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api/products", productsRoute);
app.use("/api/categories", categoryRoute);
app.use("/api/cart", cartRoute);
app.use("/api/orders", orderRoute);
app.use("/api/admin", adminRoute);
app.use("/api/reviews", reviewsRoute);

app.use((err, req, res, next) => {
    res.status(err.status || 500).json({
        message: err.message || "Internal Server Error"
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});