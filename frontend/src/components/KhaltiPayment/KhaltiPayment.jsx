// src/components/Payment/KhaltiPayment.js
import React, { useState } from "react";
import axios from "axios";
import "./KhaltiPayment.css"; // Optional: Add styling

const KhaltiPayment = () => {
  const [message, setMessage] = useState("");

  const handleKhaltiPayment = async () => {
    try {
      // Make a POST request to your backend to initiate the Khalti payment
      const response = await axios.post(
        "http://localhost:5000/api/payment/initiate",
        {
          amount: 1000, // Rs. 10 in paisa (minimum Rs. 10)
          purchase_order_id: `SAMPLE_ORDER_${Date.now()}_${Math.random()
            .toString(36)
            .substr(2, 9)}`, // Unique order ID
          purchase_order_name: "Sample Product",
          customer_info: {
            name: "Test User",
            email: "test@example.com",
            phone: "9800000001", // Use a valid Nepali phone number for testing
          },
          return_url: "http://localhost:3000/payment-success", // Replace with your return URL
          website_url: "http://localhost:3000", // Replace with your website URL
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      // Redirect to the Khalti payment URL
      if (response.data.payment_url) {
        window.location.href = response.data.payment_url;
      } else {
        setMessage("Error initiating payment. Please try again.");
      }
    } catch (error) {
      console.error("Payment initiation error:", error);
      setMessage(
        error.response?.data?.message ||
          "Failed to initiate payment. Check console."
      );
    }
  };

  return (
    <div className="khalti-payment-container">
      <h2>Khalti Payment Demo</h2>
      {message && (
        <p className={message.includes("✅") ? "success" : "error"}>
          {message}
        </p>
      )}
      <button onClick={handleKhaltiPayment} className="pay-button">
        Pay with Khalti (Rs. 10)
      </button>
    </div>
  );
};

export default KhaltiPayment;
