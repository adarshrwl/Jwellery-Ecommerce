const mongoose = require("mongoose");

const CATEGORIES = ["Gold", "AD", "Diamond", "Indian"]; // ✅ Fixed categories
const reviewSchema = mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
  },
  { timestamps: true }
);

const productSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, enum: CATEGORIES, required: true }, // ✅ Restrict to fixed categories
    image: { type: String, required: true },
    stock: { type: Number, required: true, default: 1 },
    sales: { type: Number, default: 0 },
    reviews: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        rating: { type: Number, required: true, min: 1, max: 5 },
        comment: { type: String, required: true },
      },
    ],
    averageRating: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
