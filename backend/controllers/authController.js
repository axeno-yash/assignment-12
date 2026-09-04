import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import { z } from "zod";
import generateToken from "../utils/generateToken.js";

const saltRounds = 10;

const signup = async (req, res) => {
    try {
        const schema = z.object({
            name: z.string(),
            email: z.email(),
            password: z.string().min(6),
            phone: z.number().min(10).optional(),
            address: z.string().optional()
        }).strict();

        const { success, error, data } = schema.safeParse(req.body);

        if (error || !success) {
            return res.status(400).json({
                message: "Invalid Credentials",
                data
            });
        }
        const { name, email, password, phone, address } = data;

        const user = await User.find({ email });

        if (user.length > 0) {
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
        console.log(createdUser);

        return res.status(201).json({
            _id: createdUser._id,
            name: createdUser.name,
            email: createdUser.email,
            phone: createdUser?.phone,
            address: createdUser?.address,
            token: generateToken(createdUser._id, createdUser.email, createdUser.role)
        });

    } catch (err) {
        return res.status(500).json({
            message: err.message
        });
    }
};

const signin = async (req, res) => {
    try {
        const schema = z.object({
            email: z.email(),
            password: z.string().min(6)
        }).strict();

        const { success, data, error } = schema.safeParse(req.body);
        if (error || !success) {
            return res.status(400).json({
                message: "Invalid Credentials"
            });
        }

        const { email, password } = data;

        const user = await User.findOne({ email }).select("+password");
        if (!user) {
            return res.status(404).json({
                message: "User doesn't exist"
            });
        }

        const result = await bcrypt.compare(password, user.password);
        if (!result) {
            return res.status(401).json({
                message: "Wrong password"
            });
        } else {
            const token = generateToken(user._id, user.email, user.role);

            res.cookie("token", token);

            return res.status(200).json({
                message: "Signin successful",
                _id: user._id,
                email: user.email,
                role: user.role,
                token: token
            });
        }

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

export {
    signup,
    signin,
    logout
};
