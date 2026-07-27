# DevBlog Backend — Node.js + Express + MongoDB (Beginner Tutorial + Project)

This is the **server** for the static DevBlog frontend. It handles **register, login, logout, and card CRUD** (create, read, update, delete). The card data it returns matches the frontend's `BlogCard` shape (`id`, `title`, `excerpt`, `content`, `author`, `date`, `category`, `image`), so you can plug the two together with no changes.

Two things that make this version production-friendly:

- **The login token is stored in an httpOnly cookie** (not sent in the JSON body). The browser stores and sends it automatically, and JavaScript can't read it — which is safer against theft.
- **Feature-based folders:** everything about users lives in the `user/` folder, everything about cards lives in the `card/` folder.

> Frontend fields it matches: `id`, `title`, `excerpt`, `content`, `author`, `date`, `category`, `image`.

This README is both a **tutorial** (understand each part) and a **project guide** (run it, test it in Postman, connect it to the frontend).

---

## 1. What This Backend Does

| Who | Can do |
|-----|--------|
| **Anyone (public)** | See all cards, see one card |
| **Logged-in user** | Create cards, see their own cards, edit/delete their own cards |

The rules mirror the frontend: the home page is public; the dashboard and create/edit/delete need login. "Logged in" simply means the browser is holding the auth cookie we set at login.

---

## 2. Folder Structure (feature-based)

Instead of grouping by *type* (all models together, all routes together), we group by *feature*. Everything a feature needs sits in one folder — easy to find, easy to grow.

```
Blog Backend (Node.js)/
├── server.js                    ← starts the app, wires everything together
├── .env.example                 ← copy to .env and fill in your values
├── package.json                 ← dependencies & scripts
│
├── config/
│   └── db.js                    ← connects to MongoDB
│
├── user/                        ← 👤 EVERYTHING about users
│   ├── user.model.js            ← user shape (name, email, password)
│   ├── user.controller.js       ← register, login, logout, getMe (sets cookie)
│   ├── user.routes.js           ← /api/users/...
│   └── auth.middleware.js       ← "protect" = must be logged in (reads cookie)
│
└── card/                        ← 📝 EVERYTHING about cards
    ├── card.model.js            ← card shape
    ├── card.controller.js       ← the CRUD logic
    └── card.routes.js           ← /api/cards/...
```

**Why the auth middleware is in `user/`:** logging in and checking "who are you?" is a user concern. The card routes just import it: `import { protect } from "../user/auth.middleware.js"`.

**How a request flows:**
```
Request → server.js → route → (protect reads the cookie?) → controller → MongoDB → JSON response
```

> **Two ways to use this README.** To just run it, go to Section 3. To *learn by building it yourself* from an empty folder, follow the file-by-file tutorial in **Section 12** — every file's full code is there with explanations.

---

## 3. Before You Start (install these)

1. **Node.js** — https://nodejs.org (LTS). Check: `node --version`.
2. **MongoDB** — pick ONE:
   - **Local**: install MongoDB Community Server → URL is `mongodb://127.0.0.1:27017/devblog`.
   - **MongoDB Atlas (free cloud, easiest)**: create a cluster at https://www.mongodb.com/atlas → **Connect → Drivers** → copy the string.
   - **Atlas**: install MongoDB Community Server → URL is `mongodb+srv://<db_username>:<db_password>@cluster0.drqortc.mongodb.net/?appName=Cluster0`.
3. **Postman** — https://www.postman.com/downloads (to test the API). Postman stores cookies automatically, which is perfect for this cookie-based setup.

---

## 4. Setup & Run (step by step)

```bash
# 1. Go into the folder
cd "Blog Backend (Node.js)"

# 2. Install the packages
npm install

# 3. Create your .env from the example
copy .env.example .env      # Windows
cp .env.example .env        # Mac/Linux
```

Fill in `.env`:

```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/devblog
JWT_SECRET=some_long_random_secret_text
CLIENT_URL=http://localhost:3000
NODE_ENV=development
```

Start the server:

```bash
npm run dev
```

You should see:
```
✅ MongoDB connected
🚀 Server running on http://localhost:5000
```

Open http://localhost:5000 → `{ "message": "Blog API is running 🚀" }`. It works!

---

## 5. The API Endpoints (full list)

Base URL: **`http://localhost:5000`**

| # | Method | Endpoint | Auth? | What it does |
|---|--------|----------|-------|--------------|
| 1 | POST | `/api/users/register` | No | Create an account → sets auth cookie |
| 2 | POST | `/api/users/login` | No | Log in → sets auth cookie |
| 3 | POST | `/api/users/logout` | No | Clears the auth cookie |
| 4 | GET | `/api/users/me` | ✅ Cookie | Get the logged-in user |
| 5 | GET | `/api/cards` | No | Get ALL cards (home page) |
| 6 | GET | `/api/cards/:id` | No | Get ONE card (single post) |
| 7 | GET | `/api/cards/mine` | ✅ Cookie | Get MY cards (dashboard) |
| 8 | POST | `/api/cards` | ✅ Cookie | Create a card |
| 9 | PUT | `/api/cards/:id` | ✅ Cookie | Update a card (owner only) |
| 10 | DELETE | `/api/cards/:id` | ✅ Cookie | Delete a card (owner only) |

"✅ Cookie" means you must be logged in. Once you hit login, the cookie is stored by the browser/Postman and sent automatically — you don't add any header yourself.

---

## 6. How the Cookie Auth Works (important concept)

Old way: the server returns the token in JSON, and the frontend must store it and manually attach an `Authorization: Bearer ...` header on every request.

**This project's way (cookies):**

1. You call **login**. The server creates a JWT and sends it back as a **`Set-Cookie`** header with `httpOnly`.
2. The browser (or Postman) **saves that cookie** and **automatically attaches it** to every future request to this server — no code needed.
3. The `protect` middleware reads `req.cookies.token`, verifies it, and lets the request through.
4. **Logout** clears the cookie.

**Why httpOnly is safer:** `httpOnly` cookies can't be read by JavaScript in the browser, so malicious scripts can't steal the token. (A header-based token stored in `localStorage` *can* be stolen.)

> The `protect` middleware also accepts an `Authorization: Bearer` header as a fallback, so manual testing still works if you ever want it — but you won't need to.

---

## 7. Testing in Postman (complete walkthrough)

Postman keeps a **cookie jar** per domain, so after you log in it sends the cookie automatically — just like a browser. Follow these in order.

**For POST/PUT requests:** Body tab → **raw** → choose **JSON**.

### ① Register

- **POST** `http://localhost:5000/api/users/register`
- Body:
```json
{ "name": "Sara Khan", "email": "sara@example.com", "password": "123456" }
```
- **Response (201):**
```json
{
  "user": {
    "name": "Sara Khan",
    "email": "sara@example.com",
    "id": "66a3f1c2e5b1a2c3d4e5f601"
  }
}
```
- Look at the **Cookies** tab under the response — you'll see a `token` cookie was set. That's your login, stored automatically. (The password is never returned.)

### ② Login

- **POST** `http://localhost:5000/api/users/login`
- Body:
```json
{ "email": "sara@example.com", "password": "123456" }
```
- **Response (200):** the `user` object again, and the `token` cookie is refreshed.
- Wrong password → **401** `{ "message": "Invalid email or password" }`.

### ③ Create a card (cookie sent automatically)

- **POST** `http://localhost:5000/api/cards`
- **No header needed** — Postman sends the cookie for you.
- Body:
```json
{
  "title": "Getting Started with Next.js",
  "excerpt": "Next.js makes building React apps simple.",
  "content": "Full article text goes here...",
  "category": "Next.js",
  "image": "https://picsum.photos/seed/next/600/400"
}
```
- **Response (201):**
```json
{
  "id": "66a3f2a0e5b1a2c3d4e5f610",
  "title": "Getting Started with Next.js",
  "excerpt": "Next.js makes building React apps simple.",
  "content": "Full article text goes here...",
  "author": "Sara Khan",
  "category": "Next.js",
  "image": "https://picsum.photos/seed/next/600/400",
  "date": "Jul 24, 2026"
}
```
`id`, `author`, and a friendly `date` match the frontend card exactly. `author` came from your logged-in name.
- If you haven't logged in (no cookie) → **401** `{ "message": "Not authorized, please log in" }`.

### ④ Get all cards (public)

- **GET** `http://localhost:5000/api/cards` → array of cards, newest first. Exactly what the home page maps over.

### ⑤ Get one card (public)

- **GET** `http://localhost:5000/api/cards/<id>` → one card. (If the id doesn't exist you get `null` — the simplified version doesn't send a 404.)

### ⑥ Get my cards (needs login)

- **GET** `http://localhost:5000/api/cards/mine` → only cards you created.

### ⑦ Update a card (owner only)

- **PUT** `http://localhost:5000/api/cards/<id>`
- Body (send only what changes):
```json
{ "title": "Getting Started with Next.js (Updated)", "category": "React" }
```
- **Response (200):** the updated card. If you try to edit a card that isn't yours, the query matches nothing and you get `null` back (nothing is changed).

### ⑧ Delete a card (owner only)

- **DELETE** `http://localhost:5000/api/cards/<id>`
- **Response (200):** `{ "message": "Card deleted" }`. (Only your own card is actually removed — a non-owner's delete simply matches nothing.)

### ⑨ Logout

- **POST** `http://localhost:5000/api/users/logout` → `{ "message": "Logged out" }`. The `token` cookie is cleared; protected routes now return 401 again.

---

## 8. Status Codes You'll See

| Code | Meaning | Example |
|------|---------|---------|
| 200 | OK | Read/update/delete/login worked |
| 201 | Created | Register or create card worked |
| 400 | Bad Request | Missing fields / email already used |
| 401 | Unauthorized | Not logged in / wrong password |
| 403 | Forbidden | Logged in but editing someone else's card |
| 404 | Not Found | Card/route doesn't exist |
| 500 | Server Error | Something crashed (check the terminal) |

---

## 9. Connecting This Backend to the Static Frontend

Because we use cookies, the frontend must send them with **`credentials: "include"`** on every request. The shapes already match, so your components don't change.

**Login (Client Component):**
```tsx
await fetch("http://localhost:5000/api/users/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  credentials: "include",              // send & receive the cookie
  body: JSON.stringify({ email, password }),
});
// no token to store — the browser now holds the httpOnly cookie
```

**Create a card (cookie goes automatically):**
```tsx
await fetch("http://localhost:5000/api/cards", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  credentials: "include",              // <-- this is what sends the cookie
  body: JSON.stringify({ title, excerpt, content, category, image }),
});
```

**Get all cards (public, no cookie needed):**
```tsx
const res = await fetch("http://localhost:5000/api/cards", { cache: "no-store" });
const cards = await res.json();
```

**Logout:**
```tsx
await fetch("http://localhost:5000/api/users/logout", {
  method: "POST",
  credentials: "include",
});
```

Two must-dos for cookies to work across origins: the backend sets `cors({ origin: CLIENT_URL, credentials: true })` (already done in `server.js`), and the frontend sends `credentials: "include"` (shown above).

---

## 10. Common Problems & Fixes

| Problem | Fix |
|---------|-----|
| `MongoDB connection error` | Check `MONGO_URI`. For Atlas, allow your IP in Network Access. |
| `Not authorized, please log in` | You aren't logged in — call login first (in Postman it sets the cookie automatically). |
| Cookie not sticking in the browser | Backend `cors` needs `credentials: true` and an exact `origin` (not `*`); frontend fetch needs `credentials: "include"`. |
| Cookie blocked in production | Deploy over HTTPS and set `NODE_ENV=production` (makes the cookie `secure`). |
| `Cannot use import statement` | Ensure `"type": "module"` is in `package.json` (it is). |
| `/api/cards/mine` treated as an id | Keep the `/mine` route **above** `/:id` in `card.routes.js`. |

---

## 11. Practice Challenges 🏋️

1. Add a `role` field (`user`/`admin`) and an `authorize("admin")` middleware in `user/` so an admin can delete ANY card.
2. Add a `likes` number to the Card model and a `PUT /api/cards/:id/like` route.
3. Validate that the title is at least 5 characters.
4. Add a `comment/` feature folder (model + controller + routes) so cards can have comments.
5. Seed the database with the 6 sample cards from the frontend's `lib/data.ts`.

---

## 12. Full Code — Build It File by File (Tutorial)

Build from an empty folder. Each step says **what to type**, **why**, and gives the **complete code**. By the end you'll have the whole cookie-based, feature-structured backend.

---

### Step 1 — Create the project & install packages

```bash
mkdir blog-backend
cd blog-backend
npm init -y
npm install express mongoose bcryptjs jsonwebtoken dotenv cors cookie-parser
npm install --save-dev nodemon
```

- `express` — web framework. `mongoose` — MongoDB models. `bcryptjs` — hash passwords.
- `jsonwebtoken` — create login tokens. `dotenv` — load secrets. `cors` — allow the frontend.
- **`cookie-parser`** — read cookies from incoming requests (new in this version).
- `nodemon` — auto-restart while developing.

---

### Step 2 — `package.json`

Add `"type": "module"` (for `import`) and the scripts.

```json
{
  "name": "blog-backend",
  "version": "1.0.0",
  "description": "Server for the static DevBlog frontend — auth + card CRUD",
  "type": "module",
  "main": "server.js",
  "scripts": {
    "dev": "nodemon server.js",
    "start": "node server.js"
  },
  "dependencies": {
    "bcryptjs": "^2.4.3",
    "cookie-parser": "^1.4.6",
    "cors": "^2.8.5",
    "dotenv": "^16.4.5",
    "express": "^4.19.2",
    "jsonwebtoken": "^9.0.2",
    "mongoose": "^8.5.0"
  },
  "devDependencies": {
    "nodemon": "^3.1.4"
  }
}
```

---

### Step 3 — `.env`

Create `.env` in the root. `NODE_ENV=development` keeps the cookie usable over plain `http` locally; set it to `production` when you deploy over HTTPS.

```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/devblog
JWT_SECRET=change_this_to_a_long_random_string
CLIENT_URL=http://localhost:3000
NODE_ENV=development
```

---

### Step 4 — `config/db.js`

```js
import mongoose from "mongoose";

// Connects to MongoDB using the URL from your .env file.
export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1); // stop the app if the database won't connect
  }
};
```

---

### Step 5 — `user/user.model.js`

The user shape. We keep it simple — just the fields. (We never send the password back to the client because the controllers return only `id`, `name`, and `email`.)

```js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true }, // stored hashed, never plain text
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
```

---

### Step 6 — `user/auth.middleware.js` (reads the cookie)

`protect` blocks anyone not logged in. It reads the token from the **cookie** first (how the browser sends it), with an `Authorization` header as a fallback.

```js
import jwt from "jsonwebtoken";
import User from "./user.model.js";

export const protect = async (req, res, next) => {
  try {
    let token;

    // 1. Prefer the cookie (browser sends it automatically)
    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }
    // 2. Fallback: an Authorization header (handy for manual tests)
    else if (req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "Not authorized, please log in" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id).select("-password");
    if (!req.user) {
      return res.status(401).json({ message: "User no longer exists" });
    }

    next();
  } catch (err) {
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
};
```

**Line notes:** `req.cookies` exists because we add `cookie-parser` in `server.js`. `next()` lets the request continue to the controller.

---

### Step 7 — `user/user.controller.js` (sets & clears the cookie)

Register/login create a JWT and put it in an httpOnly cookie with `res.cookie(...)`. Logout clears it. No token is sent in the JSON body anymore.

```js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "./user.model.js";

// Helper: create a signed JWT token that proves who the user is.
const createToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// Helper: options for the token cookie.
const cookieOptions = {
  httpOnly: true, // JS in the browser CANNOT read it -> safer
  secure: process.env.NODE_ENV === "production", // HTTPS-only in production
  sameSite: "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

// REGISTER — POST /api/users/register
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });

    const token = createToken(user);
    res.cookie("token", token, cookieOptions); // store token in a cookie
    res.status(201).json({ user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// LOGIN — POST /api/users/login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    const isMatch = user && (await bcrypt.compare(password, user.password));

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = createToken(user);
    res.cookie("token", token, cookieOptions);
    res.status(200).json({ user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// LOGOUT — POST /api/users/logout
export const logout = async (req, res) => {
  res.clearCookie("token", cookieOptions);
  res.json({ message: "Logged out" });
};

// GET CURRENT USER — GET /api/users/me
export const getMe = async (req, res) => {
  res.json(req.user);
};
```

**Line notes:** we don't hand-check the fields — the model's `required` rules do that. In `login` we only keep the one real check (wrong email/password) and combine both cases into a single `isMatch`. `httpOnly: true` is the key security setting; `secure` is off in development so the cookie works over `http://localhost`. `clearCookie` uses the same options so it reliably removes the cookie.

---

### Step 8 — `user/user.routes.js`

```js
import express from "express";
import { register, login, logout, getMe } from "./user.controller.js";
import { protect } from "./auth.middleware.js";

const router = express.Router();

router.post("/register", register); // sets cookie
router.post("/login", login);       // sets cookie
router.post("/logout", logout);     // clears cookie
router.get("/me", protect, getMe);  // needs cookie

export default router;
```

---

### Step 9 — `card/card.model.js`

Just the card fields. MongoDB stores the id as `_id` and adds `createdAt`/`updatedAt`; the controller's `format` helper (next step) turns those into the frontend's `id` and `date`.

```js
import mongoose from "mongoose";

const cardSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    excerpt: { type: String, required: true },
    content: { type: String, required: true },
    category: { type: String, default: "General" },
    image: { type: String, default: "https://picsum.photos/seed/blog/600/400" },
    author: { type: String, required: true }, // display name from the user
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Card = mongoose.model("Card", cardSchema);
export default Card;
```

---

### Step 10 — `card/card.controller.js`

All five operations, kept short. A tiny `format` helper at the top shapes each card to match the frontend exactly (`id`, `date`, ...). For update/delete, the owner check is built **into the query** — `findOneAndUpdate({ _id, createdBy: req.user._id })` only touches a card that matches this id AND belongs to this user. No separate fetch-and-verify step.

```js
import Card from "./card.model.js";

// Shape a card to match the frontend exactly:
// id, title, excerpt, content, author, date, category, image
const format = (card) => ({
  id: card._id,
  title: card.title,
  excerpt: card.excerpt,
  content: card.content,
  author: card.author,
  category: card.category,
  image: card.image,
  date: new Date(card.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }),
});

// GET ALL (PUBLIC)
export const getCards = async (req, res) => {
  try {
    const cards = await Card.find().sort({ createdAt: -1 });
    res.json(cards.map(format));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET ONE (PUBLIC)
export const getCard = async (req, res) => {
  try {
    const card = await Card.findById(req.params.id);
    res.json(card ? format(card) : null);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET MINE (PROTECTED)
export const getMyCards = async (req, res) => {
  try {
    const cards = await Card.find({ createdBy: req.user._id }).sort({ createdAt: -1 });
    res.json(cards.map(format));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// CREATE (PROTECTED)
export const createCard = async (req, res) => {
  try {
    const card = await Card.create({
      ...req.body,
      author: req.user.name,   // from the logged-in user
      createdBy: req.user._id, // owner
    });
    res.status(201).json(format(card));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE (PROTECTED, OWNER ONLY)
export const updateCard = async (req, res) => {
  try {
    const card = await Card.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user._id },
      req.body,
      { new: true }
    );
    res.json(card ? format(card) : null);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE (PROTECTED, OWNER ONLY)
export const deleteCard = async (req, res) => {
  try {
    await Card.findOneAndDelete({ _id: req.params.id, createdBy: req.user._id });
    res.json({ message: "Card deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
```

**Notes:** the `format` helper is the one place we map the database fields to the frontend's shape (`_id → id`, `createdAt → date`) — visible and easy to change, not hidden in the model. We also removed the manual "is the field present?" checks (the model's `required` rules handle that), and putting `createdBy: req.user._id` inside the query is the whole authorization — a non-owner simply matches nothing.

---

### Step 11 — `card/card.routes.js` (imports protect from user/)

The guard lives in the user feature, so we import it from `../user/auth.middleware.js`. Keep `/mine` above `/:id`.

```js
import express from "express";
import {
  getCards, getCard, getMyCards, createCard, updateCard, deleteCard,
} from "./card.controller.js";
import { protect } from "../user/auth.middleware.js";

const router = express.Router();

// PUBLIC
router.get("/", getCards);
router.get("/mine", protect, getMyCards); // must be above "/:id"
router.get("/:id", getCard);

// PROTECTED (cookie sent automatically)
router.post("/", protect, createCard);
router.put("/:id", protect, updateCard);
router.delete("/:id", protect, deleteCard);

export default router;
```

---

### Step 12 — `server.js` (adds cookie-parser + CORS credentials)

Two additions for cookies: `cookieParser()` middleware, and `cors` with `credentials: true` and an exact origin.

```js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/db.js";
import userRoutes from "./user/user.routes.js";
import cardRoutes from "./card/card.routes.js";

dotenv.config();

const app = express();

// credentials:true + exact origin are REQUIRED for cookies to work
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());   // read JSON bodies
app.use(cookieParser());   // read cookies into req.cookies

connectDB();

app.get("/", (req, res) => {
  res.json({ message: "Blog API is running 🚀" });
});

app.use("/api/users", userRoutes);  // /api/users/register, /login, /logout, /me
app.use("/api/cards", cardRoutes);  // /api/cards ...

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Server error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
```

**Line notes:** `cookieParser()` must run before the routes so `req.cookies` is populated. With cookies, `cors` origin can't be `"*"` — it must be your exact frontend URL, and `credentials: true` is mandatory.

---

### Step 13 — Run it

```bash
npm run dev
```

See `✅ MongoDB connected` and `🚀 Server running...`, then go to **Section 7** and test in Postman: register → (cookie set) → create card → get cards → update → delete → logout. 🎉

You just built a complete cookie-authenticated, feature-structured CRUD API.

---

**Recap:** `npm install` → set `.env` → `npm run dev` → in Postman: register/login (cookie is stored automatically) → create/get/update/delete cards → logout. On the frontend, add `credentials: "include"` to your fetch calls and the same cookie flows through. The data shapes already match, so the UI just works. 🎉
