import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./AdminAddProduct.css";

const AdminAddProduct = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login"); // Redirect to login if not authenticated
    }
  }, [navigate]);

  // Fixed Categories
  const CATEGORIES = ["Gold", "AD", "Diamond", "Indian"];

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: CATEGORIES[0], // ✅ Default to the first category
    stock: "",
    image: null,
  });

  const [message, setMessage] = useState("");

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle file upload
  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("Unauthorized: Please login as admin.");
      return;
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    };

    const formDataObj = new FormData();
    for (let key in formData) {
      formDataObj.append(key, formData[key]);
    }

    try {
      await axios.post(
        "http://localhost:5000/api/products",
        formDataObj,
        config
      );
      setMessage("✅ Product added successfully!");
    } catch (error) {
      setMessage("❌ Error adding product. Please try again.");
    }
  };

  return (
    <div className="admin-product-form">
      <h2>Add New Product</h2>
      {message && <p>{message}</p>}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          onChange={handleChange}
          required
        ></textarea>
        <input
          type="number"
          name="price"
          placeholder="Price"
          onChange={handleChange}
          required
        />

        {/* ✅ Dropdown for fixed categories */}
        <select name="category" onChange={handleChange} required>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <input
          type="number"
          name="stock"
          placeholder="Stock Quantity"
          onChange={handleChange}
          required
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          required
        />
        <button type="submit">Add Product</button>
      </form>
    </div>
  );
};

export default AdminAddProduct;
