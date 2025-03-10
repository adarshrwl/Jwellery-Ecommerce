const Product = require("../models/Product");
const fs = require("fs");
const path = require("path");

// ✅ Admin: Add a new product
const addProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    if (!image)
      return res.status(400).json({ message: "Product image is required" });

    const newProduct = new Product({
      name,
      description,
      price,
      category,
      image,
      stock,
    });

    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding product", error: error.message });
  }
};

// ✅ Admin & User: Get all products (Supports category & sorting)
const getProducts = async (req, res) => {
  try {
    const { category, sort } = req.query;
    let filter = {};

    // ✅ Apply case-insensitive category filtering
    if (category) {
      filter.category = new RegExp(category, "i"); // Match category case-insensitively
    }

    let sortOption = {};
    if (sort === "topRated") sortOption = { averageRating: -1 };
    else if (sort === "topSeller") sortOption = { sales: -1 };
    else sortOption = { createdAt: -1 };

    console.log("Fetching products with filter:", filter);

    const products = await Product.find(filter).sort(sortOption);
    res.status(200).json(products);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching products", error: error.message });
  }
};

// ✅ Admin & User: Get product by ID
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.status(200).json(product);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching product", error: error.message });
  }
};

// ✅ Admin: Delete a product
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Delete the associated image file if it exists
    if (
      product.image &&
      fs.existsSync(path.join(__dirname, "..", product.image))
    ) {
      fs.unlinkSync(path.join(__dirname, "..", product.image));
    }

    await Product.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting product", error: error.message });
  }
};

// ✅ Admin: Update a product
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const { name, description, price, category, stock } = req.body;
    let image = product.image;

    if (req.file) {
      if (
        product.image &&
        fs.existsSync(path.join(__dirname, "..", product.image))
      ) {
        fs.unlinkSync(path.join(__dirname, "..", product.image));
      }
      image = `/uploads/${req.file.filename}`;
    }

    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    product.category = category || product.category;
    product.stock = stock || product.stock;
    product.image = image;

    const updatedProduct = await product.save();
    res.status(200).json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating product", error: error.message });
  }
};
const addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const productId = req.params.id;
    const userId = req.user._id; // Assuming req.user is set by authMiddleware

    if (!rating || !comment) {
      return res
        .status(400)
        .json({ message: "Rating and comment are required" });
    }

    if (rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ message: "Rating must be between 1 and 5" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check if user has already reviewed this product
    const existingReview = product.reviews.find(
      (review) => review.user.toString() === userId.toString()
    );
    if (existingReview) {
      return res
        .status(400)
        .json({ message: "You have already reviewed this product" });
    }

    // Add new review
    product.reviews.push({ user: userId, rating, comment });

    // Calculate new average rating
    const totalRatings = product.reviews.length;
    const sumRatings = product.reviews.reduce(
      (sum, review) => sum + review.rating,
      0
    );
    product.averageRating = totalRatings > 0 ? sumRatings / totalRatings : 0;

    await product.save();
    res.status(201).json({ message: "Review added successfully", product });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding review", error: error.message });
  }
};

module.exports = {
  addProduct,
  getProducts,
  getProductById,
  deleteProduct,
  updateProduct,
  addReview,
};
