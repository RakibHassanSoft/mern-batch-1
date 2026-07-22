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
│   ├── InputField.tsx             ← labelled text input
│   ├── TextareaField.tsx          ← labelled multi-line input
│   ├── BlogCard.tsx               ← one card in the grid (with optional actions)
│   └── CardForm.tsx               ← shared form for create AND edit
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

**InputField / TextareaField** — labelled fields with the focus ring. Used by every form. `defaultValue` lets the edit page pre-fill them.

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

**Summary:** you now have every page and component for a blog, fully styled with Tailwind and built from reusable pieces. Drop it into a Next.js app, run `npm run dev`, and start designing — then connect your Node.js backend when ready.
