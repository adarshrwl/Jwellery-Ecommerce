import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Button, Card, Container, Row, Col, Form } from "react-bootstrap";
import "./productDescription.css";

const ProductDescription = () => {
  const { id } = useParams(); // Get productId from URL (e.g., /products/:id)
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1); // State for quantity
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:5000/api/products/${id}`
        );
        setProduct(data);
      } catch (err) {
        setError(
          err.response?.data?.message || "Error fetching product details"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!token) {
      alert("Please log in to add items to your cart.");
      return;
    }

    try {
      await axios.post(
        "http://localhost:5000/api/cart",
        {
          productId: id,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity, // Include quantity in the cart request
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Product added to cart successfully!");
    } catch (err) {
      alert(
        "Error adding product to cart: " +
          (err.response?.data?.message || err.message)
      );
    }
  };

  const handleQuantityChange = (e) => {
    const value = Math.max(1, Number(e.target.value)); // Ensure quantity is at least 1
    setQuantity(value > product.stock ? product.stock : value); // Limit to available stock
  };

  if (loading) {
    return (
      <Container className="ezy__product-desc py-5">
        <p className="text-center text-muted animate__fadeIn">
          Loading product details...
        </p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="ezy__product-desc py-5">
        <p className="text-center error-message animate__fadeIn">{error}</p>
      </Container>
    );
  }

  return (
    <Container className="ezy__product-desc py-5">
      <Row className="justify-content-center">
        <Col lg={10}>
          <Card className="ezy__product-desc-card shadow-lg animate__fadeIn">
            <Row className="g-0">
              <Col md={5}>
                <div className="ezy__product-desc-image">
                  <img
                    src={
                      product.image.startsWith("http")
                        ? product.image
                        : `http://localhost:5000${product.image}`
                    }
                    alt={product.name}
                    className="img-fluid rounded-start"
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/400?text=Image+Not+Found";
                    }}
                  />
                </div>
              </Col>
              <Col md={7} className="p-4">
                <h2 className="ezy__product-desc-title">{product.name}</h2>
                <p className="ezy__product-desc-price">
                  Rs. {product.price.toFixed(2)}
                </p>
                <p className="ezy__product-desc-category">
                  Category: {product.category}
                </p>
                <p className="ezy__product-desc-stock">
                  {product.stock > 0
                    ? `In Stock: ${product.stock}`
                    : "Out of Stock"}
                </p>
                <div className="ezy__product-desc-text">
                  <h5>Description</h5>
                  <p>{product.description}</p>
                </div>
                {product.stock > 0 && (
                  <div className="d-flex align-items-center mt-3">
                    <Form.Label className="text-white me-3">
                      Quantity:
                    </Form.Label>
                    <Form.Control
                      type="number"
                      min="1"
                      max={product.stock}
                      value={quantity}
                      onChange={handleQuantityChange}
                      className="ezy__product-desc-quantity"
                    />
                    <Button
                      className="ezy__product-desc-btn ms-3"
                      onClick={handleAddToCart}
                      disabled={product.stock === 0}
                    >
                      {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
                    </Button>
                  </div>
                )}
              </Col>
            </Row>
            {/* Reviews Section */}
            <Card.Body className="p-4">
              <h4 className="text-white mb-3">
                Reviews ({product.reviews.length})
              </h4>
              {product.reviews.length === 0 ? (
                <p className="text-muted">No reviews yet.</p>
              ) : (
                product.reviews.map((review, index) => (
                  <div key={index} className="ezy__product-desc-review mb-3">
                    <p className="text-light mb-1">
                      <strong>User {review.user}</strong> - {review.rating}/5
                    </p>
                    <p className="text-light">{review.comment}</p>
                    <hr className="ezy__product-desc-review-separator" />
                  </div>
                ))
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ProductDescription;
