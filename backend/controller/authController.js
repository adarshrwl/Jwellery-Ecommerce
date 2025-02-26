const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

// ✅ Signup Controller (Forces Role to Always Be "User")
const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body; // 🚨 "role" is NOT accepted in the request

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

    // ✅ Include role in JWT token
    const token = jwt.sign(
      { id: user._id, role: "user" }, // ✅ Explicitly set role in token
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // ✅ Ensure role is included in response
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: "user",
      },
    });
  } catch (err) {
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
      return res.status(400).json({ msg: "User not found" });
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

    // ✅ Ensure role is included in the JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    console.log("✅ Token Generated:", token);

    // ✅ Include role in the response
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role, // ✅ Now properly included in response
      },
    });
  } catch (err) {
    console.error("❌ Login Error:", err.message);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

module.exports = { signup, login };
