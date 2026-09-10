import multer from "multer";
import fs from "fs";
import path from "path";

// ---- Upload limits (shown in admin UI + API errors) ----
export const MAX_IMAGE_FILES = 5;
export const MAX_IMAGE_SIZE_MB = 5;
const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024;

const assetsDir = path.join(process.cwd(), "public", "assets");
fs.mkdirSync(assetsDir, { recursive: true });

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, assetsDir),
    filename: (req, file, cb) => {
        const cleanName = String(file.originalname || "image")
            .toLowerCase()
            .trim()
            .split(" ")
            .filter(Boolean)
            .join("-");
        cb(null, `${Date.now()}-${cleanName}`);
    },
});

function imageOnly(req, file, cb) {
    if (file.mimetype.startsWith("image/")) {
        cb(null, true);
    } else {
        cb(new Error("Only image files are allowed"));
    }
}

const uploadImages = multer({
    storage,
    limits: { fileSize: MAX_IMAGE_SIZE_BYTES, files: MAX_IMAGE_FILES },
    fileFilter: imageOnly,
}).array("images", MAX_IMAGE_FILES);

export function handleUpload(req, res, next) {
    uploadImages(req, res, (err) => {
        if (!err) return next();
        if (err.code === "LIMIT_FILE_SIZE") {
            return res.status(400).json({
                message: `Each image must be under ${MAX_IMAGE_SIZE_MB}MB`,
            });
        }
        if (err.code === "LIMIT_FILE_COUNT" || err.code === "LIMIT_UNEXPECTED_FILE") {
            return res.status(400).json({
                message: `You can upload up to ${MAX_IMAGE_FILES} images at a time`,
            });
        }
        return res.status(400).json({ message: err.message });
    });
}
