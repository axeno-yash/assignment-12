import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter your Name!"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please enter your Email!"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    role: {
      type: String,
      enum: ["customer", "admin"],
      default: "customer",
    },
    password: {
      type: String,
      trim: true,
      required: [true, "Please enter your Password"],
      minlength: [6, "Password must be at least 6 characters long"],
      select: false,
    },
    phone: {
      type: Number,
      trim: true,
      min: [10, "Phone number must be at least 10 digits long"]
    },
    address: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;