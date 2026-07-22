# Next.js Frontend — Part 2 (Dynamic Routes, Protected Pages & Building a Real Site)

This continues from **Part 1**. Now you'll learn the routing and data features that turn a set of pages into a real website: dynamic routes, nested layouts, loading/error screens, data fetching, and **private/protected routes** (login-only pages).

> Still frontend only — no backend logic. You'll connect these pages to your own Node.js backend later. Where a "server" is needed for examples, we call an API endpoint (a URL) — exactly how your Node backend will be reached.

---

## 1. Quick Recap of Routing (from Part 1)

- A folder inside `app/` = a URL segment.
- A `page.tsx` inside makes it visitable.
- `layout.tsx` wraps pages with shared UI.

Everything below builds on this.

---

## 2. Dynamic Routes ⭐ (pages that change based on the URL)

Sometimes you need one page design that works for **many** items — e.g. `/blog/1`, `/blog/2`, `/blog/hello-world`. You can't create a folder for each. Instead you use a **dynamic route**: a folder name in **square brackets**.

```
app/blog/[id]/page.tsx     →  matches /blog/1, /blog/2, /blog/anything
```

The `[id]` part becomes a **parameter** you can read. In the App Router, `params` is received by the page:

```tsx
// app/blog/[id]/page.tsx
export default async function BlogPost({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;   // read the value from the URL

  return (
    <main>
      <h1>Blog Post #{id}</h1>
      <p>You are reading post {id}.</p>
    </main>
  );
}
```

Visit `/blog/42` → shows "Blog Post #42". Visit `/blog/hello` → shows "Blog Post #hello". **One file handles infinitely many pages.**

Linking to a dynamic route:

```tsx
import Link from "next/link";

export default function BlogList() {
  const posts = [
    { id: 1, title: "First Post" },
    { id: 2, title: "Second Post" },
  ];

  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>
          <Link href={`/blog/${post.id}`}>{post.title}</Link>
        </li>
      ))}
    </ul>
  );
}
```

The `` `/blog/${post.id}` `` template literal (from your TS notes) builds each link's URL.

---

## 3. Nested Dynamic Routes & Multiple Params

You can nest dynamic segments:

```
app/shop/[category]/[productId]/page.tsx   →  /shop/shoes/12
```

```tsx
export default async function Product({
  params,
}: {
  params: Promise<{ category: string; productId: string }>;
}) {
  const { category, productId } = await params;
  return <h1>{category} → product {productId}</h1>;
}
```

`/shop/shoes/12` shows "shoes → product 12".

---

## 4. Catch-All Routes (match anything after a point)

Use `[...slug]` to catch any number of segments:

```
app/docs/[...slug]/page.tsx
```

- `/docs/a` → slug = `["a"]`
- `/docs/a/b/c` → slug = `["a", "b", "c"]`

```tsx
export default async function Docs({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  return <h1>Path: {slug.join(" / ")}</h1>;
}
```

Useful for documentation sites and deeply nested paths. (`[[...slug]]` with double brackets also matches the base `/docs` itself.)

---

## 5. Route Groups (organise without changing the URL)

A folder in **parentheses** `(name)` groups files for organisation but does **not** appear in the URL. Great for separating sections like marketing pages vs app pages.

```
app/
├── (marketing)/
│   ├── about/page.tsx     →  /about   (note: NOT /marketing/about)
│   └── pricing/page.tsx   →  /pricing
└── (dashboard)/
    ├── layout.tsx         (a different layout just for these)
    └── settings/page.tsx  →  /settings
```

This lets you give the dashboard its own layout (sidebar) separate from marketing pages, without ugly URLs.

---

## 6. Nested Layouts (section-specific wrappers)

From Part 1 you know the root `layout.tsx`. You can add a `layout.tsx` to **any folder** to wrap just that section. Example — a dashboard with a sidebar on every dashboard page:

```tsx
// app/dashboard/layout.tsx
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: "flex" }}>
      <aside>
        <p>Dashboard Menu</p>
      </aside>
      <section>{children}</section>
    </div>
  );
}
```

Now every page under `app/dashboard/` (like `/dashboard/settings`, `/dashboard/profile`) gets the sidebar automatically, while the rest of the site does not. Layouts **nest** — the root layout wraps this one.

---

## 7. Loading UI (instant loading screens)

Add a `loading.tsx` in any folder. Next.js shows it automatically while that page's data is loading — no state management needed.

```tsx
// app/blog/loading.tsx
export default function Loading() {
  return <p>Loading posts...</p>;
}
```

You could return a spinner or skeleton cards here. It appears instantly, then swaps to the page when ready.

---

## 8. Error UI (graceful error screens)

Add an `error.tsx` (must be a Client Component) to catch errors in a section and show a friendly message instead of a crash.

```tsx
"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div>
      <h2>Something went wrong.</h2>
      <p>{error.message}</p>
      <button onClick={() => reset()}>Try again</button>
    </div>
  );
}
```

`reset()` re-attempts to render the page. There's also `not-found.tsx` for 404 pages (Section 12).

---

## 9. Fetching Data in Server Components ⭐ (the clean way)

In Part 1 you learned `useEffect` for fetching. In Next.js, the **better** way to load data is directly inside a Server Component — you just make the component `async` and `await` your fetch (remember async/await + fetch from your TS notes). No `useState`, no `useEffect`, no loading flags.

```tsx
// app/users/page.tsx  (Server Component by default)
type User = { id: number; name: string; email: string };

export default async function UsersPage() {
  const res = await fetch("https://jsonplaceholder.typicode.com/users");
  const users: User[] = await res.json();

  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>
          {user.name} — {user.email}
        </li>
      ))}
    </ul>
  );
}
```

The data is fetched on the server **before** the page is sent, so the user sees content immediately. This is where you'll call your **Node.js backend's API URLs** later — just replace the URL.

### Fetching one item in a dynamic route

Combine Sections 2 and 9:

```tsx
// app/users/[id]/page.tsx
type User = { id: number; name: string; email: string };

export default async function UserPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const res = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`);
  const user: User = await res.json();

  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  );
}
```

### When to fetch on the client instead
If data must load *after* interaction (e.g. search-as-you-type), fetch inside a Client Component with `useEffect` (Part 1, Section 15). Rule of thumb: **fetch on the server by default; fetch on the client only for interactive/live updates.**

---

## 10. Programmatic Navigation (`useRouter`)

Sometimes you navigate from code, not a `<Link>` — e.g. after a form submit, go to another page. Use `useRouter` (Client Component only):

```tsx
"use client";

import { useRouter } from "next/navigation";

export default function LoginButton() {
  const router = useRouter();

  function handleLogin() {
    // ...do login work...
    router.push("/dashboard");   // go to dashboard
  }

  return <button onClick={handleLogin}>Log in</button>;
}
```

Useful methods: `router.push("/path")` (go there), `router.replace("/path")` (go without adding to history), `router.back()` (go back), `router.refresh()` (reload server data).

---

## 11. Private / Protected Routes ⭐⭐ (login-only pages)

This is a must-have for real apps: some pages (like `/dashboard`) should only be visible to logged-in users. There are two common frontend approaches. We'll show both.

> **Note:** the *real* security lives in your Node.js backend (it decides who's logged in and issues a token/cookie). These frontend guards control *what the user sees* and *redirect* them. Always enforce auth on the backend too.

### Approach A — Middleware (protect whole sections, recommended)

**Middleware** runs *before* a page loads and can redirect the user. Create `middleware.ts` in the project root (same level as `app/`):

```ts
// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Read a login token from cookies (your Node backend would set this)
  const token = request.cookies.get("token")?.value;

  // If visiting a protected page with no token → send to login
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Otherwise allow the request through
  return NextResponse.next();
}

// Only run this middleware for these paths:
export const config = {
  matcher: ["/dashboard/:path*", "/settings/:path*"],
};
```

Now anyone visiting `/dashboard` (or anything under it) without a `token` cookie is automatically redirected to `/login`. The `matcher` lists which routes to protect. This is the cleanest way to guard entire sections.

### Approach B — Guard inside a layout (protect a section's pages)

You can also check auth in a section layout and redirect. This example reads the cookie on the server:

```tsx
// app/dashboard/layout.tsx
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = (await cookies()).get("token")?.value;

  if (!token) {
    redirect("/login");   // not logged in → bounce to login
  }

  return <section>{children}</section>;
}
```

Every page under `/dashboard` now requires a token before it renders.

### A simple login/logout flow (frontend side)

Your Node backend handles the real login and sets the cookie. On the frontend, after a successful login you send the user onward, and for logout you clear and redirect:

```tsx
"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  function handleLogout() {
    // tell your Node backend to clear the session/cookie, e.g.:
    // await fetch("/api/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return <button onClick={handleLogout}>Logout</button>;
}
```

**Summary:** use **middleware** to protect whole areas, and/or a **layout guard** for a section. The cookie/token comes from your Node.js backend.

---

## 12. Custom 404 (Not Found) Pages

Add `not-found.tsx` for a friendly "page doesn't exist" screen:

```tsx
// app/not-found.tsx
import Link from "next/link";

export default function NotFound() {
  return (
    <div>
      <h1>404 — Page Not Found</h1>
      <Link href="/">Go home</Link>
    </div>
  );
}
```

You can also trigger it from code when an item doesn't exist:

```tsx
import { notFound } from "next/navigation";

// inside an async page, after fetching:
if (!user) {
  notFound();   // shows the not-found.tsx page
}
```

---

## 13. Metadata & SEO (titles, descriptions for Google)

Next.js makes SEO easy. Export a `metadata` object from any `page.tsx` or `layout.tsx`:

```tsx
// app/about/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us — MySite",
  description: "Learn about our team and mission.",
};

export default function AboutPage() {
  return <h1>About Us</h1>;
}
```

This sets the browser tab title and the description Google shows. For dynamic pages, use `generateMetadata` to build it from data:

```tsx
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  return { title: `Post ${id} — MyBlog` };
}
```

---

## 14. Optimised Images (`next/image`)

Use Next.js's `<Image>` instead of `<img>` — it auto-resizes, lazy-loads, and speeds up your site.

```tsx
import Image from "next/image";

export default function Logo() {
  return (
    <Image
      src="/logo.png"      // a file in the public/ folder
      alt="Company logo"
      width={200}
      height={100}
    />
  );
}
```

For external image URLs, add the domain to `next.config.js` (Next tells you exactly what to add if you forget).

---

## 15. Optimised Fonts (`next/font`)

Load Google Fonts with zero layout shift and no extra requests:

```tsx
// app/layout.tsx
import { Poppins } from "next/font/google";

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "700"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={poppins.className}>{children}</body>
    </html>
  );
}
```

Now the whole site uses Poppins, optimised automatically.

---

## 16. Environment Variables (secret & config values)

Store config (like your backend's API URL) in a `.env.local` file in the project root:

```
NEXT_PUBLIC_API_URL=http://localhost:5000
SECRET_KEY=only-on-server
```

- Variables starting with **`NEXT_PUBLIC_`** are available in the browser (safe, public values like your API base URL).
- Variables **without** that prefix are **server-only** (keep secrets here — never exposed to the browser).

Use them:

```tsx
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const res = await fetch(`${apiUrl}/users`);
```

**Never** commit `.env.local` to Git — add it to `.gitignore` (from your Git notes). This is exactly where your Node.js backend URL will go.

---

## 17. Forms & Handling Input

A typical controlled form (Client Component). It collects input and would send it to your Node backend:

```tsx
"use client";

import { useState } from "react";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();               // stop the page from reloading

    // send to YOUR Node.js backend:
    // await fetch("/api/contact", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ name, email }),
    // });

    console.log({ name, email });     // for now, just log it
    setName("");
    setEmail("");
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button type="submit">Send</button>
    </form>
  );
}
```

- `e.preventDefault()` stops the default page reload.
- `value` + `onChange` = a **controlled input** (React owns the value). From Part 1, Section 14.
- The commented `fetch` is where you'll POST to your Node backend (POST pattern from your TS notes).

---

## 18. Building & Deploying

When your site is ready:

```bash
npm run build     # creates an optimised production build
npm run start     # runs that production build locally to test
```

**Easiest deployment: Vercel** (made by the Next.js team, free tier):
1. Push your project to GitHub (from your Git notes).
2. Go to https://vercel.com → **Import** your GitHub repo.
3. Add your environment variables in the Vercel dashboard.
4. Click **Deploy** — your site goes live with a URL.

Every future `git push` auto-deploys. Done. 🚀

---

## 19. Full Real-World Structure (everything together)

```
my-app/
├── middleware.ts               ← protects /dashboard (Section 11)
├── .env.local                  ← API URL & secrets (Section 16)
├── app/
│   ├── layout.tsx              ← root layout: fonts, navbar, footer
│   ├── page.tsx                ← home
│   ├── not-found.tsx           ← 404 page
│   ├── (marketing)/
│   │   ├── about/page.tsx
│   │   └── pricing/page.tsx
│   ├── blog/
│   │   ├── page.tsx            ← list of posts (fetch)
│   │   ├── loading.tsx         ← loading screen
│   │   └── [id]/page.tsx       ← single post (dynamic + fetch)
│   ├── login/page.tsx
│   └── dashboard/
│       ├── layout.tsx          ← sidebar + auth guard
│       ├── page.tsx
│       └── settings/page.tsx
└── components/
    ├── Navbar.tsx
    ├── ContactForm.tsx         ("use client")
    └── LogoutButton.tsx        ("use client")
```

If you can build this, you can build a real website. Everything except the backend is here.

---

## 20. Part 2 Checklist

- [ ] Create dynamic routes with `[id]` and read `params`.
- [ ] Handle nested params and catch-all `[...slug]` routes.
- [ ] Organise with route groups `(name)`.
- [ ] Add section-specific nested layouts.
- [ ] Add `loading.tsx` and `error.tsx`.
- [ ] Fetch data in an async Server Component (and in a dynamic route).
- [ ] Navigate from code with `useRouter`.
- [ ] Protect routes with **middleware** and/or a **layout auth guard**.
- [ ] Add a custom 404 with `not-found.tsx` / `notFound()`.
- [ ] Set page titles/descriptions with `metadata`.
- [ ] Use `next/image` and `next/font`.
- [ ] Store config in `.env.local` (and understand `NEXT_PUBLIC_`).
- [ ] Build a controlled form that would POST to a backend.
- [ ] Build and deploy to Vercel.

---

## 21. Final Practice Task 🏋️ (build a real site)

Build a small blog-style site combining both parts:

1. **Home** page with a navbar (layout) and intro.
2. **Blog list** page that fetches posts from `https://jsonplaceholder.typicode.com/posts` (Server Component) and links each to `/blog/[id]`.
3. **Single post** page — dynamic route that fetches and shows one post, with a `loading.tsx`.
4. A **`/dashboard`** section protected by **middleware** (redirect to `/login` if no `token` cookie).
5. A **login** page and a **logout** button using `useRouter`.
6. A **contact form** (controlled inputs) that logs the data (ready to POST to your Node backend).
7. Set proper **metadata** on each page.
8. Deploy to **Vercel**.

Finish this and you're genuinely ready to build production frontends — then plug in your **Node.js backend** for the data and auth. 🎉

---

**Golden rule:** the frontend (this) decides *what the user sees and where they go*; your Node.js backend decides *what's true and who's allowed*. Build both, connect them with `fetch`, and you have a full website.
