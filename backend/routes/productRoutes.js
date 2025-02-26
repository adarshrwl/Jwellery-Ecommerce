const express = require("express");
const {
  addProduct,
  getProducts,
  getProductById, // ✅ Added missing function
  deleteProduct,
  updateProduct,
} = require("../controller/productController");

const { protect, adminOnly } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

// ✅ Admin: Add a new product
router.post("/", protect, adminOnly, upload.single("image"), addProduct);

// ✅ Admin: Get all products
router.get("/", getProducts);

// ✅ Admin: Get product by ID (Fix missing GET route)
router.get("/:id", getProductById); // ✅ This was missing

// ✅ Admin: Delete a product
router.delete("/:id", protect, adminOnly, deleteProduct);

// ✅ Admin: Update a product
router.put("/:id", protect, adminOnly, upload.single("image"), updateProduct);

module.exports = router;
