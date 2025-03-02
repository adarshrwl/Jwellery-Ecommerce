import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Row, Col, Spinner } from "react-bootstrap";
import TopRatedProductCard from "../../common/ProductCard/ProductCard"; // Import the new component
import "./topRatedProducts.css";

const TopRatedProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTopRatedProducts = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/api/products");

        // Calculate average rating for each product and sort
        const productsWithRatings = data.map((product) => {
          const totalRatings = product.reviews.reduce(
            (sum, review) => sum + review.rating,
            0
          );
          const averageRating =
            product.reviews.length > 0
              ? totalRatings / product.reviews.length
              : 0;
          return { ...product, averageRating };
        });

        // Sort products by average rating in descending order
        const sortedProducts = productsWithRatings.sort(
          (a, b) => b.averageRating - a.averageRating
        );

        setProducts(sortedProducts);
      } catch (err) {
        setError(
          err.response?.data?.message || "Error fetching top rated products"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTopRatedProducts();
  }, []);

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="mt-2">Loading top rated products...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5 text-center">
        <p className="text-danger">{error}</p>
      </Container>
    );
  }

  return (
    <Container fluid className="ezy__top-rated py-5">
      <h2 className="text-center mb-5">Top Rated Products</h2>
      <Row xs={1} md={2} lg={3} xl={4} className="g-4 justify-content-center">
        {products.map((product) => (
          <Col key={product._id} className="d-flex justify-content-center">
            <TopRatedProductCard product={product} />
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default TopRatedProducts;
