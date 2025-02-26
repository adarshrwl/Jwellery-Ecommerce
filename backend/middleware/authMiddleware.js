const jwt = require("jsonwebtoken");
const User = require("../models/user");

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1]; // Extract the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token

      req.user = await User.findById(decoded.id).select("-password"); // Attach user data
      next();
    } catch (error) {
      res.status(401).json({ msg: "Token is invalid" });
    }
  } else {
    res.status(401).json({ msg: "No token, authorization denied" });
  }
};
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    console.log("User Role:", req.user?.role); // Log the user role
    res.status(403).json({ message: "Not authorized as admin" });
  }
};

module.exports = { protect, adminOnly };
