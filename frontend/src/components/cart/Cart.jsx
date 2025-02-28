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
  // Calculate cart total
  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shippingFee = 209;
  const tax = Math.round(subtotal * 0.1); // 10% tax
  const total = subtotal + shippingFee + tax;

  return (
    <Card className="ezy__epcart4-card sticky-top">
      <Card.Body className="p-md-4">
        <h6 className="mb-4 opacity-75">Order Summary</h6>
        <div className="d-flex justify-content-between align-items-center">
          <span>Sub total</span>
          <span className="fw-bold">${subtotal.toFixed(2)}</span>
        </div>
        <hr className="ezy__epcart4-hr" />
        <div className="d-flex justify-content-between align-items-center">
          <span>Shipping Fee</span>
          <span className="fw-bold">${shippingFee}</span>
        </div>
        <hr className="ezy__epcart4-hr" />
        <div className="d-flex justify-content-between align-items-center">
          <span>Tax</span>
          <span className="fw-bold">${tax}</span>
        </div>
        <hr className="ezy__epcart4-hr" />
        <div className="d-flex justify-content-between align-items-center">
          <span className="fs-5 fw-bold">Total</span>
          <span className="fw-bold">${total.toFixed(2)}</span>
        </div>
      </Card.Body>
      <Card.Body className="px-md-4 pb-md-4">
        <Button variant="" className="ezy__epcart4-btn w-100">
          BUY ({cart.length})
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
        value: qty < 1 ? 1 : qty, // Ensure quantity doesn't go below 1
      },
    });

  return (
    <InputGroup className="ezy__epcart4-qty mb-3">
      <Form.Control
        type="number"
        value={value}
        onChange={(e) => qtyControl(Number(e.target.value))}
      />
      <InputGroup.Text className="d-flex flex-column bg-transparent p-0">
        <Button variant="" type="button" onClick={() => qtyControl(value + 1)}>
          +
        </Button>
        <Button variant="" type="button" onClick={() => qtyControl(value - 1)}>
          -
        </Button>
      </InputGroup.Text>
    </InputGroup>
  );
};

QtyField.propTypes = {
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.any,
};

const ProductItem = ({ item, index, onChange, removeItem }) => {
  // Construct the full image URL
  const baseUrl = "http://localhost:5000"; // Adjust if your backend runs on a different port or domain
  const imageUrl = item.image.startsWith("http")
    ? item.image
    : `${baseUrl}${item.image}`;

  return (
    <Card.Body className="d-flex align-items-start p-md-4">
      <div className="ezy__epcart4-image me-3 me-md-4">
        <img
          src={imageUrl}
          alt={item.name}
          className="img-fluid"
          style={{ maxWidth: "100px", height: "auto" }} // Adjust size for clarity
          onError={(e) => {
            e.target.src =
              "https://via.placeholder.com/100?text=Image+Not+Found"; // Fallback image
          }}
        />
      </div>
      <div>
        <div className="ezy__epcart4-heading mb-3">
          <a href="#!">{item.name}</a>
        </div>
        <div>
          <QtyField
            name={`ezy__epcart4-qty-${index}`}
            value={item.quantity}
            onChange={(e) => onChange(e, index)}
          />
          <h3 className="ezy__epcart4-price mb-0">Rs. {item.price}</h3>
        </div>
      </div>
      <div>
        <Button
          variant=""
          className="ezy__epcart4-del d-inline-flex justify-content-center align-items-center rounded-circle p-0"
          onClick={() => removeItem(item.product)}
        >
          <FontAwesomeIcon icon={faTimes} className="fs-6" />
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
  const token = localStorage.getItem("token");

  // Fetch cart items from backend
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
        setCart(data.items || []); // Ensure items is an array
      } catch (error) {
        console.error(
          "Error fetching cart:",
          error.response?.data || error.message
        );
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, [token]);

  // Handle quantity change
  const onChange = async (e, index) => {
    const { value } = e.target;
    const updatedCart = [...cart];
    updatedCart[index].quantity = Number(value);
    setCart(updatedCart);

    try {
      await axios.put(
        "http://localhost:5000/api/cart",
        {
          productId: cart[index].product,
          quantity: Number(value),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      console.error(
        "Error updating cart:",
        error.response?.data || error.message
      );
    }
  };

  // Remove item from cart
  const removeItem = async (productId) => {
    try {
      await axios.delete(`http://localhost:5000/api/cart/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCart(cart.filter((item) => item.product !== productId));
    } catch (error) {
      console.error(
        "Error removing item from cart:",
        error.response?.data || error.message
      );
    }
  };

  return (
    <section className="ezy__epcart4 dark-gray" id="ezy__epcart4">
      <Container>
        {loading ? (
          <p>Loading cart...</p>
        ) : cart.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <Row>
            <Col lg={8}>
              <Card className="ezy__epcart4-card mb-3">
                {cart.map((item, i) => (
                  <Fragment key={i}>
                    {!!i && <hr className="ezy__epcart4-hr my-0" />}
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
      </Container>
    </section>
  );
};

export default Cart;
