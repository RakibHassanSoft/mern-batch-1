# DevBlog — Static Frontend (Next.js + Tailwind CSS)

A complete **static** UI for a simple blog: public can read cards, users can register/login, and a dashboard to create / edit / delete cards. **No backend, no data saving** — this is the design layer only. Sample data lives in `lib/data.ts`. Later you wire these pages to your Node.js backend.

Everything is **component-based** and styled with **Tailwind utility classes**. This README explains the structure, how to run it, and what every important Tailwind class does.

---

## 1. Folder & File Structure

```
Blog Project (Static)/
├── app/
│   ├── layout.tsx                 ← wraps every page (Navbar + Footer + font)
│   ├── globals.css                ← Tailwind directives + tiny defaults
│   ├── page.tsx                   ← PUBLIC HOME (hero + grid of all cards)
│   ├── blog/
│   │   └── [id]/page.tsx          ← PUBLIC single post (dynamic route)
│   ├── login/page.tsx             ← login form (static)
│   ├── register/page.tsx          ← register form (static)
│   └── dashboard/
│       ├── page.tsx               ← user's cards + edit/delete buttons
│       ├── create/page.tsx        ← create card form
│       └── edit/[id]/page.tsx     ← edit card form (pre-filled)
│
├── components/
│   ├── Navbar.tsx                 ← top navigation bar
│   ├── Footer.tsx                 ← bottom footer
│   ├── Button.tsx                 ← reusable button (primary/outline/danger)
│   ├── BlogCard.tsx               ← one card in the grid (with optional actions)
│   └── CardForm.tsx               ← shared form for create AND edit, with direct input markup
│
├── lib/
│   └── data.ts                    ← sample cards + the BlogCard type
│
├── tailwind.config.ts             ← which files Tailwind scans
├── next.config.mjs                ← allows picsum.photos images
└── README.md                      ← this file
```

**How the pieces connect:** `layout.tsx` shows the `Navbar` and `Footer` on every page. Each `page.tsx` imports components and the sample data. `BlogCard` is reused on the home grid and the dashboard (with `showActions` for edit/delete). `CardForm` is reused by both the create and edit pages.

---

## 2. Pages & Routes

| URL | File | Who sees it | Purpose |
|-----|------|-------------|---------|
| `/` | `app/page.tsx` | Public | Hero + grid of all cards |
| `/blog/1` | `app/blog/[id]/page.tsx` | Public | Read one full post |
| `/login` | `app/login/page.tsx` | Public | Login form |
| `/register` | `app/register/page.tsx` | Public | Register form |
| `/dashboard` | `app/dashboard/page.tsx` | User | Their cards + edit/delete |
| `/dashboard/create` | `app/dashboard/create/page.tsx` | User | Create a card |
| `/dashboard/edit/1` | `app/dashboard/edit/[id]/page.tsx` | User | Edit a card |

---

## 3. How to Run It

You need the standard Next.js setup. Two options:

**Option A — drop these files into a fresh Next.js app (recommended):**
```bash
npx create-next-app@latest devblog
# choose: TypeScript = Yes, Tailwind = Yes, App Router = Yes, src/ = No, alias @/* = Yes
```
Then copy the `app/`, `components/`, and `lib/` folders from here **into** the new project (replacing the default `app/page.tsx` and `app/layout.tsx`). Also copy `next.config.mjs`. Run:
```bash
cd devblog
npm run dev
```
Open **http://localhost:3000**.

**Option B — if you already have a Next.js + Tailwind project:** just copy `app/`, `components/`, `lib/`, and `next.config.mjs` in.

> The `@/` in imports (like `@/components/Navbar`) is a shortcut for the project root. `create-next-app` sets this up automatically when you accept the alias.

---

## 4. The Design System (colors & spacing used everywhere)

Keeping these consistent is what makes the site look clean:

| Purpose | Tailwind classes |
|---------|------------------|
| Page background | `bg-slate-50` |
| Card background | `bg-white` |
| Borders | `border border-slate-200` |
| Rounded corners | `rounded-lg` / `rounded-xl` |
| Soft shadow | `shadow-sm` (hover: `shadow-md`) |
| Primary color | `indigo-600` (hover `indigo-700`) |
| Danger color | `red-600` (hover `red-700`) |
| Main text | `text-slate-900` (headings) / `text-slate-600` (body) |
| Muted text | `text-slate-500` |

---

## 5. Tailwind Explained — Class by Class

Tailwind = tiny single-purpose classes you combine. Below are every class used in this project, grouped by what they do, with the visual result.

### Layout & width
| Class | What it does (output) |
|-------|-----------------------|
| `max-w-6xl` | Caps width (~1152px) so content isn't too wide on big screens |
| `max-w-md` | Narrow width (~448px) — used for login/register cards |
| `mx-auto` | Centers a fixed-width block horizontally (auto left/right margin) |
| `px-4` | Horizontal padding of 1rem (16px) left & right |
| `py-10` | Vertical padding of 2.5rem top & bottom |
| `p-6` | Padding on all sides |
| `mt-4`, `mb-6` | Margin top / bottom (spacing between elements) |
| `gap-6` | Space **between** flex/grid children |

### Flexbox (arranging items in a row/column)
| Class | Output |
|-------|--------|
| `flex` | Lay children in a row |
| `flex-col` | Stack children in a column |
| `items-center` | Center children vertically (on the cross axis) |
| `justify-between` | Push children to opposite ends |
| `justify-center` | Center children horizontally |
| `flex-1` | Make a child grow to fill available space |

### Grid (the cards layout)
```
grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6
```
- `grid` → turn on grid layout.
- `grid-cols-1` → **1 column** by default (mobile).
- `sm:grid-cols-2` → **2 columns** on small screens and up (≥640px).
- `lg:grid-cols-3` → **3 columns** on large screens (≥1024px).
- `gap-6` → 1.5rem space between cards.

This one line = a fully responsive card grid.

### Colors
| Class | Output |
|-------|--------|
| `bg-indigo-600` | Indigo background (buttons, pills) |
| `text-white` | White text |
| `text-slate-600` | Grey body text |
| `bg-slate-50` | Very light grey page background |
| `border-slate-200` | Light grey border |
| `hover:bg-indigo-700` | Darker indigo **when hovered** |

### Text
| Class | Output |
|-------|--------|
| `text-sm` / `text-lg` / `text-4xl` | Font size (small → very large) |
| `font-medium` / `font-semibold` / `font-bold` | Text weight (thickness) |
| `text-center` | Center the text |
| `tracking-tight` | Slightly tighter letter spacing (nicer big headings) |
| `leading-relaxed` | More space between lines (readable paragraphs) |
| `line-clamp-1` / `line-clamp-2` | Cut text to 1 or 2 lines with `...` |

### Borders, corners, shadows
| Class | Output |
|-------|--------|
| `rounded-lg` / `rounded-xl` / `rounded-full` | Rounded corners (medium / large / pill/circle) |
| `border` | 1px border |
| `shadow-sm` → `hover:shadow-md` | Subtle shadow that deepens on hover |
| `overflow-hidden` | Clip anything spilling out (keeps image corners rounded) |

### Effects & interaction
| Class | Output |
|-------|--------|
| `transition` | Animate changes smoothly (e.g. color on hover) |
| `hover:...` | Apply a style only when the mouse is over it |
| `focus:ring-2 focus:ring-indigo-500` | Glowing ring around an input when clicked/typing |
| `group` + `group-hover:scale-105` | When you hover the **card**, the image zooms in slightly |
| `sticky top-0 z-50` | Navbar sticks to the top while scrolling, stays above content |

### Responsive prefixes (very important)
Any class can be prefixed to apply only at a screen size:
- no prefix → all sizes (mobile-first)
- `sm:` → ≥640px (small tablets)
- `md:` → ≥768px
- `lg:` → ≥1024px (desktops)

Example: `text-4xl sm:text-5xl` = big on mobile, bigger on desktop.

---

## 6. How Each Component Works

**Navbar** — a `sticky` white bar. Left side is the logo, right side has links styled as text plus one filled "Sign Up" button. Hover changes link color to indigo.

**Footer** — light bar pinned to the bottom (the `layout.tsx` uses `min-h-screen flex flex-col` + `flex-1` on `main` so the footer sits at the bottom even on short pages).

**Button** — one component, three looks via the `variant` prop (`primary` filled indigo, `outline` bordered, `danger` red). If you pass `href` it becomes a `<Link>`; otherwise a real `<button>`.

**Login/Register/Create/Edit forms** — written with direct `<label>`, `<input>`, and `<textarea>` markup for easier reading. Each field is clearly labelled, and helper text explains what to type.

**BlogCard** — the core card: image with a floating category pill, title (clamped to 1 line), excerpt (2 lines), author/date row, and a "Read more" link. Pass `showActions` to also show Edit/Delete buttons (used on the dashboard).

**CardForm** — one form reused for create **and** edit. Pass a `card` to pre-fill it (edit mode); leave it out for empty fields (create mode).

---

## 7. Turning This Static UI Into a Real App (next steps)

Right now nothing saves — the forms and Delete button don't do anything yet. To make it live:

1. **Replace `lib/data.ts`** with real data fetched from your Node.js backend (use `fetch` in the Server Components — see your Next.js Part 2 notes).
2. **Login/Register forms** → send a POST to `/api/auth/login` and `/api/auth/signup` (your Node.js auth notes), store the returned token.
3. **Create/Edit forms** → make them Client Components (`"use client"`), add `useState` for the fields, and POST/PUT to your backend.
4. **Delete button** → make it a Client Component that calls DELETE on your backend, then refreshes.
5. **Protect the `/dashboard`** routes with middleware (Next.js Part 2, protected routes).

The design won't change — you're just adding behavior behind these same components.

---

## 8. Quick Customisation Tips

- **Change the brand color:** find-and-replace `indigo` with another Tailwind color (e.g. `emerald`, `rose`, `blue`).
- **Wider/narrower content:** change `max-w-6xl` (grid) or `max-w-md` (auth cards).
- **More/less cards per row:** edit `lg:grid-cols-3` to `lg:grid-cols-4`, etc.
- **Rounder cards:** swap `rounded-xl` for `rounded-2xl`.

---

## 9. Full Source Code (copy & paste)

Every file below is complete. Create the file at the given path and paste the code. Create files in this order (data → components → pages → config) so imports resolve.

---

### `lib/data.ts`

```ts
// Static sample data so the design has something to show.
// Later you will replace this with data from your Node.js backend.

export type BlogCard = {
  id: number;
  title: string;
  excerpt: string;   // short preview text
  content: string;   // full text (used on the single-post page)
  author: string;
  date: string;
  category: string;
  image: string;     // any image URL
};

export const blogCards: BlogCard[] = [
  {
    id: 1,
    title: "Getting Started with Next.js",
    excerpt:
      "Next.js makes building React apps simple with file-based routing and zero config.",
    content:
      "Next.js is a React framework that gives you routing, optimisation, and a great developer experience out of the box. In this post we walk through creating your first app, adding pages, and understanding the App Router.",
    author: "Sara Khan",
    date: "Jul 20, 2026",
    category: "Next.js",
    image: "https://picsum.photos/seed/next/600/400",
  },
  {
    id: 2,
    title: "Understanding Tailwind CSS",
    excerpt:
      "Style your app quickly using utility classes instead of writing custom CSS files.",
    content:
      "Tailwind CSS is a utility-first framework. Instead of writing CSS, you compose small classes like flex, p-4, and text-center directly in your markup. This post explains the mindset and the most useful classes.",
    author: "Aman Verma",
    date: "Jul 18, 2026",
    category: "CSS",
    image: "https://picsum.photos/seed/tailwind/600/400",
  },
  {
    id: 3,
    title: "REST APIs with Node.js",
    excerpt:
      "Learn how to build a clean CRUD API using Express and MongoDB with Mongoose.",
    content:
      "A REST API exposes your data over HTTP methods: GET, POST, PUT, and DELETE. Using Express and Mongoose you can build a full CRUD backend quickly. Here is how the pieces fit together.",
    author: "Priya Singh",
    date: "Jul 15, 2026",
    category: "Node.js",
    image: "https://picsum.photos/seed/node/600/400",
  },
  {
    id: 4,
    title: "TypeScript for Beginners",
    excerpt:
      "Add types to your JavaScript to catch bugs early and get better autocomplete.",
    content:
      "TypeScript is JavaScript with types. It catches mistakes before you run your code and makes large projects safer to change. This post covers the basics every React developer needs.",
    author: "Sara Khan",
    date: "Jul 12, 2026",
    category: "TypeScript",
    image: "https://picsum.photos/seed/ts/600/400",
  },
  {
    id: 5,
    title: "Git & GitHub Essentials",
    excerpt:
      "Track your code, collaborate with others, and never lose your work again.",
    content:
      "Git is a version control system and GitHub hosts your repositories online. Together they let you save snapshots of your project and work with a team. Learn the core commands here.",
    author: "Aman Verma",
    date: "Jul 09, 2026",
    category: "Git",
    image: "https://picsum.photos/seed/git/600/400",
  },
  {
    id: 6,
    title: "How the Web Works",
    excerpt:
      "From typing a URL to seeing a page — understand the request/response cycle.",
    content:
      "When you visit a website, your browser asks DNS for an IP address, connects to a server, sends an HTTP request, and renders the response. Understanding this makes everything else easier.",
    author: "Priya Singh",
    date: "Jul 05, 2026",
    category: "Web",
    image: "https://picsum.photos/seed/web/600/400",
  },
];
```

---

### `app/globals.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Small global defaults. Tailwind handles most styling via classes. */
body {
  @apply bg-slate-50 text-slate-800 antialiased;
}
```

---

### `app/layout.tsx`

```tsx
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Load a clean Google font for the whole site
const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

export const metadata: Metadata = {
  title: "DevBlog — Share what you learn",
  description: "A simple blog built with Next.js and Tailwind CSS.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/* min-h-screen + flex-col keeps the footer at the bottom on short pages */}
      <body className={`${poppins.className} min-h-screen flex flex-col`}>
        <Navbar />
        {/* flex-1 makes the page content grow to fill remaining space */}
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
```

---

### `components/Navbar.tsx`

```tsx
import Link from "next/link";

// Top navigation bar. Static links only — no login logic yet.
export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200">
      <nav className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo / brand */}
        <Link href="/" className="text-xl font-bold text-indigo-600">
          Dev<span className="text-slate-900">Blog</span>
        </Link>

        {/* Links */}
        <div className="flex items-center gap-2 sm:gap-4">
          <Link
            href="/"
            className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition"
          >
            Home
          </Link>
          <Link
            href="/dashboard"
            className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition"
          >
            Dashboard
          </Link>
          <Link
            href="/login"
            className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition"
          >
            Login
          </Link>
          {/* Primary button style */}
          <Link
            href="/register"
            className="text-sm font-medium bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            Sign Up
          </Link>
        </div>
      </nav>
    </header>
  );
}
```

---

### `components/Footer.tsx`

```tsx
import Link from "next/link";

// Simple footer shown on every page (added in layout.tsx).
export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 mt-12">
      <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-slate-500">
          © 2026 DevBlog. Built with Next.js & Tailwind CSS.
        </p>
        <div className="flex gap-4">
          <Link href="/" className="text-sm text-slate-500 hover:text-indigo-600">
            Home
          </Link>
          <Link href="/dashboard" className="text-sm text-slate-500 hover:text-indigo-600">
            Dashboard
          </Link>
        </div>
      </div>
    </footer>
  );
}
```

---

### `components/Button.tsx`

```tsx
import Link from "next/link";

// A reusable button that can render as a real <button> or a <Link>.
// variant controls the color style.

type ButtonProps = {
  children: React.ReactNode;
  href?: string;                          // if given, renders a Link
  variant?: "primary" | "outline" | "danger";
  type?: "button" | "submit";
  className?: string;
};

// Base classes shared by all variants
const base =
  "inline-flex items-center justify-center text-sm font-medium px-4 py-2 rounded-lg transition";

// Different color styles
const styles = {
  primary: "bg-indigo-600 text-white hover:bg-indigo-700",
  outline: "border border-slate-300 text-slate-700 hover:bg-slate-100",
  danger: "bg-red-600 text-white hover:bg-red-700",
};

export default function Button({
  children,
  href,
  variant = "primary",
  type = "button",
  className = "",
}: ButtonProps) {
  const classes = `${base} ${styles[variant]} ${className}`;

  // If href is passed, render a navigation link that looks like a button
  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={classes}>
      {children}
    </button>
  );
}
```


### `components/BlogCard.tsx`

```tsx
import Link from "next/link";
import Image from "next/image";
import type { BlogCard as BlogCardType } from "@/lib/data";

// A single blog card in the grid.
// showActions = true adds Edit/Delete buttons (used on the Dashboard).

type BlogCardProps = {
  card: BlogCardType;
  showActions?: boolean;
};

export default function BlogCard({ card, showActions = false }: BlogCardProps) {
  return (
    <article className="group bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition">
      {/* Cover image */}
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={card.image}
          alt={card.title}
          fill
          className="object-cover group-hover:scale-105 transition duration-300"
        />
        {/* Category pill floating on top of the image */}
        <span className="absolute top-3 left-3 bg-indigo-600 text-white text-xs font-medium px-2.5 py-1 rounded-full">
          {card.category}
        </span>
      </div>

      {/* Text content */}
      <div className="p-5">
        <h3 className="text-lg font-semibold text-slate-900 line-clamp-1">
          {card.title}
        </h3>
        <p className="mt-2 text-sm text-slate-600 line-clamp-2">{card.excerpt}</p>

        {/* Author + date row */}
        <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
          <span>{card.author}</span>
          <span>{card.date}</span>
        </div>

        {/* Read more link */}
        <Link
          href={`/blog/${card.id}`}
          className="mt-4 inline-block text-sm font-medium text-indigo-600 hover:text-indigo-800"
        >
          Read more →
        </Link>

        {/* Optional Edit / Delete actions (Dashboard only) */}
        {showActions && (
          <div className="mt-4 flex gap-2 border-t border-slate-100 pt-4">
            <Link
              href={`/dashboard/edit/${card.id}`}
              className="flex-1 text-center text-sm font-medium border border-slate-300 text-slate-700 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition"
            >
              Edit
            </Link>
            <button
              className="flex-1 text-sm font-medium bg-red-600 text-white px-3 py-1.5 rounded-lg hover:bg-red-700 transition"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </article>
  );
}
```

---

### `components/CardForm.tsx`

```tsx
import Button from "./Button";
import type { BlogCard } from "@/lib/data";

// Shared form for BOTH creating and editing a card.
// If `card` is passed, the fields are pre-filled (edit mode).

type CardFormProps = {
  card?: BlogCard;       // undefined = create mode, provided = edit mode
  heading: string;
  submitLabel: string;
};

export default function CardForm({ card, heading, submitLabel }: CardFormProps) {
  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-slate-900">{heading}</h1>
      <p className="mt-1 text-sm text-slate-500">
        Fill in the details below. (Static form — no saving yet.)
      </p>

      {/* Card container */}
      <form className="mt-6 bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="title" className="text-sm font-medium text-slate-700">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            id="title"
            name="title"
            type="text"
            placeholder="Enter a catchy title"
            defaultValue={card?.title}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          <p className="text-xs text-slate-500">Give your post a clear title so readers know what to expect.</p>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="category" className="text-sm font-medium text-slate-700">
            Category <span className="text-red-500">*</span>
          </label>
          <input
            id="category"
            name="category"
            type="text"
            placeholder="e.g. Next.js"
            defaultValue={card?.category}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          <p className="text-xs text-slate-500">Pick one category such as Next.js, React, or Node.js.</p>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="image" className="text-sm font-medium text-slate-700">
            Cover Image URL
          </label>
          <input
            id="image"
            name="image"
            type="url"
            placeholder="https://..."
            defaultValue={card?.image}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          <p className="text-xs text-slate-500">Optional: paste an image URL to show a cover image for your post.</p>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="excerpt" className="text-sm font-medium text-slate-700">
            Short Excerpt <span className="text-red-500">*</span>
          </label>
          <input
            id="excerpt"
            name="excerpt"
            type="text"
            placeholder="One-line summary shown on the card"
            defaultValue={card?.excerpt}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          <p className="text-xs text-slate-500">Write a short summary that explains the main idea.</p>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="content" className="text-sm font-medium text-slate-700">
            Content <span className="text-red-500">*</span>
          </label>
          <textarea
            id="content"
            name="content"
            rows={6}
            placeholder="Write your full post here..."
            defaultValue={card?.content}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm resize-y focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          <p className="text-xs text-slate-500">Share your full post content here. Use paragraphs and headings if needed.</p>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3 pt-2">
          <Button type="submit" variant="primary">
            {submitLabel}
          </Button>
          <Button href="/dashboard" variant="outline">
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
```

---

### `app/page.tsx`  (Public Home)

```tsx
import Link from "next/link";
import BlogCard from "@/components/BlogCard";
import { blogCards } from "@/lib/data";

// PUBLIC HOME PAGE — anyone can see all the cards here.
export default function HomePage() {
  return (
    <div>
      {/* ---------- Hero section ---------- */}
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 py-16 text-center">
          <span className="inline-block bg-indigo-50 text-indigo-600 text-xs font-medium px-3 py-1 rounded-full">
            Welcome to DevBlog
          </span>
          <h1 className="mt-4 text-4xl sm:text-5xl font-bold text-slate-900 tracking-tight">
            Share what you <span className="text-indigo-600">learn</span>
          </h1>
          <p className="mt-4 max-w-xl mx-auto text-slate-600">
            Read posts from developers, or sign up to write and manage your own.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <Link
              href="/register"
              className="bg-indigo-600 text-white text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-indigo-700 transition"
            >
              Start Writing
            </Link>
            <Link
              href="#posts"
              className="border border-slate-300 text-slate-700 text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-slate-100 transition"
            >
              Browse Posts
            </Link>
          </div>
        </div>
      </section>

      {/* ---------- Cards grid ---------- */}
      <section id="posts" className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-900">Latest Posts</h2>
          <span className="text-sm text-slate-500">{blogCards.length} posts</span>
        </div>

        {/* Responsive grid: 1 column on mobile, 2 on tablet, 3 on desktop */}
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

---

### `app/blog/[id]/page.tsx`  (Single Post — public)

```tsx
import Link from "next/link";
import Image from "next/image";
import { blogCards } from "@/lib/data";

// SINGLE POST PAGE — public. Reads the :id from the URL and shows one card.
// Static: we just find the card in our sample array.

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const card = blogCards.find((c) => c.id === Number(id));

  // Simple fallback if the id doesn't exist
  if (!card) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-slate-900">Post not found</h1>
        <Link href="/" className="mt-4 inline-block text-indigo-600 hover:underline">
          ← Back to home
        </Link>
      </div>
    );
  }

  return (
    <article className="max-w-3xl mx-auto px-4 py-10">
      {/* Back link */}
      <Link
        href="/"
        className="text-sm text-slate-500 hover:text-indigo-600 transition"
      >
        ← Back to all posts
      </Link>

      {/* Category + meta */}
      <div className="mt-6 flex items-center gap-3">
        <span className="bg-indigo-600 text-white text-xs font-medium px-2.5 py-1 rounded-full">
          {card.category}
        </span>
        <span className="text-sm text-slate-500">{card.date}</span>
      </div>

      {/* Title */}
      <h1 className="mt-4 text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
        {card.title}
      </h1>

      {/* Author */}
      <div className="mt-4 flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold">
          {card.author.charAt(0)}
        </div>
        <span className="text-sm font-medium text-slate-700">{card.author}</span>
      </div>

      {/* Cover image */}
      <div className="relative h-64 sm:h-80 w-full mt-8 rounded-xl overflow-hidden">
        <Image src={card.image} alt={card.title} fill className="object-cover" />
      </div>

      {/* Body text */}
      <div className="mt-8 text-slate-700 leading-relaxed space-y-4">
        <p className="text-lg text-slate-800 font-medium">{card.excerpt}</p>
        <p>{card.content}</p>
        <p>{card.content}</p>
      </div>
    </article>
  );
}
```

---

### `app/login/page.tsx`

```tsx
import Link from "next/link";
import Button from "@/components/Button";

// LOGIN PAGE — static form. No auth logic; just the design.
export default function LoginPage() {
  return (
    // Center the card vertically and horizontally
    <div className="flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
          <h1 className="text-2xl font-bold text-slate-900 text-center">
            Welcome back
          </h1>
          <p className="mt-1 text-sm text-slate-500 text-center">
            Log in to manage your posts.
          </p>

          <form className="mt-6 flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-sm font-medium text-slate-700">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                required
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="text-sm font-medium text-slate-700">
                Password <span className="text-red-500">*</span>
              </label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                required
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <p className="text-xs text-slate-500">Your password is case-sensitive.</p>
            </div>

            <Button type="submit" variant="primary" className="w-full">
              Log In
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-indigo-600 font-medium hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
```

---

### `app/register/page.tsx`

```tsx
import Link from "next/link";
import Button from "@/components/Button";

// REGISTER PAGE — static form. Same design language as login.
export default function RegisterPage() {
  return (
    <div className="flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
          <h1 className="text-2xl font-bold text-slate-900 text-center">
            Create your account
          </h1>
          <p className="mt-1 text-sm text-slate-500 text-center">
            Start writing and sharing your posts.
          </p>

          <form className="mt-6 flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="name" className="text-sm font-medium text-slate-700">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Sara Khan"
                required
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-sm font-medium text-slate-700">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                required
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <p className="text-xs text-slate-500">Use a valid email address so you can log in later.</p>
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="text-sm font-medium text-slate-700">
                Password <span className="text-red-500">*</span>
              </label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="At least 6 characters"
                required
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <p className="text-xs text-slate-500">Choose a strong password with at least 6 characters.</p>
            </div>

            <Button type="submit" variant="primary" className="w-full">
              Create Account
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link href="/login" className="text-indigo-600 font-medium hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
```

---

### `app/dashboard/page.tsx`  (User's cards + Edit/Delete)

```tsx
import BlogCard from "@/components/BlogCard";
import Button from "@/components/Button";
import { blogCards } from "@/lib/data";

// DASHBOARD — the logged-in user's own cards, with Edit/Delete actions.
// Static: we just reuse the sample data and pretend it belongs to the user.
export default function DashboardPage() {
  // Pretend the logged-in user owns the first 3 posts
  const myCards = blogCards.slice(0, 3);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* Header row: title + "Create" button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Posts</h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage the cards you have created.
          </p>
        </div>
        <Button href="/dashboard/create" variant="primary">
          + New Post
        </Button>
      </div>

      {/* Empty-state example (shown only if there are no cards) */}
      {myCards.length === 0 ? (
        <div className="mt-10 text-center bg-white border border-dashed border-slate-300 rounded-xl p-12">
          <p className="text-slate-500">You haven&apos;t created any posts yet.</p>
          <div className="mt-4">
            <Button href="/dashboard/create" variant="primary">
              Create your first post
            </Button>
          </div>
        </div>
      ) : (
        // Grid of the user's cards WITH edit/delete actions
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {myCards.map((card) => (
            <BlogCard key={card.id} card={card} showActions />
          ))}
        </div>
      )}
    </div>
  );
}
```

---

### `app/dashboard/create/page.tsx`

```tsx
import CardForm from "@/components/CardForm";

// CREATE CARD PAGE — reuses the shared CardForm in "create" mode (empty fields).
export default function CreateCardPage() {
  return <CardForm heading="Create a new post" submitLabel="Publish Post" />;
}
```

---

### `app/dashboard/edit/[id]/page.tsx`

```tsx
import Link from "next/link";
import CardForm from "@/components/CardForm";
import { blogCards } from "@/lib/data";

// EDIT CARD PAGE — reuses CardForm in "edit" mode (fields pre-filled).
// Static: find the card by id and pass it into the form.
export default async function EditCardPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const card = blogCards.find((c) => c.id === Number(id));

  if (!card) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-slate-900">Post not found</h1>
        <Link
          href="/dashboard"
          className="mt-4 inline-block text-indigo-600 hover:underline"
        >
          ← Back to dashboard
        </Link>
      </div>
    );
  }

  return (
    <CardForm card={card} heading="Edit post" submitLabel="Save Changes" />
  );
}
```

---

### `tailwind.config.ts`

```ts
import type { Config } from "tailwindcss";

// Tells Tailwind which files to scan for class names.
const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},   // add custom colors/fonts here later if you want
  },
  plugins: [],
};

export default config;
```

---

### `next.config.mjs`

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Allow images loaded from picsum.photos (the sample image source).
    remotePatterns: [
      { protocol: "https", hostname: "picsum.photos" },
    ],
  },
};

export default nextConfig;
```

---

**Summary:** you now have every page and component for a blog, fully styled with Tailwind and built from reusable pieces. Drop it into a Next.js app, run `npm run dev`, and start designing — then connect your Node.js backend when ready.
