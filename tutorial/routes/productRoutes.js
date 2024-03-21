import express from "express";
import {
  updateProduct,
  getProductById,
  createProduct,
  getAllProducts,
  deleteProduct,
  getProductsCustomer,
} from "../controllers/productController.js";
import upload from "../middlewares/uploadMiddleware.js"; // Import upload
import { checkAuth, isAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post(
  "/create",
  checkAuth,
  isAdmin,
  upload.single("image"),
  createProduct
);
router.get("/CustomerGetProduct", getProductsCustomer);
router.get("/getproduct/:id", getProductById);
router.put("/updateproduct/:id", upload.single("image"), updateProduct);
router.get("/getallproduct", getAllProducts);
router.delete("/delete/:id", deleteProduct);

export default router;
