# DevBlog — Full Stack (Next.js frontend + Node.js backend, connected with axios)

This folder contains a **complete, working** blog app:

```
blog (frontend + backend)/
├── static/      ← the design ONLY (fake data) — the starting point, for comparison
├── frontend/    ← the SAME design, wired to the backend with axios
├── backend/     ← the Node.js + Express + MongoDB API
└── STATIC-TO-CONNECTED.md   ← file-by-file "what to change and how" note
```

Public visitors can read all posts. Registered users can log in, create, edit, and delete their own posts. Login uses an **httpOnly cookie**, and every request is made with **axios** — a **public** client for open routes and a **protected** client that carries the cookie.

This README is a clear, follow-along guide. **Section 1** runs the finished app. **Section 4 is the main tutorial** — a step-by-step walkthrough that takes the *static blog* and connects it to the server, with the exact code at every step.

> **Want to see the change directly?** Compare the `static/` and `frontend/` folders side by side. The **`STATIC-TO-CONNECTED.md`** file lists every single change (BEFORE → AFTER, with code and why) needed to turn `static/` into `frontend/`.

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

### No wrapper functions — call axios directly

To keep things simple for beginners, we **don't** hide calls behind helper functions like `getCards()`. Instead each page/component calls `api` or `authApi` **directly**, right where it's needed:
```ts
import { api } from "@/lib/api";
const res = await api.get("/api/cards");   // you see the method + URL in one place
const cards = res.data;
```
So `lib/` has **only one file: `api.ts`**. Nothing else to learn.

---

## 3b. Every API Call at a Glance (GET / POST / PUT / DELETE)

Here is every call in the app, where it lives, and whether it's public (`api`) or protected (`authApi`).

### Card calls

| Direct call | HTTP method | Client | Public/Protected | File |
|-------------|-------------|--------|------------------|------|
| `api.get("/api/cards")` | **GET** | `api` | 🌍 Public | `app/page.tsx` |
| `api.get(\`/api/cards/${id}\`)` | **GET** | `api` | 🌍 Public | `app/blog/[id]/page.tsx`, `edit/[id]` |
| `authApi.get("/api/cards/mine")` | **GET** | `authApi` | 🔒 Protected | `app/dashboard/page.tsx` |
| `authApi.post("/api/cards", data)` | **POST** | `authApi` | 🔒 Protected | `components/CardForm.tsx` |
| `authApi.put(\`/api/cards/${id}\`, data)` | **PUT** | `authApi` | 🔒 Protected | `components/CardForm.tsx` |
| `authApi.delete(\`/api/cards/${id}\`)` | **DELETE** | `authApi` | 🔒 Protected | `app/dashboard/page.tsx` |

### Auth calls

| Direct call | HTTP method | Client | File |
|-------------|-------------|--------|------|
| `authApi.post("/api/users/register", {...})` | **POST** | `authApi` | `app/register/page.tsx` |
| `authApi.post("/api/users/login", {...})` | **POST** | `authApi` | `app/login/page.tsx` |
| `authApi.post("/api/users/logout")` | **POST** | `authApi` | `components/Navbar.tsx` |
| `authApi.get("/api/users/me")` | **GET** | `authApi` | `components/Navbar.tsx` |

### The four HTTP methods explained

- **GET** — *read* data. `api.get("/api/cards")` reads all posts. Never changes anything.
- **POST** — *create* new data. `authApi.post("/api/cards", data)` makes a new post; `authApi.post("/api/users/register", ...)` makes an account.
- **PUT** — *update/replace* existing data. `authApi.put("/api/cards/:id", data)` edits a post you own.
- **DELETE** — *remove* data. `authApi.delete("/api/cards/:id")` removes a post you own.

Each frontend call maps 1-to-1 to a backend route with the **same method** — that's what makes the two sides line up.

---

## 4. Tutorial: Connect the Static Blog to the Server (Step by Step)

The static blog uses fake data and its forms don't save. To connect it to the backend you: **(1)** add `.env.local` and `lib/api.ts` (the only lib file), **(2)** delete `lib/data.ts`, and **(3)** edit each page/component to call `api` / `authApi` **directly** and make the forms submit.

**👉 The full step-by-step walkthrough — every file, BEFORE → AFTER code, and why — is in [`STATIC-TO-CONNECTED.md`](./STATIC-TO-CONNECTED.md).** It's written for beginners: follow it top to bottom and you'll rebuild `frontend/` from `static/` yourself.

Quick idea of the change:
```tsx
// STATIC  (app/page.tsx)
import { blogCards } from "@/lib/data";
{blogCards.map((card) => <BlogCard key={card.id} card={card} />)}

// CONNECTED (app/page.tsx) — call axios directly
"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
const [cards, setCards] = useState([]);
useEffect(() => { api.get("/api/cards").then((res) => setCards(res.data)); }, []);
{cards.map((card) => <BlogCard key={card.id} card={card} />)}
```

No wrapper functions — you call `api.get(...)`, `authApi.post(...)`, etc. right in the file. See `STATIC-TO-CONNECTED.md` for all 13 steps.

---

## 5. Full File Structure (frontend)

```
frontend/
├── .env.local                     ← NEXT_PUBLIC_API_URL=http://localhost:5000
├── lib/
│   └── api.ts                     ← the ONLY lib file: the two axios clients
├── app/
│   ├── layout.tsx                 ← navbar + footer wrapper
│   ├── globals.css
│   ├── page.tsx                   ← HOME (public) — api.get("/api/cards")
│   ├── blog/[id]/page.tsx         ← SINGLE POST (public) — api.get("/api/cards/:id")
│   ├── login/page.tsx             ← authApi.post("/api/users/login")
│   ├── register/page.tsx          ← authApi.post("/api/users/register")
│   └── dashboard/
│       ├── page.tsx               ← authApi.get("/api/cards/mine") + authApi.delete
│       ├── create/page.tsx        ← <CardForm> create
│       └── edit/[id]/page.tsx     ← api.get("/api/cards/:id") → <CardForm> edit
├── components/
│   ├── Navbar.tsx                 ← authApi.get("/api/users/me") + logout
│   ├── Footer.tsx
│   ├── Button.tsx
│   ├── InputField.tsx             ← controlled input
│   ├── TextareaField.tsx          ← controlled textarea
│   ├── BlogCard.tsx               ← card + optional Edit/Delete
│   └── CardForm.tsx               ← create & edit form (authApi.post / authApi.put)
├── tests/                         ← unit tests (Vitest)
│   └── api.test.ts                ← checks the two axios clients are configured right
└── vitest.config.ts               ← test config (@/ alias)
```

> `lib/` has only `api.ts`. The `Card` type is written **inline** in the files that need it (no separate types file).

> The **backend** has its own tests in `backend/tests/` (`format`, `cardController`, `authController`). See Section 7b for how to run both.

---

## 6. Follow the Data — Two Complete Examples

### Example A — Showing all posts (public)

1. `app/page.tsx` calls `api.get("/api/cards")` directly inside `useEffect`.
2. `api` is the **public** client (no cookie needed).
3. The backend's `getCards` controller returns an array of cards as JSON.
4. The page stores them in state and renders a `<BlogCard>` for each.

```tsx
// app/page.tsx (trimmed)
const [cards, setCards] = useState<Card[]>([]);
useEffect(() => {
  api.get("/api/cards").then((res) => setCards(res.data));
}, []);
```

### Example B — Creating a post (protected)

1. On the dashboard you click **+ New Post** → `app/dashboard/create/page.tsx` renders `<CardForm>`.
2. You fill the form and submit. `CardForm` calls `authApi.post("/api/cards", data)` **directly**.
3. `authApi` is the **protected** client, so the **cookie goes automatically**.
4. The backend's `protect` middleware reads the cookie, confirms you're logged in, and saves the card with your name as the author.
5. `CardForm` calls `router.push("/dashboard")` and you see your new post.

```tsx
// components/CardForm.tsx (trimmed)
await authApi.post("/api/cards", { title, category, image, excerpt, content });
router.push("/dashboard");
```

---

## 7. Why the Login "Just Works" (cookies + axios)

1. You submit the login form → `authApi.post("/api/users/login", { email, password })`.
2. The backend replies with a `Set-Cookie: token=...; HttpOnly` header.
3. Because axios used `withCredentials: true` **and** the backend set `cors({ credentials: true })`, the browser **stores** the cookie.
4. Every later `authApi` request **sends** that cookie automatically — you never touch a token by hand.
5. `Navbar` calls `authApi.get("/api/users/me")`; if it succeeds, it shows Dashboard/Logout.
6. Logout → `authApi.post("/api/users/logout")` clears the cookie.

You never store a token in `localStorage` — the httpOnly cookie is safer because JavaScript can't read it.

---

## 7b. Unit Testing — Make Sure Everything Works ✅

Both sides ship with **unit tests** so you can prove each function works without clicking through the whole app. The tests **mock** the database and axios, so they run instantly and need no server or MongoDB.

### Backend tests (Node's built-in test runner — no extra library)

```bash
cd backend
npm install        # once
npm test           # runs "node --test"
```

What they check (in `backend/tests/`):
- `format.test.js` — the `format` helper turns `_id → id` and `createdAt → "Jul 24, 2026"`, and hides internal fields.
- `cardController.test.js` — every CRUD method: **GET** all/one, **POST** create (author set from the user), **PUT** update (owner check in the query), **DELETE**. The `Card` model is mocked, so no DB is used.
- `authController.test.js` — **register** hashes the password + sets the cookie + never returns the password; **login** succeeds with the right password and returns **401** with a wrong one.

Expected result: **14 tests, 14 pass.**

### Frontend tests (Vitest)

```bash
cd frontend
npm install        # once
npm test           # runs "vitest run"
```

What they check (in `frontend/tests/`):
- `api.test.ts` — the two axios clients are configured correctly: both point at `NEXT_PUBLIC_API_URL`, `api` is public (no credentials), and `authApi` sends the cookie (`withCredentials: true`).

Expected result: **2 tests, 2 pass.**

> Since we now call axios **directly** in each file (no wrapper functions to unit-test), the meaningful frontend unit test is that the clients themselves are set up right. To test the actual page behavior, you'd add component tests with React Testing Library (see the `Unit Testing Basics` folder).

### Why this matters
Tests are your safety net. New to testing? Read the **`Unit Testing Basics`** folder first — it teaches the ideas from zero.

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

## 9. Deploying — Backend on Render, Frontend on Netlify 🚀

We'll put the **backend on Render** and the **frontend on Netlify**. They get different HTTPS URLs and must be told about each other. Do the backend first (the frontend needs its URL).

> **Before you start:** push BOTH `backend/` and `frontend/` to GitHub (see the Git & GitHub notes). Render and Netlify deploy straight from your GitHub repo. You can keep them in one repo (a "monorepo") or two separate repos — both work; you just point each service at the right folder.

---

### Part A — Deploy the Backend on Render

**1. Create the service**
1. Go to **https://render.com** → sign up (log in with GitHub is easiest).
2. Click **New +** → **Web Service**.
3. Connect your GitHub and pick the repo.
4. If your backend is in a subfolder, set **Root Directory** to `backend`.

**2. Settings**
- **Environment:** Node
- **Build Command:** `npm install`
- **Start Command:** `npm start`  (this runs `node server.js`)
- **Instance Type:** Free

**3. Environment variables** (click **Advanced → Add Environment Variable**). Add each:

| Key | Value |
|-----|-------|
| `MONGO_URI` | your MongoDB Atlas connection string |
| `JWT_SECRET` | a long random secret |
| `NODE_ENV` | `production` |
| `CLIENT_URL` | *(fill this in Part C, after Netlify gives you a URL)* |

> For now you can put a placeholder for `CLIENT_URL`; you'll update it in Part C.

**4. MongoDB Atlas access:** In Atlas → **Network Access** → allow `0.0.0.0/0` (so Render's servers can connect).

**5. Deploy** → click **Create Web Service**. When it finishes, Render gives you a URL like:
```
https://devblog-backend.onrender.com
```
**Copy it.** Test it by opening that URL — you should see `{ "message": "Blog API is running 🚀" }`.

> ⏳ Render's free tier "sleeps" after inactivity, so the first request after a while can take ~30 seconds to wake up. That's normal.

---

### Part B — Deploy the Frontend on Netlify

**1. Create the site**
1. Go to **https://www.netlify.com** → sign up (log in with GitHub).
2. **Add new site** → **Import an existing project** → pick your repo.
3. If the frontend is in a subfolder, set **Base directory** to `frontend`.

**2. Build settings** (Netlify auto-detects Next.js and installs its Next.js plugin, but confirm):
- **Build command:** `npm run build`
- **Publish directory:** `.next`  (the Next.js plugin handles this automatically)

**3. Environment variable** (Site settings → **Environment variables** → Add):

| Key | Value |
|-----|-------|
| `NEXT_PUBLIC_API_URL` | your Render backend URL, e.g. `https://devblog-backend.onrender.com` |

**4. Deploy** → Netlify builds and gives you a URL like:
```
https://devblog.netlify.app
```
**Copy it.**

> If images don't load in production, make sure `picsum.photos` (and any other image host) is listed in `frontend/next.config.mjs` under `images.remotePatterns`.

---

### Part C — Connect Them (the crucial step)

The two sites now exist but must trust each other.

1. **Tell the backend about the frontend:** in Render → your service → **Environment** → set
   `CLIENT_URL = https://devblog.netlify.app` (your exact Netlify URL, no trailing slash). Save → Render redeploys.
2. **Tell the frontend about the backend:** confirm Netlify's `NEXT_PUBLIC_API_URL` is your exact Render URL. If you change it, **redeploy** the Netlify site (env changes need a rebuild).

---

### Part D — Cookies Across Two Domains (already handled)

Locally, frontend and backend share `localhost`, so a `lax` cookie works. In production they're on **different domains** (`netlify.app` vs `onrender.com`), so the login cookie must be **`sameSite: "none"` + `secure: true`** or the browser won't send it.

**Good news: the code already does this.** In `backend/user/user.controller.js` the cookie options switch automatically when `NODE_ENV=production`:
```js
const isProduction = process.env.NODE_ENV === "production";
const cookieOptions = {
  httpOnly: true,
  secure: isProduction,                         // HTTPS only in production
  sameSite: isProduction ? "none" : "lax",      // cross-site cookie in production
  maxAge: 7 * 24 * 60 * 60 * 1000,
};
```
So just make sure `NODE_ENV=production` is set on Render (Part A). Render and Netlify both serve HTTPS, which `secure` requires. The frontend already sends `withCredentials: true`, and the backend already sets `cors({ credentials: true })` — nothing else to change.

---

### Part E — Test the Live App ✅

Open your Netlify URL and run the full flow: **register → create a post → edit → delete → logout**. If it all works, you're deployed! 🎉

### Deployment troubleshooting

| Problem | Fix |
|---------|-----|
| Login works but dashboard bounces to /login (in production) | Cookie not crossing domains. Confirm `NODE_ENV=production` on Render (enables `sameSite:none`+`secure`), and `CLIENT_URL` is your exact Netlify URL. |
| CORS error in production | `CLIENT_URL` on Render must exactly match the Netlify URL (https, no trailing slash). |
| First request very slow | Render free tier was asleep — it wakes in ~30s, then it's fast. |
| Posts don't load | `NEXT_PUBLIC_API_URL` on Netlify wrong, or you changed it without redeploying. Redeploy after env changes. |
| Can't connect to database | Atlas → Network Access must allow `0.0.0.0/0`. |
| Env change didn't take effect | Netlify/Render need a **redeploy** after editing environment variables. |

---

## 10. Recap

- **Two servers:** backend (`:5000`) and frontend (`:3000`), running at the same time.
- **axios, two clients:** `api` (public) for reading, `authApi` (protected, `withCredentials`) for anything needing login.
- **Cookie auth:** login sets an httpOnly cookie; axios sends it automatically; no manual tokens.
- **Same design, real data:** the UI is the static design with `lib/data.ts` swapped for axios calls to your Node.js backend.

Run both, open `http://localhost:3000`, register, and start posting. 🎉
