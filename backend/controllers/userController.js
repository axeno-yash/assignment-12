import User from "../models/user.model.js";
import { z } from "zod";

const updateProfileSchema = z.object({
    name: z.string().min(1).optional(),
    phone: z.number().min(10).optional(),
    address: z.string().min(1).optional(),
}).strict();

export const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateUserProfile = async (req, res) => {
    try {
        const { success, data, error } = updateProfileSchema.safeParse(req.body);
        if (!success || error) {
            return res.status(400).json({ message: "Invalid profile data", details: error.errors });
        }

        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (data.name) user.name = data.name;
        if (data.phone) user.phone = data.phone;
        if (data.address) user.address = data.address;

        const updatedUser = await user.save();
        res.status(200).json({
            message: "Profile updated successfully",
            user: {
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                phone: updatedUser.phone,
                address: updatedUser.address,
                role: updatedUser.role,
            },
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
