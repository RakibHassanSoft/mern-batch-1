# Static → Connected (TypeScript): BEFORE code, AFTER code & Explanation

This guide shows you **exactly** how to turn the **static** blog into the **connected** (full-stack) blog. For every file you get three things:

1. **BEFORE (static)** — the complete original file
2. **AFTER (connected)** — the complete new file
3. **Explanation** — what changed, why, and why each tool/line is used

Two real folders sit side by side so you can compare:

```
blog (frontend + backend)/
├── static/      ← the design only (fake data, nothing saves)
└── frontend/    ← the SAME design, connected to the backend with axios
```

Everything is **TypeScript** and uses **direct axios calls** — no wrapper functions. The `lib/` folder ends up with **only one file: `api.ts`**.

---

## The Big Idea

- **Static** reads a fake array (`lib/data.ts`) and its forms don't save anything.
- **Connected** calls the backend with **axios**, directly in each file:
  ```ts
  const res = await api.get("/api/cards");                      // read (public)
  await authApi.post("/api/users/login", { email, password });  // login (private)
  ```
- Two axios clients (in `lib/api.ts`): `api` = **public** (no login), `authApi` = **private** (sends the login cookie).
- **Cookie login:** on login the backend returns a cookie; the browser stores it and sends it on every later request — but only if axios uses `withCredentials: true` (that's what `authApi` has).
- **Types:** since `lib/` only has `api.ts`, the `Card` type is written **inline** in the files that use it.

**The three kinds of change:** (1) ADD `.env.local` + `lib/api.ts`, (2) DELETE `lib/data.ts`, (3) EDIT each page/component to fetch data and make forms submit. The design (JSX + Tailwind) never changes.

---

## STEP 0 — Start the backend
```bash
cd backend
npm install
cp .env.example .env   # set MONGO_URI, JWT_SECRET, CLIENT_URL=http://localhost:3000, NODE_ENV=development
npm run dev            # http://localhost:5000
```

## STEP 1 — Install axios
```bash
cd frontend
npm install axios
```

---

## STEP 2 — ADD `.env.local` (new file — did not exist in static)

**AFTER — full file:**
```
NEXT_PUBLIC_API_URL=http://localhost:5000
```
**Explanation:** the frontend must know the backend's address. We keep it in an env file (not hard-coded) so deploying only means changing this value. `NEXT_PUBLIC_` makes it readable in the browser. **Restart `npm run dev` after creating it.**

---

## STEP 3 — ADD `lib/api.ts` (the ONLY lib file) ⭐

**AFTER — full file:**
```ts
import axios from "axios";

// The backend URL comes from .env.local -> NEXT_PUBLIC_API_URL (e.g. http://localhost:5000)
const baseURL = process.env.NEXT_PUBLIC_API_URL;

// PUBLIC axios client — open routes that don't need login (reading cards).
export const api = axios.create({ baseURL });

// PROTECTED axios client — withCredentials:true sends & receives the login cookie.
// Use for register, login, logout, "my cards", create, update, delete.
export const authApi = axios.create({ baseURL, withCredentials: true });
```
**Explanation:**
- `axios.create({ baseURL })` builds a reusable client so you write `api.get("/api/cards")` instead of the full URL every time.
- **Two clients:** public reads use `api`; anything needing login uses `authApi`.
- **`withCredentials: true`** is the key line — without it the browser won't send the login cookie, so protected requests return `401`.

---

## STEP 4 — DELETE `lib/data.ts`

**BEFORE:** a large fake `blogCards` array used only for the design.
**AFTER:** delete the file — real data now comes from the backend.
**Explanation:** every `import { blogCards } from "@/lib/data"` will be replaced by an axios call in the steps below.

---

## STEP 5 — `components/InputField.tsx`

**BEFORE (static) — full file:**
```tsx
// A labelled text input, reused across the login/register/card forms.
type InputFieldProps = {
  label: string;
  type?: string;
  name: string;
  placeholder?: string;
  defaultValue?: string;
};

export default function InputField({ label, type = "text", name, placeholder, defaultValue }: InputFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={name} className="text-sm font-medium text-slate-700">{label}</label>
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        defaultValue={defaultValue}
        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm
                   focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
      />
    </div>
  );
}
```

**AFTER (connected) — full file:**
```tsx
// A controlled labelled input (value + onChange come from the parent's state).
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
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm
                   focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
      />
    </div>
  );
}
```

**Explanation:**
- **What changed:** removed `defaultValue`; added `value` and `onChange` (both to the props type and the `<input>`).
- **Why:** `defaultValue` only sets an initial value and the parent can't read what the user types. `value` + `onChange` make a **controlled input** — the text lives in React state, so the form can read it and send it to the server. Do the same to `TextareaField.tsx` (next).

---

## STEP 6 — `components/TextareaField.tsx`

**BEFORE (static) — full file:**
```tsx
// A labelled multi-line text area, used for the blog card content.
type TextareaFieldProps = {
  label: string;
  name: string;
  placeholder?: string;
  defaultValue?: string;
  rows?: number;
};

export default function TextareaField({ label, name, placeholder, defaultValue, rows = 6 }: TextareaFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={name} className="text-sm font-medium text-slate-700">{label}</label>
      <textarea
        id={name}
        name={name}
        rows={rows}
        placeholder={placeholder}
        defaultValue={defaultValue}
        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm resize-y
                   focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
      />
    </div>
  );
}
```

**AFTER (connected) — full file:**
```tsx
// A controlled labelled textarea for the card content.
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
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        rows={rows}
        placeholder={placeholder}
        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm resize-y
                   focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
      />
    </div>
  );
}
```

**Explanation:** same change as InputField — `defaultValue` → `value` + `onChange` — but for a `<textarea>`. Note the `onChange` type uses `HTMLTextAreaElement`. Now the post content is controlled too, so the form can submit it.

---

## STEP 7 — `app/page.tsx` (Home)

**BEFORE (static) — full file:**
```tsx
import Link from "next/link";
import BlogCard from "@/components/BlogCard";
import { blogCards } from "@/lib/data";

// PUBLIC HOME PAGE — anyone can see all the cards here.
export default function HomePage() {
  return (
    <div>
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 py-16 text-center">
          <span className="inline-block bg-indigo-50 text-indigo-600 text-xs font-medium px-3 py-1 rounded-full">Welcome to DevBlog</span>
          <h1 className="mt-4 text-4xl sm:text-5xl font-bold text-slate-900 tracking-tight">
            Share what you <span className="text-indigo-600">learn</span>
          </h1>
          <p className="mt-4 max-w-xl mx-auto text-slate-600">Read posts from developers, or sign up to write and manage your own.</p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <Link href="/register" className="bg-indigo-600 text-white text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-indigo-700 transition">Start Writing</Link>
            <Link href="#posts" className="border border-slate-300 text-slate-700 text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-slate-100 transition">Browse Posts</Link>
          </div>
        </div>
      </section>

      <section id="posts" className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-900">Latest Posts</h2>
          <span className="text-sm text-slate-500">{blogCards.length} posts</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogCards.map((card) => (
            <BlogCard key={card.id} card={card} />
          ))}
        </div>
      </section>
    </div>
  );
}
```

**AFTER (connected) — full file:**
```tsx
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import BlogCard from "@/components/BlogCard";
import { api } from "@/lib/api"; // only the axios client — no wrapper functions

// The shape of a card (defined inline, since lib only has api.ts).
type Card = {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  category: string;
  image: string;
};

// PUBLIC HOME PAGE — reads all cards.
export default function HomePage() {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Direct axios call — public route, no login needed.
    api
      .get("/api/cards")
      .then((res) => setCards(res.data)) // res.data = the array of cards
      .catch(() => setCards([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 py-16 text-center">
          <span className="inline-block bg-indigo-50 text-indigo-600 text-xs font-medium px-3 py-1 rounded-full">Welcome to DevBlog</span>
          <h1 className="mt-4 text-4xl sm:text-5xl font-bold text-slate-900 tracking-tight">
            Share what you <span className="text-indigo-600">learn</span>
          </h1>
          <p className="mt-4 max-w-xl mx-auto text-slate-600">Read posts from developers, or sign up to write and manage your own.</p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <Link href="/register" className="bg-indigo-600 text-white text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-indigo-700 transition">Start Writing</Link>
            <Link href="#posts" className="border border-slate-300 text-slate-700 text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-slate-100 transition">Browse Posts</Link>
          </div>
        </div>
      </section>

      <section id="posts" className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-900">Latest Posts</h2>
          <span className="text-sm text-slate-500">{cards.length} posts</span>
        </div>

        {loading ? (
          <p className="text-slate-500">Loading posts...</p>
        ) : cards.length === 0 ? (
          <p className="text-slate-500">No posts yet. Be the first to write one!</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {cards.map((card) => (
              <BlogCard key={card.id} card={card} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
```

**Explanation:**
- **What changed:** removed `import { blogCards }`; added `"use client"`, the inline `Card` type, `useState`/`useEffect`, `api.get("/api/cards")`, and a loading state. `blogCards.map` → `cards.map` (from state).
- **`"use client"`** is required because we use `useState`/`useEffect` (browser features).
- **`useEffect(..., [])`** runs once when the page first loads — the right place to fetch data.
- **`api` (not `authApi`)** because reading all posts is public — no cookie needed.
- **`res.data`** is where axios puts the response body (here, the array of cards).

---

## STEP 8 — `app/blog/[id]/page.tsx` (single post)

**BEFORE (static) — full file:**
```tsx
import Link from "next/link";
import Image from "next/image";
import { blogCards } from "@/lib/data";

// SINGLE POST PAGE — public. Reads the :id from the URL and shows one card.
export default async function BlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const card = blogCards.find((c) => c.id === Number(id));

  if (!card) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-slate-900">Post not found</h1>
        <Link href="/" className="mt-4 inline-block text-indigo-600 hover:underline">← Back to home</Link>
      </div>
    );
  }

  return (
    <article className="max-w-3xl mx-auto px-4 py-10">
      <Link href="/" className="text-sm text-slate-500 hover:text-indigo-600 transition">← Back to all posts</Link>
      <div className="mt-6 flex items-center gap-3">
        <span className="bg-indigo-600 text-white text-xs font-medium px-2.5 py-1 rounded-full">{card.category}</span>
        <span className="text-sm text-slate-500">{card.date}</span>
      </div>
      <h1 className="mt-4 text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">{card.title}</h1>
      <div className="mt-4 flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold">
          {card.author.charAt(0)}
        </div>
        <span className="text-sm font-medium text-slate-700">{card.author}</span>
      </div>
      <div className="relative h-64 sm:h-80 w-full mt-8 rounded-xl overflow-hidden">
        <Image src={card.image} alt={card.title} fill className="object-cover" />
      </div>
      <div className="mt-8 text-slate-700 leading-relaxed space-y-4">
        <p className="text-lg text-slate-800 font-medium">{card.excerpt}</p>
        <p>{card.content}</p>
      </div>
    </article>
  );
}
```

**AFTER (connected) — full file:**
```tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "@/lib/api"; // direct axios client

type Card = {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  category: string;
  image: string;
};

// SINGLE POST PAGE — public. Reads the :id from the URL and fetches that card.
export default function BlogPostPage() {
  const params = useParams();
  const id = params.id as string;

  const [card, setCard] = useState<Card | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Direct axios call — public route.
    api
      .get(`/api/cards/${id}`)
      .then((res) => setCard(res.data))
      .catch(() => setCard(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="max-w-3xl mx-auto px-4 py-20 text-slate-500">Loading...</p>;

  if (!card) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-slate-900">Post not found</h1>
        <Link href="/" className="mt-4 inline-block text-indigo-600 hover:underline">← Back to home</Link>
      </div>
    );
  }

  return (
    <article className="max-w-3xl mx-auto px-4 py-10">
      <Link href="/" className="text-sm text-slate-500 hover:text-indigo-600 transition">← Back to all posts</Link>
      <div className="mt-6 flex items-center gap-3">
        <span className="bg-indigo-600 text-white text-xs font-medium px-2.5 py-1 rounded-full">{card.category}</span>
        <span className="text-sm text-slate-500">{card.date}</span>
      </div>
      <h1 className="mt-4 text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">{card.title}</h1>
      <div className="mt-4 flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold">
          {card.author.charAt(0)}
        </div>
        <span className="text-sm font-medium text-slate-700">{card.author}</span>
      </div>
      <div className="relative h-64 sm:h-80 w-full mt-8 rounded-xl overflow-hidden">
        <Image src={card.image} alt={card.title} fill className="object-cover" />
      </div>
      <div className="mt-8 text-slate-700 leading-relaxed space-y-4">
        <p className="text-lg text-slate-800 font-medium">{card.excerpt}</p>
        <p>{card.content}</p>
      </div>
    </article>
  );
}
```

**Explanation:**
- **What changed:** static was a server component using `params` + `blogCards.find()`. Now it's a client component: `useParams()` reads the id and `api.get(\`/api/cards/${id}\`)` fetches that one card.
- **`useParams()`** is how a client component reads the `[id]` from the URL.
- **Template literal `` `/api/cards/${id}` ``** inserts the id into the URL. The JSX design is unchanged.

---

## STEP 9 — `components/BlogCard.tsx`

**BEFORE (static) — full file:**
```tsx
import Link from "next/link";
import Image from "next/image";
import type { BlogCard as BlogCardType } from "@/lib/data";

type BlogCardProps = {
  card: BlogCardType;
  showActions?: boolean;
};

export default function BlogCard({ card, showActions = false }: BlogCardProps) {
  return (
    <article className="group bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition">
      <div className="relative h-48 w-full overflow-hidden">
        <Image src={card.image} alt={card.title} fill className="object-cover group-hover:scale-105 transition duration-300" />
        <span className="absolute top-3 left-3 bg-indigo-600 text-white text-xs font-medium px-2.5 py-1 rounded-full">{card.category}</span>
      </div>
      <div className="p-5">
        <h3 className="text-lg font-semibold text-slate-900 line-clamp-1">{card.title}</h3>
        <p className="mt-2 text-sm text-slate-600 line-clamp-2">{card.excerpt}</p>
        <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
          <span>{card.author}</span>
          <span>{card.date}</span>
        </div>
        <Link href={`/blog/${card.id}`} className="mt-4 inline-block text-sm font-medium text-indigo-600 hover:text-indigo-800">Read more →</Link>
        {showActions && (
          <div className="mt-4 flex gap-2 border-t border-slate-100 pt-4">
            <Link href={`/dashboard/edit/${card.id}`} className="flex-1 text-center text-sm font-medium border border-slate-300 text-slate-700 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition">Edit</Link>
            <button className="flex-1 text-sm font-medium bg-red-600 text-white px-3 py-1.5 rounded-lg hover:bg-red-700 transition">Delete</button>
          </div>
        )}
      </div>
    </article>
  );
}
```

**AFTER (connected) — full file:**
```tsx
"use client";

import Link from "next/link";
import Image from "next/image";

// Card shape (inline — lib only has api.ts).
type Card = {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  category: string;
  image: string;
};

type BlogCardProps = {
  card: Card;
  showActions?: boolean;
  onDelete?: (id: string) => void;
};

// A single blog card. On the dashboard we pass showActions + onDelete.
export default function BlogCard({ card, showActions = false, onDelete }: BlogCardProps) {
  return (
    <article className="group bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition">
      <div className="relative h-48 w-full overflow-hidden">
        <Image src={card.image} alt={card.title} fill className="object-cover group-hover:scale-105 transition duration-300" />
        <span className="absolute top-3 left-3 bg-indigo-600 text-white text-xs font-medium px-2.5 py-1 rounded-full">{card.category}</span>
      </div>
      <div className="p-5">
        <h3 className="text-lg font-semibold text-slate-900 line-clamp-1">{card.title}</h3>
        <p className="mt-2 text-sm text-slate-600 line-clamp-2">{card.excerpt}</p>
        <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
          <span>{card.author}</span>
          <span>{card.date}</span>
        </div>
        <Link href={`/blog/${card.id}`} className="mt-4 inline-block text-sm font-medium text-indigo-600 hover:text-indigo-800">Read more →</Link>
        {showActions && (
          <div className="mt-4 flex gap-2 border-t border-slate-100 pt-4">
            <Link href={`/dashboard/edit/${card.id}`} className="flex-1 text-center text-sm font-medium border border-slate-300 text-slate-700 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition">Edit</Link>
            <button onClick={() => onDelete?.(card.id)} className="flex-1 text-sm font-medium bg-red-600 text-white px-3 py-1.5 rounded-lg hover:bg-red-700 transition">Delete</button>
          </div>
        )}
      </div>
    </article>
  );
}
```

**Explanation:**
- **What changed:** added `"use client"`; replaced `import type { BlogCard } from "@/lib/data"` with an inline `Card` type (data.ts is gone); added the `onDelete` prop; the Delete button now runs `onClick={() => onDelete?.(card.id)}`.
- **Why `"use client"`:** the button now has an `onClick` handler (interactive).
- **Why `onDelete`:** the card doesn't delete itself — the dashboard passes a function and the card calls it with its id. The real axios delete lives on the dashboard (Step 13). `?.` safely does nothing if `onDelete` wasn't passed (e.g. on the home page).

---

## STEP 10 — `components/CardForm.tsx` ⭐

**BEFORE (static) — full file:**
```tsx
import InputField from "./InputField";
import TextareaField from "./TextareaField";
import Button from "./Button";
import type { BlogCard } from "@/lib/data";

type CardFormProps = {
  card?: BlogCard;
  heading: string;
  submitLabel: string;
};

export default function CardForm({ card, heading, submitLabel }: CardFormProps) {
  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-slate-900">{heading}</h1>
      <p className="mt-1 text-sm text-slate-500">Fill in the details below. (Static form — no saving yet.)</p>

      <form className="mt-6 bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col gap-5">
        <InputField label="Title" name="title" placeholder="Enter a catchy title" defaultValue={card?.title} />
        <InputField label="Category" name="category" placeholder="e.g. Next.js" defaultValue={card?.category} />
        <InputField label="Cover Image URL" name="image" placeholder="https://..." defaultValue={card?.image} />
        <InputField label="Short Excerpt" name="excerpt" placeholder="One-line summary shown on the card" defaultValue={card?.excerpt} />
        <TextareaField label="Content" name="content" placeholder="Write your full post here..." defaultValue={card?.content} />

        <div className="flex gap-3 pt-2">
          <Button type="submit" variant="primary">{submitLabel}</Button>
          <Button href="/dashboard" variant="outline">Cancel</Button>
        </div>
      </form>
    </div>
  );
}
```

**AFTER (connected) — full file:**
```tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import InputField from "./InputField";
import TextareaField from "./TextareaField";
import Button from "./Button";
import { authApi } from "@/lib/api"; // protected client

type Card = {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  category: string;
  image: string;
};

type CardFormProps = {
  card?: Card; // if given -> edit mode (PUT); otherwise create mode (POST)
  heading: string;
  submitLabel: string;
};

export default function CardForm({ card, heading, submitLabel }: CardFormProps) {
  const router = useRouter();

  // One state per field. In edit mode they start with the card's values.
  const [title, setTitle] = useState(card?.title ?? "");
  const [category, setCategory] = useState(card?.category ?? "");
  const [image, setImage] = useState(card?.image ?? "");
  const [excerpt, setExcerpt] = useState(card?.excerpt ?? "");
  const [content, setContent] = useState(card?.content ?? "");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    const data = { title, category, image, excerpt, content };

    try {
      if (card) {
        // Direct axios call — EDIT (PUT).
        await authApi.put(`/api/cards/${card.id}`, data);
      } else {
        // Direct axios call — CREATE (POST).
        await authApi.post("/api/cards", data);
      }
      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Could not save. Are you logged in?");
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-slate-900">{heading}</h1>
      <p className="mt-1 text-sm text-slate-500">Fill in the details below.</p>

      <form onSubmit={handleSubmit} className="mt-6 bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col gap-5">
        {error && <p className="bg-red-50 text-red-700 text-sm px-3 py-2 rounded-lg">{error}</p>}

        <InputField label="Title" name="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter a catchy title" />
        <InputField label="Category" name="category" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="e.g. Next.js" />
        <InputField label="Cover Image URL" name="image" value={image} onChange={(e) => setImage(e.target.value)} placeholder="https://..." />
        <InputField label="Short Excerpt" name="excerpt" value={excerpt} onChange={(e) => setExcerpt(e.target.value)} placeholder="One-line summary" />
        <TextareaField label="Content" name="content" value={content} onChange={(e) => setContent(e.target.value)} placeholder="Write your full post here..." />

        <div className="flex gap-3 pt-2">
          <Button type="submit" variant="primary" disabled={saving}>{saving ? "Saving..." : submitLabel}</Button>
          <Button href="/dashboard" variant="outline">Cancel</Button>
        </div>
      </form>
    </div>
  );
}
```

**Explanation:**
- **What changed:** added `"use client"`, `useState`/`useRouter`/`authApi`, one state per field, `<form onSubmit={handleSubmit}>`, and the real axios call. Inputs went from `defaultValue` to `value` + `onChange`.
- **`e.preventDefault()`** stops the browser's default form submit (which reloads the page and would skip our axios call).
- **`card` ? PUT : POST** — one form for both: the edit page passes a `card` → `authApi.put` (update); the create page passes none → `authApi.post` (new).
- **`authApi`** (not `api`) because creating/editing requires login (cookie).
- **`saving`** disables the button and shows "Saving..." to prevent double submits.

---

## STEP 11 — `app/login/page.tsx`

**BEFORE (static) — full file:**
```tsx
import Link from "next/link";
import InputField from "@/components/InputField";
import Button from "@/components/Button";

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
          <h1 className="text-2xl font-bold text-slate-900 text-center">Welcome back</h1>
          <p className="mt-1 text-sm text-slate-500 text-center">Log in to manage your posts.</p>

          <form className="mt-6 flex flex-col gap-4">
            <InputField label="Email" type="email" name="email" placeholder="you@example.com" />
            <InputField label="Password" type="password" name="password" placeholder="••••••••" />
            <Button type="submit" variant="primary" className="w-full">Log In</Button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-indigo-600 font-medium hover:underline">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
```

**AFTER (connected) — full file:**
```tsx
"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import InputField from "@/components/InputField";
import Button from "@/components/Button";
import { authApi } from "@/lib/api"; // protected client (sends/receives the cookie)

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      // Direct axios call — on success the server sets the login cookie.
      await authApi.post("/api/users/login", { email, password });
      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Invalid email or password.");
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
          <h1 className="text-2xl font-bold text-slate-900 text-center">Welcome back</h1>
          <p className="mt-1 text-sm text-slate-500 text-center">Log in to manage your posts.</p>

          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
            {error && <p className="bg-red-50 text-red-700 text-sm px-3 py-2 rounded-lg">{error}</p>}
            <InputField label="Email" name="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
            <InputField label="Password" name="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
            <Button type="submit" variant="primary" className="w-full" disabled={loading}>{loading ? "Logging in..." : "Log In"}</Button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-indigo-600 font-medium hover:underline">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
```

**Explanation:**
- **What changed:** added `"use client"`, state (`email`, `password`, `error`, `loading`), controlled inputs, `onSubmit`, and `authApi.post("/api/users/login", { email, password })`.
- **You never handle a token by hand:** because `authApi` uses `withCredentials: true`, the browser stores the cookie the server returns and sends it automatically on later requests.
- On success we `router.push("/dashboard")`.

---

## STEP 12 — `app/register/page.tsx`

**BEFORE (static) — full file:**
```tsx
import Link from "next/link";
import InputField from "@/components/InputField";
import Button from "@/components/Button";

export default function RegisterPage() {
  return (
    <div className="flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
          <h1 className="text-2xl font-bold text-slate-900 text-center">Create your account</h1>
          <p className="mt-1 text-sm text-slate-500 text-center">Start writing and sharing your posts.</p>

          <form className="mt-6 flex flex-col gap-4">
            <InputField label="Full Name" name="name" placeholder="Sara Khan" />
            <InputField label="Email" type="email" name="email" placeholder="you@example.com" />
            <InputField label="Password" type="password" name="password" placeholder="At least 6 characters" />
            <Button type="submit" variant="primary" className="w-full">Create Account</Button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link href="/login" className="text-indigo-600 font-medium hover:underline">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
```

**AFTER (connected) — full file:**
```tsx
"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import InputField from "@/components/InputField";
import Button from "@/components/Button";
import { authApi } from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      // Direct axios call — creates the account and sets the cookie.
      await authApi.post("/api/users/register", { name, email, password });
      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Could not register. The email may already be in use.");
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
          <h1 className="text-2xl font-bold text-slate-900 text-center">Create your account</h1>
          <p className="mt-1 text-sm text-slate-500 text-center">Start writing and sharing your posts.</p>

          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
            {error && <p className="bg-red-50 text-red-700 text-sm px-3 py-2 rounded-lg">{error}</p>}
            <InputField label="Full Name" name="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Sara Khan" />
            <InputField label="Email" name="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
            <InputField label="Password" name="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 6 characters" />
            <Button type="submit" variant="primary" className="w-full" disabled={loading}>{loading ? "Creating..." : "Create Account"}</Button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link href="/login" className="text-indigo-600 font-medium hover:underline">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
```

**Explanation:** almost identical to login. The differences: an extra `name` field and the URL `/api/users/register`. On success the backend sets the cookie immediately, so no separate login step is needed.

---

## STEP 13 — `app/dashboard/page.tsx`

**BEFORE (static) — full file:**
```tsx
import BlogCard from "@/components/BlogCard";
import Button from "@/components/Button";
import { blogCards } from "@/lib/data";

// DASHBOARD — static: reuse sample data and pretend it belongs to the user.
export default function DashboardPage() {
  const myCards = blogCards.slice(0, 3);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Posts</h1>
          <p className="mt-1 text-sm text-slate-500">Manage the cards you have created.</p>
        </div>
        <Button href="/dashboard/create" variant="primary">+ New Post</Button>
      </div>

      {myCards.length === 0 ? (
        <div className="mt-10 text-center bg-white border border-dashed border-slate-300 rounded-xl p-12">
          <p className="text-slate-500">You haven&apos;t created any posts yet.</p>
          <div className="mt-4">
            <Button href="/dashboard/create" variant="primary">Create your first post</Button>
          </div>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {myCards.map((card) => (
            <BlogCard key={card.id} card={card} showActions />
          ))}
        </div>
      )}
    </div>
  );
}
```

**AFTER (connected) — full file:**
```tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import BlogCard from "@/components/BlogCard";
import Button from "@/components/Button";
import { authApi } from "@/lib/api"; // protected client

type Card = {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  category: string;
  image: string;
};

// DASHBOARD — PROTECTED. Shows only the logged-in user's cards.
export default function DashboardPage() {
  const router = useRouter();
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Direct axios call — the cookie proves who you are.
    // If it fails (not logged in), send the user to /login.
    authApi
      .get("/api/cards/mine")
      .then((res) => setCards(res.data))
      .catch(() => router.push("/login"))
      .finally(() => setLoading(false));
  }, [router]);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this post?")) return;
    // Direct axios call — delete on the server, then remove from the screen.
    await authApi.delete(`/api/cards/${id}`);
    setCards((prev) => prev.filter((c) => c.id !== id));
  };

  if (loading) return <p className="max-w-6xl mx-auto px-4 py-16 text-slate-500">Loading your posts...</p>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Posts</h1>
          <p className="mt-1 text-sm text-slate-500">Manage the cards you have created.</p>
        </div>
        <Button href="/dashboard/create" variant="primary">+ New Post</Button>
      </div>

      {cards.length === 0 ? (
        <div className="mt-10 text-center bg-white border border-dashed border-slate-300 rounded-xl p-12">
          <p className="text-slate-500">You haven&apos;t created any posts yet.</p>
          <div className="mt-4">
            <Button href="/dashboard/create" variant="primary">Create your first post</Button>
          </div>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card) => (
            <BlogCard key={card.id} card={card} showActions onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}
```

**Explanation:**
- **What changed:** `blogCards.slice(0,3)` (fake) → `authApi.get("/api/cards/mine")` (your real cards). Added `"use client"`, state, a 401→login redirect, and a working `handleDelete`.
- **Why `authApi`:** `/api/cards/mine` is protected — the cookie tells the server who "me" is.
- **`.catch(() => router.push("/login"))`:** if you're not logged in the server returns `401`, so we send you to the login page.
- **After delete, `setCards(...filter...)`:** the server row is gone but React doesn't know — filtering it out of state removes the card from the screen immediately.

---

## STEP 14 — `app/dashboard/edit/[id]/page.tsx`

**BEFORE (static) — full file:**
```tsx
import Link from "next/link";
import CardForm from "@/components/CardForm";
import { blogCards } from "@/lib/data";

export default async function EditCardPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const card = blogCards.find((c) => c.id === Number(id));

  if (!card) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-slate-900">Post not found</h1>
        <Link href="/dashboard" className="mt-4 inline-block text-indigo-600 hover:underline">← Back to dashboard</Link>
      </div>
    );
  }

  return <CardForm card={card} heading="Edit post" submitLabel="Save Changes" />;
}
```

**AFTER (connected) — full file:**
```tsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import CardForm from "@/components/CardForm";
import { api } from "@/lib/api"; // public client (reading one card)

type Card = {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  category: string;
  image: string;
};

// EDIT PAGE — fetch the card, then render the shared form pre-filled.
export default function EditCardPage() {
  const params = useParams();
  const id = params.id as string;

  const [card, setCard] = useState<Card | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Direct axios call to read the card being edited.
    api
      .get(`/api/cards/${id}`)
      .then((res) => setCard(res.data))
      .catch(() => setCard(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="max-w-2xl mx-auto px-4 py-16 text-slate-500">Loading...</p>;
  if (!card) return <p className="max-w-2xl mx-auto px-4 py-16 text-slate-500">Post not found.</p>;

  return <CardForm card={card} heading="Edit post" submitLabel="Save Changes" />;
}
```

**Explanation:**
- **What changed:** `blogCards.find()` → `api.get(\`/api/cards/${id}\`)`. Added `"use client"`, `useParams()`, and state.
- **Why fetch first:** to edit you must show the existing values, so we fetch the card and pass it into `<CardForm card={card}>` (which pre-fills the fields). CardForm then does the `authApi.put` when saved (Step 10).
- **Why `api` (not `authApi`):** reading a card is public. The save (protected) happens inside CardForm.

---

## STEP 15 — `app/dashboard/create/page.tsx` (NO change)

**BEFORE = AFTER — full file:**
```tsx
import CardForm from "@/components/CardForm";

// CREATE CARD PAGE — reuses the shared CardForm in "create" mode (empty fields).
export default function CreateCardPage() {
  return <CardForm heading="Create a new post" submitLabel="Publish Post" />;
}
```
**Explanation:** unchanged. It just renders `<CardForm>` with no `card`, so CardForm is in create mode and does the `authApi.post` itself.

---

## STEP 16 — `components/Navbar.tsx`

**BEFORE (static) — full file:**
```tsx
import Link from "next/link";

// Top navigation bar. Static links only — no login logic yet.
export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200">
      <nav className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-indigo-600">
          Dev<span className="text-slate-900">Blog</span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-4">
          <Link href="/" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition">Home</Link>
          <Link href="/dashboard" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition">Dashboard</Link>
          <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition">Login</Link>
          <Link href="/register" className="text-sm font-medium bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition">Sign Up</Link>
        </div>
      </nav>
    </header>
  );
}
```

**AFTER (connected) — full file:**
```tsx
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authApi } from "@/lib/api"; // protected client

// Navbar — checks "am I logged in?" and shows the right links.
export default function Navbar() {
  const [loggedIn, setLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Direct axios call — succeeds only if a valid cookie exists.
    authApi
      .get("/api/users/me")
      .then(() => setLoggedIn(true))
      .catch(() => setLoggedIn(false));
  }, []);

  const handleLogout = async () => {
    // Direct axios call — clears the cookie on the server.
    await authApi.post("/api/users/logout");
    setLoggedIn(false);
    router.push("/login");
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200">
      <nav className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-indigo-600">
          Dev<span className="text-slate-900">Blog</span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-4">
          <Link href="/" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition">Home</Link>

          {loggedIn ? (
            <>
              <Link href="/dashboard" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition">Dashboard</Link>
              <button onClick={handleLogout} className="text-sm font-medium bg-slate-100 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-200 transition">Logout</button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition">Login</Link>
              <Link href="/register" className="text-sm font-medium bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition">Sign Up</Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
```

**Explanation:**
- **What changed:** static always showed the same links. Now `authApi.get("/api/users/me")` checks whether a valid cookie exists, and we show Dashboard + Logout when logged in, else Login + Sign Up.
- **`/api/users/me`** succeeds only if the cookie is valid — a simple way to know the user is logged in. `handleLogout` calls `/api/users/logout` (which clears the cookie), then updates the UI.

---

## STEP 17 — Run and test every API action
```bash
# terminal 1
cd backend && npm run dev        # http://localhost:5000
# terminal 2
cd frontend && npm install && npm run dev   # http://localhost:3000
```
Open **http://localhost:3000** and try, in order:

| Action | Page | Inline call | If it works |
|--------|------|-------------|-------------|
| Register | /register | `authApi.post("/api/users/register")` | goes to dashboard |
| Login | /login | `authApi.post("/api/users/login")` | goes to dashboard |
| See all posts | / | `api.get("/api/cards")` | cards appear |
| See one post | /blog/:id | `api.get("/api/cards/:id")` | full post appears |
| Create | /dashboard/create | `authApi.post("/api/cards")` | new post shows on home |
| Edit | /dashboard/edit/:id | `authApi.put("/api/cards/:id")` | changes saved |
| Delete | /dashboard | `authApi.delete("/api/cards/:id")` | post disappears |
| Logout | Navbar | `authApi.post("/api/users/logout")` | Login/Sign Up return |

If all of these work, you've connected the static blog to the backend yourself. 🎉

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Posts don't load / Network Error | Is the backend running on `:5000`? Is `NEXT_PUBLIC_API_URL` correct? Restart `npm run dev` after editing `.env.local`. |
| Login works but dashboard bounces to /login | Cookie not sent. Check `authApi` has `withCredentials: true`, backend `cors` has `credentials: true` and an exact `origin`. |
| CORS error | Backend `CLIENT_URL` must exactly match `http://localhost:3000`. |
| 401 on create/edit/delete | Not logged in, or cookie expired — log in again. |
| `useState`/`useParams` error | Make sure the file starts with `"use client"`. |

> Deployment (Render + Netlify) and MongoDB Atlas setup are covered in the main **`README.md`** (Section 9).

---

**Summary:** ADD `.env.local` + `lib/api.ts`, DELETE `lib/data.ts`, then EDIT each file to call `api`/`authApi` **directly** and make the forms controlled + submitting. `api` = public reads, `authApi` = anything needing login (carries the cookie). The design never changes — only where data comes from.
