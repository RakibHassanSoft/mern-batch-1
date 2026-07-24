import mongoose from "mongoose";

// A blog card. The fields match the frontend's BlogCard type exactly:
// id, title, excerpt, content, author, date, category, image
const cardSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    excerpt: { type: String, required: true },
    content: { type: String, required: true },
    category: { type: String, default: "General" },
    image: {
      type: String,
      default: "https://picsum.photos/seed/blog/600/400",
    },
    // "author" is the display name shown on the card (set from the logged-in user)
    author: { type: String, required: true },
    // "createdBy" links the card to the user who owns it (used for permissions)
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true } // adds createdAt & updatedAt automatically
);

const Card = mongoose.model("Card", cardSchema);
export default Card;
