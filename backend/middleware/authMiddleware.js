const jwt = require("jsonwebtoken");
const User = require("../models/user");

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      console.log("Decoded JWT:", decoded);

      req.user = await User.findById(decoded._id).select("-password");
      if (!req.user) {
        return res.status(401).json({ msg: "User not found" });
      }

      next();
    } catch (error) {
      console.error("JWT Verification Error:", error);
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
