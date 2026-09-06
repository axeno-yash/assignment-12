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

const router = express.Router();

router.get("/", getProducts);
router.get("/:id", getProductById);

router.use(authMiddleware);
router.use(roleMiddleware);

router.post("/", createProduct);
router.put("/:id", updateProduct);
router.patch("/:id/stock", updateProductStock);
router.delete("/:id", deleteProduct);

export default router;
