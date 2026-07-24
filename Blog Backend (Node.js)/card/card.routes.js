import express from "express";
import {
  getCards,
  getCard,
  getMyCards,
  createCard,
  updateCard,
  deleteCard,
} from "./card.controller.js";
// The login guard lives with the user feature, so we import it from there.
import { protect } from "../user/auth.middleware.js";

const router = express.Router();

// PUBLIC routes — anyone can read
router.get("/", getCards);                 // all cards
router.get("/mine", protect, getMyCards);  // my cards (must be above "/:id")
router.get("/:id", getCard);               // one card

// PROTECTED routes — must be logged in (cookie is sent automatically)
router.post("/", protect, createCard);       // create
router.put("/:id", protect, updateCard);     // update (owner only)
router.delete("/:id", protect, deleteCard);  // delete (owner only)

export default router;
