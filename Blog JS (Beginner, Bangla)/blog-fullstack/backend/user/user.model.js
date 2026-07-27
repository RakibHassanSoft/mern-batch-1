import mongoose from "mongoose";

// A registered user of the blog.
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true }, // stored hashed, never plain text
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
