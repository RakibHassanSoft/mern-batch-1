// The shape of a card, matching what the backend sends.
export type Card = {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  category: string;
  image: string;
};

// What we send when creating/editing a card (no id/author/date — the server sets those).
export type CardInput = {
  title: string;
  excerpt: string;
  content: string;
  category: string;
  image: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
};
