# DevBlog — Full Stack (Next.js frontend + Node.js backend, connected with axios)

This folder contains a **complete, working** blog app:

```
blog (frontend + backend)/
├── backend/     ← the Node.js + Express + MongoDB API (from the backend tutorial)
└── frontend/    ← the Next.js app, wired to the backend with axios
```

Public visitors can read all posts. Registered users can log in, create, edit, and delete their own posts. Login uses an **httpOnly cookie**, and every request is made with **axios** — a **public** client for open routes and a **protected** client that carries the cookie.

This README is a clear, follow-along guide. **Section 1** runs the finished app. **Section 4 is the main tutorial** — a step-by-step walkthrough that takes the *static blog* and connects it to the server, with the exact code at every step. Follow Section 4 and you'll be able to connect the static blog to your backend yourself.

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

## 3b. Every API Function at a Glance (GET / POST / PUT / DELETE)

All server calls live in two small files. Each function is one line of intent. Here's the complete map so you always know which function does what, which HTTP method it uses, and whether it's public or protected.

### Card functions — `lib/cards.ts`

| Function | HTTP method | Endpoint | Client | Public/Protected |
|----------|-------------|----------|--------|------------------|
| `getCards()` | **GET** | `/api/cards` | `api` | 🌍 Public |
| `getCard(id)` | **GET** | `/api/cards/:id` | `api` | 🌍 Public |
| `getMyCards()` | **GET** | `/api/cards/mine` | `authApi` | 🔒 Protected |
| `createCard(data)` | **POST** | `/api/cards` | `authApi` | 🔒 Protected |
| `updateCard(id, data)` | **PUT** | `/api/cards/:id` | `authApi` | 🔒 Protected |
| `deleteCard(id)` | **DELETE** | `/api/cards/:id` | `authApi` | 🔒 Protected |

### Auth functions — `lib/auth.ts`

| Function | HTTP method | Endpoint | Client |
|----------|-------------|----------|--------|
| `registerUser(name, email, password)` | **POST** | `/api/users/register` | `authApi` |
| `loginUser(email, password)` | **POST** | `/api/users/login` | `authApi` |
| `logoutUser()` | **POST** | `/api/users/logout` | `authApi` |
| `getMe()` | **GET** | `/api/users/me` | `authApi` |

### The four HTTP methods explained

- **GET** — *read* data. `getCards()` reads all posts; `getCard(id)` reads one. Never changes anything.
- **POST** — *create* new data. `createCard(data)` makes a new post; `registerUser(...)` makes a new account.
- **PUT** — *update/replace* existing data. `updateCard(id, data)` edits a post you own.
- **DELETE** — *remove* data. `deleteCard(id)` removes a post you own.

Each frontend function maps 1-to-1 to a backend route with the **same method** — that's what makes the two sides line up.

---

## 4. Tutorial: Connect the Static Blog to the Server (Step by Step)

This is the main tutorial. You start with the **static blog** (the `Blog Project (Static)` folder — fake data, no server) and, step by step, turn it into a real app that talks to your Node.js backend. Do the steps **in order**. Each step says exactly which file to touch, gives the **full code**, and explains why.

> The finished result of every step already lives in this `frontend/` folder — so if you get stuck, compare with the matching file here.

### The idea in one line
The static blog reads a fake array (`lib/data.ts`) and its forms don't save. We will: **(1)** add axios + a few helper files, **(2)** replace the fake array with real API calls, and **(3)** make the forms actually submit. The design does not change.

---

### Step 0 — Get ready

1. Have the **backend running** (Section 1, Step 1) on `http://localhost:5000`.
2. Copy your **static blog** into a working folder (or just edit it in place).
3. Install axios inside the frontend:

```bash
cd frontend        # your static blog folder
npm install axios
```

---

### Step 1 — Tell the frontend where the server is

Create **`.env.local`** in the frontend root:

```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

Why: we never hard-code the URL in our code. `NEXT_PUBLIC_` makes it readable in the browser. **Restart `npm run dev` after creating this file.**

---

### Step 2 — Create the two axios clients

Create **`lib/api.ts`**:

```ts
import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_API_URL; // http://localhost:5000

// PUBLIC client — open routes (reading cards). No cookie.
export const api = axios.create({ baseURL });

// PROTECTED client — sends/receives the httpOnly auth cookie.
export const authApi = axios.create({ baseURL, withCredentials: true });
```

Why: `api` is for public reads. `authApi` has **`withCredentials: true`**, which is the single setting that makes the login cookie flow. Use `authApi` for anything that needs login or sets/clears the cookie.

---

### Step 3 — Add the shared types

Create **`lib/types.ts`**:

```ts
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

export type CardInput = {
  title: string;
  excerpt: string;
  content: string;
  category: string;
  image: string;
};

export type User = { id: string; name: string; email: string };
```

Why: these describe the data. `Card` is what the backend sends; `CardInput` is what you send when creating/editing (the server fills in `id`, `author`, `date`). Note `id` is now a **string** (a MongoDB id), not a number like in the static fake data.

---

### Step 4 — Add the card API calls (replaces the fake data)

Create **`lib/cards.ts`**:

```ts
import { api, authApi } from "./api";
import type { Card, CardInput } from "./types";

// PUBLIC
export const getCards = async (): Promise<Card[]> => {
  const res = await api.get("/api/cards");
  return res.data;
};
export const getCard = async (id: string): Promise<Card> => {
  const res = await api.get(`/api/cards/${id}`);
  return res.data;
};

// PROTECTED (need login — use authApi)
export const getMyCards = async (): Promise<Card[]> => {
  const res = await authApi.get("/api/cards/mine");
  return res.data;
};
export const createCard = async (data: CardInput): Promise<Card> => {
  const res = await authApi.post("/api/cards", data);
  return res.data;
};
export const updateCard = async (id: string, data: CardInput): Promise<Card> => {
  const res = await authApi.put(`/api/cards/${id}`, data);
  return res.data;
};
export const deleteCard = async (id: string): Promise<void> => {
  await authApi.delete(`/api/cards/${id}`);
};
```

Why: these functions are the replacement for `lib/data.ts`. Each URL matches a backend route. Public reads use `api`; the rest use `authApi`.

---

### Step 5 — Add the auth API calls

Create **`lib/auth.ts`**:

```ts
import { authApi } from "./api";
import type { User } from "./types";

export const registerUser = async (name: string, email: string, password: string): Promise<User> => {
  const res = await authApi.post("/api/users/register", { name, email, password });
  return res.data.user;
};
export const loginUser = async (email: string, password: string): Promise<User> => {
  const res = await authApi.post("/api/users/login", { email, password });
  return res.data.user;
};
export const logoutUser = async (): Promise<void> => {
  await authApi.post("/api/users/logout");
};
export const getMe = async (): Promise<User> => {
  const res = await authApi.get("/api/users/me");
  return res.data;
};
```

Why: all four touch the login cookie, so they all use `authApi`. The backend returns `{ user: {...} }`, so we read `res.data.user`.

---

### Step 6 — Delete the fake data

Delete **`lib/data.ts`**. Nothing should import `blogCards` anymore — the next steps switch every page to the API functions instead.

---

### Step 7 — Make the inputs "controlled"

The static inputs used `defaultValue`, which the parent can't read. Change them to controlled inputs (`value` + `onChange`).

Replace **`components/InputField.tsx`**:

```tsx
type InputFieldProps = {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  placeholder?: string;
};

export default function InputField({ label, name, value, onChange, type = "text", placeholder }: InputFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={name} className="text-sm font-medium text-slate-700">{label}</label>
      <input
        id={name} name={name} type={type} value={value} onChange={onChange} placeholder={placeholder}
        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
      />
    </div>
  );
}
```

Replace **`components/TextareaField.tsx`** the same way:

```tsx
type TextareaFieldProps = {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  rows?: number;
};

export default function TextareaField({ label, name, value, onChange, placeholder, rows = 6 }: TextareaFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={name} className="text-sm font-medium text-slate-700">{label}</label>
      <textarea
        id={name} name={name} value={value} onChange={onChange} rows={rows} placeholder={placeholder}
        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm resize-y focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
      />
    </div>
  );
}
```

Why: a **controlled** input's value lives in React state, so the form can read what the user typed and send it to the server.

---

### Step 8 — Home page: fetch real cards

Replace the top of **`app/page.tsx`** so it fetches instead of importing fake data. Add `"use client"` at the very top, then:

```tsx
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import BlogCard from "@/components/BlogCard";
import { getCards } from "@/lib/cards";
import type { Card } from "@/lib/types";

export default function HomePage() {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCards()
      .then(setCards)
      .catch(() => setCards([]))
      .finally(() => setLoading(false));
  }, []);

  // ...keep your existing hero section exactly as it was...

  // In the grid area, swap the old blogCards.map(...) for this:
  // {loading ? <p>Loading...</p> : cards.map((card) => <BlogCard key={card.id} card={card} />)}
}
```

(The full version with the hero is in `frontend/app/page.tsx`.) Why: `useEffect` runs once when the page loads, calls `getCards()`, and stores the result in state. `"use client"` is required because we use `useState`/`useEffect`.

---

### Step 9 — Single post page: fetch one card

Replace **`app/blog/[id]/page.tsx`** to read the id from the URL and fetch that card:

```tsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getCard } from "@/lib/cards";
import type { Card } from "@/lib/types";

export default function BlogPostPage() {
  const id = useParams().id as string;
  const [card, setCard] = useState<Card | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCard(id).then(setCard).catch(() => setCard(null)).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="p-10">Loading...</p>;
  if (!card) return <p className="p-10">Post not found.</p>;

  // ...keep your existing article layout, using {card.title}, {card.content}, etc...
}
```

Why: `useParams()` gives the `[id]` from the URL; we fetch just that one card instead of `.find()` on a fake array. (Full layout in `frontend/app/blog/[id]/page.tsx`.)

---

### Step 10 — BlogCard: allow deleting

Add an optional `onDelete` prop and make it a client component. Replace **`components/BlogCard.tsx`** — the important additions:

```tsx
"use client";
// ...imports...
type BlogCardProps = { card: Card; showActions?: boolean; onDelete?: (id: string) => void };

export default function BlogCard({ card, showActions = false, onDelete }: BlogCardProps) {
  // ...same markup...
  // The Delete button becomes:
  // <button onClick={() => onDelete?.(card.id)} ...>Delete</button>
}
```

Why: the dashboard passes an `onDelete` function; clicking Delete calls it with the card's id. (Full file in `frontend/components/BlogCard.tsx`.)

---

### Step 11 — CardForm: actually submit

Replace **`components/CardForm.tsx`** so it holds field state and submits via axios (create **or** update):

```tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import InputField from "./InputField";
import TextareaField from "./TextareaField";
import Button from "./Button";
import { createCard, updateCard } from "@/lib/cards";
import type { Card } from "@/lib/types";

export default function CardForm({ card, heading, submitLabel }: { card?: Card; heading: string; submitLabel: string }) {
  const router = useRouter();
  const [title, setTitle] = useState(card?.title ?? "");
  const [category, setCategory] = useState(card?.category ?? "");
  const [image, setImage] = useState(card?.image ?? "");
  const [excerpt, setExcerpt] = useState(card?.excerpt ?? "");
  const [content, setContent] = useState(card?.content ?? "");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const data = { title, category, image, excerpt, content };
    try {
      if (card) await updateCard(card.id, data); // edit -> PUT
      else await createCard(data);               // create -> POST
      router.push("/dashboard");
      router.refresh();
    } catch {
      alert("Could not save. Are you logged in?");
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} /* ...same styling... */>
      <InputField label="Title" name="title" value={title} onChange={(e) => setTitle(e.target.value)} />
      {/* ...the other fields, each with value + onChange... */}
      <Button type="submit" disabled={saving}>{saving ? "Saving..." : submitLabel}</Button>
    </form>
  );
}
```

Why: one form handles both cases — if a `card` was passed it updates (PUT), otherwise it creates (POST). After saving it sends you back to the dashboard. (Full file in `frontend/components/CardForm.tsx`.)

---

### Step 12 — Create & Edit pages

**`app/dashboard/create/page.tsx`** stays tiny:

```tsx
import CardForm from "@/components/CardForm";
export default function CreateCardPage() {
  return <CardForm heading="Create a new post" submitLabel="Publish Post" />;
}
```

**`app/dashboard/edit/[id]/page.tsx`** fetches the card, then pre-fills the form:

```tsx
"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import CardForm from "@/components/CardForm";
import { getCard } from "@/lib/cards";
import type { Card } from "@/lib/types";

export default function EditCardPage() {
  const id = useParams().id as string;
  const [card, setCard] = useState<Card | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    getCard(id).then(setCard).catch(() => setCard(null)).finally(() => setLoading(false));
  }, [id]);
  if (loading) return <p className="p-10">Loading...</p>;
  if (!card) return <p className="p-10">Post not found.</p>;
  return <CardForm card={card} heading="Edit post" submitLabel="Save Changes" />;
}
```

---

### Step 13 — Login & Register pages

Turn the static forms into real ones. **`app/login/page.tsx`** (core parts):

```tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "@/lib/auth";
// ...InputField, Button imports...

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await loginUser(email, password); // sets the cookie
      router.push("/dashboard");
      router.refresh();
    } catch {
      alert("Invalid email or password.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <InputField label="Email" name="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <InputField label="Password" name="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <Button type="submit">Log In</Button>
    </form>
  );
}
```

**`app/register/page.tsx`** is the same but with a `name` field and `registerUser(name, email, password)`. (Full styled versions in `frontend/app/login` and `frontend/app/register`.)

Why: on success, the backend sets the cookie and we send the user to the dashboard.

---

### Step 14 — Dashboard: fetch my cards + delete

Replace **`app/dashboard/page.tsx`** to load the logged-in user's cards and handle delete:

```tsx
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import BlogCard from "@/components/BlogCard";
import Button from "@/components/Button";
import { getMyCards, deleteCard } from "@/lib/cards";
import type { Card } from "@/lib/types";

export default function DashboardPage() {
  const router = useRouter();
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyCards()
      .then(setCards)
      .catch(() => router.push("/login")) // not logged in -> login
      .finally(() => setLoading(false));
  }, [router]);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this post?")) return;
    await deleteCard(id);
    setCards((prev) => prev.filter((c) => c.id !== id));
  };

  if (loading) return <p className="p-10">Loading your posts...</p>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* header + "New Post" button */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card) => (
          <BlogCard key={card.id} card={card} showActions onDelete={handleDelete} />
        ))}
      </div>
    </div>
  );
}
```

Why: `getMyCards()` uses `authApi`, so the cookie proves who you are. If you're not logged in the request fails and we redirect to `/login`. Delete removes it on the server, then from the screen. (Full styled file in `frontend/app/dashboard/page.tsx`.)

---

### Step 15 — Navbar: show login state

Make **`components/Navbar.tsx`** a client component that checks `getMe()`:

```tsx
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getMe, logoutUser } from "@/lib/auth";
// ...Link import...

export default function Navbar() {
  const [loggedIn, setLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    getMe().then(() => setLoggedIn(true)).catch(() => setLoggedIn(false));
  }, []);

  const handleLogout = async () => {
    await logoutUser();
    setLoggedIn(false);
    router.push("/login");
    router.refresh();
  };

  // if loggedIn -> show Dashboard + Logout button (onClick={handleLogout})
  // else        -> show Login + Sign Up links
}
```

Why: `getMe()` succeeds only if the cookie is valid, so the navbar can show the right links. (Full file in `frontend/components/Navbar.tsx`.)

---

### Step 16 — Run both and test the full flow

1. Backend running on `:5000`, frontend on `:3000`.
2. Open `http://localhost:3000`.
3. **Register** → you land on the dashboard.
4. **Create** a post → it appears on the home page.
5. **Edit** it → changes save.
6. **Delete** it → it disappears.
7. **Logout** → navbar switches back to Login / Sign Up.

If any step fails, jump to **Section 8 (Troubleshooting)** — it's almost always the cookie settings or a wrong URL.

**That's the whole conversion:** you added axios + 4 small `lib/` files, deleted the fake data, and switched each page from the fake array to the matching API call. The design never changed.

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
├── components/
│   ├── Navbar.tsx                 ← getMe() to toggle login state + logout
│   ├── Footer.tsx
│   ├── Button.tsx
│   ├── InputField.tsx             ← controlled input
│   ├── TextareaField.tsx          ← controlled textarea
│   ├── BlogCard.tsx               ← card + optional Edit/Delete
│   └── CardForm.tsx               ← create & edit form (axios submit)
├── tests/                         ← unit tests (Vitest)
│   ├── cards.test.ts              ← card helpers hit correct method + URL
│   └── auth.test.ts               ← auth helpers hit correct endpoints
└── vitest.config.ts               ← test config (@/ alias)
```

> The **backend** has its own tests in `backend/tests/` (`format`, `cardController`, `authController`). See Section 7b for how to run both.

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
- `cards.test.ts` — each card helper calls the **right method + URL** and the **right client** (public `api` vs protected `authApi`): `getCards → GET /api/cards`, `createCard → POST /api/cards`, `updateCard → PUT /api/cards/:id`, `deleteCard → DELETE /api/cards/:id`, etc. axios is mocked.
- `auth.test.ts` — `registerUser`, `loginUser`, `logoutUser`, `getMe` hit the correct `/api/users/...` endpoints and unwrap `res.data.user`.

Expected result: **10 tests, 10 pass.**

### Why this matters
These tests are your safety net. If you later change a function and accidentally break the method or URL (say `POST` becomes `PUT`), the test fails immediately and tells you exactly where. New to testing? Read the **`Unit Testing Basics`** folder first — it teaches the ideas from zero.

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
