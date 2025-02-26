import React from "react";
import { Button, Card, Container, Row, Col } from "react-bootstrap";
import { motion } from "framer-motion";
import "./HomePage.css";

const HomePage = () => {
  return (
    <div className="bg-light text-dark">
      {/* Hero Section */}
      <div
        className="position-relative text-center text-white d-flex flex-column justify-content-center align-items-center"
        style={{
          height: "100vh",
          backgroundImage: "url('/hero-image.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <motion.h1
          className="display-4 fw-bold mb-3 text-shadow"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          Discover Stunning Earrings for Every Occasion
        </motion.h1>
        <motion.p
          className="lead mb-4 text-shadow"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          Explore our exclusive collection of elegant, trendy, and timeless
          designs.
        </motion.p>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
        >
          <Button variant="dark" size="lg" className="rounded-pill">
            Shop Now
          </Button>
        </motion.div>
      </div>

      {/* Featured Products Section */}
      <Container className="py-5">
        <h2 className="text-center mb-4 fw-bold">Featured Earrings</h2>
        <Row className="g-4">
          {[
            {
              id: 1,
              name: "Gold Hoop Earrings",
              price: "$49.99",
              image: "/earring-1.jpg",
            },
            {
              id: 2,
              name: "Diamond Stud Earrings",
              price: "$79.99",
              image: "/earring-2.jpg",
            },
            {
              id: 3,
              name: "Silver Drop Earrings",
              price: "$59.99",
              image: "/earring-3.jpg",
            },
            {
              id: 4,
              name: "Luxury Pearl Earrings",
              price: "$89.99",
              image: "/earring-4.jpg",
            },
          ].map((earring) => (
            <Col key={earring.id} xs={12} sm={6} md={4} lg={3}>
              <Card className="shadow-sm border-0">
                <Card.Img
                  variant="top"
                  src={earring.image}
                  alt={earring.name}
                  style={{ height: "250px", objectFit: "cover" }}
                />
                <Card.Body className="text-center">
                  <Card.Title className="fw-semibold">
                    {earring.name}
                  </Card.Title>
                  <Card.Text className="text-muted">{earring.price}</Card.Text>
                  <Button variant="dark" className="rounded-pill w-100">
                    Add to Cart
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
};

export default HomePage;
