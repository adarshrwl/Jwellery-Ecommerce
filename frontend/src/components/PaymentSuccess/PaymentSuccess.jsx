import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Container, Row, Col, Button, Alert } from "react-bootstrap";
import "./PaymentSuccess.css"; // Create this CSS file

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);
  const paymentIntent = query.get("payment_intent");
  const paymentStatus = query.get("payment_status");

  useEffect(() => {
    if (!paymentIntent || paymentStatus !== "succeeded") {
      navigate("/payment"); // Redirect back to payment if no valid payment intent
    }
  }, [paymentIntent, paymentStatus, navigate]);

  const handleContinueShopping = () => {
    navigate("/"); // Redirect to homepage or products page
  };

  return (
    <Container className="ezy__payment-success py-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <div className="text-center">
            <h2 className="ezy__success-title">Payment Successful!</h2>
            <p className="ezy__success-text">
              Thank you for your purchase. Your payment has been processed
              successfully.
            </p>
            {paymentIntent && (
              <Alert variant="success" className="mt-3">
                Payment Intent ID: {paymentIntent}
                <br />
                Status: {paymentStatus}
              </Alert>
            )}
            <Button
              variant="primary"
              onClick={handleContinueShopping}
              className="mt-4 ezy__continue-btn"
            >
              Continue Shopping
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default PaymentSuccess;
