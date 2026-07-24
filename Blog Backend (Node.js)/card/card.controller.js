import Card from "./card.model.js";

// ---------- GET ALL CARDS (PUBLIC) ----------
// GET /api/cards   -> everyone can see every card (like the home page)
export const getCards = async (req, res) => {
  try {
    const cards = await Card.find().sort({ createdAt: -1 }); // newest first
    res.status(200).json(cards);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ---------- GET ONE CARD (PUBLIC) ----------
// GET /api/cards/:id
export const getCard = async (req, res) => {
  try {
    const card = await Card.findById(req.params.id);
    if (!card) {
      return res.status(404).json({ message: "Card not found" });
    }
    res.status(200).json(card);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ---------- GET MY CARDS (PROTECTED) ----------
// GET /api/cards/mine   -> only the logged-in user's own cards (the dashboard)
export const getMyCards = async (req, res) => {
  try {
    const cards = await Card.find({ createdBy: req.user._id }).sort({
      createdAt: -1,
    });
    res.status(200).json(cards);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ---------- CREATE CARD (PROTECTED) ----------
// POST /api/cards   body: { title, excerpt, content, category, image }
export const createCard = async (req, res) => {
  try {
    const { title, excerpt, content, category, image } = req.body;

    if (!title || !excerpt || !content) {
      return res
        .status(400)
        .json({ message: "Title, excerpt and content are required" });
    }

    const card = await Card.create({
      title,
      excerpt,
      content,
      category,
      image,
      author: req.user.name,    // author name comes from the logged-in user
      createdBy: req.user._id,  // link the card to its owner
    });

    res.status(201).json(card);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ---------- UPDATE CARD (PROTECTED + OWNER ONLY) ----------
// PUT /api/cards/:id
export const updateCard = async (req, res) => {
  try {
    const card = await Card.findById(req.params.id);
    if (!card) {
      return res.status(404).json({ message: "Card not found" });
    }

    // Only the owner may edit their card
    if (card.createdBy.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "You can only edit your own cards" });
    }

    // Update only the fields that were sent
    const { title, excerpt, content, category, image } = req.body;
    if (title !== undefined) card.title = title;
    if (excerpt !== undefined) card.excerpt = excerpt;
    if (content !== undefined) card.content = content;
    if (category !== undefined) card.category = category;
    if (image !== undefined) card.image = image;

    const updated = await card.save();
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ---------- DELETE CARD (PROTECTED + OWNER ONLY) ----------
// DELETE /api/cards/:id
export const deleteCard = async (req, res) => {
  try {
    const card = await Card.findById(req.params.id);
    if (!card) {
      return res.status(404).json({ message: "Card not found" });
    }

    if (card.createdBy.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "You can only delete your own cards" });
    }

    await card.deleteOne();
    res.status(200).json({ message: "Card deleted", id: req.params.id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
