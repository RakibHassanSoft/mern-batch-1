# Google Login in Next.js with a Node.js Backend — Full Beginner Tutorial

A complete step-by-step guide to adding **"Sign in with Google"** to a **Next.js** app using **NextAuth.js (Auth.js)**, and securely connecting it to your own **Node.js/Express** backend + MongoDB.

---

## Table of Contents

1. [How Google Login Works (OAuth 2.0 in Plain English)](#1-how-google-login-works-oauth-20-in-plain-english)
2. [Architecture Overview](#2-architecture-overview)
3. [Step 1: Create Google OAuth Credentials](#3-step-1-create-google-oauth-credentials)
4. [Step 2: Create the Next.js App](#4-step-2-create-the-nextjs-app)
5. [Step 3: Install & Configure NextAuth.js](#5-step-3-install--configure-nextauthjs)
6. [Step 4: Build the Login UI](#6-step-4-build-the-login-ui)
7. [Step 5: Protect Pages (Client & Server)](#7-step-5-protect-pages-client--server)
8. [Step 6: Save the User to Your Node.js Backend](#8-step-6-save-the-user-to-your-nodejs-backend)
9. [Step 7: Secure Your Node.js API with JWT](#9-step-7-secure-your-nodejs-api-with-jwt)
10. [Step 8: Deploying (Env Vars & Redirect URIs)](#10-step-8-deploying-env-vars--redirect-uris)
11. [Common Errors & Fixes](#11-common-errors--fixes)
12. [References](#12-references)

---

## 1. How Google Login Works (OAuth 2.0 in Plain English)

Instead of storing passwords yourself, you let Google prove who the user is:

1. User clicks **"Sign in with Google"**.
2. Browser goes to Google's consent screen.
3. User approves → Google redirects back to your app with a temporary **code**.
4. Your app exchanges that code (server-side, using your **client secret**) for the user's **profile + tokens**.
5. Your app creates a **session** (cookie) so the user stays logged in.

You never see the user's Google password. 🔒

---

## 2. Architecture Overview

```
[Browser]
   │ 1. signIn("google")
   ▼
[Next.js + NextAuth]  ←──── 2. OAuth dance ────→  [Google]
   │ 3. session cookie created
   │ 4. On first login: POST user info + JWT
   ▼
[Node.js / Express API]  →  [MongoDB]
   (verifies JWT, stores user, serves protected data)
```

- **NextAuth.js** handles the entire OAuth flow inside Next.js — no manual token code.
- Your **Node.js API** stays a separate service (typical MERN batch setup) and trusts requests via a **JWT**.

---

## 3. Step 1: Create Google OAuth Credentials

1. Go to **Google Cloud Console**: <https://console.cloud.google.com/>
2. Create a new project (top bar → New Project → name it e.g. `my-login-app`).
3. Left menu → **APIs & Services → OAuth consent screen**
   - User type: **External** → Create
   - App name, support email, developer email → Save
   - Scopes: default (`email`, `profile`, `openid`) is enough
   - Test users: add your own Gmail while in testing mode
4. **APIs & Services → Credentials → + Create Credentials → OAuth client ID**
   - Application type: **Web application**
   - **Authorized JavaScript origins:**
     - `http://localhost:3000`
   - **Authorized redirect URIs:**
     - `http://localhost:3000/api/auth/callback/google`  ← exact path NextAuth uses
5. Click Create → copy the **Client ID** and **Client Secret**.

> ⚠️ The redirect URI must match **exactly** — including `http` vs `https` and no trailing slash. 90% of beginner errors come from this.

---

## 4. Step 2: Create the Next.js App

```bash
npx create-next-app@latest my-login-app
# Choose: TypeScript? No (this tutorial uses JS) · App Router? Yes · Tailwind? optional
cd my-login-app
npm install next-auth
```

Create `.env.local` in the project root:

```env
GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=generate_a_random_string_here
NEXT_PUBLIC_API_URL=http://localhost:5000
```

Generate a strong secret:

```bash
openssl rand -base64 32
# or in Node:
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

> `.env.local` is git-ignored by default in Next.js. Never commit secrets.

---

## 5. Step 3: Install & Configure NextAuth.js

### App Router (Next.js 13+): `app/api/auth/[...nextauth]/route.js`

```js
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  session: {
    strategy: "jwt", // stateless sessions stored in a signed cookie
  },
  callbacks: {
    // Runs whenever a JWT is created/updated
    async jwt({ token, account, profile }) {
      if (account) {
        token.provider = account.provider;
      }
      return token;
    },
    // Shapes what the client sees in useSession()
    async session({ session, token }) {
      session.user.id = token.sub; // Google's unique user id
      return session;
    },
    // Runs on every sign-in attempt — good place to sync with your backend
    async signIn({ user }) {
      try {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: user.name,
            email: user.email,
            image: user.image,
          }),
        });
      } catch (e) {
        console.error("Backend sync failed:", e);
        // return false to block login if backend save is mandatory
      }
      return true;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
```

### Wrap the app with the session provider

`app/providers.jsx`:

```jsx
"use client";
import { SessionProvider } from "next-auth/react";

export default function Providers({ children }) {
  return <SessionProvider>{children}</SessionProvider>;
}
```

`app/layout.jsx`:

```jsx
import Providers from "./providers";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

---

## 6. Step 4: Build the Login UI

`app/components/AuthButton.jsx`:

```jsx
"use client";
import { useSession, signIn, signOut } from "next-auth/react";

export default function AuthButton() {
  const { data: session, status } = useSession();

  if (status === "loading") return <p>Loading...</p>;

  if (session) {
    return (
      <div>
        <img src={session.user.image} alt="" width={40} style={{ borderRadius: "50%" }} />
        <span>Hi, {session.user.name}</span>
        <button onClick={() => signOut()}>Sign out</button>
      </div>
    );
  }

  return (
    <button onClick={() => signIn("google")}>
      Sign in with Google
    </button>
  );
}
```

Use it on the home page (`app/page.jsx`):

```jsx
import AuthButton from "./components/AuthButton";

export default function Home() {
  return (
    <main>
      <h1>My App</h1>
      <AuthButton />
    </main>
  );
}
```

Run it:

```bash
npm run dev
# open http://localhost:3000 and click "Sign in with Google" 🎉
```

---

## 7. Step 5: Protect Pages (Client & Server)

### Client-side protection

```jsx
"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") router.push("/");
  }, [status, router]);

  if (status === "loading") return <p>Loading...</p>;
  if (!session) return null;

  return <h1>Welcome to your dashboard, {session.user.name}!</h1>;
}
```

### Server-side protection (better — no flash of content)

```jsx
// app/dashboard/page.jsx (Server Component)
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/");

  return <h1>Welcome, {session.user.name}</h1>;
}
```

### Middleware protection (whole route groups)

`middleware.js` at project root:

```js
export { default } from "next-auth/middleware";

export const config = { matcher: ["/dashboard/:path*", "/profile/:path*"] };
```

---

## 8. Step 6: Save the User to Your Node.js Backend

Separate `server/` project:

```bash
mkdir server && cd server
npm init -y
npm install express cors dotenv mongodb jsonwebtoken
```

`server/.env`:

```env
PORT=5000
DB_URI=mongodb://localhost:27017/authDB
JWT_SECRET=another_long_random_string
```

`server/index.js`:

```js
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient } = require("mongodb");
const jwt = require("jsonwebtoken");

const app = express();
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

const client = new MongoClient(process.env.DB_URI);
const users = client.db("authDB").collection("users");

// Upsert user on login (called from NextAuth signIn callback)
app.put("/api/users", async (req, res) => {
  const { name, email, image } = req.body;
  if (!email) return res.status(400).send({ error: "Email required" });

  const result = await users.updateOne(
    { email },
    {
      $set: { name, image, lastLogin: new Date() },
      $setOnInsert: { email, role: "user", createdAt: new Date() },
    },
    { upsert: true }
  );
  res.send(result);
});

// Issue a JWT for the logged-in user
app.post("/api/jwt", async (req, res) => {
  const { email } = req.body;
  const token = jwt.sign({ email }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  res.send({ token });
});

app.listen(process.env.PORT, () =>
  console.log(`API running on port ${process.env.PORT}`)
);
```

---

## 9. Step 7: Secure Your Node.js API with JWT

### Middleware to verify tokens

```js
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization; // "Bearer <token>"
  if (!authHeader) return res.status(401).send({ error: "Unauthorized" });

  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).send({ error: "Forbidden" });
    req.user = decoded; // { email }
    next();
  });
};

// Protected route example
app.get("/api/profile", verifyToken, async (req, res) => {
  const user = await users.findOne({ email: req.user.email });
  res.send(user);
});
```

### Getting & using the JWT from Next.js

Fetch the token after login and attach it to API calls:

```jsx
"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function Profile() {
  const { data: session } = useSession();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (!session?.user?.email) return;

    const load = async () => {
      // 1. Get a JWT from your backend
      const jwtRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/jwt`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: session.user.email }),
      });
      const { token } = await jwtRes.json();

      // 2. Call protected route with it
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(await res.json());
    };
    load();
  }, [session]);

  if (!profile) return <p>Loading...</p>;
  return (
    <div>
      <h1>{profile.name}</h1>
      <p>{profile.email}</p>
      <p>Role: {profile.role}</p>
    </div>
  );
}
```

> 💡 In production, issue the JWT once at sign-in (inside the NextAuth `jwt` callback), store it in the NextAuth token, and expose it via the `session` callback — then you skip the extra `/api/jwt` round trip. The simple version above is easier to understand first.

---

## 10. Step 8: Deploying (Env Vars & Redirect URIs)

When you deploy (e.g., Next.js → Vercel, Node API → Render/Railway):

1. Add production env vars in the hosting dashboard (`GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL=https://yourapp.vercel.app`).
2. In Google Cloud Console → Credentials, add production URLs:
   - Origin: `https://yourapp.vercel.app`
   - Redirect URI: `https://yourapp.vercel.app/api/auth/callback/google`
3. Update CORS in Node: `cors({ origin: "https://yourapp.vercel.app" })`.
4. Publish the OAuth consent screen (move from Testing → Production) so any Google user can log in.

---

## 11. Common Errors & Fixes

| Error | Cause | Fix |
|---|---|---|
| `redirect_uri_mismatch` | Redirect URI in Google Console doesn't match exactly | Must be `http://localhost:3000/api/auth/callback/google` — check protocol, port, path, no trailing slash |
| `Access blocked: app not verified` | Consent screen in Testing mode, user not added | Add your Gmail as a Test user, or publish the app |
| `[next-auth][error][NO_SECRET]` | Missing `NEXTAUTH_SECRET` | Add it to `.env.local` and restart dev server |
| `useSession` returns nothing | `SessionProvider` missing | Wrap layout with the Providers component (Step 3) |
| Session lost on refresh | `NEXTAUTH_URL` wrong or cookies blocked | Set `NEXTAUTH_URL` correctly; use same domain |
| CORS error calling Node API | Origin not allowed | `cors({ origin: "http://localhost:3000" })` |
| 403 from protected route | JWT expired or wrong `JWT_SECRET` | Same secret on sign & verify; re-login to refresh token |
| Env var undefined in browser | Server-only var used in client code | Client-visible vars must start with `NEXT_PUBLIC_` (never secrets!) |

---

## 12. References

- NextAuth.js (Auth.js) docs: <https://next-auth.js.org/getting-started/introduction>
- Google provider in NextAuth: <https://next-auth.js.org/providers/google>
- Auth.js (new docs site): <https://authjs.dev>
- Google Cloud Console: <https://console.cloud.google.com/>
- Google OAuth 2.0 docs: <https://developers.google.com/identity/protocols/oauth2>
- Next.js docs: <https://nextjs.org/docs>
- JWT explained: <https://jwt.io/introduction>
- jsonwebtoken npm: <https://www.npmjs.com/package/jsonwebtoken>
- Express CORS: <https://expressjs.com/en/resources/middleware/cors.html>

---

*Flow to remember: **Google proves identity → NextAuth makes the session → your Node API trusts a JWT → MongoDB stores the user.*** 🚀
