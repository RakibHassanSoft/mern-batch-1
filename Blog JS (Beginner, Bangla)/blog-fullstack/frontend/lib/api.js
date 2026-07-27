import axios from "axios";

// backend-এর URL .env.local থেকে আসে (যেমন http://localhost:5000)
const baseURL = process.env.NEXT_PUBLIC_API_URL;

// ─────────────────────────────────────────────
// api = PUBLIC client
// যেসব route-এ লগইন লাগে না (সব কার্ড পড়া, একটি কার্ড পড়া) তার জন্য।
// ─────────────────────────────────────────────
export const api = axios.create({ baseURL });

// ─────────────────────────────────────────────
// authApi = PRIVATE / PROTECTED client
// withCredentials: true মানে ব্রাউজার cookie নিজে থেকে পাঠাবে ও রাখবে।
// লগইন লাগে এমন সব কাজ (register, login, logout, নিজের কার্ড, create, update, delete) এর জন্য।
// ─────────────────────────────────────────────
export const authApi = axios.create({ baseURL, withCredentials: true });
