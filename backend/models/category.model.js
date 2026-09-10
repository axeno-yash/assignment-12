import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Category name is required"],
            unique: true,
            trim: true,
        },
        slug: {
            type: String,
            unique: true,
            sparse: true,
            trim: true,
            lowercase: true,
        },
    },
    {
        timestamps: true,
    }
);

function slugifyName(value = "") {
    return String(value).toLowerCase().trim().split(" ").filter(Boolean).join("-");
}

categorySchema.pre("validate", function () {
    if (!this.slug && this.name) {
        this.slug = slugifyName(this.name);
    }
});

const Category = mongoose.model("Category", categorySchema);

export default Category;