import { Router } from "express";
import * as productController from "../controllers/productController";
import { requireAuth } from "@clerk/express";
import multer from "multer";
import path from "path";
import * as uploadController from "../controllers/uploadController";

// configure multer with security controls


const uploadsDir = path.join(process.cwd(), "uploads");
const upload = multer({
  dest: uploadsDir,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (_req, file, cb) => {
    const allowedMimes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
 },
});

const router = Router();

// GET /api/products => Get all products (public)
router.get("/", productController.getAllProducts);

// GET /api/products/my - Get current user's products (protected)
router.get("/my", requireAuth(), productController.getMyProducts);

// GET /api/products/:id - Get single product by ID (public)
router.get("/:id", productController.getProductById);

// POST /api/products - Create new product (protected)
router.post("/", requireAuth(), productController.createProduct);

// POST /api/products/upload - Upload a product image (protected)
router.post("/upload", requireAuth(), upload.single("image"), uploadController.uploadImage);

// PUT /api/products/:id - Update product (protected - owner only)
router.put("/:id", requireAuth(), productController.updateProduct);

// DELETE /api/products/:id - Delete product (protected - owner only)
router.delete("/:id", requireAuth(), productController.deleteProduct);

export default router;