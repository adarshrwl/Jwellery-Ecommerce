// models/Cart.js
const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true, // Optimize queries by user
    },
    items: {
      type: [
        {
          product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
          },
          name: {
            type: String,
            required: true,
          },
          price: {
            type: Number,
            required: true,
            min: 0, // Prevent negative prices
          },
          image: {
            type: String,
            required: true,
          },
          quantity: {
            type: Number,
            required: true,
            default: 1,
            min: 1, // Prevent negative or zero quantities
          },
        },
      ],
      default: [], // Explicitly empty array
    },
  },
  { timestamps: true }
);

const Cart = mongoose.model("Cart", cartSchema);
module.exports = Cart;
