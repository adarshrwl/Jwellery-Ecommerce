const express = require("express");
const { signup, login } = require("../controller/authController");

const router = express.Router();

// Authentication Routes
router.post("/signup", signup);
router.post("/login", login);

module.exports = router;
