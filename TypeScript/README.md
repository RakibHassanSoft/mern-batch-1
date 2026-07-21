# TypeScript — Beginner Notes (Only What You Need for React & Next.js)

This guide assumes you know **nothing about JavaScript**. We build every idea from zero and stop exactly at the point where you are ready to start React and then Next.js. Read top to bottom, type out every example yourself.

---

## 1. First, What is JavaScript? (You need this before TS)

**JavaScript (JS)** is the programming language that runs inside every web browser. HTML builds the structure of a page, CSS styles it, and **JavaScript makes it do things** — respond to clicks, load data, change text, etc.

A tiny JavaScript example:

```js
let name = "Aman";
console.log("Hello " + name);   // prints: Hello Aman
```

- `let` creates a variable (a labelled box that holds a value).
- `console.log(...)` prints something to the console (a text output area developers use).
- `//` starts a comment — a note the computer ignores.

That is the whole idea of JS: store values, and run instructions on them.

---

## 2. What is TypeScript? (And why it exists)

**TypeScript (TS)** is JavaScript **plus types**. It is a superset — meaning every valid JavaScript is also valid TypeScript. TS adds one main new power: you can say **what KIND of value** a variable is allowed to hold.

Why does that help? Look at this JavaScript problem:

```js
let age = 25;
age = "twenty five";   // JS allows this! Now age is text, which causes bugs later.
```

TypeScript stops mistakes like this **before you even run the code**:

```ts
let age: number = 25;
age = "twenty five";   // ❌ TypeScript ERROR: cannot assign text to a number
```

The `: number` part is a **type annotation** — you promise "age will always be a number." If you break the promise, TS warns you immediately in your editor (red squiggly line).

**Why React and Next.js use TypeScript:**
- Catches bugs while you type, not when users hit them.
- Autocomplete: your editor knows what's available and suggests it.
- Makes big projects (like a Next.js app) safe to change without breaking things.

The browser cannot run `.ts` files directly. TypeScript is **compiled** (translated) into plain JavaScript first. In React/Next.js this happens automatically — you never do it by hand.

---

## 3. Variables: let, const, var

Three ways to store a value. You will use only two.

```ts
let score = 10;        // can be changed later
const name = "Aman";   // CANNOT be changed (constant)
var old = 5;           // OLD way — do NOT use it
```

- Use **`const`** by default (most things never need to change).
- Use **`let`** only when the value must change later (a counter, a toggle).
- Never use **`var`** — it behaves in confusing ways.

```ts
const pi = 3.14;
pi = 3.15;    // ❌ ERROR: cannot reassign a const

let count = 0;
count = count + 1;   // ✅ fine, count is now 1
```

---

## 4. The Basic Types

These are the building blocks. Learn each one.

### string — text
```ts
let firstName: string = "Sara";
let greeting: string = "Hello";
```
Text is always wrapped in quotes: `"..."`, `'...'`, or backticks `` `...` ``.

### number — any number (whole or decimal)
```ts
let age: number = 30;
let price: number = 99.99;
```
There is no separate "integer" type — all numbers are just `number`.

### boolean — true or false only
```ts
let isLoggedIn: boolean = true;
let hasPaid: boolean = false;
```
Used constantly in React to decide "show this or not."

### Type inference (you can often skip the annotation)
TypeScript is smart. If you give a value right away, it figures out the type itself:

```ts
let city = "Delhi";   // TS already knows this is a string
city = 5;             // ❌ ERROR
```

So in real code you often write `let city = "Delhi"` and let TS infer. You add explicit types mostly for function inputs and complex data (covered below).

---

## 5. Template Literals (joining text with values)

Instead of gluing text with `+`, use backticks `` ` `` and `${ }`:

```ts
const name = "Aman";
const age = 25;

// Old way:
console.log("Hi " + name + ", you are " + age);

// Better way (template literal):
console.log(`Hi ${name}, you are ${age}`);
```

You will see `${ }` everywhere in React. It means "insert this value here."

---

## 6. Arrays (a list of values)

An array is an ordered list. Write the item type followed by `[]`.

```ts
let fruits: string[] = ["apple", "banana", "mango"];
let scores: number[] = [10, 20, 30];
let flags: boolean[] = [true, false, true];
```

Accessing items (counting starts at **0**):

```ts
console.log(fruits[0]);   // "apple"  (first item)
console.log(fruits[1]);   // "banana" (second item)
console.log(fruits.length); // 3      (how many items)
```

Adding and looping:

```ts
fruits.push("orange");        // add to the end
for (const fruit of fruits) { // do something with each item
    console.log(fruit);
}
```

Arrays are huge in React — lists of products, users, messages are all arrays.

---

## 7. Objects (grouped, labelled data)

An object groups related values under names (called **properties**). This is how React describes things like a user or a product.

```ts
const user = {
    name: "Sara",
    age: 28,
    isAdmin: false
};

console.log(user.name);   // "Sara"
console.log(user.age);    // 28
```

You read a property with a dot: `user.name`.

### Typing an object with `type`

To reuse a shape and get safety, describe it with a **type alias**:

```ts
type User = {
    name: string;
    age: number;
    isAdmin: boolean;
};

const user1: User = {
    name: "Sara",
    age: 28,
    isAdmin: false
};
```

Now TS enforces that every `User` has exactly those properties with those types. Miss one and you get an error. **This is one of the most important TS skills for React** — component props are described exactly like this.

### Optional properties with `?`

A `?` means "this property may or may not exist":

```ts
type User = {
    name: string;
    age: number;
    email?: string;   // optional
};

const u1: User = { name: "Sara", age: 28 };                    // ✅ ok, no email
const u2: User = { name: "Ali", age: 30, email: "a@x.com" };   // ✅ also ok
```

---

## 8. Functions (reusable blocks of instructions)

A function is a named set of steps you can run again and again. In TypeScript you type the **inputs** and the **output**.

```ts
function add(a: number, b: number): number {
    return a + b;
}

console.log(add(2, 3));   // 5
```

Reading it:
- `a: number, b: number` → the two inputs (parameters) must be numbers.
- `: number` after the `()` → the function gives back a number.
- `return` → the value the function produces.

If a function returns nothing, its type is `void`:

```ts
function greet(name: string): void {
    console.log(`Hello ${name}`);
    // no return
}
```

### Arrow Functions (the style React uses everywhere)

Same thing, shorter syntax. **You must be comfortable with this** — React components and event handlers are written like this.

```ts
const add = (a: number, b: number): number => {
    return a + b;
};

// If it's just one return line, you can drop the braces and 'return':
const addShort = (a: number, b: number): number => a + b;
```

The `=>` is the "arrow." Read `(a, b) => a + b` as "given a and b, give back a + b."

Optional and default parameters:

```ts
const greet = (name: string = "Guest"): string => `Hi ${name}`;
greet();          // "Hi Guest"  (used the default)
greet("Sara");    // "Hi Sara"
```

---

## 9. Union Types (a value that can be one of several types)

The `|` symbol means "OR." This is extremely common in React (a status, a theme, etc.).

```ts
let status: "loading" | "success" | "error";
status = "loading";   // ✅
status = "done";      // ❌ ERROR: not one of the allowed words

let id: string | number;   // can be text OR a number
id = "abc";   // ✅
id = 123;     // ✅
```

Those exact allowed words (`"loading" | "success" | "error"`) are called **literal types** — the value must be one of those specific strings.

---

## 10. `any`, `unknown`, and Why to Avoid `any`

```ts
let data: any = 5;
data = "hello";   // allowed
data = true;      // allowed
```

`any` turns OFF type checking for that variable. It removes the whole benefit of TypeScript. **Avoid it.** Beginners reach for `any` to silence errors — instead, take a moment to give the real type.

If you truly don't know the type yet, `unknown` is the safer choice (it forces you to check before using it). For now: just remember **don't sprinkle `any` everywhere.**

---

## 11. null and undefined (the "no value" values)

- `undefined` → a variable that has not been given a value yet.
- `null` → an intentional "empty / nothing."

```ts
let picked: string | null = null;   // nothing picked yet
picked = "red";                     // now it has a value
```

You will meet these in React when data hasn't loaded yet. The `string | null` union means "a string, or nothing."

Safe access with `?.` (optional chaining) — avoids crashes when something might be missing:

```ts
const user = { name: "Sara", address: { city: "Delhi" } };
console.log(user.address?.city);   // "Delhi", and won't crash if address is missing
```

---

## 12. interface vs type (for describing object shapes)

You saw `type` above. `interface` does almost the same job for objects:

```ts
interface User {
    name: string;
    age: number;
}

const u: User = { name: "Sara", age: 28 };
```

**Which to use?** For a beginner going into React/Next.js: **pick either and stay consistent.** Common guidance:
- `interface` for object/props shapes.
- `type` for unions and simpler aliases (`type Status = "on" | "off"`).

Both are fine. Don't overthink this — just know both words mean "the shape of an object."

---

## 13. Generics — Just Enough to Recognise Them

Generics let a type be filled in later, written with angle brackets `<>`. You do **not** need to write your own yet, but you WILL see them in React, so recognise the pattern:

```ts
let names: Array<string> = ["a", "b"];   // same as string[]
```

In React you'll see things like `useState<number>(0)` — the `<number>` is a generic telling React "this piece of state holds a number." That's the main place a beginner meets generics. Just know: **`<...>` after a name means "the type it works with goes here."**

---

## 14. Modules: import and export (how files share code)

Real apps (and every Next.js project) split code across many files. One file **exports** something, another **imports** it.

`math.ts`:
```ts
export const add = (a: number, b: number): number => a + b;
export const PI = 3.14;
```

`app.ts`:
```ts
import { add, PI } from "./math";
console.log(add(2, 3));   // 5
```

There is also a **default export** (one main thing per file). React components are usually default-exported:

```ts
// greeting.ts
export default function greeting() {
    return "hello";
}

// app.ts
import greeting from "./greeting";   // no curly braces for default
```

You must be comfortable reading both `import { x } from "..."` and `import x from "..."` — Next.js files are full of them.

---

## 15. Promises & async / await (code that waits)

Some tasks take time — loading data from the internet, reading a file, waiting for a timer. JavaScript does **not** freeze while waiting; it continues and comes back when the result is ready. This is called **asynchronous** ("async") code.

### What is a Promise?

A **Promise** is an object that represents a value that **isn't ready yet but will be soon**. Think of ordering food: you get a receipt (the promise) now, and the food (the value) arrives later. A promise ends in one of two ways:

- **resolved / fulfilled** → it worked, here's the value.
- **rejected** → it failed, here's the error.

### async / await (the easy, modern way)

`await` means "pause here until this promise finishes, then give me the result." You can only use `await` inside a function marked `async`.

```ts
async function loadData() {
    console.log("Start");
    const result = await someSlowTask();   // waits here until done
    console.log("Got:", result);           // runs only after it finishes
}
```

- `async` before a function → "this function contains waiting."
- `await` before a promise → "wait for the value, then continue."

An `async` function **always returns a Promise**. Its type looks like `Promise<Whatever>`:

```ts
async function getAge(): Promise<number> {
    return 25;   // even though you return a number, the type is Promise<number>
}
```

You'll write `async` functions constantly in Next.js to load data before showing a page.

---

## 16. Fetching Data with `fetch` (getting data from the internet)

`fetch` is the built-in tool for asking a server for data (calling an **API**). It returns a Promise, so you use `await` with it. **This is one of the most important real-world skills** — React and Next.js apps are mostly "fetch data, then show it."

### The basic pattern

```ts
async function getUser() {
    const response = await fetch("https://api.example.com/user");
    const data = await response.json();
    console.log(data);
}
```

Two `await`s, and here's why:
1. `await fetch(url)` → waits for the server to respond. Gives back a **Response** object (headers, status, etc. — not the data yet).
2. `await response.json()` → reads the response body and turns the JSON text into a usable JavaScript object.

> **JSON** = the text format servers use to send data. It looks just like a TS object (`{ "name": "Sara", "age": 28 }`). `.json()` converts that text into a real object you can use.

### Typing the fetched data

`fetch` doesn't know the shape of what comes back — by default the data is `any`. You should **tell TypeScript the shape** so you get safety and autocomplete:

```ts
type User = {
    id: number;
    name: string;
    email: string;
};

async function getUser(): Promise<User> {
    const response = await fetch("https://api.example.com/user/1");
    const data: User = await response.json();
    return data;
}
```

Now `data.name` autocompletes and `data.nam` is caught as an error.

### Handling errors with try / catch

Networks fail — the server might be down or the address wrong. Wrap risky code in `try / catch` so your app doesn't crash:

```ts
async function getUser(): Promise<User | null> {
    try {
        const response = await fetch("https://api.example.com/user/1");

        if (!response.ok) {                     // status wasn't 200-ish
            throw new Error(`Request failed: ${response.status}`);
        }

        const data: User = await response.json();
        return data;
    } catch (error) {
        console.log("Something went wrong:", error);
        return null;                            // return nothing instead of crashing
    }
}
```

- `try { }` → "attempt this."
- `catch (error) { }` → "if anything above failed, run this instead."
- `throw new Error(...)` → deliberately signal a failure.
- `response.ok` → `true` when the request succeeded.

### Fetching a list

APIs often return an array. Type it with `[]`:

```ts
type Product = { id: number; title: string; price: number };

async function getProducts(): Promise<Product[]> {
    const res = await fetch("https://api.example.com/products");
    const products: Product[] = await res.json();
    return products;
}
```

This exact pattern — an `async` function, `await fetch`, `await .json()`, a typed result — is what you'll use in nearly every Next.js data-loading function. Get comfortable with it now.

### Sending data (POST) — quick preview

Fetching (`GET`) just reads. To send data (create/update), you pass options:

```ts
await fetch("https://api.example.com/user", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: "Sara", age: 28 }),
});
```

`JSON.stringify(...)` does the reverse of `.json()` — it turns your TS object into JSON text to send. You don't need to master POST yet; just recognise it.

---

## 17. How This Connects to React (the payoff)

You don't need React yet, but here's why everything above matters, so it clicks later:

A React **component** is just a function that returns UI. Its inputs (called **props**) are typed with an object type — exactly like Section 7:

```ts
// This is a preview — you'll learn React itself next.
type ButtonProps = {
    label: string;
    disabled?: boolean;
};

function Button({ label, disabled }: ButtonProps) {
    return /* the button UI */;
}
```

Notice it uses: a `type` object (Section 7), optional `?` (Section 7), a function with typed input (Section 8), and destructuring `{ label, disabled }` (see below). **If you understand this README, you're ready.**

### Destructuring (unpacking values by name)

One more small skill you'll see constantly. Instead of `props.label`, React "unpacks" values:

```ts
const user = { name: "Sara", age: 28 };
const { name, age } = user;   // pull out name and age into their own variables
console.log(name);            // "Sara"

// Same idea for arrays (by position):
const [first, second] = ["a", "b"];
console.log(first);   // "a"
```

`const [count, setCount] = useState(0)` in React is exactly this array destructuring.

---

## 18. Checklist: Are You Ready for React / Next.js?

Tick these off. If you can do each one without looking, you're ready.

- [ ] Explain what TypeScript adds to JavaScript (types).
- [ ] Use `const` and `let` correctly.
- [ ] Type a variable as `string`, `number`, `boolean`.
- [ ] Use template literals: `` `Hi ${name}` ``.
- [ ] Create and read arrays (`string[]`) and objects.
- [ ] Describe an object's shape with `type` or `interface`, including optional `?` properties.
- [ ] Write a normal function AND an arrow function with typed inputs/output.
- [ ] Read a union type like `"on" | "off"` or `string | number`.
- [ ] Understand why to avoid `any`.
- [ ] Use `import` / `export` (both named and default).
- [ ] Recognise a generic like `useState<number>(0)`.
- [ ] Destructure objects `{ }` and arrays `[ ]`.
- [ ] Understand Promises and use `async` / `await`.
- [ ] Fetch data with `await fetch(...)` and `await res.json()`, and type the result.
- [ ] Handle failures with `try` / `catch`.

---

## 19. How to Practice (set up in 2 minutes)

The fastest way to try everything above, no installation needed:

1. Go to **https://www.typescriptlang.org/play**
2. Type the examples from this guide on the left.
3. See the errors and results instantly on the right.

When you build real projects later, TypeScript is already included in Next.js — you just create the app and start writing `.ts` / `.tsx` files.

---

## 20. Practice Task 🏋️

Write these in the TypeScript Playground:

1. Make a `const` for your name (string) and `let` for your age (number).
2. Create a `type Student` with `name: string`, `age: number`, and optional `email?: string`.
3. Make two students using that type.
4. Put both students in an array: `Student[]`.
5. Write an arrow function `introduce` that takes a `Student` and returns a sentence using a template literal.
6. Loop over your array and `console.log` each introduction.
7. Add a union type `let level: "beginner" | "pro"` and set it.
8. Write an `async` function `loadUsers` that fetches `https://jsonplaceholder.typicode.com/users`, types the result as an array, and `console.log`s the first user's name. Wrap it in `try` / `catch`. (This is a free public API you can actually call.)

If you finish this comfortably, start learning **React** next — then **Next.js**.

---

**Golden rule for beginners:** don't try to learn *all* of TypeScript. The pieces in this file are 90% of what you use in React and Next.js. Master these, and learn the rest only when a real project needs it.
