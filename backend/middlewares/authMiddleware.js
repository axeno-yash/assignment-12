import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import mongoose from "mongoose";

const secret = process.env.SECRET_JWT;

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.cookies?.token;
        if (!token) {
            return res.status(401).json({ message: "Authentication required" });
        }

        const decoded = jwt.verify(token, secret);
        if (!mongoose.isValidObjectId(decoded.id)) {
            return res.status(400).json({ message: "Invalid user ID in token" });
        }

        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        req.user = user;
        next();
    } catch (e) {
        return res.status(401).json({ message: e.message });
    }
};

export default authMiddleware;