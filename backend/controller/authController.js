const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

// ✅ Generate JWT Token (Ensures _id & Role are Included)
const generateToken = (user) => {
  return jwt.sign(
    { _id: user._id, role: user.role }, // Ensure correct field names
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
};

// ✅ Signup Controller (Forces Role to Always Be "User")
const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body; // 🚨 "role" is NOT accepted in the request

    if (!name || !email || !password) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: "User already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // ✅ Always forces role to "user"
    user = new User({
      name,
      email,
      password: hashedPassword,
      role: "user",
    });

    await user.save();

    // ✅ Generate Token with Correct Role
    const token = generateToken(user);

    // ✅ Ensure role is included in response
    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("❌ Signup Error:", err.message);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

// ✅ Login Controller (Includes Role in Response)
const login = async (req, res) => {
  try {
    console.log("🔹 Received Request Body:", req.body);

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ msg: "Please provide email and password" });
    }

    let user = await User.findOne({ email });
    if (!user) {
      console.log("❌ User not found");
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    console.log("✅ User Found:", user);

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("🔍 Password Match:", isMatch);

    if (!isMatch) {
      console.log("❌ Invalid credentials");
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    console.log("🔹 Generating JWT Token...");
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined in .env file");
    }

    // ✅ Generate JWT Token with Role
    const token = generateToken(user);
    console.log("✅ Token Generated:", token);

    // ✅ Include role in the response
    res.json({
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("❌ Login Error:", err.message);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

module.exports = { signup, login };
