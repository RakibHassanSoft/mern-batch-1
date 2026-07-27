# Blog Full Stack (JavaScript, Bangla comments)

আসল অ্যাপ — **frontend + backend + database**। frontend (Next.js, JS) server-এর সাথে **সরাসরি axios call** দিয়ে কথা বলে। প্রতিটি ফাইলে ছোট **Bangla comment**।

Real app: Next.js (JS) frontend + Node.js/Express + MongoDB backend, connected with **inline axios calls** (no wrapper functions). Bangla comments in every file.

```
blog-fullstack/
├── backend/     ← Node.js + Express + MongoDB API (JS)
└── frontend/    ← Next.js (JS) — সরাসরি api / authApi call
```

---

## চালানো (Run) — দুইটা terminal লাগবে

### ১) Backend
```bash
cd backend
npm install
# .env ফাইলে দিন:
#   MONGO_URI=<আপনার MongoDB Atlas string>
#   JWT_SECRET=<লম্বা random text>
#   CLIENT_URL=http://localhost:3000
#   NODE_ENV=development
npm run dev
```
চলবে **http://localhost:5000**।

### ২) Frontend
```bash
cd frontend
npm install
npm run dev
```
চলবে **http://localhost:3000**। `.env.local`-এ `NEXT_PUBLIC_API_URL=http://localhost:5000` আগে থেকেই আছে।

তারপর **http://localhost:3000** খুলে: register → পোস্ট create → edit → delete → logout।

---

## সরাসরি API call (এই version-এর মূল বৈশিষ্ট্য) ⭐

কোনো `loginUser()` টাইপ লুকানো ফাংশন নেই। প্রতিটি call ফাইলের ভেতরেই সরাসরি লেখা:

```js
// public (লগইন লাগে না)
const res = await api.get("/api/cards");

// private (লগইন লাগে — cookie যায়)
await authApi.post("/api/users/login", { email, password });
await authApi.post("/api/cards", data);
await authApi.put(`/api/cards/${id}`, data);
await authApi.delete(`/api/cards/${id}`);
```

দুইটা client `lib/api.js`-এ তৈরি:
- `api` → **public** (পড়ার জন্য)
- `authApi` → **private**, `withCredentials: true` (cookie সহ)

কোন call কোন ফাইলে আছে — তার পুরো তালিকা মূল (parent) folder-এর README-তে দেওয়া আছে।

---

## backend এর টেস্ট
`backend/tests/`-এ unit test আছে। চালান:
```bash
cd backend
npm test
```

বিস্তারিত concept: `../../Node.js Backend`, `../../MongoDB`, আর `../../Unit Testing Basics` folder দেখুন।
