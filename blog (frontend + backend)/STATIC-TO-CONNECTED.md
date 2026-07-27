# Static → Connected: Exactly What to Change (File by File)

This note shows the **precise changes** that turn the **static** blog into the **connected** (full-stack) blog. Two real folders sit side by side so you can compare:

```
blog (frontend + backend)/
├── static/      ← the design only (fake data, nothing saves)
└── frontend/    ← the SAME design, now talking to the backend with axios
```

Open the same file in both folders and read this note. Each section shows **BEFORE (static)** → **AFTER (connected)** and explains the change. The **look never changes** — only where the data comes from and whether forms actually submit.

> How to use this: pick a file below, open `static/<file>` and `frontend/<file>` together, and apply the change described. By the end you've rebuilt `frontend/` from `static/` yourself.

---

## The 3 Kinds of Change (the whole idea)

1. **Add 5 small files** that didn't exist in static: `.env.local`, `lib/api.ts`, `lib/types.ts`, `lib/cards.ts`, `lib/auth.ts`.
2. **Delete 1 file:** `lib/data.ts` (the fake data).
3. **Edit the pages/components** so they:
   - fetch real data with axios instead of importing the fake array, and
   - make forms actually submit (controlled inputs + a submit handler).

That's it. Below is every change in detail.

---

## STEP 1 — ADD: `.env.local` (new file)

**Static:** does not exist.
**Connected:** create it in the frontend root.

```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

**Why:** the frontend must know the backend's address. `NEXT_PUBLIC_` makes it readable in the browser. Restart `npm run dev` after adding it.

---

## STEP 2 — ADD: `lib/api.ts` (new file)

**Static:** does not exist.
**Connected:** create it. These are the two axios clients used everywhere.

```ts
import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

// PUBLIC — open routes (reading cards). No cookie.
export const api = axios.create({ baseURL });

// PROTECTED — sends/receives the login cookie automatically.
export const authApi = axios.create({ baseURL, withCredentials: true });
```

**Why:** `api` for public reads, `authApi` (with `withCredentials`) for anything needing login. Also run `npm install axios` once.

---

## STEP 3 — ADD: `lib/types.ts` (new file)

**Static:** the card shape lived inside `lib/data.ts`.
**Connected:** move the shape here (and add input/user types).

```ts
export type Card = {
  id: string;            // was `number` in static — a real DB id is a string
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  category: string;
  image: string;
};

export type CardInput = { title: string; excerpt: string; content: string; category: string; image: string };
export type User = { id: string; name: string; email: string };
```

**Why:** describes the data coming from the backend. Note `id` changes from `number` → `string`.

---

## STEP 4 — ADD: `lib/cards.ts` and `lib/auth.ts` (new files)

**Static:** none — data was a hard-coded array.
**Connected:** small functions that make the axios calls (so pages stay clean).

`lib/cards.ts`:
```ts
import { api, authApi } from "./api";
import type { Card, CardInput } from "./types";

export const getCards   = async ()               => (await api.get("/api/cards")).data;
export const getCard    = async (id: string)     => (await api.get(`/api/cards/${id}`)).data;
export const getMyCards = async ()               => (await authApi.get("/api/cards/mine")).data;
export const createCard = async (d: CardInput)   => (await authApi.post("/api/cards", d)).data;
export const updateCard = async (id: string, d: CardInput) => (await authApi.put(`/api/cards/${id}`, d)).data;
export const deleteCard = async (id: string)     => { await authApi.delete(`/api/cards/${id}`); };
```

`lib/auth.ts`:
```ts
import { authApi } from "./api";
export const registerUser = async (name: string, email: string, password: string) => (await authApi.post("/api/users/register", { name, email, password })).data.user;
export const loginUser    = async (email: string, password: string)               => (await authApi.post("/api/users/login", { email, password })).data.user;
export const logoutUser   = async ()                                              => { await authApi.post("/api/users/logout"); };
export const getMe        = async ()                                              => (await authApi.get("/api/users/me")).data;
```

**Why:** each function = one API call. `getCards/getCard` are public (`api`); everything else needs login (`authApi`).

> Prefer inline calls instead of these helper functions? See the `Blog JS (Beginner, Bangla)` folder, which calls `api`/`authApi` directly in each file.

---

## STEP 5 — DELETE: `lib/data.ts`

**Static:** a big array of fake `blogCards`.
**Connected:** delete this file. Real data now comes from the backend via `lib/cards.ts`.

---

## STEP 6 — EDIT: `components/InputField.tsx` (uncontrolled → controlled)

**BEFORE (static)** — uses `defaultValue`, so the parent can't read what's typed:
```tsx
export default function InputField({ label, type = "text", name, placeholder, defaultValue }) {
  return (
    <input ... defaultValue={defaultValue} />
  );
}
```

**AFTER (connected)** — uses `value` + `onChange` (controlled):
```tsx
export default function InputField({ label, name, value, onChange, type = "text", placeholder }) {
  return (
    <input ... value={value} onChange={onChange} />
  );
}
```

**Why:** a form can only send data it can *read*. A controlled input stores its value in React state. Do the same change to `components/TextareaField.tsx`.

---

## STEP 7 — EDIT: `app/page.tsx` (home — fake array → fetch)

**BEFORE (static):**
```tsx
import { blogCards } from "@/lib/data";

export default function HomePage() {
  return (
    // ...
    {blogCards.map((card) => <BlogCard key={card.id} card={card} />)}
  );
}
```

**AFTER (connected):** add `"use client"`, fetch on load, keep in state:
```tsx
"use client";
import { useEffect, useState } from "react";
import BlogCard from "@/components/BlogCard";
import { getCards } from "@/lib/cards";

export default function HomePage() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCards().then(setCards).catch(() => setCards([])).finally(() => setLoading(false));
  }, []);

  return (
    // ...same hero + grid...
    {loading ? <p>Loading...</p> : cards.map((card) => <BlogCard key={card.id} card={card} />)}
  );
}
```

**What changed:** removed `import { blogCards }`; added `"use client"`, `useState`, `useEffect`, and a loading state. The JSX/design is identical.

---

## STEP 8 — EDIT: `app/blog/[id]/page.tsx` (find → fetch one)

**BEFORE (static):** finds the card in the fake array.
```tsx
import { blogCards } from "@/lib/data";
export default async function BlogPostPage({ params }) {
  const { id } = await params;
  const card = blogCards.find((c) => c.id === Number(id));
  // ...
}
```

**AFTER (connected):** fetch that one card from the API.
```tsx
"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getCard } from "@/lib/cards";

export default function BlogPostPage() {
  const id = useParams().id;
  const [card, setCard] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    getCard(id).then(setCard).catch(() => setCard(null)).finally(() => setLoading(false));
  }, [id]);
  // ...same layout, plus loading / not-found checks
}
```

**What changed:** `blogCards.find(...)` → `getCard(id)`; read the id with `useParams()` instead of `params`.

---

## STEP 9 — EDIT: `components/BlogCard.tsx` (dead Delete → working Delete)

**BEFORE (static):** the Delete button does nothing.
```tsx
<button className="...">Delete</button>
```

**AFTER (connected):** add an `onDelete` prop and call it (and add `"use client"`).
```tsx
"use client";
export default function BlogCard({ card, showActions = false, onDelete }) {
  // ...
  <button onClick={() => onDelete?.(card.id)} className="...">Delete</button>
}
```

**Why:** the dashboard passes a delete function; the card just calls it with its id.

---

## STEP 10 — EDIT: `components/CardForm.tsx` (static form → real submit)

**BEFORE (static):** plain form, `defaultValue` fields, no submit logic.

**AFTER (connected):** `"use client"`, `useState` per field, and a submit handler that calls the API:
```tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createCard, updateCard } from "@/lib/cards";

export default function CardForm({ card, heading, submitLabel }) {
  const router = useRouter();
  const [title, setTitle] = useState(card?.title ?? "");
  // ...one useState per field...

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { title, category, image, excerpt, content };
    if (card) await updateCard(card.id, data);  // edit  → PUT
    else      await createCard(data);            // create → POST
    router.push("/dashboard");
  };

  return <form onSubmit={handleSubmit}> ...controlled inputs... </form>;
}
```

**What changed:** fields become controlled (`value`+`onChange`); submit calls `createCard` (POST) or `updateCard` (PUT); then navigates back.

---

## STEP 11 — EDIT: `app/login/page.tsx` and `app/register/page.tsx`

**BEFORE (static):** a form that submits nowhere.

**AFTER (connected):** controlled fields + a handler that calls auth, then redirects.
```tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    await loginUser(email, password); // sets the cookie
    router.push("/dashboard");
  };
  // ...form with value/onChange + onSubmit={handleSubmit}
}
```

`register/page.tsx` is the same idea with a `name` field and `registerUser(...)`.

---

## STEP 12 — EDIT: `app/dashboard/page.tsx` (fake slice → my cards + delete)

**BEFORE (static):** pretended the first 3 fake cards belong to the user.
```tsx
import { blogCards } from "@/lib/data";
const myCards = blogCards.slice(0, 3);
```

**AFTER (connected):** fetch the logged-in user's cards; redirect to login if not authed; wire delete.
```tsx
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getMyCards, deleteCard } from "@/lib/cards";

export default function DashboardPage() {
  const router = useRouter();
  const [cards, setCards] = useState([]);
  useEffect(() => {
    getMyCards().then(setCards).catch(() => router.push("/login"));
  }, [router]);
  const handleDelete = async (id) => { await deleteCard(id); setCards((p) => p.filter((c) => c.id !== id)); };
  // ...pass onDelete to <BlogCard showActions onDelete={handleDelete} />
}
```

**What changed:** `blogCards.slice(0,3)` → `getMyCards()`; added the 401→login redirect and a working delete.

---

## STEP 13 — EDIT: `app/dashboard/edit/[id]/page.tsx`

**BEFORE (static):** `blogCards.find(...)`.
**AFTER (connected):** fetch the card, then render `<CardForm card={card} />`.
```tsx
"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import CardForm from "@/components/CardForm";
import { getCard } from "@/lib/cards";

export default function EditCardPage() {
  const id = useParams().id;
  const [card, setCard] = useState(null);
  useEffect(() => { getCard(id).then(setCard); }, [id]);
  if (!card) return <p className="p-10">Loading...</p>;
  return <CardForm card={card} heading="Edit post" submitLabel="Save Changes" />;
}
```

`app/dashboard/create/page.tsx` needs **no change** — it already just renders `<CardForm>` (which now submits).

---

## STEP 14 — EDIT: `components/Navbar.tsx` (static links → login-aware)

**BEFORE (static):** always shows Home / Dashboard / Login / Sign Up.

**AFTER (connected):** check login with `getMe()`, show Dashboard/Logout when logged in.
```tsx
"use client";
import { useEffect, useState } from "react";
import { getMe, logoutUser } from "@/lib/auth";
// ...
useEffect(() => { getMe().then(() => setLoggedIn(true)).catch(() => setLoggedIn(false)); }, []);
```

---

## Change Summary Table

| File | Change | Type |
|------|--------|------|
| `.env.local` | create with `NEXT_PUBLIC_API_URL` | ➕ add |
| `lib/api.ts` | create the 2 axios clients | ➕ add |
| `lib/types.ts` | create Card/CardInput/User types | ➕ add |
| `lib/cards.ts` | create card API calls | ➕ add |
| `lib/auth.ts` | create auth API calls | ➕ add |
| `lib/data.ts` | delete fake data | ➖ remove |
| `components/InputField.tsx` | `defaultValue` → `value`+`onChange` | ✏️ edit |
| `components/TextareaField.tsx` | `defaultValue` → `value`+`onChange` | ✏️ edit |
| `components/BlogCard.tsx` | add `onDelete`, `"use client"` | ✏️ edit |
| `components/CardForm.tsx` | state + submit (create/update) | ✏️ edit |
| `components/Navbar.tsx` | login-aware via `getMe` | ✏️ edit |
| `app/page.tsx` | `blogCards` → `getCards()` | ✏️ edit |
| `app/blog/[id]/page.tsx` | `.find()` → `getCard(id)` | ✏️ edit |
| `app/login/page.tsx` | form → `loginUser()` | ✏️ edit |
| `app/register/page.tsx` | form → `registerUser()` | ✏️ edit |
| `app/dashboard/page.tsx` | `.slice()` → `getMyCards()` + delete | ✏️ edit |
| `app/dashboard/edit/[id]/page.tsx` | `.find()` → `getCard(id)` | ✏️ edit |
| `app/dashboard/create/page.tsx` | no change | ➖ none |

---

## How to Compare Side by Side

1. Open `static/app/page.tsx` and `frontend/app/page.tsx` — see `blogCards` become `getCards()`.
2. Open `static/components/CardForm.tsx` and `frontend/components/CardForm.tsx` — see the form gain state + submit.
3. Open `static/lib/data.ts` — it exists here but is **gone** in `frontend/` (replaced by `lib/*.ts`).

**Rule to remember:** the design (JSX + Tailwind) stays the same everywhere. Connecting to the backend only changes **where data comes from** (fake array → axios) and **whether forms do something** (nothing → POST/PUT/DELETE).
