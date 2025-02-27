import React from "react";
import "./ProductCard.css"; // Ensure you create and link this CSS file

const ProductCard = ({ product }) => {
  // Prepend the backend URL to the image path
  const imageUrl = product.image.startsWith("http")
    ? product.image
    : `http://localhost:5000${product.image}`;

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
        <button className="btn cart-btn">Add to Cart</button>
      </div>
    </div>
  );
};

export default ProductCard;
