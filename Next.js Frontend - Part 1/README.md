# Next.js Frontend — Part 1 (Fundamentals)

**For people who do NOT know React.** This part teaches you React *through* Next.js — just enough to build real pages — plus everything you need to get a Next.js app running and structured. Part 2 then covers dynamic routes, protected/private routes, data fetching, and finishing a real website.

> We use the modern **App Router** (the current recommended way, using the `app/` folder). Ignore any old tutorial that uses a `pages/` folder — that's the legacy system.
>
> Backend is **not** covered here — you said you'll use Node.js separately. This is pure frontend.

---

## 1. What is React? (You need the idea first)

**React** is a JavaScript library for building user interfaces out of **components**. A component is a reusable piece of UI — a button, a navbar, a card — written as a **function that returns what should appear on screen**.

Instead of writing one giant HTML file, you build small components and combine them like LEGO blocks:

```
<Page>
  <Navbar />
  <ProductList />
  <Footer />
</Page>
```

The special part: when your data changes, React automatically updates only the parts of the screen that need to change. You describe *what* the UI should look like for the current data, and React handles the *how*.

**Next.js** is a framework built on top of React. It adds the things React alone doesn't give you: routing (turning files into pages), performance optimisation, image/font handling, and more — all with almost no setup. So learning Next.js = learning React + a lot of convenience.

---

## 2. What is Next.js and Why Use It?

Plain React gives you components but nothing else — no routing, no page structure. You'd have to wire up many tools yourself. **Next.js gives you a complete, ready-to-build framework:**

- **File-based routing** — create a file, and it becomes a page. No router setup.
- **Fast by default** — pages are optimised and can render on the server.
- **Built-in image, font, and link optimisation.**
- **One command to create, run, and deploy.**

This is why most new React websites today are built with Next.js.

---

## 3. Setting Up (create your first app)

You need **Node.js** installed first (get it from https://nodejs.org — the LTS version).

Open a terminal and run:

```bash
npx create-next-app@latest my-app
```

It asks you some questions. For a beginner, choose:

```
Would you like to use TypeScript?        → Yes
Would you like to use ESLint?            → Yes
Would you like to use Tailwind CSS?      → Yes   (easy styling)
Would you like to use `src/` directory?  → No    (keeps it simple)
Would you like to use App Router?        → Yes   (VERY IMPORTANT: yes)
Would you like to customize the alias?   → No
```

Then start it:

```bash
cd my-app
npm run dev
```

Open **http://localhost:3000** in your browser. You'll see your app. Leave this running — every time you save a file, the browser updates automatically.

---

## 4. The Project Structure (what each folder is)

After creating the app, the important parts are:

```
my-app/
├── app/                ← YOUR PAGES LIVE HERE (this is everything)
│   ├── layout.tsx      ← the shared wrapper around every page
│   ├── page.tsx        ← the home page  (route: "/")
│   └── globals.css     ← global styles
├── public/             ← images and static files (logo.png, etc.)
├── package.json        ← project settings & dependencies
└── next.config.js      ← Next.js configuration
```

**The `app/` folder is where you spend 95% of your time.** Everything below is about the `app/` folder.

---

## 5. File-Based Routing (the core Next.js idea)

In Next.js, **folders inside `app/` become URLs**, and a file named **`page.tsx`** makes that folder a real page.

```
app/page.tsx              →  yoursite.com/
app/about/page.tsx        →  yoursite.com/about
app/contact/page.tsx      →  yoursite.com/contact
app/blog/page.tsx         →  yoursite.com/blog
```

Rule: **a folder = a URL segment**, and it needs a `page.tsx` inside to be visitable.

Your first page — `app/page.tsx`:

```tsx
export default function HomePage() {
  return (
    <main>
      <h1>Welcome to my website</h1>
      <p>This is the home page.</p>
    </main>
  );
}
```

Make an About page — create `app/about/page.tsx`:

```tsx
export default function AboutPage() {
  return (
    <main>
      <h1>About Us</h1>
      <p>We build cool things.</p>
    </main>
  );
}
```

Now visit `/about` — it just works. **No router configuration needed.** That's the magic of Next.js.

---

## 6. JSX — Writing HTML Inside JavaScript

That HTML-looking code inside the `return` is called **JSX**. It looks like HTML but has a few important differences:

```tsx
export default function Example() {
  return (
    <div>
      <h1>Hello</h1>
      <p>This is JSX</p>
    </div>
  );
}
```

**Rules of JSX:**

1. **Return ONE parent element.** Wrap multiple elements in one `<div>` or an empty `<>...</>` (called a Fragment):

```tsx
return (
  <>
    <h1>Title</h1>
    <p>Text</p>
  </>
);
```

2. **`className` instead of `class`** (because `class` is a reserved word in JavaScript):

```tsx
<div className="card">...</div>    // ✅
<div class="card">...</div>        // ❌
```

3. **Insert JavaScript values with `{ }`:**

```tsx
export default function Greeting() {
  const name = "Sara";
  const year = 2026;
  return <h1>Hello {name}, welcome to {year}</h1>;
}
```

4. **Close every tag**, even self-closing ones: `<img />`, `<br />`, `<input />`.

---

## 7. Components (building blocks)

A **component** is just a function that returns JSX. Its name **must start with a capital letter**. You build small components and use them inside bigger ones.

Create a folder for components (convention): `app/components/Navbar.tsx`

```tsx
export default function Navbar() {
  return (
    <nav>
      <h2>MySite</h2>
    </nav>
  );
}
```

Use it in a page by importing and writing it as a tag:

```tsx
import Navbar from "./components/Navbar";

export default function HomePage() {
  return (
    <div>
      <Navbar />
      <h1>Home</h1>
    </div>
  );
}
```

You can reuse a component as many times as you want — that's the whole point.

---

## 8. Props (passing data into components)

**Props** let you pass data into a component so it can be reused with different content. You send props like HTML attributes, and receive them as a typed object (remember the `type` object from the TypeScript notes).

The component that receives props:

```tsx
type CardProps = {
  title: string;
  description: string;
};

export default function Card({ title, description }: CardProps) {
  return (
    <div className="card">
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}
```

Using it with different props:

```tsx
import Card from "./components/Card";

export default function HomePage() {
  return (
    <div>
      <Card title="Fast" description="Loads instantly" />
      <Card title="Simple" description="Easy to learn" />
      <Card title="Powerful" description="Build anything" />
    </div>
  );
}
```

Same component, three different cards. `{ title, description }` is **destructuring** (from the TS notes) — pulling the props out by name.

---

## 9. Rendering Lists (showing arrays of data)

Real websites show lists — products, posts, users. You turn an array into JSX with `.map()`.

```tsx
export default function Fruits() {
  const fruits = ["Apple", "Banana", "Mango"];

  return (
    <ul>
      {fruits.map((fruit) => (
        <li key={fruit}>{fruit}</li>
      ))}
    </ul>
  );
}
```

- `.map(...)` transforms each array item into a `<li>`.
- **`key`** is required — a unique value per item so React can track each one. Use an `id` when you have one.

With objects and a component:

```tsx
type Product = { id: number; name: string; price: number };

export default function ProductList() {
  const products: Product[] = [
    { id: 1, name: "Shoes", price: 999 },
    { id: 2, name: "Bag", price: 1499 },
  ];

  return (
    <div>
      {products.map((p) => (
        <Card key={p.id} title={p.name} description={`₹${p.price}`} />
      ))}
    </div>
  );
}
```

---

## 10. Conditional Rendering (show things based on data)

Show different UI depending on a condition:

```tsx
export default function Status() {
  const isLoggedIn = true;

  return (
    <div>
      {isLoggedIn ? <p>Welcome back!</p> : <p>Please log in.</p>}
    </div>
  );
}
```

- `condition ? A : B` → show A if true, else B (the ternary operator).

Show something **only if** true (using `&&`):

```tsx
{isLoggedIn && <button>Logout</button>}
```

If `isLoggedIn` is false, nothing shows. This pattern is everywhere in real apps.

---

## 11. Navigation with `<Link>` (moving between pages)

To move between pages, **do NOT use a plain `<a>` tag** — it reloads the whole site (slow). Use Next.js's `<Link>`, which switches pages instantly.

```tsx
import Link from "next/link";

export default function Navbar() {
  return (
    <nav>
      <Link href="/">Home</Link>
      <Link href="/about">About</Link>
      <Link href="/contact">Contact</Link>
    </nav>
  );
}
```

`href` matches your folder-based routes from Section 5. That's all you need for navigation.

---

## 12. Layouts (shared UI around every page)

A **layout** wraps pages so shared things (navbar, footer) appear on every page without repeating them.

The root layout already exists at `app/layout.tsx`:

```tsx
import Navbar from "./components/Navbar";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Navbar />        {/* shows on every page */}
        {children}        {/* the current page renders here */}
        <footer>© 2026 MySite</footer>
      </body>
    </html>
  );
}
```

- `children` is a special prop → the page currently being viewed.
- `React.ReactNode` is just the type for "any renderable content."

You can also add layouts to specific folders (e.g. a dashboard layout for everything under `app/dashboard/`) — just put a `layout.tsx` in that folder. More on this in Part 2.

---

## 13. Server Components vs Client Components ⭐ (Next.js's biggest concept)

This is the one idea that confuses beginners, so read slowly.

In the App Router, **every component is a Server Component by default.** That means it runs on the server, produces HTML, and sends it to the browser. Server Components are fast and great for showing data — but they **cannot** use interactivity (clicks, typing, state).

When you need **interactivity** (a counter, a form, a toggle, anything that responds to the user), you make it a **Client Component** by adding `"use client";` at the very top of the file.

**Server Component (default) — no special line needed:**
```tsx
export default function Welcome() {
  return <h1>Hello, this runs on the server</h1>;
}
```

**Client Component — needs "use client":**
```tsx
"use client";

import { useState } from "react";

export default function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>Clicked {count} times</button>;
}
```

**Simple rule to remember:**

| Use a Server Component (default) when... | Use `"use client"` when... |
|------------------------------------------|-----------------------------|
| Just showing content/data | Using `useState` or `useEffect` |
| Fetching data | Handling clicks / typing (`onClick`, `onChange`) |
| No interactivity needed | Using browser-only features |

Tip: keep most things as Server Components, and make only the small interactive pieces Client Components.

---

## 14. State with `useState` (memory that changes the screen)

**State** is data that can change while the user uses the page — and when it changes, the screen updates automatically. You need state for counters, form inputs, toggles, etc. State requires a **Client Component**.

```tsx
"use client";

import { useState } from "react";

export default function Counter() {
  const [count, setCount] = useState(0);   // start at 0

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Add 1</button>
      <button onClick={() => setCount(0)}>Reset</button>
    </div>
  );
}
```

Breaking down `const [count, setCount] = useState(0)`:
- `useState(0)` → create a state value starting at `0`.
- `count` → the current value (read it).
- `setCount` → the function to **change** it. Always change state through this, never `count = 5`.
- Every time you call `setCount`, React re-renders and the screen updates.

(This `[count, setCount]` is array destructuring — from your TS notes. `useState<number>(0)` is the generic — also from your TS notes.)

A text input example (very common):

```tsx
"use client";

import { useState } from "react";

export default function NameBox() {
  const [name, setName] = useState("");

  return (
    <div>
      <input value={name} onChange={(e) => setName(e.target.value)} />
      <p>Hello {name}</p>
    </div>
  );
}
```

As you type, `onChange` runs, `setName` updates the state, and the `<p>` updates live.

---

## 15. Effects with `useEffect` (running code at the right time)

`useEffect` runs code **after** the component appears on screen — useful for things like starting a timer, or (in Part 2) fetching data on the client. Also a Client Component feature.

```tsx
"use client";

import { useState, useEffect } from "react";

export default function Clock() {
  const [time, setTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => clearInterval(timer);   // cleanup when component leaves
  }, []);   // empty [] = run once when it first appears

  return <h2>{time}</h2>;
}
```

- The function inside `useEffect` runs after render.
- The `[]` at the end is the **dependency array**: empty means "run once." If you put a value inside, it re-runs whenever that value changes.
- The returned function is **cleanup** — runs when the component disappears (stops the timer here).

Don't overuse `useEffect`. For most data loading in Next.js you'll fetch in Server Components instead (Part 2) — cleaner and faster.

---

## 16. Styling Your App

You picked Tailwind during setup, so here are the common options:

### Option A — Tailwind CSS (utility classes, recommended)
Style directly with class names — no separate CSS file needed:

```tsx
export default function Button() {
  return (
    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-800">
      Click Me
    </button>
  );
}
```

Common classes: `flex`, `grid`, `p-4` (padding), `m-2` (margin), `text-center`, `bg-red-500`, `rounded`, `text-xl`. You'll pick these up fast from https://tailwindcss.com/docs.

### Option B — Global CSS
Edit `app/globals.css` and use normal CSS (from your CSS notes):

```css
body { font-family: Arial, sans-serif; background: #f5f5f5; }
.card { padding: 20px; border-radius: 12px; background: white; }
```

### Option C — CSS Modules (scoped CSS per component)
Create `Card.module.css`:
```css
.card { padding: 20px; background: white; border-radius: 12px; }
```
Use it (styles only apply to this component — no name clashes):
```tsx
import styles from "./Card.module.css";

export default function Card() {
  return <div className={styles.card}>Hello</div>;
}
```

Pick one style and stay consistent. Tailwind is the easiest for beginners.

---

## 17. Putting Part 1 Together — a Mini Site

You now know enough to build a multi-page site. Structure:

```
app/
├── layout.tsx              (navbar + footer wrapper)
├── page.tsx                (home)
├── about/page.tsx          (about)
├── contact/page.tsx        (contact)
└── components/
    ├── Navbar.tsx
    ├── Card.tsx
    └── Counter.tsx         ("use client")
```

With Sections 1–16 you can:
- Create multiple pages (routing).
- Share a navbar/footer (layout).
- Navigate with `<Link>`.
- Build reusable components with props.
- Show lists and conditional content.
- Add interactivity with state.
- Style everything.

That's a real, working website already. 🎉

---

## 18. Part 1 Checklist

- [ ] Explain what React and Next.js are, and why we use the App Router.
- [ ] Create a new Next.js app and run it.
- [ ] Make new pages by adding folders + `page.tsx`.
- [ ] Write JSX correctly (`className`, `{ }`, one parent, closed tags).
- [ ] Build components and reuse them.
- [ ] Pass data with typed props.
- [ ] Render a list with `.map()` and `key`.
- [ ] Show conditional UI with `? :` and `&&`.
- [ ] Navigate with `<Link>`.
- [ ] Use a layout to share a navbar/footer.
- [ ] Explain Server vs Client Components and when to add `"use client"`.
- [ ] Use `useState` for interactivity and `useEffect` for timed code.
- [ ] Style with Tailwind / CSS Modules / global CSS.

---

## 19. Practice Task 🏋️

Build a small site with three pages (Home, About, Contact):

1. Create the app with `create-next-app`.
2. Add a `Navbar` component with `<Link>`s to all three pages, shown via the layout.
3. On the Home page, create a `Card` component and render **4 cards** from an array using `.map()`.
4. Add a `Counter` client component to the Home page.
5. Add a name `<input>` that greets the user live as they type.
6. Style everything with Tailwind.

When this works and feels comfortable, move on to **Part 2** — dynamic routes, protected/private pages, data fetching, and finishing a real website.
