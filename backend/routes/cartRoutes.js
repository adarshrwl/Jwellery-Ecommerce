const express = require("express");
const {
  addToCart,
  removeFromCart,
  getCart,
  updateCartItem,
} = require("../controller/cartController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, getCart);
router.post("/", protect, addToCart);
router.put("/", protect, updateCartItem);
router.delete("/:productId", protect, removeFromCart);

module.exports = router;
