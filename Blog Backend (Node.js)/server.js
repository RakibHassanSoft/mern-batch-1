import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/db.js";
import userRoutes from "./user/user.routes.js";
import cardRoutes from "./card/card.routes.js";

dotenv.config(); // load values from .env

const app = express();

// ----- Global middleware -----
// credentials:true lets the browser send & receive our cookie.
// The origin MUST be your exact frontend URL (not "*") for cookies to work.
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());   // read JSON bodies from requests
app.use(cookieParser());   // read cookies into req.cookies

// ----- Connect to the database -----
connectDB();

// ----- A quick health-check route -----
app.get("/", (req, res) => {
  res.json({ message: "Blog API is running 🚀" });
});

// ----- Feature routes -----
app.use("/api/users", userRoutes);  // /api/users/register, /login, /logout, /me
app.use("/api/cards", cardRoutes);  // /api/cards ...

// ----- 404 for unknown routes -----
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// ----- Global error handler -----
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Server error" });
});

// ----- Start the server -----
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
