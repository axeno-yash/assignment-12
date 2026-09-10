import express from "express";
import {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    updateProductStock,
    deleteProduct,
} from "../controllers/productController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import roleMiddleware from "../middlewares/roleMiddleware.js";
import { handleUpload } from "../utils/upload.js";

const router = express.Router();

router.get("/", getProducts);
router.get("/:id", getProductById);

router.use(authMiddleware);
router.use(roleMiddleware);

router.post("/", handleUpload, createProduct);
router.put("/:id", handleUpload, updateProduct);
router.patch("/:id/stock", updateProductStock);
router.delete("/:id", deleteProduct);

export default router;
