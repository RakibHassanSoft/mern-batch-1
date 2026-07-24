import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "./user.model.js";

// Helper: create a signed JWT token that proves who the user is.
const createToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d", // token is valid for 7 days
  });
};

// Helper: the options we use when setting the token cookie.
const cookieOptions = {
  httpOnly: true, // JavaScript in the browser CANNOT read it -> safer
  secure: process.env.NODE_ENV === "production", // HTTPS-only in production
  sameSite: "lax", // sensible default for same-site apps
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds (match the token)
};

// ---------- REGISTER ----------
// POST /api/users/register   body: { name, email, password }
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1. Basic validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // 2. Make sure the email isn't already used
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // 3. Hash (scramble) the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Create the user
    const user = await User.create({ name, email, password: hashedPassword });

    // 5. Put the token in an httpOnly cookie, then send back the user
    const token = createToken(user);
    res.cookie("token", token, cookieOptions);
    res.status(201).json({ user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ---------- LOGIN ----------
// POST /api/users/login   body: { email, password }
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // 2. Compare the typed password with the stored hash
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // 3. Success -> set the cookie and return the user
    const token = createToken(user);
    res.cookie("token", token, cookieOptions);
    res.status(200).json({ user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ---------- LOGOUT ----------
// POST /api/users/logout   -> clears the cookie
export const logout = async (req, res) => {
  res.clearCookie("token", cookieOptions);
  res.status(200).json({ message: "Logged out" });
};

// ---------- GET CURRENT USER ----------
// GET /api/users/me   (protected)   returns the logged-in user
export const getMe = async (req, res) => {
  res.status(200).json(req.user);
};
