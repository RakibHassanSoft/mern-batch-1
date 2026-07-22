# Node.js Backend — CRUD, Mongoose, Authentication & Authorization

Clear, code-based beginner notes for building a real backend API with **Node.js + Express + MongoDB (Mongoose)**. This is the backend that your Next.js frontend will talk to. We build up step by step: setup → a REST API → database → CRUD → login/signup (authentication) → who-can-do-what (authorization).

> Assumes you know basic JavaScript/TypeScript. Examples use plain JavaScript so nothing extra gets in the way of the concepts. Everything works the same in TypeScript.

---

## 1. What is Node.js? (and Express)

**Node.js** lets you run JavaScript **outside the browser** — on a server. That means you can use JavaScript to build backends: handle requests, talk to databases, and send data back.

- **Browser JavaScript** → runs in Chrome, controls the webpage.
- **Node.js JavaScript** → runs on a server, handles requests and data.

**Express** is a small, popular framework that makes building a Node server easy. Node alone is low-level; Express gives you clean tools for **routes** (URLs) and **requests/responses**. Almost every Node backend uses Express.

**The big picture of a backend API:**

```
Frontend (Next.js)  ──HTTP request──▶  Node + Express  ──▶  MongoDB
                    ◀──JSON response──               ◀──
```

The frontend asks ("give me all products"), the backend fetches from the database, and sends back JSON.

---

## 2. Setup (create a Node project)

Install **Node.js** from https://nodejs.org (LTS version). Check it works:

```bash
node --version
npm --version
```

Create your project:

```bash
mkdir my-backend
cd my-backend
npm init -y            # creates package.json
```

Install the packages we'll use:

```bash
npm install express mongoose bcryptjs jsonwebtoken dotenv cors
npm install --save-dev nodemon
```

What each does:
- **express** — the web framework (routes, requests).
- **mongoose** — talk to MongoDB easily.
- **bcryptjs** — hash (scramble) passwords safely.
- **jsonwebtoken** — create login tokens (JWT).
- **dotenv** — load secret values from a `.env` file.
- **cors** — let your frontend (different URL) call this backend.
- **nodemon** — auto-restarts the server when you save (dev only).

In `package.json`, add scripts and `"type": "module"` (so we can use modern `import`):

```json
{
  "type": "module",
  "scripts": {
    "dev": "nodemon server.js",
    "start": "node server.js"
  }
}
```

Run with `npm run dev`.

---

## 3. Your First Express Server

Create `server.js`:

```js
import express from "express";

const app = express();

app.use(express.json());   // lets the server read JSON from requests

// A simple route
app.get("/", (req, res) => {
  res.send("Server is running!");
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
```

Run `npm run dev`, open http://localhost:5000 → you see "Server is running!".

**Key pieces:**
- `app.get("/", ...)` → handle a GET request to `/`.
- `req` → the **request** (what the client sent).
- `res` → the **response** (what you send back). `res.send(...)` or `res.json(...)`.
- `app.use(express.json())` → required so you can read JSON bodies (for POST/PUT).

---

## 4. HTTP Methods & REST (the language of APIs)

A **REST API** uses standard HTTP methods to mean different actions. This maps directly to **CRUD** (Create, Read, Update, Delete):

| Action | HTTP Method | Example URL | CRUD |
|--------|-------------|-------------|------|
| Get all items | `GET` | `/api/products` | Read |
| Get one item | `GET` | `/api/products/:id` | Read |
| Create item | `POST` | `/api/products` | Create |
| Update item | `PUT` (or `PATCH`) | `/api/products/:id` | Update |
| Delete item | `DELETE` | `/api/products/:id` | Delete |

- `:id` is a **route parameter** — read it with `req.params.id`.
- The client sends data in the **request body** — read it with `req.body` (needs `express.json()`).

We'll build all five for real in Section 8.

---

## 5. Connecting to MongoDB with Mongoose

**MongoDB** is a database that stores data as **documents** (which look just like JavaScript objects / JSON). **Mongoose** is the tool that connects Node to MongoDB and lets you define the shape of your data.

### Get a database
Easiest: create a free cluster at **MongoDB Atlas** (https://www.mongodb.com/atlas). It gives you a connection string like:

```
mongodb+srv://username:password@cluster.mongodb.net/mydb
```

### Store secrets in `.env`
Create a `.env` file (never commit this to Git):

```
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/mydb
JWT_SECRET=someLongRandomSecretText
```

### Connect
Update `server.js`:

```js
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();                 // load .env values

const app = express();
app.use(cors());                 // allow the frontend to call us
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("DB error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server on port ${PORT}`));
```

`process.env.MONGO_URI` reads the value from `.env` (thanks to `dotenv`).

---

## 6. Schemas & Models (defining your data shape)

A **Schema** describes what a document looks like (its fields and rules). A **Model** is the tool you use to actually create, find, update, and delete those documents.

Create `models/Product.js`:

```js
import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    inStock: { type: Boolean, default: true },
  },
  { timestamps: true }   // auto-adds createdAt & updatedAt
);

const Product = mongoose.model("Product", productSchema);
export default Product;
```

- `required: true` → the field must be provided (validation).
- `default: true` → used if not provided.
- `timestamps: true` → automatically tracks when each doc was created/updated.

Mongoose turns the model name `"Product"` into a MongoDB collection called `products`.

---

## 7. Organising Code: Routes & Controllers

For anything beyond a toy app, split your code:
- **Routes** → map URLs to functions.
- **Controllers** → the actual logic for each action.

```
my-backend/
├── server.js
├── models/
│   └── Product.js
├── controllers/
│   └── productController.js
├── routes/
│   └── productRoutes.js
├── middleware/
│   └── auth.js
└── .env
```

This keeps `server.js` clean and each file focused.

---

## 8. Full CRUD (Create, Read, Update, Delete) ⭐

Here's the complete set of operations. Mongoose model methods do the database work, and they're **async** (they return Promises — remember async/await from your TS notes).

`controllers/productController.js`:

```js
import Product from "../models/Product.js";

// CREATE — POST /api/products
export const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);   // uses the JSON body
    res.status(201).json(product);                     // 201 = created
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// READ ALL — GET /api/products
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find();             // get every product
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// READ ONE — GET /api/products/:id
export const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE — PUT /api/products/:id
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }   // return the UPDATED doc + re-check rules
    );
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE — DELETE /api/products/:id
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
```

**Key Mongoose methods:** `create()`, `find()`, `findById()`, `findByIdAndUpdate()`, `findByIdAndDelete()`. Also useful: `findOne({ email })` to search by a field.

`routes/productRoutes.js`:

```js
import express from "express";
import {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";

const router = express.Router();

router.post("/", createProduct);
router.get("/", getProducts);
router.get("/:id", getProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

export default router;
```

Wire it into `server.js`:

```js
import productRoutes from "./routes/productRoutes.js";

app.use("/api/products", productRoutes);
```

Now you have a working REST API:
- `POST /api/products` → create
- `GET /api/products` → list
- `GET /api/products/:id` → one
- `PUT /api/products/:id` → update
- `DELETE /api/products/:id` → delete

Test it with **Postman**, **Thunder Client** (VS Code), or your frontend's `fetch`.

---

## 9. HTTP Status Codes (what the numbers mean)

Send the right status so the frontend knows what happened:

| Code | Meaning | When |
|------|---------|------|
| 200 | OK | Success (read/update/delete) |
| 201 | Created | Something new was created |
| 400 | Bad Request | Client sent invalid data |
| 401 | Unauthorized | Not logged in / bad token |
| 403 | Forbidden | Logged in, but not allowed |
| 404 | Not Found | Item/route doesn't exist |
| 500 | Server Error | Something crashed on our side |

---

## 10. Authentication ⭐⭐ (signup & login)

**Authentication = proving who you are** (login). The plan:

1. **Signup:** user sends email + password → we **hash** the password (never store plain text!) → save the user.
2. **Login:** user sends email + password → we compare against the hash → if correct, we give them a **token (JWT)**.
3. The frontend keeps that token and sends it with future requests to prove it's them.

### The User model

`models/User.js`:

```js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
```

- `unique: true` → no two users can share an email.
- `role` → we'll use this for **authorization** (Section 11). `enum` limits it to allowed values.

### Hashing passwords with bcrypt

**Never store passwords as plain text.** `bcrypt` scrambles them one-way — even you can't reverse it, but you can *check* if a guess matches.

`controllers/authController.js`:

```js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Helper: make a JWT token for a user
const createToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },   // data stored inside the token
    process.env.JWT_SECRET,              // secret key from .env
    { expiresIn: "7d" }                  // token valid for 7 days
  );
};

// SIGNUP — POST /api/auth/signup
export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1. Check if user already exists
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // 2. Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);   // 10 = strength

    // 3. Save the user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // 4. Give them a token right away
    const token = createToken(user);
    res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// LOGIN — POST /api/auth/login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Find the user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 2. Compare the password with the stored hash
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 3. Give them a token
    const token = createToken(user);
    res.status(200).json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
```

`routes/authRoutes.js`:

```js
import express from "express";
import { signup, login } from "../controllers/authController.js";

const router = express.Router();
router.post("/signup", signup);
router.post("/login", login);

export default router;
```

In `server.js`:
```js
import authRoutes from "./routes/authRoutes.js";
app.use("/api/auth", authRoutes);
```

### What is a JWT?

A **JWT (JSON Web Token)** is a signed string that proves a user is logged in. It contains data (like their id and role) and is signed with your secret. The frontend stores it and sends it on each request in a header:

```
Authorization: Bearer <the-token>
```

Because it's signed with `JWT_SECRET`, nobody can fake or change it without the secret.

---

## 11. Authorization ⭐⭐ (who is allowed to do what)

**Authentication** = who you are. **Authorization** = what you're allowed to do. Example: any logged-in user can read products, but only an **admin** can delete them.

We enforce this with **middleware** — a function that runs *before* the controller and can block the request.

### Step 1 — "protect" middleware (must be logged in)

`middleware/auth.js`:

```js
import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Checks the token — blocks anyone not logged in
export const protect = async (req, res, next) => {
  try {
    // 1. Read the token from the Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }
    const token = authHeader.split(" ")[1];   // remove "Bearer "

    // 2. Verify it with our secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Attach the user to the request (so controllers can use it)
    req.user = await User.findById(decoded.id).select("-password");
    if (!req.user) {
      return res.status(401).json({ message: "User no longer exists" });
    }

    next();   // all good → continue to the controller
  } catch (err) {
    res.status(401).json({ message: "Not authorized, token failed" });
  }
};
```

- `next()` → "let the request continue." Without it, the request stops here.
- `req.user` → now available in any controller that runs after this.
- `.select("-password")` → don't include the password field.

### Step 2 — "authorize" middleware (must have the right role)

```js
// Allows only certain roles. Usage: authorize("admin")
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: "You do not have permission for this action" });
    }
    next();
  };
};
```

- `403` = logged in, but not allowed.
- `authorize("admin")` blocks everyone whose role isn't admin.

### Step 3 — apply them to routes

Update `routes/productRoutes.js`:

```js
import express from "express";
import {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

// Public — anyone can read
router.get("/", getProducts);
router.get("/:id", getProduct);

// Logged-in users can create
router.post("/", protect, createProduct);

// Only admins can update or delete
router.put("/:id", protect, authorize("admin"), updateProduct);
router.delete("/:id", protect, authorize("admin"), deleteProduct);

export default router;
```

Read `router.delete("/:id", protect, authorize("admin"), deleteProduct)` as a chain:
1. `protect` → are you logged in? (else 401)
2. `authorize("admin")` → are you an admin? (else 403)
3. `deleteProduct` → only now does the actual delete run.

This middleware chain is the heart of backend security.

### Using `req.user` in a controller

Now controllers know who's making the request — e.g. save the creator, or return only the logged-in user's data:

```js
export const createProduct = async (req, res) => {
  const product = await Product.create({
    ...req.body,
    createdBy: req.user._id,   // available thanks to 'protect'
  });
  res.status(201).json(product);
};

// GET /api/auth/me — return the current logged-in user
export const getMe = async (req, res) => {
  res.status(200).json(req.user);
};
```

---

## 12. How the Frontend Uses This

Your Next.js frontend calls these endpoints with `fetch` (from your TS/Next notes). After login, it stores the token and sends it on protected requests:

```js
// login
const res = await fetch("http://localhost:5000/api/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email, password }),
});
const data = await res.json();   // { token, user }

// later, a protected request — send the token
await fetch("http://localhost:5000/api/products", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${data.token}`,   // proves who we are
  },
  body: JSON.stringify({ name: "Shoes", price: 999 }),
});
```

That `Authorization: Bearer ...` header is exactly what the `protect` middleware reads. This is how your two folders (frontend + backend) connect.

---

## 13. Error Handling (one central place)

Instead of repeating try/catch everywhere, add a global error handler at the **end** of `server.js`:

```js
// Handle unknown routes
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Global error handler (must have 4 arguments)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || "Server error" });
});
```

---

## 14. Final Project Structure

```
my-backend/
├── server.js                 ← app setup, DB connect, mount routes
├── .env                      ← MONGO_URI, JWT_SECRET, PORT (never commit)
├── package.json
├── models/
│   ├── User.js
│   └── Product.js
├── controllers/
│   ├── authController.js     ← signup, login, getMe
│   └── productController.js  ← CRUD
├── routes/
│   ├── authRoutes.js
│   └── productRoutes.js
└── middleware/
    └── auth.js               ← protect, authorize
```

---

## 15. Quick Reference

```js
// Mongoose CRUD
Model.create(data)                       // create
Model.find()                             // all
Model.findById(id)                       // one by id
Model.findOne({ email })                 // one by field
Model.findByIdAndUpdate(id, data, { new: true })
Model.findByIdAndDelete(id)

// Auth
bcrypt.hash(password, 10)                // hash a password
bcrypt.compare(plain, hashed)            // check a password
jwt.sign(payload, secret, { expiresIn })// make a token
jwt.verify(token, secret)               // read/validate a token

// Express
app.use(express.json())                  // read JSON bodies
router.get/post/put/delete(path, ...mw, controller)
req.body / req.params.id / req.headers.authorization / req.user
res.status(code).json(data)
```

---

## 16. Checklist

- [ ] Explain what Node.js and Express do.
- [ ] Set up a project and run an Express server.
- [ ] Understand REST methods mapped to CRUD.
- [ ] Connect to MongoDB with Mongoose.
- [ ] Define a Schema and Model with validation.
- [ ] Build all five CRUD endpoints.
- [ ] Send correct status codes.
- [ ] Hash passwords with bcrypt (signup) and verify them (login).
- [ ] Create and verify JWT tokens.
- [ ] Write `protect` middleware (authentication).
- [ ] Write `authorize(role)` middleware (authorization).
- [ ] Apply middleware to protect routes.
- [ ] Connect the frontend with the `Authorization` header.

---

## 17. Practice Task 🏋️

Build a **Notes API**:

1. Set up the project (express, mongoose, bcryptjs, jsonwebtoken, dotenv).
2. Create a `User` model and `signup` / `login` with hashed passwords + JWT.
3. Create a `Note` model (`title`, `content`, `createdBy`).
4. Build full CRUD for notes.
5. Add `protect` so only logged-in users can create/read/update/delete.
6. Make sure a user can only edit/delete **their own** notes (check `note.createdBy` against `req.user._id`).
7. Add an `admin` role that can delete **any** note using `authorize("admin")`.
8. Test everything with Postman or Thunder Client.

Finish this and you can build the backend for a real app — then connect it to your Next.js frontend. 🎉

---

**Golden rule:** hash every password, never trust the client, and put your security in **middleware** so it's applied consistently. Authentication answers *"who are you?"*; authorization answers *"are you allowed?"*.
