# DevBlog — Full Stack (Next.js frontend + Node.js backend, connected with axios)

This folder contains a **complete, working** blog app:

```
blog (frontend + backend)/
├── backend/     ← the Node.js + Express + MongoDB API (from the backend tutorial)
└── frontend/    ← the Next.js app, wired to the backend with axios
```

Public visitors can read all posts. Registered users can log in, create, edit, and delete their own posts. Login uses an **httpOnly cookie**, and every request is made with **axios** — a **public** client for open routes and a **protected** client that carries the cookie.

This README is a clear, follow-along guide: run both servers, understand the axios setup, and see exactly what changed from the static design so you can learn the pattern.

---

## 1. Run It in 5 Steps (do this first)

You need **Node.js** and a **MongoDB** database (local or free MongoDB Atlas).

### Step 1 — Start the backend

```bash
cd backend
npm install
cp .env.example .env        # (Windows: copy .env.example .env)
```

Edit `backend/.env`:
```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/devblog   # or your Atlas string
JWT_SECRET=some_long_random_secret
CLIENT_URL=http://localhost:3000              # the frontend URL (must be exact)
NODE_ENV=development
```

```bash
npm run dev
```
You should see `✅ MongoDB connected` and `🚀 Server running on http://localhost:5000`.

### Step 2 — Start the frontend (new terminal)

```bash
cd frontend
npm install
npm run dev
```

`frontend/.env.local` already points at the backend:
```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### Step 3 — Open the app

Go to **http://localhost:3000**.

### Step 4 — Try the flow
Register → you land on the dashboard → create a post → see it on the home page → edit it → delete it → log out.

### Step 5 — Done
Both servers must be running at the same time. The frontend (`:3000`) talks to the backend (`:5000`) via axios.

> **Two URLs to remember:** frontend `http://localhost:3000`, backend `http://localhost:5000`. They're set in `CLIENT_URL` (backend) and `NEXT_PUBLIC_API_URL` (frontend). If you change a port, change it in both places.

---

## 2. How the Two Talk — the Big Picture

```
 Browser (Next.js :3000)                 Server (Node :5000)
 ┌───────────────────────┐   axios    ┌──────────────────────┐
 │  pages & components    │ ─────────▶ │  /api/users  (auth)  │
 │  lib/api.ts (axios)    │  cookie    │  /api/cards  (CRUD)  │ ─▶ MongoDB
 │                        │ ◀───────── │                      │
 └───────────────────────┘   JSON     └──────────────────────┘
```

- The frontend never talks to MongoDB directly — it calls the backend's URLs with axios.
- When you log in, the backend sends back a **cookie**. The browser stores it and attaches it to future requests automatically (as long as axios uses `withCredentials`).

---

## 3. The axios Setup (the heart of the connection) ⭐

Everything goes through **`frontend/lib/api.ts`**, which creates **two** axios clients:

```ts
import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_API_URL; // http://localhost:5000

// PUBLIC — open routes (reading cards). No cookie.
export const api = axios.create({ baseURL });

// PROTECTED — sends/receives the httpOnly auth cookie.
export const authApi = axios.create({ baseURL, withCredentials: true });
```

**The one rule that makes cookies work:** `withCredentials: true`. Without it, the browser won't send or store the auth cookie, and every protected request would fail with 401.

### When to use which

| Use `api` (public) | Use `authApi` (protected) |
|--------------------|----------------------------|
| `GET /api/cards` (all posts) | `POST /api/users/register` (sets cookie) |
| `GET /api/cards/:id` (one post) | `POST /api/users/login` (sets cookie) |
| | `POST /api/users/logout` (clears cookie) |
| | `GET /api/users/me` (who am I?) |
| | `GET /api/cards/mine` (my posts) |
| | `POST/PUT/DELETE /api/cards` (create/edit/delete) |

Simple rule: **if the action needs you to be logged in — or sets/clears the login cookie — use `authApi`. Otherwise use `api`.**

### The calls are wrapped in helper files

To keep components clean, the actual requests live in small functions:

- **`lib/cards.ts`** — `getCards`, `getCard` (public) and `getMyCards`, `createCard`, `updateCard`, `deleteCard` (protected).
- **`lib/auth.ts`** — `registerUser`, `loginUser`, `logoutUser`, `getMe` (all protected/cookie).

A page just imports the function it needs:
```ts
import { getCards } from "@/lib/cards";
const cards = await getCards();   // axios GET /api/cards under the hood
```

---

## 4. What Changed From the Static Design (what to replace / include)

If you built the **static** version first (the `Blog Project (Static)` folder), here's exactly how to turn it into this full-stack version. If you're starting fresh, these files are already done for you in `frontend/`.

### ➕ Files to ADD

| New file | Why |
|----------|-----|
| `frontend/.env.local` | Holds `NEXT_PUBLIC_API_URL` (the backend URL) |
| `lib/api.ts` | The two axios clients (public + protected) |
| `lib/types.ts` | `Card`, `CardInput`, `User` types |
| `lib/cards.ts` | Card API calls (replaces the old hard-coded data) |
| `lib/auth.ts` | Auth API calls (register/login/logout/me) |

### ➖ File to REMOVE

| Remove | Replaced by |
|--------|-------------|
| `lib/data.ts` (the fake `blogCards` array) | Real data fetched from the backend via `lib/cards.ts` |

### 🔁 Files to REPLACE (behavior added on top of the same design)

The look stays the same — you're only adding data-fetching and actions.

| File | What to change |
|------|----------------|
| `app/page.tsx` | Instead of importing `blogCards`, add `"use client"`, and fetch with `getCards()` in `useEffect`. Add a loading state. |
| `app/blog/[id]/page.tsx` | Fetch a single card with `getCard(id)` (using `useParams`) instead of `.find()` on fake data. |
| `app/dashboard/page.tsx` | Fetch the user's cards with `getMyCards()`. If it fails (401), redirect to `/login`. Wire the Delete button to `deleteCard(id)`. |
| `app/dashboard/create/page.tsx` | Keep it thin — it renders `<CardForm>` which now actually POSTs. |
| `app/dashboard/edit/[id]/page.tsx` | Fetch the card with `getCard(id)`, then render `<CardForm card={card}>`. |
| `app/login/page.tsx` | Turn into a real form: `useState` for fields, submit calls `loginUser()`, then `router.push("/dashboard")`. |
| `app/register/page.tsx` | Same as login but calls `registerUser()`. |
| `components/CardForm.tsx` | Make it `"use client"`, manage fields with `useState`, and on submit call `createCard()` or `updateCard()`. |
| `components/BlogCard.tsx` | Add an optional `onDelete` prop so the dashboard can delete. |
| `components/InputField.tsx` / `TextareaField.tsx` | Change from `defaultValue` to **controlled** `value` + `onChange` (so forms can read what you type). |
| `components/Navbar.tsx` | Make it `"use client"` and call `getMe()` to show Login/Sign-Up vs Dashboard/Logout. |

That's the whole transformation: **fake array → axios calls**, and **static forms → controlled forms that submit**.

---

## 5. Full File Structure (frontend)

```
frontend/
├── .env.local                     ← NEXT_PUBLIC_API_URL=http://localhost:5000
├── lib/
│   ├── api.ts                     ← the two axios clients (public + protected)
│   ├── types.ts                   ← Card / CardInput / User types
│   ├── cards.ts                   ← card API calls
│   └── auth.ts                    ← auth API calls
├── app/
│   ├── layout.tsx                 ← navbar + footer wrapper
│   ├── globals.css
│   ├── page.tsx                   ← HOME (public) — getCards()
│   ├── blog/[id]/page.tsx         ← SINGLE POST (public) — getCard(id)
│   ├── login/page.tsx             ← loginUser()
│   ├── register/page.tsx          ← registerUser()
│   └── dashboard/
│       ├── page.tsx               ← getMyCards() + deleteCard()
│       ├── create/page.tsx        ← <CardForm> create
│       └── edit/[id]/page.tsx     ← getCard() → <CardForm> edit
└── components/
    ├── Navbar.tsx                 ← getMe() to toggle login state + logout
    ├── Footer.tsx
    ├── Button.tsx
    ├── InputField.tsx             ← controlled input
    ├── TextareaField.tsx          ← controlled textarea
    ├── BlogCard.tsx               ← card + optional Edit/Delete
    └── CardForm.tsx               ← create & edit form (axios submit)
```

---

## 6. Follow the Data — Two Complete Examples

### Example A — Showing all posts (public)

1. `app/page.tsx` runs `getCards()` inside `useEffect`.
2. `getCards()` (in `lib/cards.ts`) does `api.get("/api/cards")` — the **public** client.
3. The backend's `getCards` controller returns an array of cards as JSON.
4. The page stores them in state and renders a `<BlogCard>` for each.

```tsx
// app/page.tsx (trimmed)
const [cards, setCards] = useState<Card[]>([]);
useEffect(() => {
  getCards().then(setCards);
}, []);
```

### Example B — Creating a post (protected)

1. On the dashboard you click **+ New Post** → `app/dashboard/create/page.tsx` renders `<CardForm>`.
2. You fill the form and submit. `CardForm` calls `createCard(data)`.
3. `createCard()` does `authApi.post("/api/cards", data)` — the **protected** client, so the **cookie goes automatically**.
4. The backend's `protect` middleware reads the cookie, confirms you're logged in, and saves the card with your name as the author.
5. `CardForm` calls `router.push("/dashboard")` and you see your new post.

```tsx
// components/CardForm.tsx (trimmed)
await createCard({ title, category, image, excerpt, content }); // authApi under the hood
router.push("/dashboard");
```

---

## 7. Why the Login "Just Works" (cookies + axios)

1. You submit the login form → `loginUser()` → `authApi.post("/api/users/login", ...)`.
2. The backend replies with a `Set-Cookie: token=...; HttpOnly` header.
3. Because axios used `withCredentials: true` **and** the backend set `cors({ credentials: true })`, the browser **stores** the cookie.
4. Every later `authApi` request **sends** that cookie automatically — you never touch a token by hand.
5. `Navbar` calls `getMe()`; if it succeeds, it shows Dashboard/Logout.
6. Logout → `authApi.post("/api/users/logout")` clears the cookie.

You never store a token in `localStorage` — the httpOnly cookie is safer because JavaScript can't read it.

---

## 8. Troubleshooting (read this if something breaks)

| Symptom | Cause & fix |
|---------|-------------|
| Posts don't load / Network Error | Is the **backend running** on `:5000`? Is `NEXT_PUBLIC_API_URL` correct? Restart `npm run dev` after editing `.env.local`. |
| Login seems to work but dashboard bounces to /login | The cookie isn't being sent. Check: `authApi` has `withCredentials: true`, backend `cors` has `credentials: true` **and** an exact `origin` (not `*`). |
| CORS error in the browser console | Backend `CLIENT_URL` must exactly match the frontend URL (`http://localhost:3000`). |
| Images don't show | External image domain must be allowed in `next.config.mjs` (`picsum.photos` already is). |
| Changed a port and nothing connects | Update **both** `CLIENT_URL` (backend) and `NEXT_PUBLIC_API_URL` (frontend). |
| `401` on create/edit/delete | You're not logged in, or the cookie expired (7 days) — log in again. |

---

## 9. Deploying (later)

- **Backend** → host on Render/Railway/Fly. Set `MONGO_URI`, `JWT_SECRET`, `NODE_ENV=production`, and `CLIENT_URL` to your deployed frontend URL.
- **Frontend** → host on Vercel. Set `NEXT_PUBLIC_API_URL` to your deployed backend URL.
- For cookies across different domains in production, the backend cookie needs `sameSite: "none"` and `secure: true` (HTTPS). Locally, `lax` is fine.

---

## 10. Recap

- **Two servers:** backend (`:5000`) and frontend (`:3000`), running at the same time.
- **axios, two clients:** `api` (public) for reading, `authApi` (protected, `withCredentials`) for anything needing login.
- **Cookie auth:** login sets an httpOnly cookie; axios sends it automatically; no manual tokens.
- **Same design, real data:** the UI is the static design with `lib/data.ts` swapped for axios calls to your Node.js backend.

Run both, open `http://localhost:3000`, register, and start posting. 🎉
