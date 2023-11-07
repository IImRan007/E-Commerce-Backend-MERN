const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/userModel");

// @desc Register a new user
// @route POST /api/user
// @access Public
const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req?.body;

  if (!username) {
    res.status(400);
    throw new Error("Please provide the username field.");
  } else if (!email) {
    res.status(400);
    throw new Error("Please provide the email field.");
  } else if (!password) {
    res.status(400);
    throw new Error("Please provide the password field.");
  }

  // Find if user already exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create user
  const user = await User.create({ username, email, password: hashedPassword });

  // if user created
  if (user) {
    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// @desc Login a new user
// @route /api/user/login
// @access Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req?.body;

  if (!email) {
    res.status(400);
    throw new Error("Please provide the email field.");
  } else if (!password) {
    res.status(400);
    throw new Error("Please provide the password field.");
  }

  const user = await User.findOne({ email });

  // Check user and password match
  if (user && (await bcrypt.compare(password, user.password))) {
    res.status(200).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid credentials");
  }
});

// @desc Get current user
// @route /api/user/me
// @access Private
const getMe = asyncHandler(async (req, res) => {
  const user = {
    id: req.user._id,
    email: req.user.email,
    username: req.user.username,
  };

  res.status(200).json(user);
});

// Generate token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

module.exports = { registerUser, loginUser, getMe };
