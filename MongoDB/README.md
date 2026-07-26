# MongoDB — Complete Beginner Tutorial

MongoDB is a **database** — a place to store your app's data (users, posts, orders...) so it's saved permanently and can be searched. This guide starts from zero: what a database is, how MongoDB stores data, how to set it up, and how to read/write data both in the Mongo shell and from Node.js with Mongoose.

---

## 1. What is a Database? (and why MongoDB)

When your app closes, normal variables disappear. A **database** keeps data safe on disk so it's still there tomorrow. Every real app (Instagram, Amazon, your blog) uses one.

**MongoDB** is a popular **NoSQL** database. Instead of tables with rows and columns (like Excel / SQL), MongoDB stores data as **documents** that look just like JavaScript objects / JSON.

A document:
```json
{
  "name": "Sara Khan",
  "age": 28,
  "email": "sara@example.com",
  "hobbies": ["coding", "reading"]
}
```

If you know JavaScript objects, you already understand MongoDB documents. That's why it pairs so well with Node.js and the MERN stack.

---

## 2. SQL vs NoSQL (the words)

| SQL (e.g. MySQL) | MongoDB (NoSQL) |
|------------------|------------------|
| Table | **Collection** |
| Row | **Document** |
| Column | **Field** |
| Rigid schema (fixed columns) | Flexible (documents can differ) |
| Uses SQL language | Uses JavaScript-like queries |

You don't need SQL to learn MongoDB. Just remember: **database → collections → documents → fields.**

---

## 3. The Core Concepts

```
Database:  "blogApp"
   │
   ├── Collection: "users"        (like a folder of user documents)
   │     ├── Document: { name: "Sara", email: "sara@x.com" }
   │     └── Document: { name: "Aman", email: "aman@x.com" }
   │
   └── Collection: "posts"
         ├── Document: { title: "Hello", author: "Sara" }
         └── Document: { title: "World", author: "Aman" }
```

- A **database** holds many collections.
- A **collection** holds many documents (all the same *kind* of thing, e.g. all users).
- A **document** is one record (one user, one post).
- Each field is a `key: value` pair.

### The special `_id` field
Every document automatically gets a unique **`_id`** (a long value called an ObjectId, e.g. `507f1f77bcf86cd799439011`). It's like a fingerprint — no two documents share one. You use it to find, update, or delete a specific document.

---

## 4. Setup — Get a MongoDB (pick one)

### Option A — MongoDB Atlas (free cloud database) ✅ easiest
No installation; your database lives online.

1. Go to **https://www.mongodb.com/atlas** → sign up.
2. Create a **free (M0) cluster** (pick any cloud/region).
3. **Database Access** → add a database user (username + password) — remember these.
4. **Network Access** → **Add IP Address** → "Allow access from anywhere" (`0.0.0.0/0`) for learning.
5. **Connect** → **Drivers** → copy the **connection string**. It looks like:
```
mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/myDatabase
```
Replace `USERNAME`/`PASSWORD` with the ones you made. You'll paste this string into your Node app.

### Option B — Local MongoDB (on your computer)
1. Install **MongoDB Community Server** from https://www.mongodb.com/try/download/community.
2. Your connection string is: `mongodb://127.0.0.1:27017/myDatabase`.

### Also install: MongoDB Compass (visual tool) — highly recommended
**Compass** (https://www.mongodb.com/products/compass) is a free app that lets you **see** your databases, collections, and documents with clicks — great for beginners to watch what's happening. Connect it using the same connection string.

---

## 5. Basic MongoDB Commands (the shell)

You can run these in **`mongosh`** (the Mongo shell) or in Compass's shell. This shows the raw MongoDB commands — later we'll do the same from Node.js.

```js
show dbs                     // list all databases
use blogApp                  // switch to (and create) a database called blogApp
show collections             // list collections in the current database
```

---

## 6. CRUD in MongoDB ⭐ (Create, Read, Update, Delete)

CRUD = the four things you do with data. Here's each one in the shell.

### CREATE — add documents
```js
// insert ONE document
db.users.insertOne({ name: "Sara", age: 28, email: "sara@x.com" })

// insert MANY at once
db.users.insertMany([
  { name: "Aman", age: 25 },
  { name: "Priya", age: 30 }
])
```

### READ — find documents
```js
db.users.find()                       // all users
db.users.find({ name: "Sara" })       // only where name is "Sara"
db.users.findOne({ email: "sara@x.com" })  // just the first match
```

Filters are just objects: `{ field: value }` means "where field equals value."

### UPDATE — change documents
```js
// change one document. $set updates specific fields.
db.users.updateOne(
  { name: "Sara" },          // which document(s) to match
  { $set: { age: 29 } }      // what to change
)

// update many at once
db.users.updateMany(
  { age: { $lt: 18 } },
  { $set: { minor: true } }
)
```
> Always use `$set` — without it, MongoDB would replace the WHOLE document.

### DELETE — remove documents
```js
db.users.deleteOne({ name: "Sara" })       // remove the first match
db.users.deleteMany({ age: { $lt: 18 } })  // remove all matches
```

---

## 7. Query Operators (searching with conditions)

Filters can do more than "equals." Operators start with `$`:

```js
db.users.find({ age: { $gt: 25 } })         // age greater than 25
db.users.find({ age: { $gte: 18 } })        // >= 18
db.users.find({ age: { $lt: 30 } })         // < 30
db.users.find({ age: { $lte: 65 } })        // <= 65
db.users.find({ name: { $ne: "Sara" } })    // NOT equal to Sara
db.users.find({ age: { $in: [25, 30, 35] } })  // age is one of these
```

| Operator | Means |
|----------|-------|
| `$gt` / `$gte` | greater than / or equal |
| `$lt` / `$lte` | less than / or equal |
| `$ne` | not equal |
| `$in` / `$nin` | in / not in a list |
| `$and` / `$or` | combine conditions |

Combine with `$or`:
```js
db.users.find({ $or: [{ age: { $lt: 18 } }, { age: { $gt: 60 } }] })
```

Useful extras:
```js
db.users.find().sort({ age: -1 })   // sort by age, -1 = descending, 1 = ascending
db.users.find().limit(5)            // only the first 5
db.users.countDocuments()           // how many documents
```

---

## 8. Using MongoDB from Node.js with Mongoose ⭐

In real apps you don't type shell commands — your Node.js backend talks to MongoDB. The easiest way is **Mongoose**, a library that adds structure and simple methods.

### Install and connect
```bash
npm install mongoose
```
```js
import mongoose from "mongoose";

await mongoose.connect("mongodb+srv://USER:PASS@cluster0.xxxxx.mongodb.net/blogApp");
console.log("Connected to MongoDB");
```
(The connection string comes from Atlas — Section 4.)

### Define a Schema and Model
A **Schema** describes what a document looks like. A **Model** is the tool you use to create/find/update/delete those documents.

```js
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  age: Number,
}, { timestamps: true });   // auto-adds createdAt & updatedAt

const User = mongoose.model("User", userSchema);
```

- `required: true` → the field must be provided.
- `unique: true` → no two documents can share this value.
- Mongoose turns the model name `"User"` into a collection called `users`.

### CRUD with Mongoose (same four actions, cleaner)
```js
// CREATE
const user = await User.create({ name: "Sara", email: "sara@x.com", age: 28 });

// READ
const all = await User.find();                       // everyone
const one = await User.findById("507f1f77...");      // by _id
const byEmail = await User.findOne({ email: "sara@x.com" });

// UPDATE (returns the updated document with { new: true })
await User.findByIdAndUpdate("507f1f77...", { age: 29 }, { new: true });

// DELETE
await User.findByIdAndDelete("507f1f77...");
```

These are `async` (they return Promises), so use `await`. This is exactly the pattern your Node.js blog backend uses for cards and users.

---

## 9. Relationships (linking documents)

Often one document refers to another — e.g. a post belongs to a user. You store the other document's `_id` and mark it with `ref`.

```js
const postSchema = new mongoose.Schema({
  title: String,
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // link to a User
});
const Post = mongoose.model("Post", postSchema);

// Create a post owned by a user
await Post.create({ title: "Hello", author: user._id });

// Fetch posts AND pull in the linked user's data with .populate()
const posts = await Post.find().populate("author");
// each post.author is now the full user object, not just the id
```

`populate()` is Mongoose replacing the stored id with the actual document it points to.

---

## 10. Data Types You Can Store

```js
{
  name: "Sara",                 // String
  age: 28,                      // Number
  isAdmin: false,               // Boolean
  hobbies: ["code", "read"],    // Array
  address: { city: "Delhi" },   // Nested object
  createdAt: new Date(),        // Date
  _id: ObjectId("...")          // ObjectId (the unique id)
}
```

Documents can even have different fields from each other — MongoDB is flexible. (In practice, a Mongoose Schema keeps them consistent.)

---

## 11. Best Practices for Beginners

- **Keep your connection string secret** — put it in a `.env` file, never in code you share or push to GitHub.
- **One model per file** (e.g. `User.js`, `Post.js`).
- **Let Mongoose validate** (`required`, `unique`, types) instead of checking everything by hand.
- **Use `_id`** to target a specific document for update/delete.
- **Watch your data in Compass** while learning — seeing documents appear/change makes it click.

---

## 12. Common Beginner Questions

**Do I need to create the database/collection first?** No — MongoDB creates them automatically the first time you insert a document.

**What's the difference between `find` and `findOne`?** `find` returns an array of all matches; `findOne` returns just the first matching document (or `null`).

**Why is my update replacing the whole document?** In the shell you forgot `$set`. In Mongoose, `findByIdAndUpdate` handles this for you.

**SQL or MongoDB — which should I learn?** For the MERN stack (what this course uses), MongoDB. Learn SQL later if a job needs it.

---

## 13. Practice 🏋️

Using Compass or `mongosh` (or a small Node script with Mongoose):

1. Create a database `practiceDB`.
2. Insert 3 users with `insertMany` (name + age).
3. Find all users older than 25.
4. Update one user's age with `$set`.
5. Sort users by age descending.
6. Delete one user.
7. In Node with Mongoose: define a `Task` model (`title`, `done`), create 2 tasks, fetch them all, mark one `done: true`, then delete it.

Finish this and you understand the database half of a full-stack app. Next, see the **Node.js** notes to build an API on top of it. 🎉

---

**Summary:** MongoDB stores data as JSON-like **documents** inside **collections** inside a **database**. The four actions are **CRUD** (insert / find / update / delete). Use **Atlas** for a free cloud database and **Compass** to see it. In real apps, connect with **Mongoose**: define a Schema + Model, then use `create` / `find` / `findByIdAndUpdate` / `findByIdAndDelete`.
