import React, { useState } from "react";
import "./ProductCard.css";
import axios from "axios";

const ProductCard = ({ product }) => {
  const [message, setMessage] = useState("");

  // Prepend the backend URL to the image path
  const imageUrl = product.image.startsWith("http")
    ? product.image
    : `http://localhost:5000${product.image}`;

  const handleAddToCart = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("❌ No token found in localStorage!");
      setMessage("Please log in to add items to the cart.");
      return;
    }

    console.log("✅ Token being sent:", token); // Debugging token

    try {
      const response = await axios.post(
        "http://localhost:5000/api/cart",
        {
          productId: product._id,
          name: product.name,
          price: product.price,
          image: product.image,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("✅ Response from backend:", response.data);
      setMessage("Added to cart successfully!");
    } catch (error) {
      console.error(
        "❌ Error adding to cart:",
        error.response?.data || error.message
      );
      setMessage("Failed to add to cart. Please try again.");
    }

    setTimeout(() => setMessage(""), 3000);
  };

  return (
    <div className="product-card">
      <div className="product-image">
        <img src={imageUrl} alt={product.name} />
      </div>
      <div className="product-info">
        <h5 className="product-title">{product.name}</h5>
        <p className="product-description">{product.description}</p>
        <p className="product-price">${product.price}</p>
      </div>
      <div className="product-actions">
        <button className="btn view-btn">View Details</button>
        <button className="btn cart-btn" onClick={handleAddToCart}>
          Add to Cart
        </button>
      </div>
      {message && <p className="cart-message">{message}</p>}
    </div>
  );
};

export default ProductCard;
