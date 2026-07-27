# Blog Full Stack (JavaScript) — Static থেকে Connected বানানোর পূর্ণ টিউটোরিয়াল

এই ফোল্ডারে আছে আসল অ্যাপ: **frontend (Next.js, JS) + backend (Node.js + MongoDB)**। এখানে আমরা ধাপে ধাপে দেখব কীভাবে **`../blog-static`** (শুধু ডিজাইন, fake data) কে **connected** অ্যাপে রূপান্তর করতে হয় — নিজে হাতে।

Start = `../blog-static` (design only). End = this folder's `frontend/` (connected). প্রতিটি ধাপে **কোন ফাইলে কী যোগ/পরিবর্তন করবেন** — BEFORE → AFTER কোড সহ দেওয়া আছে।

```
blog-fullstack/
├── backend/     ← Node.js + Express + MongoDB API (আগে থেকেই তৈরি, শুধু চালাবেন)
└── frontend/    ← Next.js (JS) — এই টিউটোরিয়ালে যা বানাচ্ছি
```

> এই version-এ কোনো লুকানো helper function নেই। প্রতিটি API call **সরাসরি ফাইলের ভেতরে** লেখা — যেমন `authApi.post("/api/users/login", { email, password })`।

---

## মূল ধারণা (The whole idea)

static-এ ডেটা আসে `lib/data.js` (fake array) থেকে, আর ফর্ম কিছু save করে না। Connected বানাতে আমরা:

1. **যোগ করব** ২টি জিনিস: `.env.local` আর `lib/api.js` (axios client)।
2. **মুছে ফেলব** ১টি ফাইল: `lib/data.js` (fake ডেটা)।
3. **এডিট করব** প্রতিটি page/component — যাতে (ক) axios দিয়ে আসল ডেটা আনে, আর (খ) ফর্ম সত্যি সত্যি submit করে।

ডিজাইন (JSX + Tailwind) একটুও বদলাবে না। শুধু ডেটা কোথা থেকে আসে সেটা বদলাবে।

---

## STEP 0 — Backend চালু করুন (আগে)

```bash
cd backend
npm install
# .env ফাইলে দিন: MONGO_URI, JWT_SECRET, CLIENT_URL=http://localhost:3000, NODE_ENV=development
npm run dev      # চলবে http://localhost:5000
```
frontend বানানোর আগে backend চালু থাকা লাগবে, নাহলে ডেটা আসবে না।

---

## STEP 1 — axios ইনস্টল করুন

frontend ফোল্ডারে (static-এর কপি) গিয়ে:
```bash
cd frontend
npm install axios
```
**কেন:** axios দিয়ে আমরা backend-এ request পাঠাব।

---

## STEP 2 — যোগ করুন `.env.local` (নতুন ফাইল)

frontend-এর root-এ নতুন ফাইল `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:5000
```
**কেন:** backend কোথায় আছে সেটা এখানে বলা। `NEXT_PUBLIC_` দিলে browser-এও পড়া যায়। ফাইল বানানোর পর `npm run dev` আবার চালু করুন।

---

## STEP 3 — যোগ করুন `lib/api.js` (নতুন ফাইল) ⭐

এই একটাই নতুন lib ফাইল লাগবে — দুইটা axios client:
```js
import axios from "axios";

// backend URL .env.local থেকে
const baseURL = process.env.NEXT_PUBLIC_API_URL;

// api = PUBLIC (লগইন লাগে না — পড়ার জন্য)
export const api = axios.create({ baseURL });

// authApi = PRIVATE (লগইন লাগে — cookie সহ)
export const authApi = axios.create({ baseURL, withCredentials: true });
```
**কেন:** `api` public কাজে, `authApi` private কাজে। `withCredentials: true` থাকায় ব্রাউজার login cookie নিজে থেকে পাঠায়।

**নিয়ম (মনে রাখুন):**
| client | কখন |
|--------|-----|
| `api` | সব পোস্ট পড়া, একটি পোস্ট পড়া |
| `authApi` | register, login, logout, my cards, create, update, delete |

---

## STEP 4 — মুছে ফেলুন `lib/data.js`

static-এর `lib/data.js` (fake `blogCards`) আর লাগবে না — এখন আসল ডেটা backend থেকে আসবে। ফাইলটি delete করুন।

---

## STEP 5 — Input কে "controlled" বানান

static-এ input `defaultValue` ব্যবহার করত, তাই ফর্ম জানত না user কী লিখেছে। এখন `value` + `onChange` দেব।

**BEFORE — `components/InputField.jsx` (static):**
```jsx
export default function InputField({ label, name, type = "text", placeholder, defaultValue }) {
  return <input ... defaultValue={defaultValue} />;
}
```

**AFTER — `components/InputField.jsx` (connected):**
```jsx
export default function InputField({ label, name, value, onChange, type = "text", placeholder }) {
  return <input ... value={value} onChange={onChange} />;
}
```
`components/TextareaField.jsx`-এও একই পরিবর্তন করুন। **কেন:** controlled input-এর মান React state-এ থাকে, তাই ফর্ম সেটা পড়ে server-এ পাঠাতে পারে।

---

## STEP 6 — Home পেজ: fake array → `api.get`

**BEFORE — `app/page.jsx` (static):**
```jsx
import { blogCards } from "@/lib/data";

export default function HomePage() {
  return (
    // ...
    {blogCards.map((card) => <BlogCard key={card.id} card={card} />)}
  );
}
```

**AFTER — `app/page.jsx` (connected):** উপরে `"use client"`, তারপর load হলে `api.get`:
```jsx
"use client";
import { useEffect, useState } from "react";
import BlogCard from "@/components/BlogCard";
import { api } from "@/lib/api";

export default function HomePage() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // সরাসরি api.get — public, cookie লাগে না
    api.get("/api/cards")
      .then((res) => setCards(res.data))   // res.data = কার্ডের array
      .catch(() => setCards([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    // ...একই hero + grid...
    {loading ? <p>Loading...</p> : cards.map((card) => <BlogCard key={card.id} card={card} />)}
  );
}
```
**কী বদলাল:** `import { blogCards }` বাদ; যোগ হলো `"use client"`, `useState`, `useEffect`, আর `api.get("/api/cards")`।

---

## STEP 7 — একটি পোস্টের পেজ: `.find()` → `api.get`

**BEFORE — `app/blog/[id]/page.jsx` (static):**
```jsx
import { blogCards } from "@/lib/data";
export default async function BlogPostPage({ params }) {
  const { id } = await params;
  const card = blogCards.find((c) => c.id === Number(id));
  // ...
}
```

**AFTER — `app/blog/[id]/page.jsx` (connected):**
```jsx
"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";

export default function BlogPostPage() {
  const id = useParams().id;               // URL থেকে id
  const [card, setCard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/api/cards/${id}`)            // সরাসরি একটি কার্ড আনি
      .then((res) => setCard(res.data))
      .catch(() => setCard(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="p-10">Loading...</p>;
  if (!card) return <p className="p-10">Post not found.</p>;
  // ...একই layout, card.title / card.content ইত্যাদি...
}
```
**কী বদলাল:** `blogCards.find(...)` → `api.get(\`/api/cards/${id}\`)`; id নিই `useParams()` দিয়ে।

---

## STEP 8 — BlogCard: Delete বাটন কাজ করাও

**BEFORE — `components/BlogCard.jsx` (static):** Delete বাটন কিছু করে না।
```jsx
<button className="...">Delete</button>
```

**AFTER — `components/BlogCard.jsx` (connected):** উপরে `"use client"`, আর `onDelete` prop যোগ:
```jsx
"use client";
export default function BlogCard({ card, showActions = false, onDelete }) {
  // ...
  <button onClick={() => onDelete && onDelete(card.id)} className="...">Delete</button>
}
```
**কেন:** dashboard একটা delete function পাঠাবে; কার্ড শুধু সেটাকে card.id দিয়ে কল করবে।

---

## STEP 9 — CardForm: ফর্ম সত্যি submit করাও (inline `authApi.post` / `authApi.put`) ⭐

এটাই সবচেয়ে গুরুত্বপূর্ণ ধাপ। static-এ ফর্ম কিছুই করত না।

**BEFORE — `components/CardForm.jsx` (static):** সাধারণ form, `defaultValue`, কোনো submit logic নেই।

**AFTER — `components/CardForm.jsx` (connected):** `"use client"`, প্রতিটি ফিল্ডের জন্য `useState`, আর submit-এ সরাসরি axios call:
```jsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import InputField from "./InputField";
import TextareaField from "./TextareaField";
import Button from "./Button";
import { authApi } from "@/lib/api";

export default function CardForm({ card, heading, submitLabel }) {
  const router = useRouter();
  const [title, setTitle] = useState(card?.title || "");
  const [category, setCategory] = useState(card?.category || "");
  const [image, setImage] = useState(card?.image || "");
  const [excerpt, setExcerpt] = useState(card?.excerpt || "");
  const [content, setContent] = useState(card?.content || "");

  const handleSubmit = async (e) => {
    e.preventDefault();                        // পেজ reload বন্ধ
    const data = { title, category, image, excerpt, content };

    if (card) {
      // edit হলে — সরাসরি authApi.put
      await authApi.put(`/api/cards/${card.id}`, data);
    } else {
      // নতুন হলে — সরাসরি authApi.post
      await authApi.post("/api/cards", data);
    }
    router.push("/dashboard");                 // কাজ শেষে dashboard-এ
  };

  return (
    <form onSubmit={handleSubmit}>
      <InputField label="Title" name="title" value={title} onChange={(e) => setTitle(e.target.value)} />
      {/* বাকি ফিল্ডগুলোও value + onChange দিয়ে */}
      <Button type="submit">{submitLabel}</Button>
    </form>
  );
}
```
**কী বদলাল:** ফিল্ড controlled হলো; submit-এ `card` থাকলে `authApi.put` (edit), না থাকলে `authApi.post` (create); তারপর dashboard-এ ফেরত।

---

## STEP 10 — Login পেজ: inline `authApi.post`

**BEFORE — `app/login/page.jsx` (static):** form কোথাও submit করে না।

**AFTER — `app/login/page.jsx` (connected):**
```jsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import InputField from "@/components/InputField";
import Button from "@/components/Button";
import { authApi } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    // সরাসরি authApi.post — সফল হলে server cookie সেট করে
    await authApi.post("/api/users/login", { email, password });
    router.push("/dashboard");
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

---

## STEP 11 — Register পেজ: inline `authApi.post`

Login-এর মতোই, শুধু একটা `name` ফিল্ড বেশি আর URL আলাদা:
```jsx
// app/register/page.jsx (মূল অংশ)
await authApi.post("/api/users/register", { name, email, password });
router.push("/dashboard");
```

---

## STEP 12 — Dashboard: fake slice → `authApi.get` + inline delete

**BEFORE — `app/dashboard/page.jsx` (static):**
```jsx
import { blogCards } from "@/lib/data";
const myCards = blogCards.slice(0, 3);   // নকল
```

**AFTER — `app/dashboard/page.jsx` (connected):**
```jsx
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import BlogCard from "@/components/BlogCard";
import { authApi } from "@/lib/api";

export default function DashboardPage() {
  const router = useRouter();
  const [cards, setCards] = useState([]);

  useEffect(() => {
    // নিজের কার্ড — সরাসরি authApi.get (cookie যায়)
    authApi.get("/api/cards/mine")
      .then((res) => setCards(res.data))
      .catch(() => router.push("/login"));  // লগইন না থাকলে login-এ
  }, [router]);

  const handleDelete = async (id) => {
    await authApi.delete(`/api/cards/${id}`);       // সরাসরি delete
    setCards((prev) => prev.filter((c) => c.id !== id)); // স্ক্রিন থেকেও বাদ
  };

  return (
    // ...map করে <BlogCard showActions onDelete={handleDelete} />
  );
}
```
**কী বদলাল:** `blogCards.slice(0,3)` → `authApi.get("/api/cards/mine")`; যোগ হলো 401→login redirect আর কাজ করা delete।

---

## STEP 13 — Edit পেজ: `.find()` → `api.get`

**AFTER — `app/dashboard/edit/[id]/page.jsx`:**
```jsx
"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import CardForm from "@/components/CardForm";
import { api } from "@/lib/api";

export default function EditCardPage() {
  const id = useParams().id;
  const [card, setCard] = useState(null);

  useEffect(() => {
    api.get(`/api/cards/${id}`).then((res) => setCard(res.data));
  }, [id]);

  if (!card) return <p className="p-10">Loading...</p>;
  return <CardForm card={card} heading="Edit post" submitLabel="Save Changes" />;
}
```
`app/dashboard/create/page.jsx` — কোনো পরিবর্তন লাগে না (এটা শুধু `<CardForm>` দেখায়, যা এখন নিজে submit করে)।

---

## STEP 14 — Navbar: inline `authApi.get("/api/users/me")`

**AFTER — `components/Navbar.jsx`:** login করা আছে কিনা চেক করে মেনু বদলায়।
```jsx
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authApi } from "@/lib/api";

export default function Navbar() {
  const [loggedIn, setLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // সরাসরি authApi.get — সফল হলে লগইন করা আছে
    authApi.get("/api/users/me")
      .then(() => setLoggedIn(true))
      .catch(() => setLoggedIn(false));
  }, []);

  const handleLogout = async () => {
    await authApi.post("/api/users/logout");  // cookie মুছে যায়
    setLoggedIn(false);
    router.push("/login");
  };
  // loggedIn হলে Dashboard + Logout, নাহলে Login + Sign Up
}
```

---

## সব পরিবর্তনের সারসংক্ষেপ

| ফাইল | কী করবেন | কোন call |
|------|----------|----------|
| `.env.local` | নতুন বানান | — |
| `lib/api.js` | নতুন বানান (api + authApi) | — |
| `lib/data.js` | মুছে ফেলুন | — |
| `components/InputField.jsx` | controlled করুন | — |
| `components/TextareaField.jsx` | controlled করুন | — |
| `app/page.jsx` | fetch করুন | `api.get("/api/cards")` |
| `app/blog/[id]/page.jsx` | fetch করুন | `api.get("/api/cards/:id")` |
| `components/BlogCard.jsx` | onDelete যোগ | — |
| `components/CardForm.jsx` | submit যোগ | `authApi.post` / `authApi.put` |
| `app/login/page.jsx` | submit যোগ | `authApi.post("/api/users/login")` |
| `app/register/page.jsx` | submit যোগ | `authApi.post("/api/users/register")` |
| `app/dashboard/page.jsx` | fetch + delete | `authApi.get("/api/cards/mine")`, `authApi.delete` |
| `app/dashboard/edit/[id]/page.jsx` | fetch করুন | `api.get("/api/cards/:id")` |
| `app/dashboard/create/page.jsx` | পরিবর্তন নেই | — |
| `components/Navbar.jsx` | login চেক | `authApi.get("/api/users/me")`, `authApi.post("/api/users/logout")` |

---

## STEP 15 — চালিয়ে টেস্ট করুন

দুইটা terminal:
```bash
# terminal 1
cd backend && npm run dev        # http://localhost:5000

# terminal 2
cd frontend && npm install && npm run dev   # http://localhost:3000
```
ব্রাউজারে **http://localhost:3000** খুলে: register → পোস্ট create → edit → delete → logout করে দেখুন। সব কাজ করলে আপনি নিজে static থেকে connected বানিয়ে ফেলেছেন! 🎉

---

## GET / POST / PUT / DELETE — মনে রাখুন

- **GET** = ডেটা পড়া (`api.get`)
- **POST** = নতুন বানানো (`authApi.post`)
- **PUT** = আপডেট করা (`authApi.put`)
- **DELETE** = মুছে ফেলা (`authApi.delete`)

frontend-এর প্রতিটি call backend-এর একই method-এর route-এর সাথে মিলে যায়।

> তুলনা করে দেখতে চাইলে: `../blog-static/` (static) আর এই folder-এর `frontend/` (connected) একই ফাইল পাশাপাশি খুলুন।
