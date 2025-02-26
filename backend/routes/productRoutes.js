const express = require("express");
const {
  addProduct,
  getProducts,
  deleteProduct,
  updateProduct,
} = require("../controller/productController");

const { protect, adminOnly } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

// ✅ Admin: Add a new product
router.post("/", protect, adminOnly, upload.single("image"), addProduct);

// ✅ Admin: Get all products
router.get("/", protect, adminOnly, getProducts);

// ✅ Admin: Delete a product
router.delete("/:id", protect, adminOnly, deleteProduct);

// ✅ Admin: Update a product
router.put("/:id", protect, adminOnly, upload.single("image"), updateProduct);

module.exports = router;
