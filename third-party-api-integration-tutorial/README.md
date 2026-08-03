# Third-Party API Integration with Google Gemini AI — Full Beginner Tutorial (MERN)

Learn how to add a **third-party API** to your MERN app using **Google Gemini (AI) API** as the real example — and use it in your **own profile page** (AI-generated bio, AI assistant, smart suggestions).

Every code block is followed by a **🔍 Code Explanation** section that explains *what each line does* and ***why* we wrote it that way**. The same pattern works for *any* third-party API (weather, payment, movies, etc.).

---

## Table of Contents

1. [What is a Third-Party API? What is Gemini?](#1-what-is-a-third-party-api-what-is-gemini)
2. [The Golden Rule: Where to Call the API](#2-the-golden-rule-where-to-call-the-api)
3. [Step 1: Get Your Free Gemini API Key](#3-step-1-get-your-free-gemini-api-key)
4. [Step 2: Test the API Before Writing Code](#4-step-2-test-the-api-before-writing-code)
5. [Step 3: Backend Setup (Node.js + Express)](#5-step-3-backend-setup-nodejs--express)
6. [Step 4: Call Gemini from Node.js](#6-step-4-call-gemini-from-nodejs)
7. [Step 5: Use Gemini in Your Own Profile (3 Real Features)](#7-step-5-use-gemini-in-your-own-profile-3-real-features)
8. [Step 6: Frontend (React) — Profile Page with AI](#8-step-6-frontend-react--profile-page-with-ai)
9. [Step 7: Loading, Error & Empty States](#9-step-7-loading-error--empty-states)
10. [Step 8: Rate Limits, Caching & Cost Safety](#10-step-8-rate-limits-caching--cost-safety)
11. [Bonus: Streaming Responses (ChatGPT-style typing)](#11-bonus-streaming-responses-chatgpt-style-typing)
12. [Common Errors & Fixes](#12-common-errors--fixes)
13. [References](#13-references)

---

## 1. What is a Third-Party API? What is Gemini?

A **third-party API** is a service made by someone else that your app calls over HTTP to get data or perform actions.

**Google Gemini API** is Google's AI model API. You send it text (a "prompt"), it sends back an AI-generated answer as JSON:

```
You send:    "Write a short bio for a MERN developer named Rahim"
Gemini says: "Rahim is a passionate MERN stack developer who loves building..."
```

Why Gemini is perfect for learning third-party APIs:

- ✅ **Free tier** — no credit card needed
- ✅ Needs an **API key** → you learn the secure key-handling pattern
- ✅ Instantly useful features (AI bio, chatbot, suggestions)

---

## 2. The Golden Rule: Where to Call the API

| Approach | When | Risk |
|---|---|---|
| React → Gemini directly | Never for real apps | ❌ Your key is visible to everyone |
| React → **Your Node server** → Gemini | Always | ✅ Key stays secret on the server |

> ⚠️ **Never put an API key in React code.**

**Why?** Everything in your React app is downloaded to the visitor's browser. Anyone can open DevTools → Sources and read your JavaScript — including any key inside it. Even `VITE_`/`NEXT_PUBLIC_` env variables get **baked into the public bundle at build time**; they only hide the key from your Git repo, not from users. If your key leaks, strangers can burn through your quota (or your money).

So the flow is:

```
[React Profile Page] → [Your Express Server (key lives here)] → [Gemini API]
                                        ↓
                                    [MongoDB]
```

**Why this "proxy" pattern is the professional standard:** the browser only ever talks to *your* server. Your server holds the secret, adds it to the request, forwards it to Gemini, and returns a clean result. You also get one central place to add caching, rate limiting, and error handling.

---

## 3. Step 1: Get Your Free Gemini API Key

1. Go to **Google AI Studio**: <https://aistudio.google.com/>
2. Sign in with your Google account.
3. Click **"Get API key"** → **"Create API key"**.
4. Copy the key (looks like `AIzaSy...`). You'll only put it in the server's `.env`.

Free tier limits (check current numbers at <https://ai.google.dev/pricing>): enough requests per minute/day for learning and small projects.

---

## 4. Step 2: Test the API Before Writing Code

**Always test a third-party API raw before integrating it.** Why? If the raw call fails, you know the problem is your key or the request format — not your code. Debugging becomes 10x easier.

```bash
curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent" \
  -H "Content-Type: application/json" \
  -H "x-goog-api-key: YOUR_API_KEY" \
  -d '{
    "contents": [{ "parts": [{ "text": "Say hello in one sentence" }] }]
  }'
```

### 🔍 Code Explanation

| Part | What it does | Why |
|---|---|---|
| The URL | Gemini's REST endpoint; `gemini-2.5-flash` in the path picks the model | Different models = different speed/quality/cost. Flash is fast and free-tier friendly |
| `-H "Content-Type: application/json"` | Tells the server the body is JSON | APIs reject bodies they can't identify |
| `-H "x-goog-api-key: ..."` | Sends your key in a header | This is how Google knows the request is yours (authentication) |
| `-d '{ "contents": ... }'` | The request body — your prompt wrapped in Gemini's required structure | Every API defines its own body shape; you must follow their docs exactly |

Response shape (this is what you'll parse):

```json
{
  "candidates": [
    {
      "content": {
        "parts": [{ "text": "Hello there, hope you're having a great day!" }]
      }
    }
  ]
}
```

The answer text lives at: `candidates[0].content.parts[0].text`

**Why so nested?** Gemini can return multiple alternative answers (`candidates`) and multi-part answers (text + images), so the format supports more than plain text. You usually only need the first candidate's first part.

---

## 5. Step 3: Backend Setup (Node.js + Express)

```bash
mkdir server && cd server
npm init -y
npm install express cors dotenv mongodb @google/genai
```

### 🔍 Why each package?

| Package | Why we need it |
|---|---|
| `express` | Web framework — lets us define API routes like `/api/ask-ai` |
| `cors` | Browsers block requests between different origins (localhost:5173 → localhost:5000). This middleware allows it |
| `dotenv` | Loads `.env` file values into `process.env` so secrets stay out of code |
| `mongodb` | Database driver — we'll save AI results into user profiles |
| `@google/genai` | Google's official Gemini SDK — writes the HTTP calls for us |

`.env`:

```env
PORT=5000
DB_URI=mongodb://localhost:27017/profileDB
GEMINI_API_KEY=AIzaSy_your_key_here
```

**Why a `.env` file?** Code goes to GitHub; secrets must not. `.env` keeps configuration separate from code, and each developer/server can have their own values without editing code.

`.gitignore`:

```
node_modules
.env
```

**Why?** `node_modules` is huge and re-creatable with `npm install`. `.env` contains secrets — committing it leaks your key to anyone who sees the repo.

Basic `index.js`:

```js
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient } = require("mongodb");
const { GoogleGenAI } = require("@google/genai");

const app = express();
app.use(cors());
app.use(express.json());

const client = new MongoClient(process.env.DB_URI);
const userCollection = client.db("profileDB").collection("users");

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);
```

### 🔍 Code Explanation — line by line

```js
require("dotenv").config();
```
Reads `.env` and puts values into `process.env`. **Must run before** any line that uses `process.env.X` — that's why it's at the top. Forgetting this = `undefined` keys (the #1 beginner bug).

```js
app.use(cors());
```
Middleware that adds CORS headers to every response. **Why:** without it, the browser blocks your React app's requests with a CORS error. (In production, restrict it: `cors({ origin: "https://yoursite.com" })` — so only *your* frontend can call your server.)

```js
app.use(express.json());
```
Parses incoming JSON bodies so `req.body` works. **Why:** without it, `req.body` is `undefined` and every POST breaks.

```js
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
```
Creates ONE Gemini client for the whole app, reading the key from env. **Why once at the top, not inside each route:** creating it once is cleaner and avoids repeating the key logic in every endpoint.

---

## 6. Step 4: Call Gemini from Node.js

### 6.1 Simplest possible endpoint

```js
app.post("/api/ask-ai", async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).send({ error: "Prompt is required" });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    res.send({ answer: response.text });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "AI request failed. Try again." });
  }
});
```

### 🔍 Code Explanation — line by line

```js
app.post("/api/ask-ai", async (req, res) => {
```
- **Why POST, not GET?** We're sending a body (the prompt). GET requests shouldn't carry bodies, and prompts can be long.
- **Why `async`?** Calling Gemini takes 1–5 seconds. `async/await` lets Node handle other users while waiting instead of freezing.

```js
const { prompt } = req.body;
if (!prompt) return res.status(400).send({ error: "Prompt is required" });
```
- Destructures the prompt from the request body.
- **Why validate first?** If the frontend sends nothing, we fail fast with a clear `400 Bad Request` instead of wasting a Gemini call (which costs quota) on an empty prompt. **Never trust input from the client.**

```js
const response = await ai.models.generateContent({
  model: "gemini-2.5-flash",
  contents: prompt,
});
```
- The actual API call. `await` pauses this request (only this one) until Gemini answers.
- **Why `gemini-2.5-flash`?** It's the fast, cheap model — ideal for free tier. Bigger models (`pro`) are smarter but slower and eat quota faster.

```js
res.send({ answer: response.text });
```
- **Why reshape to `{ answer }` instead of sending Gemini's raw response?** Two reasons: (1) the frontend gets a tiny, clean payload; (2) if Google ever changes their response format, you fix it *here in one place* — none of your React code breaks. This is called **decoupling**, and it's a habit that marks professional code.

```js
} catch (err) {
  console.error(err);
  res.status(500).send({ error: "AI request failed. Try again." });
}
```
- **Why try/catch?** Network calls fail: rate limits, outages, bad keys. Without catch, one failure crashes the request with an ugly stack trace.
- **Why `console.error` the real error but send a generic message?** You (developer) need details in the server log; the user doesn't — and raw error objects can leak internal info (paths, key fragments). Log the truth, send a friendly summary.

### 6.2 Alternative: no SDK, plain fetch (know what's under the hood)

```js
const r = await fetch(
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": process.env.GEMINI_API_KEY,
    },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
    }),
  }
);
const data = await r.json();
const answer = data.candidates[0].content.parts[0].text;
```

### 🔍 Code Explanation

This does *exactly* what the SDK does internally — the SDK is just a convenience wrapper. **Why show both?** So you understand there's no magic: every SDK in every language ultimately makes an HTTP request like this. If a language has no SDK, you can always integrate any API with raw HTTP. Note `JSON.stringify` — `fetch` needs the body as a string, not a JS object.

---

## 7. Step 5: Use Gemini in Your Own Profile (3 Real Features)

### Feature A: AI-Generated Bio ✍️

User enters skills → Gemini writes their profile bio → save to MongoDB.

```js
app.post("/api/profile/generate-bio", async (req, res) => {
  try {
    const { email, name, skills, experience } = req.body;

    const prompt = `Write a professional, friendly 3-sentence profile bio for a developer.
Name: ${name}
Skills: ${skills}
Experience: ${experience}
Rules: first person, no hashtags, no emojis, max 60 words.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const bio = response.text.trim();

    await userCollection.updateOne(
      { email },
      { $set: { bio, bioGeneratedAt: new Date() } },
      { upsert: true }
    );

    res.send({ bio });
  } catch (err) {
    res.status(500).send({ error: "Bio generation failed" });
  }
});
```

### 🔍 Code Explanation

**The prompt (template literal):**
```js
const prompt = `Write a professional... Name: ${name} ... Rules: ... max 60 words.`;
```
- We inject the user's real data (`${name}`, `${skills}`) into the prompt — this is how AI output becomes *personalized*.
- **Why the "Rules" line?** AI models follow instructions you give them. Without rules you get random length, hashtags, emojis. With explicit constraints (tone, length, format) the output is consistent enough to put on a real profile. **Vague prompt = messy output. Specific prompt = usable output.**

**Saving to MongoDB:**
```js
await userCollection.updateOne(
  { email },                                        // 1. find user by email
  { $set: { bio, bioGeneratedAt: new Date() } },    // 2. set/overwrite these fields
  { upsert: true }                                  // 3. create the doc if it doesn't exist
);
```
- **Why save the bio at all?** So you *don't* call Gemini every time someone views the profile. AI calls are slow and limited; database reads are fast and unlimited. **Generate once, read many times** — this is caching in its simplest form.
- **Why `updateOne` + `$set` and not `insertOne`?** The user probably already exists — we only want to update two fields without touching the rest of their document.
- **Why `upsert: true`?** "Update if exists, insert if not" — one line handles both new and existing users.
- **Why store `bioGeneratedAt`?** Later you can show "generated 3 days ago" or auto-refresh old bios.

### Feature B: AI Skill Suggestions 📈

```js
app.get("/api/profile/skill-suggestions/:email", async (req, res) => {
  const user = await userCollection.findOne({ email: req.params.email });
  if (!user) return res.status(404).send({ error: "User not found" });

  const prompt = `A developer knows: ${user.skills}.
Suggest exactly 3 next skills to learn.
Reply ONLY with a JSON array of strings, like ["skill1","skill2","skill3"]. No other text.`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });

  const clean = response.text.replace(/```json|```/g, "").trim();
  res.send({ suggestions: JSON.parse(clean) });
});
```

### 🔍 Code Explanation

```js
app.get("/api/profile/skill-suggestions/:email", ...)
```
- **Why GET this time?** We're not sending a body — the email travels in the URL (`req.params.email`). GET = "give me data", POST = "here's data, do something with it".

```js
const user = await userCollection.findOne({ email: req.params.email });
if (!user) return res.status(404).send({ error: "User not found" });
```
- We read the user's skills **from our own database**, not from the request. **Why?** The client could lie; the database is our source of truth. Also, the frontend now only needs to send an email — simpler API.

```js
Reply ONLY with a JSON array of strings ... No other text.
```
- **Why beg for JSON?** We want to `JSON.parse` the answer and render a list. If Gemini replies with a paragraph, parsing fails. Telling the model the exact output format (with an example!) is the standard trick for machine-readable AI output.

```js
const clean = response.text.replace(/```json|```/g, "").trim();
```
- **Why strip code fences?** Even when told not to, AI models often wrap JSON in ` ```json ... ``` ` markdown fences. `JSON.parse` would crash on those characters. This regex removes them defensively. **Lesson: never trust AI output format 100% — sanitize before parsing.**

### Feature C: Profile AI Assistant (chat with context) 💬

```js
app.post("/api/profile/assistant", async (req, res) => {
  const { email, question } = req.body;
  const user = await userCollection.findOne({ email });

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `You are a career assistant on ${user.name}'s developer profile.
Their skills: ${user.skills}. Their bio: ${user.bio}.
Answer the user's question helpfully in under 100 words.

Question: ${question}`,
  });

  res.send({ answer: response.text });
});
```

### 🔍 Code Explanation

- **Line 1 of the prompt gives the AI a role** ("You are a career assistant"). Why: role-setting steers tone and topic — the model stays on-subject instead of answering like a generic chatbot.
- **Lines 2–3 inject context** (the user's skills and bio from *our database*). Why: Gemini knows nothing about your users. Whatever personal context you want it to use, **you** must put in the prompt. This technique — fetch data, inject into prompt — is the foundation of every "AI that knows your data" feature (it's baby RAG: Retrieval-Augmented Generation).
- **"under 100 words"** keeps answers chat-sized and saves tokens (tokens = quota/cost).

---

## 8. Step 6: Frontend (React) — Profile Page with AI

```jsx
// Profile.jsx
import { useEffect, useState } from "react";

const API = "http://localhost:5000";

const Profile = ({ email }) => {
  const [user, setUser] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${API}/api/users/${email}`)
      .then((r) => r.json())
      .then(setUser)
      .catch(() => setError("Failed to load profile"));
  }, [email]);

  const handleGenerateBio = async () => {
    setGenerating(true);
    setError("");
    try {
      const res = await fetch(`${API}/api/profile/generate-bio`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          name: user.name,
          skills: user.skills,
          experience: user.experience,
        }),
      });
      if (!res.ok) throw new Error();
      const { bio } = await res.json();
      setUser({ ...user, bio });
    } catch {
      setError("AI is busy — try again in a moment.");
    } finally {
      setGenerating(false);
    }
  };

  const handleSuggestions = async () => {
    const res = await fetch(`${API}/api/profile/skill-suggestions/${email}`);
    const data = await res.json();
    setSuggestions(data.suggestions || []);
  };

  if (!user) return <p>Loading profile...</p>;

  return (
    <div className="profile-card">
      <h1>{user.name}</h1>
      <p>Skills: {user.skills}</p>

      <section>
        <h3>Bio</h3>
        <p>{user.bio || "No bio yet — let AI write one!"}</p>
        <button onClick={handleGenerateBio} disabled={generating}>
          {generating ? "✨ Generating..." : "✨ Generate Bio with AI"}
        </button>
      </section>

      <section>
        <h3>What should I learn next?</h3>
        <button onClick={handleSuggestions}>Ask AI</button>
        <ul>
          {suggestions.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
      </section>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default Profile;
```

### 🔍 Code Explanation — the important parts

**Four pieces of state:**
```js
const [user, setUser] = useState(null);          // profile data from OUR database
const [generating, setGenerating] = useState(false); // is an AI call running?
const [suggestions, setSuggestions] = useState([]);  // AI skill list
const [error, setError] = useState("");             // user-friendly error text
```
**Why separate states?** Each represents an independent thing that can change; mixing them into one object makes updates error-prone for beginners. `generating` deserves special attention — AI calls take seconds, and the UI must reflect "work in progress".

```js
useEffect(() => { fetch(...) }, [email]);
```
- Loads the profile once when the component mounts (and again if `email` changes — that's what the dependency array means).
- **Why does it fetch from our DB and not Gemini?** The bio was already generated and saved. Page views should be instant and free.

```js
setGenerating(true);
...
<button onClick={handleGenerateBio} disabled={generating}>
```
- **Why disable the button while generating?** (1) Prevents double clicks → double Gemini calls → wasted quota; (2) tells the user something is happening. Rule: *any* button that triggers a paid/slow API call must be disabled while pending.

```js
if (!res.ok) throw new Error();
```
- **Why check `res.ok`?** `fetch` does NOT throw on HTTP errors like 429 or 500 — it only throws on network failure. Without this check, your code would try to read a bio from an error response. Classic beginner trap.

```js
setUser({ ...user, bio });
```
- **Why spread (`...user`)?** React state must be replaced, not mutated. `{ ...user, bio }` copies the old object and overwrites just `bio` — React sees a new object and re-renders. Writing `user.bio = bio` would NOT trigger a re-render.

```js
} finally {
  setGenerating(false);
}
```
- **Why `finally`?** Whether the call succeeded or failed, the spinner must stop. Putting it only after success would leave the button stuck on "Generating..." forever after an error.

```js
setSuggestions(data.suggestions || []);
```
- **Why `|| []`?** If the server returned an error object, `data.suggestions` is `undefined`, and calling `.map()` on `undefined` crashes React. Defaulting to an empty array keeps the UI alive. **Defensive coding: assume responses can be malformed.**

Simple assistant chat box:

```jsx
// AssistantBox.jsx
import { useState } from "react";

const AssistantBox = ({ email }) => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const ask = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("http://localhost:5000/api/profile/assistant", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, question }),
    });
    const data = await res.json();
    setAnswer(data.answer);
    setLoading(false);
  };

  return (
    <div>
      <form onSubmit={ask}>
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask about my skills, career advice..."
        />
        <button disabled={loading}>{loading ? "Thinking..." : "Ask"}</button>
      </form>
      {answer && <p>🤖 {answer}</p>}
    </div>
  );
};

export default AssistantBox;
```

### 🔍 Code Explanation

- `e.preventDefault()` — stops the browser's default form submit (full page reload), which would wipe your React state. Needed in every React form.
- `value={question}` + `onChange` — a **controlled input**: React state is the single source of truth for the field. This lets you clear/validate/reuse the value programmatically.
- `{answer && <p>...}` — **conditional rendering**: only show the answer paragraph if there is one. Cleaner than showing an empty box.

---

## 9. Step 7: Loading, Error & Empty States

AI APIs are **slow** (1–5 seconds) compared to normal APIs, so states matter even more:

1. **Loading** — always disable the button + show "Generating...". **Why:** prevents duplicate quota-burning clicks and reassures the user.
2. **Error** — Gemini can return 429 (too many requests) or 503 (overloaded). Show "AI is busy, try again" — never a blank screen. **Why:** blank screens make users refresh and retry harder, making rate limits worse.
3. **Empty** — "No bio yet — let AI write one!" **Why:** an empty section looks broken; an invitation drives the feature's usage.

---

## 10. Step 8: Rate Limits, Caching & Cost Safety

The free tier has per-minute and per-day request limits. Protect yourself:

**1. Cache AI results.** The bio doesn't need regenerating on every page view — that's why we save it to MongoDB and only call Gemini on button click. **Why this matters:** 1 generation + 1000 profile views = 1 API call, not 1001.

**2. Debounce/disable buttons** while a request is running (done above).

**3. Add a simple per-user cooldown on the server:**

```js
const lastCall = new Map();

const aiCooldown = (req, res, next) => {
  const key = req.body.email || req.ip;
  const last = lastCall.get(key) || 0;
  if (Date.now() - last < 10_000) {
    return res.status(429).send({ error: "Please wait 10 seconds between AI requests" });
  }
  lastCall.set(key, Date.now());
  next();
};

app.post("/api/profile/generate-bio", aiCooldown, async (req, res) => { /* ... */ });
```

### 🔍 Code Explanation

- `new Map()` stores `email → timestamp of last AI call` **in server memory**. Why a Map and not the DB? It's throwaway data — losing it on restart is fine, and memory is much faster.
- The middleware runs **before** the route handler (that's what `app.post(path, aiCooldown, handler)` means — Express runs them left to right). If the same user called within 10 seconds, we reject with `429` and **never touch Gemini**.
- **Why do this on the server when the button is already disabled?** Because the frontend can be bypassed — anyone can spam your endpoint with curl/Postman. **Frontend checks are for UX; server checks are for security.** Always enforce limits server-side.

**4. Handle 429 from Gemini gracefully:**

```js
catch (err) {
  if (err.status === 429) {
    return res.status(429).send({ error: "Rate limit hit — wait a minute." });
  }
  res.status(500).send({ error: "AI request failed" });
}
```

**Why distinguish 429 from other errors?** 429 means "slow down, try later" — the user can fix it by waiting. 500 means something is broken. Different problems deserve different messages.

**5. Key leaked to GitHub?** Delete it in AI Studio and create a new one immediately. **Why isn't deleting the commit enough?** Bots scan GitHub for keys within seconds of a push, and Git history/forks keep copies. Rotation is the only real fix.

---

## 11. Bonus: Streaming Responses (ChatGPT-style typing)

Instead of waiting 5 seconds for the full answer, show words as they arrive:

```js
// Server
app.post("/api/ask-ai-stream", async (req, res) => {
  res.setHeader("Content-Type", "text/plain; charset=utf-8");

  const stream = await ai.models.generateContentStream({
    model: "gemini-2.5-flash",
    contents: req.body.prompt,
  });

  for await (const chunk of stream) {
    res.write(chunk.text);
  }
  res.end();
});
```

```jsx
// Client
const res = await fetch("http://localhost:5000/api/ask-ai-stream", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ prompt }),
});

const reader = res.body.getReader();
const decoder = new TextDecoder();
let text = "";

while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  text += decoder.decode(value);
  setAnswer(text); // UI updates as words arrive ✨
}
```

### 🔍 Code Explanation

**Server side:**
- `generateContentStream` (instead of `generateContent`) makes Gemini return the answer in **chunks** as it generates, not all at once.
- `for await (const chunk of stream)` — an async loop that wakes up each time a new chunk arrives.
- `res.write(chunk.text)` sends each chunk to the browser immediately, **without closing the connection**; `res.end()` closes it when done. (Compare: `res.send` writes AND closes in one go — useless for streaming.)

**Client side:**
- `res.body.getReader()` gives low-level access to the response as it downloads, instead of waiting for the whole body like `res.json()` does.
- `TextDecoder` converts the raw bytes (`Uint8Array`) of each chunk into a string.
- `text += ...; setAnswer(text)` — we accumulate and re-render on every chunk, producing the "typing" effect.

**Why bother?** Perceived speed. Total time is the same, but users see progress within ~300ms instead of staring at a spinner for 5s. Every serious AI product streams.

---

## 12. Common Errors & Fixes

| Error | Cause | Fix |
|---|---|---|
| `400 API key not valid` | Wrong/typo'd key | Re-copy from AI Studio; restart server after editing `.env` |
| `process.env.GEMINI_API_KEY` is `undefined` | dotenv not loaded / wrong folder | `require("dotenv").config()` at the top; `.env` beside `package.json` |
| `429 RESOURCE_EXHAUSTED` | Free-tier rate limit | Wait, cache results, add cooldown (Step 8) |
| `503 model overloaded` | Gemini busy | Retry after a few seconds; show friendly message |
| `404 model not found` | Old/wrong model name | Use a current model like `gemini-2.5-flash`; check <https://ai.google.dev/gemini-api/docs/models> |
| `JSON.parse` fails on suggestions | Gemini wrapped JSON in \`\`\`json fences | Strip fences first: `.replace(/```json\|```/g, "")` |
| CORS error in React | cors middleware missing | `app.use(cors())` on server |
| Key visible in browser DevTools | Key placed in React code | Move all Gemini calls to the Node server (Step 3) |
| Empty `response.text` | Response blocked by safety filters | Check `response.candidates[0].finishReason`; rephrase prompt |
| `req.body` is `undefined` | Missing JSON parser | Add `app.use(express.json())` before routes |

---

## 13. References

- Gemini API Quickstart (Node.js): <https://ai.google.dev/gemini-api/docs/quickstart>
- Get API key (Google AI Studio): <https://aistudio.google.com/>
- `@google/genai` SDK on npm: <https://www.npmjs.com/package/@google/genai>
- Gemini models list: <https://ai.google.dev/gemini-api/docs/models>
- Pricing & free-tier limits: <https://ai.google.dev/pricing>
- Text generation guide: <https://ai.google.dev/gemini-api/docs/text-generation>
- Streaming docs: <https://ai.google.dev/gemini-api/docs/text-generation#streaming>
- Prompt design guide: <https://ai.google.dev/gemini-api/docs/prompting-strategies>
- Express docs: <https://expressjs.com>
- MDN Fetch API: <https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API>
- MDN Streams (for the bonus): <https://developer.mozilla.org/en-US/docs/Web/API/Streams_API>

---

*Pattern to remember: **React → your server (key lives here) → Gemini → clean JSON → profile page → cache in MongoDB.*** 🚀
