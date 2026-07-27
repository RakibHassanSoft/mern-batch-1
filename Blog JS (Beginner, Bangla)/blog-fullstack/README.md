# Blog Full Stack (JavaScript) — Static → Connected: BEFORE কোড, AFTER কোড ও বিস্তারিত ব্যাখ্যা

এই README-এ প্রতিটি ফাইলের জন্য থাকছে তিনটি জিনিস:
1. **BEFORE (static)** — আগের সম্পূর্ণ কোড
2. **AFTER (connected)** — নতুন সম্পূর্ণ কোড
3. **ব্যাখ্যা** — কী বদলাল, কেন, প্রতিটি জিনিস কেন ব্যবহার হচ্ছে

`../blog-static` থেকে শুরু করে ধাপে ধাপে এই folder-এর `frontend/` বানাবে। সব কোড পূর্ণ (snippet নয়) — কপি-পেস্ট করলেই হবে।

```
blog-fullstack/
├── backend/     ← Node.js + Express + MongoDB API (আগে থেকেই তৈরি — শুধু চালাবে)
└── frontend/    ← Next.js (JS) — এই গাইডে যা বানাচ্ছি
```

---

## অংশ ১ — দরকারি ধারণা

**Frontend** = user যা দেখে (Next.js)। **Backend** = server (Node.js + MongoDB)। **API** = দুইয়ের মধ্যে কথা বলার নিয়ম। **axios** = request পাঠানোর library।

**দুই client:** `api` = **public** (লগইন লাগে না, শুধু পড়া)। `authApi` = **private** (লগইন লাগে, সাথে **cookie** যায়)।
**cookie login:** login সফল হলে backend cookie দেয়; ব্রাউজার সেটা রেখে প্রতি request-এ পাঠায় — যদি axios-এ **`withCredentials: true`** থাকে।
**React টুল:** `"use client"` (interactive ফাইলে উপরে লাগে), `useState` (মান মনে রাখা), `useEffect` (লোড হলে চালানো), `useRouter` (`router.push`), `useParams` (URL থেকে মান)।

**যা করব:** (১) `.env.local` + `lib/api.js` যোগ, (২) `lib/data.js` মুছে ফেলা, (৩) প্রতিটি page/component এডিট। ডিজাইন বদলায় না।

---

## STEP 0 — Backend চালু করো
```bash
cd backend
npm install
# .env: MONGO_URI, JWT_SECRET, CLIENT_URL=http://localhost:3000, NODE_ENV=development
npm run dev        # http://localhost:5000
```

## STEP 1 — axios ইনস্টল
```bash
cd frontend
npm install axios
```

---

## STEP 2 — নতুন ফাইল `.env.local` (BEFORE: ছিল না)

**AFTER — পুরো ফাইল:**
```
NEXT_PUBLIC_API_URL=http://localhost:5000
```
**ব্যাখ্যা:** এখানে backend-এর ঠিকানা রাখছি। কোডে সরাসরি URL না লিখে env-এ রাখলে deploy করার সময় শুধু এই মান বদলালেই হয়। `NEXT_PUBLIC_` দেওয়ায় মানটা browser-এও পড়া যায়। **এই ফাইল বানানোর/বদলানোর পর `npm run dev` আবার চালু করতে হয়।**

---

## STEP 3 — নতুন ফাইল `lib/api.js` (BEFORE: ছিল না) ⭐

**AFTER — পুরো ফাইল:**
```js
import axios from "axios";

// backend-এর URL .env.local থেকে আসে (যেমন http://localhost:5000)
const baseURL = process.env.NEXT_PUBLIC_API_URL;

// api = PUBLIC client — লগইন লাগে না এমন কাজে (পড়া)
export const api = axios.create({ baseURL });

// authApi = PRIVATE client — withCredentials: true দেওয়ায় cookie নিজে থেকে যায়
export const authApi = axios.create({ baseURL, withCredentials: true });
```
**ব্যাখ্যা:**
- `axios.create({ baseURL })` দিয়ে একটা "client" বানাই যাতে বারবার পুরো URL লিখতে না হয় — শুধু `api.get("/api/cards")` লিখলেই হবে।
- **দুইটা client কেন?** public কাজে (কার্ড পড়া) cookie লাগে না → `api`। private কাজে (login, create, delete) cookie লাগে → `authApi`।
- **`withCredentials: true` কেন?** এটা না দিলে ব্রাউজার login cookie পাঠাবে না, ফলে private request-এ `401 Unauthorized` আসবে। এই একটাই লাইন cookie-login কাজ করানোর চাবি।
- এরপর থেকে `lib/` ফোল্ডারে থাকবে **শুধু `api.js`**।

---

## STEP 4 — মুছে ফেলো `lib/data.js`

**BEFORE:** এই ফাইলে নকল `blogCards` array ছিল (ডিজাইন দেখানোর জন্য)।
**AFTER:** ফাইলটি delete করো।
**ব্যাখ্যা:** এখন আসল ডেটা backend থেকে axios দিয়ে আসবে, তাই নকল ডেটার দরকার নেই। (নিচের প্রতিটি পেজে `import { blogCards } from "@/lib/data"` বাদ যাবে।)

---

## STEP 5 — `components/InputField.jsx`

**BEFORE (static) — পুরো ফাইল:**
```jsx
// InputField = লেবেল সহ একটি input বক্স। সব ফর্মে ব্যবহার হয়।
export default function InputField({ label, name, type = "text", placeholder, defaultValue }) {
  return (
    <div className="flex flex-col gap-1.5">
      {/* লেবেল — উপরে ফিল্ডের নাম দেখায় */}
      <label htmlFor={name} className="text-sm font-medium text-slate-700">
        {label}
      </label>
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

**AFTER (connected) — পুরো ফাইল:**
```jsx
// InputField = controlled input। value আর onChange parent থেকে আসে,
// তাই ফর্ম জানে user কী টাইপ করেছে।
export default function InputField({ label, name, value, onChange, type = "text", placeholder }) {
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

**ব্যাখ্যা:**
- **কী বদলাল:** props থেকে `defaultValue` সরিয়ে `value` আর `onChange` যোগ করলাম। `<input>`-এ `defaultValue={...}` → `value={value} onChange={onChange}` হলো।
- **কেন:** `defaultValue` শুধু প্রথমবার মান বসায়, কিন্তু user কী লিখছে তা parent জানতে পারে না। `value` + `onChange` মিলে হয় **controlled input** — লেখাটা React state-এ থাকে, তাই ফর্ম সেটা পড়ে server-এ পাঠাতে পারে।

---

## STEP 6 — `components/TextareaField.jsx`

**BEFORE (static) — পুরো ফাইল:**
```jsx
// TextareaField = বড় লেখা লেখার জন্য (ব্লগের content)।
export default function TextareaField({ label, name, placeholder, defaultValue, rows = 6 }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={name} className="text-sm font-medium text-slate-700">
        {label}
      </label>
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

**AFTER (connected) — পুরো ফাইল:**
```jsx
// TextareaField = বড় লেখার জন্য controlled textarea।
export default function TextareaField({ label, name, value, onChange, placeholder, rows = 6 }) {
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

**ব্যাখ্যা:** InputField-এর মতোই — `defaultValue` → `value` + `onChange`। শুধু এখানে `<input>` এর বদলে `<textarea>` (বড় লেখার জন্য)। এখন content-ও controlled, তাই ফর্ম পুরো লেখা পাঠাতে পারবে।

---

## STEP 7 — `app/page.jsx` (Home)

**BEFORE (static) — পুরো ফাইল:**
```jsx
import Link from "next/link";
import BlogCard from "@/components/BlogCard";
import { blogCards } from "@/lib/data";

// HOME পেজ — সবাই সব কার্ড এখানে দেখতে পারে (public)।
export default function HomePage() {
  return (
    <div>
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 py-16 text-center">
          <span className="inline-block bg-indigo-50 text-indigo-600 text-xs font-medium px-3 py-1 rounded-full">Welcome to DevBlog</span>
          <h1 className="mt-4 text-4xl sm:text-5xl font-bold text-slate-900 tracking-tight">
            Share what you <span className="text-indigo-600">learn</span>
          </h1>
          <p className="mt-4 max-w-xl mx-auto text-slate-600">পোস্ট পড়ুন, অথবা sign up করে নিজের পোস্ট লিখুন।</p>
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

**AFTER (connected) — পুরো ফাইল:**
```jsx
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import BlogCard from "@/components/BlogCard";
import { api } from "@/lib/api";

// HOME পেজ — সব কার্ড দেখায় (public)।
export default function HomePage() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);

  // পেজ লোড হলে সরাসরি api.get দিয়ে সব কার্ড আনি (public, cookie লাগে না)।
  useEffect(() => {
    api
      .get("/api/cards")
      .then((res) => setCards(res.data)) // res.data = কার্ডের array
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
          <p className="mt-4 max-w-xl mx-auto text-slate-600">পোস্ট পড়ুন, অথবা sign up করে নিজের পোস্ট লিখুন।</p>
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
          <p className="text-slate-500">এখনো কোনো পোস্ট নেই। প্রথম পোস্টটি আপনি লিখুন!</p>
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

**ব্যাখ্যা:**
- **কী বদলাল:** `import { blogCards } from "@/lib/data"` বাদ; উপরে `"use client"`; `useState`/`useEffect`/`api` import; `blogCards.map` → `cards.map` (state থেকে); loading অবস্থাও যোগ হলো।
- **`"use client"` কেন?** `useState`/`useEffect` ব্রাউজারে চলে, তাই এই লাইন লাগে।
- **`useEffect(() => {...}, [])` কেন?** পেজ প্রথমবার দেখানোর পরপর একবার ডেটা আনতে (`[]` মানে একবারই)।
- **`api.get("/api/cards")` কেন `api`?** সব কার্ড পড়া public কাজ — cookie লাগে না।
- **`res.data` কী?** axios ফেরত আসা ডেটা `res.data`-তে রাখে (এখানে কার্ডের array)।
- **loading কেন?** ডেটা আসতে একটু সময় লাগে; ততক্ষণ "Loading..." দেখাই।

---

## STEP 8 — `app/blog/[id]/page.jsx` (একটি পোস্ট)

**BEFORE (static) — পুরো ফাইল:**
```jsx
import Link from "next/link";
import Image from "next/image";
import { blogCards } from "@/lib/data";

// URL থেকে id নিয়ে সেই কার্ডটি খুঁজে বের করি।
export default async function BlogPostPage({ params }) {
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

**AFTER (connected) — পুরো ফাইল:**
```jsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";

// একটি পোস্টের বিস্তারিত পেজ (public)।
export default function BlogPostPage() {
  const params = useParams();
  const id = params.id; // URL থেকে id

  const [card, setCard] = useState(null);
  const [loading, setLoading] = useState(true);

  // সরাসরি api.get দিয়ে একটি কার্ড আনি।
  useEffect(() => {
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

**ব্যাখ্যা:**
- **কী বদলাল:** static-এ `params` দিয়ে id নিয়ে `blogCards.find()` করত। এখন `"use client"` + `useParams()` দিয়ে id নিই, আর `api.get(\`/api/cards/${id}\`)` দিয়ে ঠিক সেই কার্ডটি server থেকে আনি।
- **`useParams()` কেন?** client component-এ URL-এর `[id]` অংশ পড়তে (static-এ server component ছিল, তাই `params` prop পেত)।
- **backtick `` `/api/cards/${id}` `` কেন?** `id` মানটা URL-এর ভেতরে বসাতে (template literal)।
- বাকি JSX ডিজাইন হুবহু একই — শুধু ডেটার উৎস বদলাল।

---

## STEP 9 — `components/BlogCard.jsx`

**BEFORE (static) — পুরো ফাইল:**
```jsx
import Link from "next/link";
import Image from "next/image";

// showActions = true দিলে Edit/Delete বাটন দেখায় (dashboard-এ)।
export default function BlogCard({ card, showActions = false }) {
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

**AFTER (connected) — পুরো ফাইল:**
```jsx
"use client";

import Link from "next/link";
import Image from "next/image";

// BlogCard = একটি কার্ড। dashboard-এ showActions + onDelete পাঠালে Edit/Delete দেখায়।
export default function BlogCard({ card, showActions = false, onDelete }) {
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
            {/* Delete বাটন — parent থেকে পাঠানো onDelete কল করে */}
            <button onClick={() => onDelete && onDelete(card.id)} className="flex-1 text-sm font-medium bg-red-600 text-white px-3 py-1.5 rounded-lg hover:bg-red-700 transition">Delete</button>
          </div>
        )}
      </div>
    </article>
  );
}
```

**ব্যাখ্যা:**
- **কী বদলাল:** উপরে `"use client"` যোগ; props-এ `onDelete` যোগ; Delete বাটনে `onClick={() => onDelete && onDelete(card.id)}` যোগ।
- **`"use client"` কেন?** এখন বাটনে `onClick` (interactive) আছে — তাই client component লাগে।
- **`onDelete` prop কেন?** কার্ড নিজে delete করে না। dashboard একটা function পাঠায়; Delete চাপলে সেটাকে `card.id` দিয়ে কল করে। আসল axios delete হয় dashboard-এ (STEP 13)। এতে কোড পরিষ্কার থাকে (কার্ড শুধু "জানায়" কোনটা মুছতে হবে)।
- **`onDelete && ...` কেন?** যেসব জায়গায় `onDelete` পাঠানো হয়নি (যেমন home পেজ), সেখানে যাতে error না হয়।

---

## STEP 10 — `components/CardForm.jsx` ⭐

**BEFORE (static) — পুরো ফাইল:**
```jsx
import InputField from "./InputField";
import TextareaField from "./TextareaField";
import Button from "./Button";

// (static version-এ ফর্ম কিছু save করে না, শুধু ডিজাইন দেখায়।)
export default function CardForm({ card, heading, submitLabel }) {
  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-slate-900">{heading}</h1>
      <p className="mt-1 text-sm text-slate-500">নিচের তথ্যগুলো পূরণ করুন।</p>

      <form className="mt-6 bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col gap-5">
        <InputField label="Title" name="title" placeholder="একটি সুন্দর টাইটেল দিন" defaultValue={card?.title} />
        <InputField label="Category" name="category" placeholder="যেমন: Next.js" defaultValue={card?.category} />
        <InputField label="Cover Image URL" name="image" placeholder="https://..." defaultValue={card?.image} />
        <InputField label="Short Excerpt" name="excerpt" placeholder="এক লাইনের সারাংশ" defaultValue={card?.excerpt} />
        <TextareaField label="Content" name="content" placeholder="পুরো লেখা এখানে লিখুন..." defaultValue={card?.content} />

        <div className="flex gap-3 pt-2">
          <Button type="submit" variant="primary">{submitLabel}</Button>
          <Button href="/dashboard" variant="outline">Cancel</Button>
        </div>
      </form>
    </div>
  );
}
```

**AFTER (connected) — পুরো ফাইল:**
```jsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import InputField from "./InputField";
import TextareaField from "./TextareaField";
import Button from "./Button";
import { authApi } from "@/lib/api";

// card থাকলে edit (PUT), না থাকলে create (POST)।
export default function CardForm({ card, heading, submitLabel }) {
  const router = useRouter();

  // প্রতিটি ফিল্ডের জন্য state। edit হলে আগের value দিয়ে শুরু হয়।
  const [title, setTitle] = useState(card?.title || "");
  const [category, setCategory] = useState(card?.category || "");
  const [image, setImage] = useState(card?.image || "");
  const [excerpt, setExcerpt] = useState(card?.excerpt || "");
  const [content, setContent] = useState(card?.content || "");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();       // পেজ reload বন্ধ করি
    setError("");
    setSaving(true);

    const data = { title, category, image, excerpt, content };

    try {
      if (card) {
        // edit — সরাসরি authApi.put কল (protected, cookie যায়)
        await authApi.put(`/api/cards/${card.id}`, data);
      } else {
        // create — সরাসরি authApi.post কল
        await authApi.post("/api/cards", data);
      }
      router.push("/dashboard");  // কাজ শেষে dashboard-এ ফেরত
      router.refresh();
    } catch (err) {
      setError("সেভ করা যায়নি। আপনি কি লগইন করা আছেন?");
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-slate-900">{heading}</h1>
      <p className="mt-1 text-sm text-slate-500">নিচের তথ্যগুলো পূরণ করুন।</p>

      <form onSubmit={handleSubmit} className="mt-6 bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col gap-5">
        {error && <p className="bg-red-50 text-red-700 text-sm px-3 py-2 rounded-lg">{error}</p>}

        <InputField label="Title" name="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="একটি সুন্দর টাইটেল" />
        <InputField label="Category" name="category" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="যেমন: Next.js" />
        <InputField label="Cover Image URL" name="image" value={image} onChange={(e) => setImage(e.target.value)} placeholder="https://..." />
        <InputField label="Short Excerpt" name="excerpt" value={excerpt} onChange={(e) => setExcerpt(e.target.value)} placeholder="এক লাইনের সারাংশ" />
        <TextareaField label="Content" name="content" value={content} onChange={(e) => setContent(e.target.value)} placeholder="পুরো লেখা এখানে..." />

        <div className="flex gap-3 pt-2">
          <Button type="submit" variant="primary" disabled={saving}>{saving ? "Saving..." : submitLabel}</Button>
          <Button href="/dashboard" variant="outline">Cancel</Button>
        </div>
      </form>
    </div>
  );
}
```

**ব্যাখ্যা:**
- **কী বদলাল:** `"use client"` + `useState`/`useRouter`/`authApi` যোগ; প্রতিটি ইনপুট `defaultValue` → `value` + `onChange`; `<form>`-এ `onSubmit={handleSubmit}`; আর `handleSubmit`-এ আসল axios কল।
- **`e.preventDefault()` কেন?** সাধারণ HTML ফর্ম submit করলে পুরো পেজ reload হয়ে যায় — তখন axios কল হবে না। এটা সেই reload বন্ধ করে।
- **`card` থাকলে PUT, না থাকলে POST কেন?** একই ফর্ম দুই কাজে: edit পেজ `card` পাঠায় → `authApi.put` (update); create পেজ কিছু পাঠায় না → `authApi.post` (নতুন)।
- **`authApi` কেন (api নয়)?** create/edit করতে লগইন লাগে — cookie পাঠাতে হবে।
- **`saving` state কেন?** সেভ চলাকালীন বাটন disable করে "Saving..." দেখাই, যাতে দুইবার ক্লিক না হয়।
- **`router.push("/dashboard")` কেন?** সেভ শেষে user-কে dashboard-এ ফিরিয়ে নিই।

---

## STEP 11 — `app/login/page.jsx`

**BEFORE (static) — পুরো ফাইল:**
```jsx
import Link from "next/link";
import InputField from "@/components/InputField";
import Button from "@/components/Button";

// LOGIN পেজ — static, কোনো লগইন কাজ করে না।
export default function LoginPage() {
  return (
    <div className="flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
          <h1 className="text-2xl font-bold text-slate-900 text-center">Welcome back</h1>
          <p className="mt-1 text-sm text-slate-500 text-center">পোস্ট ম্যানেজ করতে লগইন করুন।</p>

          <form className="mt-6 flex flex-col gap-4">
            <InputField label="Email" type="email" name="email" placeholder="you@example.com" />
            <InputField label="Password" type="password" name="password" placeholder="••••••••" />
            <Button type="submit" variant="primary" className="w-full">Log In</Button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            অ্যাকাউন্ট নেই?{" "}
            <Link href="/register" className="text-indigo-600 font-medium hover:underline">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
```

**AFTER (connected) — পুরো ফাইল:**
```jsx
"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import InputField from "@/components/InputField";
import Button from "@/components/Button";
import { authApi } from "@/lib/api";

// LOGIN পেজ।
export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      // সরাসরি authApi.post — সফল হলে server cookie সেট করে দেয়।
      await authApi.post("/api/users/login", { email, password });
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError("ইমেইল বা পাসওয়ার্ড ভুল।");
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
          <h1 className="text-2xl font-bold text-slate-900 text-center">Welcome back</h1>
          <p className="mt-1 text-sm text-slate-500 text-center">পোস্ট ম্যানেজ করতে লগইন করুন।</p>

          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
            {error && <p className="bg-red-50 text-red-700 text-sm px-3 py-2 rounded-lg">{error}</p>}
            <InputField label="Email" name="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
            <InputField label="Password" name="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
            <Button type="submit" variant="primary" className="w-full" disabled={loading}>{loading ? "Logging in..." : "Log In"}</Button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            অ্যাকাউন্ট নেই?{" "}
            <Link href="/register" className="text-indigo-600 font-medium hover:underline">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
```

**ব্যাখ্যা:**
- **কী বদলাল:** `"use client"` + state (`email`, `password`, `error`, `loading`); ইনপুট controlled; `<form onSubmit={handleSubmit}>`; আর `handleSubmit`-এ `authApi.post("/api/users/login", { email, password })`।
- **cookie নিয়ে ভাবতে হচ্ছে না কেন?** `authApi`-তে `withCredentials: true` আছে, তাই server-এর পাঠানো cookie ব্রাউজার নিজে থেকে রেখে দেয় — আমরা কোনো token হাতে ধরি না।
- **সফল হলে `router.push("/dashboard")` কেন?** login হয়ে গেলে সরাসরি dashboard-এ নিয়ে যাই।

---

## STEP 12 — `app/register/page.jsx`

**BEFORE (static) — পুরো ফাইল:**
```jsx
import Link from "next/link";
import InputField from "@/components/InputField";
import Button from "@/components/Button";

// REGISTER পেজ — static, শুধু ডিজাইন।
export default function RegisterPage() {
  return (
    <div className="flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
          <h1 className="text-2xl font-bold text-slate-900 text-center">Create your account</h1>
          <p className="mt-1 text-sm text-slate-500 text-center">নিজের পোস্ট লেখা শুরু করুন।</p>

          <form className="mt-6 flex flex-col gap-4">
            <InputField label="Full Name" name="name" placeholder="Sara Khan" />
            <InputField label="Email" type="email" name="email" placeholder="you@example.com" />
            <InputField label="Password" type="password" name="password" placeholder="কমপক্ষে ৬ অক্ষর" />
            <Button type="submit" variant="primary" className="w-full">Create Account</Button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            আগে থেকেই অ্যাকাউন্ট আছে?{" "}
            <Link href="/login" className="text-indigo-600 font-medium hover:underline">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
```

**AFTER (connected) — পুরো ফাইল:**
```jsx
"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import InputField from "@/components/InputField";
import Button from "@/components/Button";
import { authApi } from "@/lib/api";

// REGISTER পেজ।
export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      // সরাসরি authApi.post — নতুন অ্যাকাউন্ট বানায় ও cookie সেট করে।
      await authApi.post("/api/users/register", { name, email, password });
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError("রেজিস্টার করা যায়নি। ইমেইলটি হয়তো আগে থেকেই আছে।");
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
          <h1 className="text-2xl font-bold text-slate-900 text-center">Create your account</h1>
          <p className="mt-1 text-sm text-slate-500 text-center">নিজের পোস্ট লেখা শুরু করুন।</p>

          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
            {error && <p className="bg-red-50 text-red-700 text-sm px-3 py-2 rounded-lg">{error}</p>}
            <InputField label="Full Name" name="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Sara Khan" />
            <InputField label="Email" name="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
            <InputField label="Password" name="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="কমপক্ষে ৬ অক্ষর" />
            <Button type="submit" variant="primary" className="w-full" disabled={loading}>{loading ? "Creating..." : "Create Account"}</Button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            আগে থেকেই অ্যাকাউন্ট আছে?{" "}
            <Link href="/login" className="text-indigo-600 font-medium hover:underline">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
```

**ব্যাখ্যা:** Login-এর সাথে প্রায় একই। পার্থক্য: বাড়তি `name` ফিল্ড আর URL `/api/users/register`। **কেন?** নতুন account বানাতে backend-এর register route এটাই; সফল হলে backend সাথে সাথে cookie দিয়ে দেয়, তাই আলাদা করে login করতে হয় না।

---

## STEP 13 — `app/dashboard/page.jsx`

**BEFORE (static) — পুরো ফাইল:**
```jsx
import BlogCard from "@/components/BlogCard";
import Button from "@/components/Button";
import { blogCards } from "@/lib/data";

// static version-এ ধরে নিই প্রথম ৩টি কার্ড এই user-এর।
export default function DashboardPage() {
  const myCards = blogCards.slice(0, 3);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Posts</h1>
          <p className="mt-1 text-sm text-slate-500">আপনার তৈরি করা পোস্টগুলো ম্যানেজ করুন।</p>
        </div>
        <Button href="/dashboard/create" variant="primary">+ New Post</Button>
      </div>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {myCards.map((card) => (
          <BlogCard key={card.id} card={card} showActions />
        ))}
      </div>
    </div>
  );
}
```

**AFTER (connected) — পুরো ফাইল:**
```jsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import BlogCard from "@/components/BlogCard";
import Button from "@/components/Button";
import { authApi } from "@/lib/api";

// DASHBOARD — শুধু লগইন করা user-এর নিজের কার্ড দেখায় (protected)।
export default function DashboardPage() {
  const router = useRouter();
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);

  // নিজের কার্ড আনি — সরাসরি authApi.get (cookie যায়)।
  // লগইন না থাকলে server 401 দেয় → আমরা /login-এ পাঠাই।
  useEffect(() => {
    authApi
      .get("/api/cards/mine")
      .then((res) => setCards(res.data))
      .catch(() => router.push("/login"))
      .finally(() => setLoading(false));
  }, [router]);

  // Delete — সরাসরি authApi.delete, তারপর স্ক্রিন থেকেও বাদ দিই।
  const handleDelete = async (id) => {
    if (!confirm("এই পোস্টটি মুছে ফেলবেন?")) return;
    await authApi.delete(`/api/cards/${id}`);
    setCards((prev) => prev.filter((c) => c.id !== id));
  };

  if (loading) return <p className="max-w-6xl mx-auto px-4 py-16 text-slate-500">Loading your posts...</p>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Posts</h1>
          <p className="mt-1 text-sm text-slate-500">আপনার তৈরি করা পোস্টগুলো ম্যানেজ করুন।</p>
        </div>
        <Button href="/dashboard/create" variant="primary">+ New Post</Button>
      </div>

      {cards.length === 0 ? (
        <div className="mt-10 text-center bg-white border border-dashed border-slate-300 rounded-xl p-12">
          <p className="text-slate-500">আপনি এখনো কোনো পোস্ট বানাননি।</p>
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

**ব্যাখ্যা:**
- **কী বদলাল:** `blogCards.slice(0,3)` (নকল) → `authApi.get("/api/cards/mine")` (আসল, নিজের কার্ড)। যোগ হলো `"use client"`, state, 401 হলে login-এ redirect, আর কাজ করা `handleDelete`।
- **`authApi.get("/api/cards/mine")` কেন?** এটা private — শুধু নিজের কার্ড দেখাবে, তাই cookie দিয়ে server বুঝবে "আমি কে"।
- **`.catch(() => router.push("/login"))` কেন?** লগইন না থাকলে server `401` দেয় (cookie নেই) → তখন user-কে login পেজে পাঠাই।
- **delete-এর পর `setCards(...filter...)` কেন?** server থেকে মুছলেও React নিজে থেকে জানে না; তাই লিস্ট থেকেও বাদ দিই যাতে কার্ডটা সাথে সাথে স্ক্রিন থেকে চলে যায়।
- **`confirm(...)` কেন?** ভুল করে delete ঠেকাতে একটা "sure?" জিজ্ঞেস করি।

---

## STEP 14 — `app/dashboard/edit/[id]/page.jsx`

**BEFORE (static) — পুরো ফাইল:**
```jsx
import Link from "next/link";
import CardForm from "@/components/CardForm";
import { blogCards } from "@/lib/data";

// id দিয়ে কার্ড খুঁজে সেটা CardForm-এ পূরণ করে দেখায়।
export default async function EditCardPage({ params }) {
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

**AFTER (connected) — পুরো ফাইল:**
```jsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import CardForm from "@/components/CardForm";
import { api } from "@/lib/api";

// EDIT পেজ — আগে কার্ডটি এনে, তারপর CardForm-এ পূরণ করে দেখাই (PUT হবে)।
export default function EditCardPage() {
  const params = useParams();
  const id = params.id;

  const [card, setCard] = useState(null);
  const [loading, setLoading] = useState(true);

  // সরাসরি api.get দিয়ে কার্ডটি আনি।
  useEffect(() => {
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

**ব্যাখ্যা:**
- **কী বদলাল:** `blogCards.find()` (নকল) → `api.get(\`/api/cards/${id}\`)` (আসল)। `"use client"` + `useParams()` + state যোগ।
- **কেন আগে `api.get`?** edit করতে হলে আগে পুরনো ডেটা দেখাতে হবে; তাই কার্ডটা এনে `CardForm`-এ `card` prop দিয়ে পাঠাই — ফিল্ডগুলো আগে থেকে পূরণ থাকবে (edit mode)। এরপর CardForm নিজেই `authApi.put` করে সেভ করে (STEP 10)।
- **`api` কেন (authApi নয়)?** কার্ড পড়া public — তাই `api`। (সেভ করার সময় `authApi` লাগে, সেটা CardForm-এ।)

---

## STEP 15 — `app/dashboard/create/page.jsx` (কোনো পরিবর্তন নেই)

**BEFORE = AFTER — পুরো ফাইল:**
```jsx
import CardForm from "@/components/CardForm";

// CREATE পেজ — CardForm খালি অবস্থায় দেখায় (নতুন পোস্ট, POST হবে)।
export default function CreateCardPage() {
  return <CardForm heading="Create a new post" submitLabel="Publish Post" />;
}
```
**ব্যাখ্যা:** এই ফাইল একই থাকে। কারণ এটা শুধু `<CardForm>` দেখায় (কোনো `card` না দিয়ে, তাই create mode)। আসল submit-এর কাজ CardForm-এর ভেতরেই হয় (STEP 10)।

---

## STEP 16 — `components/Navbar.jsx`

**BEFORE (static) — পুরো ফাইল:**
```jsx
import Link from "next/link";

// Navbar = উপরের মেনু বার। সব পেজে দেখা যায়।
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

**AFTER (connected) — পুরো ফাইল:**
```jsx
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authApi } from "@/lib/api";

// Navbar — লগইন করা থাকলে Dashboard/Logout, নাহলে Login/Sign Up দেখায়।
export default function Navbar() {
  const [loggedIn, setLoggedIn] = useState(false);
  const router = useRouter();

  // পেজ লোড হলে চেক করি user লগইন করা আছে কিনা।
  useEffect(() => {
    authApi
      .get("/api/users/me")
      .then(() => setLoggedIn(true))   // সফল হলে লগইন করা আছে
      .catch(() => setLoggedIn(false)); // ব্যর্থ হলে লগইন করা নেই
  }, []);

  // Logout — সরাসরি authApi.post দিয়ে cookie মুছে ফেলি।
  const handleLogout = async () => {
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

**ব্যাখ্যা:**
- **কী বদলাল:** static-এ সবসময় Home/Dashboard/Login/Sign Up দেখাত। এখন `authApi.get("/api/users/me")` দিয়ে চেক করি লগইন আছে কিনা, তারপর `loggedIn` অনুযায়ী মেনু বদলাই — logged in হলে Dashboard + Logout, নাহলে Login + Sign Up।
- **`authApi.get("/api/users/me")` কেন?** cookie ঠিক থাকলে এই request সফল হয় → বোঝা যায় user লগইন করা আছে।
- **`handleLogout` কেন?** `authApi.post("/api/users/logout")` server-এ cookie মুছে দেয়; তারপর আমরা state বদলে login পেজে পাঠাই।

---

# ✅ STEP 17 — চালিয়ে সব API কাজ টেস্ট করো
```bash
# terminal 1
cd backend && npm run dev        # http://localhost:5000
# terminal 2
cd frontend && npm install && npm run dev   # http://localhost:3000
```
**http://localhost:3000** খুলে ক্রম অনুযায়ী পরীক্ষা করো:

| কাজ | কোথায় | ভেতরে কোন call | ঠিক হলে |
|-----|--------|----------------|---------|
| **Register** | /register | `authApi.post("/api/users/register")` | dashboard-এ যাবে |
| **Login** | /login | `authApi.post("/api/users/login")` | dashboard-এ যাবে |
| **সব পোস্ট** | / | `api.get("/api/cards")` | কার্ড দেখা যাবে |
| **একটি পোস্ট** | /blog/:id | `api.get("/api/cards/:id")` | পুরো পোস্ট |
| **Create** | /dashboard/create | `authApi.post("/api/cards")` | নতুন পোস্ট home-এ আসবে |
| **Edit** | /dashboard/edit/:id | `authApi.put("/api/cards/:id")` | পরিবর্তন save হবে |
| **Delete** | /dashboard | `authApi.delete("/api/cards/:id")` | পোস্ট চলে যাবে |
| **Logout** | Navbar | `authApi.post("/api/users/logout")` | আবার Login দেখাবে |

সব ঠিক হলে — তুমি নিজে static থেকে connected full-stack অ্যাপ বানিয়ে ফেলেছ! 🎉

---

## 🐞 সাধারণ সমস্যা ও সমাধান

| সমস্যা | সমাধান |
|--------|--------|
| পোস্ট আসছে না / Network Error | backend চলছে কিনা (:5000)। `.env.local` ঠিক আছে কিনা। env বদলালে `npm run dev` আবার চালাও |
| login হয় কিন্তু dashboard আবার login-এ পাঠায় | `authApi`-তে `withCredentials: true`, backend-এ `cors({ credentials: true })` আর সঠিক `CLIENT_URL` আছে কিনা |
| CORS error | backend-এর `CLIENT_URL` হুবহু `http://localhost:3000` হতে হবে |
| create/delete-এ 401 | লগইন করা নেই বা cookie expired — আবার login |
| `useState`/`useParams` error | ফাইলের উপরে `"use client"` আছে কিনা |

---

# 🌐 Deploy — Backend: Render, Frontend: Netlify

**MongoDB Atlas URL:** https://www.mongodb.com/atlas → free (M0) cluster → **Database Access** (user+password) → **Network Access** (`0.0.0.0/0`) → **Connect → Drivers** → string কপি → `<username>`/`<password>` বসাও, `.net/` এর পরে db নাম দাও (`.net/devblog?`)। এটাই `MONGO_URI`।

**Backend → Render:** New + → Web Service → repo → Root Directory `backend`, Build `npm install`, Start `npm start`, Env: `MONGO_URI`, `JWT_SECRET`, `NODE_ENV=production`, `CLIENT_URL`. Deploy → URL পাবে।

**Frontend → Netlify:** Add new site → Import → Base directory `frontend`, Build `npm run build`, Env `NEXT_PUBLIC_API_URL` = Render URL। Deploy → URL পাবে।

**যুক্ত করো:** Render-এ `CLIENT_URL` = Netlify URL (শেষে `/` নয়)। Netlify-তে `NEXT_PUBLIC_API_URL` = Render URL। env বদলালে redeploy।

**Cookie দুই ডোমেইনে:** production-এ `sameSite:"none"` + `secure:true` লাগে — `backend/user/user.controller.js`-এ `NODE_ENV=production` হলে এটা নিজে হয়। শুধু Render-এ `NODE_ENV=production` দাও।

---

**সারকথা:** `.env.local` + `lib/api.js` যোগ করো, `lib/data.js` মুছো, প্রতিটি page/component-এ সরাসরি `api`/`authApi` কল বসাও, ফর্ম controlled + submit করাও। `api` = public পড়া, `authApi` = login লাগে এমন কাজ (cookie সহ)।
