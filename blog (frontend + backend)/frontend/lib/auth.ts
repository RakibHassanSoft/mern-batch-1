import { authApi } from "./api";
import type { User } from "./types";

// All auth calls use the PROTECTED client (withCredentials) because they
// set, send, or clear the login cookie.

// Register a new account. The server sets the auth cookie in the response.
export const registerUser = async (
  name: string,
  email: string,
  password: string
): Promise<User> => {
  const res = await authApi.post("/api/users/register", { name, email, password });
  return res.data.user;
};

// Log in. The server sets the auth cookie in the response.
export const loginUser = async (
  email: string,
  password: string
): Promise<User> => {
  const res = await authApi.post("/api/users/login", { email, password });
  return res.data.user;
};

// Log out. The server clears the cookie.
export const logoutUser = async (): Promise<void> => {
  await authApi.post("/api/users/logout");
};

// Get the current logged-in user (used to check "am I logged in?").
export const getMe = async (): Promise<User> => {
  const res = await authApi.get("/api/users/me");
  return res.data;
};
