import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const secret = process.env.SECRET_JWT;

const roleMiddleware = async (req, res, next) => {
    try {
        const token = req.cookies?.token;
        if (!token) {
            return res.status(401).json({ message: "Authentication required" });
        }

        const decoded = jwt.verify(token, secret);
        if (!mongoose.isValidObjectId(decoded.id)) {
            return res.status(400).json({ message: "Invalid user ID in token" });
        }

        if (decoded.role === "admin" || req.user?.role === "admin") {
            next();
        } else {
            return res.status(403).json({ message: "Access denied. Admins only." });
        }
    } catch (e) {
        return res.status(401).json({ message: e.message });
    }
};

export default roleMiddleware;