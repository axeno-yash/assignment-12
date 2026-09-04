import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const secret = process.env.SECRET_JWT;

const roleMiddleware = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        const decoded = jwt.verify(token, secret);

        if (!mongoose.isValidObjectId(decoded.id)) {
            return res.status(400).json({
                message: e.message
            })
        }

        if (decoded.role === "admin") {
            req.user = decoded;
            next();
        } else {
            return res.status(403).json({
                message: "Access denied. Admins only."
            });
        }

    } catch (e) {
        return res.status(400).json({
            message: e.message
        });
    }
}

export default roleMiddleware;