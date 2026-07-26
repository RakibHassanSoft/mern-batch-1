import Card from "./card.model.js";
import { format } from "./format.js";

// GET ALL CARDS (PUBLIC) — GET /api/cards
export const getCards = async (req, res) => {
  try {
    const cards = await Card.find().sort({ createdAt: -1 }); // newest first
    res.json(cards.map(format));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET ONE CARD (PUBLIC) — GET /api/cards/:id
export const getCard = async (req, res) => {
  try {
    const card = await Card.findById(req.params.id);
    res.json(card ? format(card) : null);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET MY CARDS (PROTECTED) — GET /api/cards/mine
export const getMyCards = async (req, res) => {
  try {
    const cards = await Card.find({ createdBy: req.user._id }).sort({ createdAt: -1 });
    res.json(cards.map(format));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// CREATE CARD (PROTECTED) — POST /api/cards
export const createCard = async (req, res) => {
  try {
    const card = await Card.create({
      ...req.body,
      author: req.user.name,   // author name from the logged-in user
      createdBy: req.user._id, // owner
    });
    res.status(201).json(format(card));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE CARD (PROTECTED, OWNER ONLY) — PUT /api/cards/:id
// The owner check is part of the query: only a card with this id AND this owner is updated.
export const updateCard = async (req, res) => {
  try {
    const card = await Card.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user._id },
      req.body,
      { new: true }
    );
    res.json(card ? format(card) : null);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE CARD (PROTECTED, OWNER ONLY) — DELETE /api/cards/:id
export const deleteCard = async (req, res) => {
  try {
    await Card.findOneAndDelete({ _id: req.params.id, createdBy: req.user._id });
    res.json({ message: "Card deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
