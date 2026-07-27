import axios from "axios";

// The backend URL comes from `.env.local` -> NEXT_PUBLIC_API_URL.
// Example: http://localhost:5000
const baseURL = process.env.NEXT_PUBLIC_API_URL;

// PUBLIC client for open routes that do not require login.
export const api = axios.create({
  baseURL,
});

// PROTECTED client for auth routes and user-specific actions.
// `withCredentials: true` makes the browser send the cookie to the backend.
export const authApi = axios.create({
  baseURL,
  withCredentials: true,
});
