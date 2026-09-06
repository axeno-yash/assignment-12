import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import { z } from "zod";
import generateToken from "../utils/generateToken.js";

const saltRounds = 10;

const signupSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    phone: z.number().min(10).optional(),
    address: z.string().optional(),
}).strict();

const signinSchema = z.object({
    email: z.email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters"),
}).strict();

const signup = async (req, res) => {
    try {
        const { success, data, error } = signupSchema.safeParse(req.body);
        if (!success || error) {
            return res.status(400).json({
                message: "Invalid input data",
                details: error.errors
            });
        }
        const { name, email, password, phone, address } = data;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                message: "User already exists"
            });
        }

        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(password, salt);
        const createdUser = await User.create({
            name,
            email,
            password: hashedPassword,
            phone,
            address
        });

        const token = generateToken(createdUser._id, createdUser.email, createdUser.role);
        res.cookie("token", token);

        return res.status(201).json({
            _id: createdUser._id,
            name: createdUser.name,
            email: createdUser.email,
            phone: createdUser?.phone,
            address: createdUser?.address,
            role: createdUser.role,
            token
        });
    } catch (err) {
        return res.status(500).json({
            message: err.message
        });
    }
};

const signin = async (req, res) => {
    try {
        const { success, data, error } = signinSchema.safeParse(req.body);
        if (!success || error) {
            return res.status(400).json({
                message: "Invalid input data",
                details: error.errors
            });
        }

        const { email, password } = data;
        const user = await User.findOne({ email }).select("+password");
        if (!user) {
            return res.status(404).json({
                message: "User doesn't exist"
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                message: "Wrong password"
            });
        }

        const token = generateToken(user._id, user.email, user.role);
        res.cookie("token", token);

        return res.status(200).json({
            message: "Signin successful",
            _id: user._id,
            email: user.email,
            role: user.role,
            token
        });
    } catch (err) {
        return res.status(500).json({
            message: err.message
        });
    }
};

const logout = async (req, res) => {
    try {
        res.clearCookie("token");
        return res.status(200).json({
            message: "Logged out successfully"
        });
    } catch (err) {
        return res.status(500).json({
            message: err.message
        });
    }
};

export { signup, signin, logout };
