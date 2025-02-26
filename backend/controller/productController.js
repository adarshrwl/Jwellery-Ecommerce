const Product = require("../models/Product");

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

// ✅ Admin: Get all products
const getProducts = async (req, res) => {
  try {
    const { category, sort } = req.query;
    let filter = {};

    if (category) {
      filter.category = category; // Filter by category
    }

    let sortOption = {};
    if (sort === "topRated") {
      sortOption = { averageRating: -1 }; // Sort by highest rating
    } else if (sort === "topSeller") {
      sortOption = { sales: -1 }; // Sort by highest sales
    } else {
      sortOption = { createdAt: -1 }; // Default: Newest first
    }

    const products = await Product.find(filter).sort(sortOption);
    res.status(200).json(products);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching products", error: error.message });
  }
};

// ✅ Admin: Delete a product
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    await product.remove();
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
    const image = req.file ? `/uploads/${req.file.filename}` : product.image;

    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    product.category = category || product.category;
    product.image = image;
    product.stock = stock || product.stock;

    const updatedProduct = await product.save();
    res.status(200).json(updatedProduct);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating product", error: error.message });
  }
};

module.exports = { addProduct, getProducts, deleteProduct, updateProduct };
