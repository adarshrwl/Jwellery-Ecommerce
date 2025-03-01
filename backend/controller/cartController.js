const mongoose = require("mongoose");
const Cart = require("../models/Cart");

// Add product to cart
const addToCart = async (req, res) => {
  try {
    const { productId, name, price, image, quantity = 1 } = req.body;
    const userId = req.user._id;

    if (!productId || !name || !price || !image) {
      return res
        .status(400)
        .json({ message: "Product ID, name, price, and image are required" });
    }

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid Product ID" });
    }

    if (!Number.isInteger(quantity) || quantity < 1) {
      return res
        .status(400)
        .json({ message: "Quantity must be a positive integer" });
    }

    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({
        user: userId,
        items: [],
      });
    }

    const existingItemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (existingItemIndex > -1) {
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      cart.items.push({
        product: new mongoose.Types.ObjectId(productId),
        name,
        price,
        image,
        quantity,
      });
    }

    await cart.save();
    await cart.populate("items.product");

    return res.status(200).json({
      message: "Product added to cart successfully",
      cart,
    });
  } catch (error) {
    console.error("Error adding to cart:", error.message);
    return res.status(500).json({
      message: "Failed to add product to cart",
      error: error.message,
    });
  }
};

// Remove item from cart
const removeFromCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.params;

    console.log("Removing Product ID:", productId, typeof productId);

    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid Product ID" });
    }

    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );
    await cart.save();

    res.status(200).json({ message: "Item removed from cart", cart });
  } catch (error) {
    console.error("Error removing from cart:", error);
    res
      .status(500)
      .json({ message: "Error removing from cart", error: error.message });
  }
};

// Get user cart
const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate(
      "items.product"
    );

    if (!cart) {
      return res.status(200).json({ items: [] });
    }

    res.status(200).json(cart);
  } catch (error) {
    console.error("Error fetching cart:", error);
    res
      .status(500)
      .json({ message: "Error fetching cart", error: error.message });
  }
};

// Update item quantity
const updateCartItem = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId, quantity } = req.body;

    console.log(
      "Updating Cart Item - Product ID:",
      productId,
      "Quantity:",
      quantity
    );

    if (!productId || quantity === undefined || quantity < 1) {
      return res
        .status(400)
        .json({ message: "Product ID and valid quantity are required" });
    }

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid Product ID" });
    }

    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.items.find(
      (item) => item.product.toString() === productId
    );
    if (!item) return res.status(404).json({ message: "Product not in cart" });

    item.quantity = quantity;
    await cart.save();

    res.status(200).json({ message: "Cart updated successfully", cart });
  } catch (error) {
    console.error("Error updating cart:", error);
    res
      .status(500)
      .json({ message: "Error updating cart", error: error.message });
  }
};

module.exports = { addToCart, removeFromCart, getCart, updateCartItem };
