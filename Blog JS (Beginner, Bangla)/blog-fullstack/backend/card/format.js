// Shape a card document to match the frontend exactly:
// id, title, excerpt, content, author, date, category, image
// Kept in its own file (no database imports) so it is easy to unit-test.
export const format = (card) => ({
  id: card._id,
  title: card.title,
  excerpt: card.excerpt,
  content: card.content,
  author: card.author,
  category: card.category,
  image: card.image,
  date: new Date(card.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }),
});
