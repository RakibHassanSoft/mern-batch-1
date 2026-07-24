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

// When we send a user back as JSON, hide the password and rename _id -> id
userSchema.set("toJSON", {
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    delete ret.password;
    return ret;
  },
});

const User = mongoose.model("User", userSchema);
export default User;
