import { api, authApi } from "./api";
import type { Card, CardInput } from "./types";

// ---------- PUBLIC (no login needed) ----------

// Get every card (home page). Uses the PUBLIC client.
export const getCards = async (): Promise<Card[]> => {
  const res = await api.get("/api/cards");
  return res.data;
};

// Get one card by id (single post page). Uses the PUBLIC client.
export const getCard = async (id: string): Promise<Card> => {
  const res = await api.get(`/api/cards/${id}`);
  return res.data;
};

// ---------- PROTECTED (must be logged in) ----------

// Get only the logged-in user's cards (dashboard). Uses the PROTECTED client.
export const getMyCards = async (): Promise<Card[]> => {
  const res = await authApi.get("/api/cards/mine");
  return res.data;
};

// Create a card. PROTECTED — the cookie proves who you are.
export const createCard = async (data: CardInput): Promise<Card> => {
  const res = await authApi.post("/api/cards", data);
  return res.data;
};

// Update a card. PROTECTED.
export const updateCard = async (id: string, data: CardInput): Promise<Card> => {
  const res = await authApi.put(`/api/cards/${id}`, data);
  return res.data;
};

// Delete a card. PROTECTED.
export const deleteCard = async (id: string): Promise<void> => {
  await authApi.delete(`/api/cards/${id}`);
};
