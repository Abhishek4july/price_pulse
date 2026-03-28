import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

const JWT_SECRET = process.env.JWT_SECRET || "secret123";

// 🔐 helper function
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
};

// ✅ Signup
export const signup = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const user = await User.create({ name, email, password });

    const token = generateToken(user);

    res.status(201)
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "strict",
        secure: false, // true in production
      })
      .json({
        success: true,
        user,
        token,
      });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Signup failed" });
  }
};


// ✅ Login
export const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user);

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "strict",
      secure: false,
    });

    res.json({
      success: true,
      user,
      token,
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Login failed" });
  }
};


// ✅ Logout (with cookie)
export const logout = (req, res) => {
  res.clearCookie("token");
  res.json({ success: true, message: "Logged out" });
};


// ✅ getMe (keep your version — already good 👍)
export const getMe = async (req, res) => {
  const user = await User.findById(req.user.id);
  res.json({ success: true, user });
};