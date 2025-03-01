import React, { Fragment, useState, useEffect } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  InputGroup,
  Row,
} from "react-bootstrap";
import PropTypes from "prop-types";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import "./cart.css";

const SideBar = ({ cart }) => {
  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shippingFee = 209;
  const total = subtotal + shippingFee;

  return (
    <Card className="ezy__epcart4-card sticky-top shadow-lg">
      <Card.Body className="p-4">
        <h5 className="mb-4 text-center fw-bold text-white">Order Summary</h5>
        <div className="d-flex justify-content-between align-items-center mb-3 text-light">
          <span>Subtotal</span>
          <span className="fw-bold">Rs. {subtotal.toFixed(2)}</span>
        </div>
        <hr className="ezy__epcart4-hr" />
        <div className="d-flex justify-content-between align-items-center mb-3 text-light">
          <span>Shipping Fee</span>
          <span className="fw-bold">Rs. {shippingFee}</span>
        </div>
        <hr className="ezy__epcart4-hr" />
        <div className="d-flex justify-content-between align-items-center text-light">
          <span className="fs-4 fw-bold">Total</span>
          <span className="fw-bold fs-3 text-warning">
            Rs. {total.toFixed(2)}
          </span>
        </div>
      </Card.Body>
      <Card.Body className="p-4 pt-0">
        <Button className="ezy__epcart4-btn w-100 rounded-pill shadow-sm">
          Buy Now ({cart.length})
        </Button>
      </Card.Body>
    </Card>
  );
};

const QtyField = ({ name, value, onChange }) => {
  const qtyControl = (qty) =>
    onChange({
      target: {
        name,
        type: "radio",
        value: qty < 1 ? 1 : qty,
      },
    });

  return (
    <div className="d-flex align-items-center ezy__epcart4-qty">
      <Button
        variant=""
        type="button"
        onClick={() => qtyControl(value - 1)}
        className="qty-btn px-2"
      >
        −
      </Button>
      <Form.Control
        type="number"
        value={value}
        onChange={(e) => qtyControl(Number(e.target.value))}
        className="text-center qty-input mx-1"
      />
      <Button
        variant=""
        type="button"
        onClick={() => qtyControl(value + 1)}
        className="qty-btn px-2"
      >
        +
      </Button>
    </div>
  );
};

QtyField.propTypes = {
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.any,
};

const ProductItem = ({ item, index, onChange, removeItem }) => {
  const baseUrl = "http://localhost:5000";
  const imageUrl = item.image.startsWith("http")
    ? item.image
    : `${baseUrl}${item.image}`;

  // Ensure item.product is a string (ObjectId as a string)
  const productId = item.product?.toString() || "";

  return (
    <Card.Body className="d-flex align-items-center p-4 border-bottom border-dark">
      <div className="ezy__epcart4-image me-4">
        <img
          src={imageUrl}
          alt={item.name}
          className="img-fluid rounded shadow-sm"
          style={{ maxWidth: "130px", height: "auto" }}
          onError={(e) => {
            e.target.src =
              "https://via.placeholder.com/130?text=Image+Not+Found";
          }}
        />
      </div>
      <div className="flex-grow-1 text-light">
        <div className="ezy__epcart4-heading mb-2">
          <a href="#!" className="fs-5 fw-medium text-white">
            {item.name}
          </a>
        </div>
        <div className="d-flex align-items-center">
          <h3 className="ezy__epcart4-price mb-0 fw-bold text-warning me-2">
            Rs. {item.price}
          </h3>
          <QtyField
            name={`ezy__epcart4-qty-${index}`}
            value={item.quantity}
            onChange={(e) => onChange(e, index)}
          />
        </div>
      </div>
      <div className="ms-3">
        <Button
          variant=""
          className="ezy__epcart4-del rounded-circle p-2 shadow-sm"
          onClick={() => removeItem(productId)} // Use the stringified productId
        >
          <FontAwesomeIcon icon={faTimes} className="fs-5 text-danger" />
        </Button>
      </div>
    </Card.Body>
  );
};

ProductItem.propTypes = {
  item: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  removeItem: PropTypes.func.isRequired,
};

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(""); // Add state for success/error messages
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchCart = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const { data } = await axios.get("http://localhost:5000/api/cart", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCart(data.items || []);
      } catch (error) {
        console.error(
          "Error fetching cart:",
          error.response?.data || error.message
        );
        setMessage("Error fetching cart. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, [token]);

  const onChange = async (e, index) => {
    const { value } = e.target;
    const updatedCart = [...cart];
    updatedCart[index].quantity = Number(value);
    setCart(updatedCart);

    try {
      await axios.put(
        "http://localhost:5000/api/cart",
        {
          productId: cart[index].product.toString(), // Ensure productId is a string
          quantity: Number(value),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage("Cart updated successfully!");
      setTimeout(() => setMessage(""), 3000); // Clear message after 3 seconds
    } catch (error) {
      console.error(
        "Error updating cart:",
        error.response?.data || error.message
      );
      setMessage("Error updating cart. Please try again.");
    }
  };

  const removeItem = async (productId) => {
    try {
      await axios.delete(`http://localhost:5000/api/cart/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCart(cart.filter((item) => item.product.toString() !== productId));
      setMessage("Item removed from cart successfully!");
      setTimeout(() => setMessage(""), 3000); // Clear message after 3 seconds
    } catch (error) {
      console.error(
        "Error removing item from cart:",
        error.response?.data || error.message
      );
      setMessage("Error removing item from cart. Please try again.");
    }
  };

  return (
    <section className="ezy__epcart4 dark-gray py-5">
      <Container>
        <h2 className="text-center mb-5 fw-bold text-white animate__fadeIn">
          Your Cart
        </h2>
        {loading ? (
          <p className="text-center text-muted">Loading cart...</p>
        ) : cart.length === 0 ? (
          <p className="text-center text-muted fs-4">Your cart is empty.</p>
        ) : (
          <Row>
            <Col lg={8}>
              <Card className="ezy__epcart4-card mb-4 shadow-lg">
                {cart.map((item, i) => (
                  <Fragment key={i}>
                    <ProductItem
                      item={item}
                      index={i}
                      onChange={onChange}
                      removeItem={removeItem}
                    />
                  </Fragment>
                ))}
              </Card>
            </Col>
            <Col lg={4}>
              <SideBar cart={cart} />
            </Col>
          </Row>
        )}
        {message && (
          <p
            className={
              message.includes("successfully")
                ? "success-message text-center"
                : "error-message text-center"
            }
          >
            {message}
          </p>
        )}
      </Container>
    </section>
  );
};

export default Cart;
