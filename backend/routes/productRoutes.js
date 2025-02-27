const express = require("express");
const {
  addProduct,
  getProducts,
  getProductById,
  deleteProduct,
  updateProduct,
} = require("../controller/productController");

const { protect, adminOnly } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

// ✅ Admin: Add a new product
router.post("/", protect, adminOnly, upload.single("image"), addProduct);

// ✅ Get all products (Filter by category supported)
router.get("/", getProducts);

// ✅ Get product by ID
router.get("/:id", getProductById);

// ✅ Admin: Delete a product
router.delete("/:id", protect, adminOnly, deleteProduct);

// ✅ Admin: Update a product
router.put("/:id", protect, adminOnly, upload.single("image"), updateProduct);

module.exports = router;
