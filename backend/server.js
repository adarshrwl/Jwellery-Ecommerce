require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const path = require("path");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const app = express();

// Connect to Database
connectDB();

// Middleware
app.use(express.json());
app.use(cors());

// Serve static files from the "uploads" directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Import Routes
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");

// Use Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);

// Stripe Payment Intent Endpoint
app.post("/api/create-payment-intent", async (req, res) => {
  try {
    const { amount } = req.body; // Expect amount in cents (smallest currency unit)
    if (!amount || amount <= 0) {
      return res
        .status(400)
        .json({ error: { message: "Invalid amount provided" } });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount, // Use the dynamic amount provided from the frontend
      currency: "usd", // Change to "inr" or your desired currency if needed
      payment_method_types: ["card"],
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).json({ error: { message: error.message } });
  }
});

// Default Route
app.get("/", (req, res) => {
  res.send("Welcome to Gemsera Backend!");
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(500)
    .json({ message: "Something went wrong!", error: err.message });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
