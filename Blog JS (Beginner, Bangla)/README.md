# Blog — JavaScript Version for Beginners (Bangla comments)

এই ফোল্ডারটি আগের blog প্রজেক্টেরই একটি **সহজ সংস্করণ**, বিশেষভাবে beginner-দের জন্য বানানো:

- সব কোড **JavaScript (JSX)** — কোনো TypeScript নেই। (`.jsx` / `.js` ফাইল, type লেখা নেই।)
- প্রতিটি ফাইলে **ছোট ছোট Bangla comment** আছে যাতে বোঝা সহজ হয়।
- fullstack version-এ **API call সরাসরি ফাইলের ভেতরেই** করা হয়েছে — আলাদা reusable ফাংশন নেই।

This is a beginner-friendly, **plain JavaScript** copy of the blog. Everything is in `.jsx`/`.js`, each file has short **Bangla comments**, and the API calls are written **directly inside each file** (no helper/wrapper functions).

---

## ফোল্ডার দুটি (Two folders)

```
Blog JS (Beginner, Bangla)/
├── blog-static/        ← শুধু ডিজাইন (fake data, কোনো server নেই)
└── blog-fullstack/     ← আসল অ্যাপ (frontend + backend + database)
    ├── backend/        ← Node.js + Express + MongoDB API
    └── frontend/       ← Next.js (JS), সরাসরি axios call
```

1. **`blog-static/`** — শুধু UI/ডিজাইন। ডেটা আসে `lib/data.js` থেকে (fake)। server লাগে না। প্রথমে এটা দিয়ে ডিজাইন বুঝুন।
2. **`blog-fullstack/`** — আসল অ্যাপ। frontend server (backend)-এর সাথে axios দিয়ে কথা বলে: login, register, create/edit/delete পোস্ট — সব কাজ করে।

---

## সবচেয়ে গুরুত্বপূর্ণ পার্থক্য: সরাসরি API call ⭐

আগের version-এ আলাদা reusable ফাংশন ছিল (যেমন `loginUser(...)`), যেটা beginner-দের জন্য বোঝা কঠিন। এই version-এ আমরা **সরাসরি axios call** লিখেছি।

**আগে (কঠিন — এই version-এ নেই):**
```js
await loginUser(email, password);   // loginUser আসলে কী করে? লুকানো!
```

**এখন (সহজ — সরাসরি বোঝা যায়):**
```js
await authApi.post("/api/users/login", { email, password });
```

এখানে সব পরিষ্কার: কোন **method** (`post`), কোন **URL** (`/api/users/login`), আর কী **data** যাচ্ছে (`{ email, password }`) — এক লাইনেই দেখা যায়।

### দুইটা axios client (`lib/api.js`)

| client | কখন ব্যবহার | উদাহরণ |
|--------|--------------|--------|
| `api` | **public** — লগইন লাগে না (পড়া) | `api.get("/api/cards")` |
| `authApi` | **private** — লগইন লাগে (cookie যায়) | `authApi.post("/api/cards", data)` |

`authApi`-তে `withCredentials: true` দেওয়া আছে, তাই ব্রাউজার cookie নিজে থেকে পাঠায়।

### কোথায় কোন call (সব সরাসরি ফাইলের ভেতরে)

| কাজ | কোড | ফাইল |
|-----|-----|------|
| সব পোস্ট পড়া | `api.get("/api/cards")` | `app/page.jsx` |
| একটি পোস্ট পড়া | `api.get(\`/api/cards/${id}\`)` | `app/blog/[id]/page.jsx` |
| রেজিস্টার | `authApi.post("/api/users/register", {...})` | `app/register/page.jsx` |
| লগইন | `authApi.post("/api/users/login", {...})` | `app/login/page.jsx` |
| লগআউট | `authApi.post("/api/users/logout")` | `components/Navbar.jsx` |
| আমি কে? | `authApi.get("/api/users/me")` | `components/Navbar.jsx` |
| আমার পোস্ট | `authApi.get("/api/cards/mine")` | `app/dashboard/page.jsx` |
| নতুন পোস্ট | `authApi.post("/api/cards", data)` | `components/CardForm.jsx` |
| পোস্ট এডিট | `authApi.put(\`/api/cards/${id}\`, data)` | `components/CardForm.jsx` |
| পোস্ট ডিলিট | `authApi.delete(\`/api/cards/${id}\`)` | `app/dashboard/page.jsx` |

---

## কীভাবে চালাবেন (How to run)

### শুধু ডিজাইন দেখতে চাইলে — `blog-static/`
```bash
cd blog-static
npm install
npm run dev
```
খুলুন **http://localhost:3000**।

### পুরো অ্যাপ চালাতে চাইলে — `blog-fullstack/`

**১) আগে backend চালান:**
```bash
cd blog-fullstack/backend
npm install
# .env ফাইলে MONGO_URI, JWT_SECRET, CLIENT_URL, NODE_ENV দিন
npm run dev
```
backend চলবে **http://localhost:5000**-এ।

**২) এবার frontend চালান (নতুন terminal):**
```bash
cd blog-fullstack/frontend
npm install
npm run dev
```
frontend চলবে **http://localhost:3000**-এ। `.env.local`-এ `NEXT_PUBLIC_API_URL=http://localhost:5000` আগে থেকেই দেওয়া আছে।

**৩)** ব্রাউজারে **http://localhost:3000** খুলে: register → পোস্ট create → edit → delete → logout করে দেখুন।

> দুইটা server (backend `:5000` আর frontend `:3000`) একসাথে চলতে হবে।

---

## HTTP method গুলো (GET / POST / PUT / DELETE)

- **GET** — ডেটা **পড়া** (কিছু বদলায় না)। যেমন `api.get("/api/cards")`।
- **POST** — নতুন কিছু **বানানো**। যেমন `authApi.post("/api/cards", data)`।
- **PUT** — আগের কিছু **আপডেট** করা। যেমন `authApi.put("/api/cards/1", data)`।
- **DELETE** — কিছু **মুছে ফেলা**। যেমন `authApi.delete("/api/cards/1")`।

frontend-এর প্রতিটি call, backend-এর একই method-এর route-এর সাথে মিলে যায়।

---

## Note

- এই folder-টি সম্পূর্ণ আলাদা (একটা "branch"/copy)। আগের TypeScript version-গুলো অক্ষত আছে।
- এখানে reusable helper না রাখায় কোড একটু বেশি লেখা লাগে, কিন্তু beginner-দের জন্য **বোঝা সহজ**। কোড বোঝার পর, বড় প্রজেক্টে reusable ফাংশন ব্যবহার করাই ভালো।
- বিস্তারিত concept-এর জন্য দেখুন: `Next.js Frontend`, `Node.js Backend`, `MongoDB`, আর `blog (frontend + backend)` folder-গুলো।
