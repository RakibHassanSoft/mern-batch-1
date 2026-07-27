import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "./user.model.js";

// Helper: create a signed JWT token that proves who the user is.
const createToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// Helper: options for the token cookie.
const isProduction = process.env.NODE_ENV === "production";
const cookieOptions = {
  httpOnly: true, // JavaScript in the browser CANNOT read it -> safer
  secure: isProduction, // HTTPS-only in production (Render/Netlify use HTTPS)
  // In production the frontend (Netlify) and backend (Render) are on DIFFERENT
  // domains, so the cookie must be "none" + secure to be sent cross-site.
  // Locally they share "localhost", so "lax" is fine.
  sameSite: isProduction ? "none" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

// REGISTER — POST /api/users/register
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });

    const token = createToken(user);
    res.cookie("token", token, cookieOptions);
    res.status(201).json({ user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// LOGIN — POST /api/users/login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    const isMatch = user && (await bcrypt.compare(password, user.password));

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = createToken(user);
    res.cookie("token", token, cookieOptions);
    res.status(200).json({ user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// LOGOUT — POST /api/users/logout
export const logout = async (req, res) => {
  res.clearCookie("token", cookieOptions);
  res.json({ message: "Logged out" });
};

// GET CURRENT USER — GET /api/users/me
export const getMe = async (req, res) => {
  res.json(req.user);
};
