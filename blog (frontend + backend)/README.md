# DevBlog — Full Stack (Next.js frontend + Node.js backend, connected with axios)

This folder contains a **complete, working** blog app:

```text
blog (frontend + backend)/
├── backend/     ← the Node.js + Express + MongoDB API
└── frontend/    ← the Next.js app, wired to the backend with axios
```

Public visitors can read all posts. Registered users can log in, create, edit, and delete their own posts. Login uses an **httpOnly cookie**, and requests are made with **axios** using two clients: one public and one protected.

---

## 1. Run It in 5 Steps

You need **Node.js** and a **MongoDB** database (local or MongoDB Atlas).

### Step 1 — Start the backend

```bash
cd backend
npm install
cp .env.example .env
```

Edit `backend/.env`:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/devblog
JWT_SECRET=some_long_random_secret
CLIENT_URL=http://localhost:3000
NODE_ENV=development
```

```bash
npm run dev
```

You should see `✅ MongoDB connected` and `🚀 Server running on http://localhost:5000`.

### Step 2 — Start the frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend reads the backend URL from `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### Step 3 — Open the app

Go to **http://localhost:3000**.

### Step 4 — Try the flow

Register → dashboard → create a post → edit it → delete it → logout.

### Step 5 — Keep both servers running

The frontend (`:3000`) talks to the backend (`:5000`) using axios.

---

## 2. How the Two Talk

```text
Browser (Next.js :3000)          Server (Node :5000)
┌───────────────────────┐  axios  ┌──────────────────────┐
│  pages & components    │ ─────▶ │  /api/users  (auth)  │
│  lib/api.ts (axios)    │ ◀───── │  /api/cards  (CRUD)  │
└───────────────────────┘         └──────────────────────┘
```

- The frontend never talks to MongoDB directly.
- Login sends back a cookie, and protected requests must use `withCredentials: true`.

---

## 3. The axios Setup (the heart of the connection) ⭐

All frontend requests share the same backend base URL in `frontend/lib/api.ts`.

```ts
import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

export const api = axios.create({ baseURL });
export const authApi = axios.create({ baseURL, withCredentials: true });
```

- `api` is for public routes (`GET /api/cards`, `GET /api/cards/:id`).
- `authApi` is for login, registration, current user, and card create/edit/delete.
- `withCredentials: true` is required for the browser to send and receive the auth cookie.

### When to use which

| Use `api` (public) | Use `authApi` (protected) |
|--------------------|----------------------------|
| `GET /api/cards` | `POST /api/users/register` |
| `GET /api/cards/:id` | `POST /api/users/login` |
| | `POST /api/users/logout` |
| | `GET /api/users/me` |
| | `GET /api/cards/mine` |
| | `POST/PUT/DELETE /api/cards` |

Simple rule: **if the action needs login or involves the auth cookie, use `authApi`.**

---

## 4. Current frontend request flow

This version keeps the code beginner-friendly by making requests directly from the page or component where the action happens. There is no separate `lib/auth.ts`, `lib/cards.ts`, or `lib/types.ts` in the current code.

| Request | Endpoint | Client |
|---------|----------|--------|
| Fetch all cards | `GET /api/cards` | `api` |
| Fetch one card | `GET /api/cards/:id` | `api` |
| Register | `POST /api/users/register` | `authApi` |
| Login | `POST /api/users/login` | `authApi` |
| Logout | `POST /api/users/logout` | `authApi` |
| Current user | `GET /api/users/me` | `authApi` |
| My cards | `GET /api/cards/mine` | `authApi` |
| Create card | `POST /api/cards` | `authApi` |
| Update card | `PUT /api/cards/:id` | `authApi` |
| Delete card | `DELETE /api/cards/:id` | `authApi` |

### Where the requests happen

- `frontend/app/page.tsx` uses `api.get("/api/cards")`.
- `frontend/app/blog/[id]/page.tsx` uses `api.get(`/api/cards/${id}`)`.
- `frontend/app/register/page.tsx` uses `authApi.post("/api/users/register", {...})`.
- `frontend/app/login/page.tsx` uses `authApi.post("/api/users/login", {...})`.
- `frontend/components/CardForm.tsx` uses `authApi.post("/api/cards", data)` and `authApi.put(`/api/cards/${card.id}`, data)`.
- `frontend/app/dashboard/page.tsx` uses `authApi.get("/api/cards/mine")` and `authApi.delete(`/api/cards/${id}`)`.
- `frontend/components/Navbar.tsx` uses `authApi.get("/api/users/me")` and `authApi.post("/api/users/logout")`.

---

## 5. Frontend file structure

```text
frontend/
├── .env.local                     ← NEXT_PUBLIC_API_URL=http://localhost:5000
├── lib/
│   └── api.ts                     ← public + protected axios clients
├── app/
│   ├── layout.tsx
│   ├── globals.css
│   ├── page.tsx
│   ├── blog/[id]/page.tsx
│   ├── login/page.tsx
│   ├── register/page.tsx
│   └── dashboard/
│       ├── page.tsx
│       ├── create/page.tsx
│       └── edit/[id]/page.tsx
├── components/
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── Button.tsx
│   ├── BlogCard.tsx
│   └── CardForm.tsx
├── tests/
│   ├── cards.test.ts
│   └── auth.test.ts
└── vitest.config.ts
```

The shared frontend logic is intentionally small: only `frontend/lib/api.ts` exports the axios clients.

---

## 6. Why this README matches the code

- `frontend/lib/api.ts` only exports `api` and `authApi`.
- The frontend request logic is visible inside pages/components.
- There are no `lib/auth.ts`, `lib/cards.ts`, or `lib/types.ts` files used by the current frontend.
- Each page or component can define its own local types for easier beginner understanding.

If you want to learn from the code, open one page and follow the form submission or data loading from the input fields to the `authApi`/`api` call.
