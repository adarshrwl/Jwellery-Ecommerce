import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./AdminProductPage.css";

const AdminProductPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editProductId, setEditProductId] = useState(null);
  const [message, setMessage] = useState(""); // Added message state
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // Fixed Categories
  const CATEGORIES = ["Gold", "AD", "Diamond", "Indian"];

  // Fetch products function
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("http://localhost:5000/api/products", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(data);
    } catch (err) {
      setError("Error fetching products: " + err.message);
    }
    setLoading(false);
  }, [token]);

  useEffect(() => {
    if (!token) {
      navigate("/login"); // Redirect to login if not authenticated
    } else {
      fetchProducts();
    }
  }, [navigate, token, fetchProducts]); // Added fetchProducts to dependency array

  const handleEdit = (id) => {
    setEditProductId(id);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await axios.delete(`http://localhost:5000/api/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessage("✅ Product deleted successfully!");
        fetchProducts(); // Refresh the product list
      } catch (error) {
        setMessage("❌ Error deleting product: " + error.message);
      }
    }
  };

  return (
    <div className="admin-product-page">
      {editProductId ? (
        <AdminEditProduct
          productId={editProductId}
          setEditProductId={setEditProductId}
          fetchProducts={fetchProducts}
          categories={CATEGORIES}
        />
      ) : (
        <>
          <h2>Manage Products</h2>
          {loading && <p>Loading products...</p>}
          {error && <p className="error">{error}</p>}
          {message && <p className="message">{message}</p>}
          <table className="table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Price</th>
                <th>Category</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td>
                    <img
                      src={`http://localhost:5000${product.image}`} // Add backend URL
                      alt={product.name}
                      className="product-image"
                    />
                  </td>
                  <td>{product.name}</td>
                  <td>${product.price}</td>
                  <td>{product.category}</td>
                  <td>{product.stock}</td>
                  <td>
                    <button
                      className="btn btn-warning"
                      onClick={() => handleEdit(product._id)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDelete(product._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

const AdminEditProduct = ({
  productId,
  setEditProductId,
  fetchProducts,
  categories,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: categories[0], // Default to the first category
    stock: "",
    image: null,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [message, setMessage] = useState("");
  const token = localStorage.getItem("token");

  // Fetch product function
  const fetchProduct = useCallback(async () => {
    try {
      const { data } = await axios.get(
        `http://localhost:5000/api/products/${productId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFormData({ ...data, image: null });
      setImagePreview(`http://localhost:5000${data.image}`); // Add backend URL
    } catch (error) {
      setMessage("Error fetching product details: " + error.message);
    }
  }, [productId, token]);

  useEffect(() => {
    if (productId) {
      fetchProduct();
    }
  }, [productId, fetchProduct]); // Added fetchProduct to dependency array

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      setImagePreview(URL.createObjectURL(file)); // Preview new image
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
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
      await axios.put(
        `http://localhost:5000/api/products/${productId}`,
        formDataObj,
        config
      );
      setMessage("✅ Product updated successfully!");
      fetchProducts(); // Refresh the product list
      setEditProductId(null); // Close the edit form
    } catch (error) {
      setMessage("❌ Error updating product: " + error.message);
    }
  };

  return (
    <div className="admin-product-form">
      <h2>Edit Product</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          required
        ></textarea>
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="stock"
          placeholder="Stock Quantity"
          value={formData.stock}
          onChange={handleChange}
          required
        />
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <input type="file" accept="image/*" onChange={handleFileChange} />
        {imagePreview && (
          <img
            src={
              imagePreview.startsWith("blob:")
                ? imagePreview
                : `http://localhost:5000${imagePreview}`
            }
            alt="Preview"
            className="image-preview"
          />
        )}
        <button type="submit">Update Product</button>
        <button type="button" onClick={() => setEditProductId(null)}>
          Cancel
        </button>
      </form>
    </div>
  );
};

export default AdminProductPage;
