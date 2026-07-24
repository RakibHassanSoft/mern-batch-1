import mongoose from "mongoose";

// Connects to MongoDB using the URL from your .env file.
// We call this once when the server starts (in server.js).
export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1); // stop the app if the database won't connect
  }
};
