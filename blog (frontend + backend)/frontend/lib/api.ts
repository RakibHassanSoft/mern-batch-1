import axios from "axios";

// The backend URL comes from .env.local -> NEXT_PUBLIC_API_URL (e.g. http://localhost:5000)
const baseURL = process.env.NEXT_PUBLIC_API_URL;

// ─────────────────────────────────────────────────────────────
// PUBLIC axios client
// Use for OPEN routes that don't need login: reading all cards, one card.
// ─────────────────────────────────────────────────────────────
export const api = axios.create({
  baseURL,
});

// ─────────────────────────────────────────────────────────────
// PROTECTED axios client
// withCredentials: true makes the browser SEND & RECEIVE the httpOnly
// auth cookie automatically. Use this for anything that touches the
// login session: register, login, logout, "my cards", create, update, delete.
// ─────────────────────────────────────────────────────────────
export const authApi = axios.create({
  baseURL,
  withCredentials: true,
});
