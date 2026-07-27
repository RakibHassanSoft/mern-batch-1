# 📝 Assignment / Task — Blog (JavaScript) বোঝা ও হাতে লেখা রিপোর্ট

এই টাস্কে তোমাকে **নিজে কোড পড়ে বুঝতে হবে** — প্রথমে **static** ব্লগ, তারপর **full stack** ব্লগের **connection code**। শেষে একটি **হাতে লেখা (handwritten) রিপোর্ট** বানিয়ে জমা দিতে হবে।

> ⏰ **জমা দেওয়ার শেষ সময়: ২৯ তারিখ, রাত ১১:৫৯ (29th, 11:59 PM)।** এর মধ্যেই হাতে লেখা রিপোর্ট সাবমিট করতে হবে।

---

## 📁 ফোল্ডার দুটি কোথায় (Where the folders are)

```
Blog JS (Beginner, Bangla)/
├── blog-static/        ← ধাপ ১: শুধু ডিজাইন (fake data, server নেই) — এটা আগে বুঝবে
└── blog-fullstack/     ← ধাপ ২: আসল অ্যাপ (frontend + backend যুক্ত) — এটা পরে বুঝবে
    ├── backend/        ← Node.js + Express + MongoDB API
    └── frontend/       ← Next.js (JS) — server-এর সাথে axios দিয়ে যুক্ত
```

- **`blog-static/`** = শুধু চেহারা/ডিজাইন। ডেটা আসে `lib/data.js` (নকল) থেকে। কিছু save হয় না।
- **`blog-fullstack/`** = আসল অ্যাপ। এখানে login, register, create/edit/delete — সব সত্যিকারের কাজ করে।

**নিয়ম:** আগে static ভালো করে বুঝবে, তারপর full stack-এ ঢুকবে। তাহলে "connection" বুঝতে সহজ হবে।

---

# 🟢 Part 1 — Static Blog কোড বোঝো (`blog-static/`)

প্রথমে `blog-static/` ফোল্ডারের প্রতিটি ফাইল খুলে পড়ো। প্রতিটি ফাইলে ছোট **Bangla comment** দেওয়া আছে — সেগুলো পড়লেই বুঝবে।

### যেসব ফাইল বুঝতে হবে (checklist)
- [ ] `lib/data.js` — নকল ব্লগ ডেটা কেমন দেখতে? প্রতিটি কার্ডে কোন কোন field আছে?
- [ ] `app/layout.jsx` — Navbar + Footer কীভাবে সব পেজে আসে?
- [ ] `app/page.jsx` — home পেজ কীভাবে `blogCards.map()` দিয়ে কার্ড দেখায়?
- [ ] `app/blog/[id]/page.jsx` — URL থেকে `id` নিয়ে কীভাবে একটি কার্ড খুঁজে বের করে?
- [ ] `components/BlogCard.jsx` — একটি কার্ডের ডিজাইন; `showActions` prop-এর কাজ কী?
- [ ] `components/CardForm.jsx` — create আর edit-এ কীভাবে একই ফর্ম ব্যবহার হয়?
- [ ] `components/Navbar.jsx`, `Footer.jsx`, `Button.jsx`, `InputField.jsx`, `TextareaField.jsx`
- [ ] `app/login/page.jsx`, `app/register/page.jsx`, `app/dashboard/page.jsx`

### নিজেকে প্রশ্ন করো (এগুলোর উত্তর রিপোর্টে লিখবে)
1. **component** কী? props দিয়ে কীভাবে ডেটা পাঠানো হয়? (`BlogCard` উদাহরণ দাও)
2. `.map()` দিয়ে লিস্ট দেখানো মানে কী?
3. এই static version-এ Login/Delete বাটন চাপলে কেন কিছু হয় না?
4. ডেটা কোথা থেকে আসছে? (উত্তর: `lib/data.js` — নকল)

---

# 🔵 Part 2 — Full Stack Blog-এর Connection Code বোঝো (`blog-fullstack/`)

static বোঝা হলে এবার `blog-fullstack/frontend/`-এ ঢোকো। এখানে একই ডিজাইন, কিন্তু ডেটা আসে **আসল server** থেকে (axios দিয়ে)। মূল কাজ হলো **connection** বোঝা।

> সাহায্যের জন্য: `blog-fullstack/README.md`-তে static থেকে connected বানানোর পূর্ণ ধাপে-ধাপে টিউটোরিয়াল (BEFORE → AFTER কোড সহ) দেওয়া আছে।

### যেসব connection code বুঝতে হবে (checklist)
- [ ] `frontend/.env.local` — backend-এর URL এখানে কেন রাখা হয়?
- [ ] `frontend/lib/api.js` — `api` আর `authApi` — দুটোর পার্থক্য কী? `withCredentials: true` কী করে?
- [ ] `frontend/app/page.jsx` — `api.get("/api/cards")` দিয়ে কীভাবে সব কার্ড আনে?
- [ ] `frontend/app/blog/[id]/page.jsx` — `api.get(\`/api/cards/${id}\`)` কীভাবে কাজ করে?
- [ ] `frontend/app/login/page.jsx` — `authApi.post("/api/users/login", ...)` কীভাবে login করায়?
- [ ] `frontend/app/register/page.jsx` — `authApi.post("/api/users/register", ...)`
- [ ] `frontend/components/CardForm.jsx` — `authApi.post` (নতুন) আর `authApi.put` (edit)
- [ ] `frontend/app/dashboard/page.jsx` — `authApi.get("/api/cards/mine")` আর `authApi.delete(...)`
- [ ] `frontend/components/Navbar.jsx` — `authApi.get("/api/users/me")` দিয়ে login চেক + logout

### Public vs Private (মূল ধারণা)
| client | কখন | উদাহরণ |
|--------|------|--------|
| `api` | **public** (লগইন লাগে না) | `api.get("/api/cards")` |
| `authApi` | **private** (লগইন লাগে, cookie যায়) | `authApi.post("/api/cards", data)` |

### নিজেকে প্রশ্ন করো (রিপোর্টে উত্তর দেবে)
1. static-এর তুলনায় full stack-এ কোন কোন ফাইল **নতুন যোগ** হয়েছে, কোনটা **মুছে** গেছে?
2. `blogCards` (নকল array) এর বদলে এখন ডেটা কীভাবে আসে?
3. login করলে **cookie** কীভাবে কাজ করে? পরের request-এ cookie কীভাবে যায়?
4. GET / POST / PUT / DELETE — প্রতিটি কী কাজে লাগে? একটি করে উদাহরণ দাও।
5. frontend-এর একটি call (যেমন `authApi.post("/api/users/login")`) backend-এর কোন route-এর সাথে মেলে?

---

## 📊 Request → Response ফ্লো (রিপোর্টে এঁকে দেখাবে)

```
Browser (frontend :3000)                Server (backend :5000)              Database
   |   axios দিয়ে request  ───────────▶   route → controller  ──────────▶   MongoDB
   |   (api / authApi)                      |                                  |
   |   ◀───────── JSON response ─────────   ◀──────────── data ───────────────  |
   |   পেজে দেখায়
```

---

# ✍️ যা জমা দিতে হবে — হাতে লেখা রিপোর্ট (Handwritten Report)

**একটি হাতে লেখা রিপোর্ট** বানাও (কম্পিউটারে টাইপ নয় — নিজ হাতে খাতায় লিখবে), যাতে থাকবে:

1. **নাম, ব্যাচ, তারিখ** — উপরে।
2. **Part 1 (Static):** উপরের প্রশ্নগুলোর উত্তর নিজের ভাষায়। প্রতিটি মূল ফাইল ২–৩ লাইনে ব্যাখ্যা করো (এই ফাইল কী করে)।
3. **Part 2 (Connection):** static থেকে full stack-এ কী কী বদলাল — নতুন/মুছে যাওয়া ফাইলের তালিকা, আর প্রতিটি axios call (`api.get`, `authApi.post`, `authApi.put`, `authApi.delete`) কোথায় ও কেন ব্যবহার হয়েছে।
4. **একটি হাতে আঁকা ডায়াগ্রাম:** উপরের request → response ফ্লো নিজে হাতে আঁকো।
5. **GET / POST / PUT / DELETE** টেবিল — প্রতিটির মানে ও একটি করে উদাহরণ।
6. **তোমার শেখা ৩টি জিনিস** — শেষে ছোট করে লেখো।

### 📸 জমা দেওয়ার নিয়ম (Submission)
- হাতে লেখা রিপোর্টের **পরিষ্কার ছবি তোলো / স্ক্যান করো** (সব পাতা)।
- একটি **PDF** বানিয়ে জমা দাও (অথবা যেভাবে instructor বলেছে)।
- ⏰ **শেষ সময়: ২৯ তারিখ, রাত ১১:৫৯ (29th, 11:59 PM)। দেরিতে জমা নেওয়া হবে না।**

---

## ▶️ কোড চালিয়ে দেখতে চাইলে (optional, but recommended)

**Static দেখতে:**
```bash
cd blog-static
npm install
npm run dev        # http://localhost:3000
```

**Full stack চালাতে (২টি terminal):**
```bash
# terminal 1 — backend
cd blog-fullstack/backend
npm install
# .env-এ MONGO_URI, JWT_SECRET, CLIENT_URL=http://localhost:3000, NODE_ENV=development দাও
npm run dev        # http://localhost:5000

# terminal 2 — frontend
cd blog-fullstack/frontend
npm install
npm run dev        # http://localhost:3000
```

চালিয়ে register → create → edit → delete → logout করে দেখলে রিপোর্ট লেখা আরও সহজ হবে।

---

## ✅ Task Checklist (জমা দেওয়ার আগে মিলিয়ে নাও)
- [ ] `blog-static/` এর সব ফাইল পড়েছি ও বুঝেছি
- [ ] `blog-fullstack/frontend/` এর connection code বুঝেছি (`api` vs `authApi`)
- [ ] হাতে লেখা রিপোর্টে Part 1 + Part 2 এর উত্তর লিখেছি
- [ ] request → response ফ্লো হাতে এঁকেছি
- [ ] GET/POST/PUT/DELETE টেবিল দিয়েছি
- [ ] রিপোর্টের পরিষ্কার ছবি/স্ক্যান করে PDF বানিয়েছি
- [ ] **২৯ তারিখ রাত ১১:৫৯ এর আগে** জমা দিয়েছি

শুভকামনা! 🎉 আগে static বোঝো, তারপর connection — ধীরে ধীরে, নিজে কোড পড়ে।
