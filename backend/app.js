import "dotenv/config";

import express from "express";
import cookieParser from "cookie-parser";
import connectionDB from "./config/db.js";

const app = express();
const PORT = process.env.PORT || 3000;
connectionDB();

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

import authRoute from "./routes/auth.route.js";
import userRoute from "./routes/user.route.js";
import adminRoute from "./routes/admin.route.js";

app.get("/", (req, res) => {
	res.status(200).json({
		status: "Everything is working fine."
	})
})

app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api/admin", adminRoute);

app.use((req, res, err) => {
	res.status(400).json({
		message: `Something Broke ${err.message}`
	})
})

app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});