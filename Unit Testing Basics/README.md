# Unit Testing Basics — for Backend (Node.js) & Frontend (React/Next.js)

A beginner guide to **unit testing**: what it is, why it helps, and how to write tests for both your Node.js backend and your Next.js frontend. There's a **runnable example** in the `examples/` folder you can try in 10 seconds.

---

## 1. What is Unit Testing?

A **unit test** is a small piece of code that checks that ONE piece of your program (a "unit" — usually a function) does what you expect.

Instead of manually clicking through your app every time you change something, you write tests once and run them anytime with one command. If something breaks, a test fails and tells you exactly what and where.

Analogy: before a car ships, each part (brakes, lights, horn) is tested on its own. A unit test checks one "part" of your code on its own.

### Why bother?
- **Catch bugs early** — before your users do.
- **Change code safely** — if you refactor and a test fails, you broke something.
- **Living documentation** — tests show how a function is meant to be used.
- **Confidence** — a green "all tests passed" means your core logic still works.

---

## 2. The Vocabulary (learn these 5 words)

| Word | Meaning |
|------|---------|
| **Test** | One check: "given this input, I expect this output." |
| **Assertion** | The actual comparison, e.g. `expect(result).toBe(5)` or `assert.equal(result, 5)`. |
| **Suite** | A group of related tests (often with `describe(...)`). |
| **Mock** | A fake stand-in for something real (a database, an API) so the test stays fast and isolated. |
| **Coverage** | How much of your code the tests actually run. |

### The golden pattern: **Arrange → Act → Assert**
Every test has three steps:
1. **Arrange** — set up the inputs.
2. **Act** — run the function.
3. **Assert** — check the result.

```js
test("sum adds two numbers", () => {
  const a = 2, b = 3;          // Arrange
  const result = sum(a, b);    // Act
  assert.equal(result, 5);     // Assert
});
```

---

## 3. Try It Right Now (runnable, zero install)

Node.js has a **built-in** test runner — no libraries needed. Open the `examples/` folder here and run:

```bash
cd examples
node --test
```

You'll see:
```
ok 1 - sum adds two numbers
ok 2 - sum works with negative numbers
ok 3 - discountPrice takes 20% off correctly
ok 4 - discountPrice rejects a percent above 100
# pass 4
```

Look at `examples/sum.js` (the code) and `examples/sum.test.js` (the tests). That's the whole idea. Notice we test a **normal case** *and* an **edge case** (an error being thrown) — good tests cover both.

---

## 4. Backend Unit Testing (Node.js)

You have two common choices.

### Option A — Node's built-in runner (`node:test`) — no install
Great for beginners. You already saw it above.

```js
import { test } from "node:test";
import assert from "node:assert/strict";
import { sum } from "./sum.js";

test("sum works", () => {
  assert.equal(sum(2, 3), 5);
});
```
Run with `node --test`. Add to `package.json`: `"test": "node --test"`.

### Option B — Jest (the most popular library)
Install: `npm install --save-dev jest`. Its style:

```js
const { sum } = require("./sum");

test("sum works", () => {
  expect(sum(2, 3)).toBe(5);
});
```
Run with `npx jest`. Jest has more built-in features (mocks, coverage reports) but needs setup for ES modules.

### Mocking the database (so tests don't need MongoDB)
Your controllers talk to MongoDB. In a unit test you **replace** the model with a fake, so no real database is touched:

```js
import { test } from "node:test";
import Card from "../card/card.model.js";
import { getCards } from "../card/card.controller.js";

test("getCards returns cards", async (t) => {
  // Fake the DB call:
  t.mock.method(Card, "find", () => ({ sort: () => [{ _id: "1", title: "Hi", createdAt: "2026-01-01" }] }));

  // Fake response object:
  const res = { body: null, json(x) { this.body = x; } };
  await getCards({}, res);

  // Check the controller returned what we expect
  if (res.body[0].id !== "1") throw new Error("expected id 1");
});
```

> Real examples live in the **`blog (frontend + backend)/backend/tests/`** folder — they test every CRUD method and the auth logic this way. Run them with `npm test` inside `backend/`.

---

## 5. Frontend Unit Testing (React / Next.js)

The go-to tool is **Vitest** (fast, works great with TypeScript). For testing what a component shows on screen, add **React Testing Library**.

### Install
```bash
npm install --save-dev vitest
# for component tests, also:
npm install --save-dev @testing-library/react @testing-library/jest-dom jsdom
```
Add to `package.json`: `"test": "vitest run"`.

### Testing a plain function (mock axios)
Your API helpers call axios. In a test you **mock** axios so no real server is needed — you just check the right method/URL is used:

```ts
import { describe, it, expect, vi } from "vitest";
import { api } from "@/lib/api";
import { getCards } from "@/lib/cards";

vi.mock("@/lib/api", () => ({ api: { get: vi.fn() } }));

it("getCards calls GET /api/cards", async () => {
  (api.get as any).mockResolvedValue({ data: [{ id: "1" }] });
  const result = await getCards();
  expect(api.get).toHaveBeenCalledWith("/api/cards");
  expect(result).toEqual([{ id: "1" }]);
});
```

### Testing a component's output (React Testing Library)
```tsx
import { render, screen } from "@testing-library/react";
import Button from "@/components/Button";

it("shows its label", () => {
  render(<Button>Click me</Button>);
  expect(screen.getByText("Click me")).toBeDefined();
});
```
The idea: render the component, then assert what the user would see.

> Real examples live in **`blog (frontend + backend)/frontend/tests/`** — they mock axios and check every API helper. Run them with `npm test` inside `frontend/`.

---

## 6. What Makes a GOOD Unit Test

- **Tests ONE thing.** One behaviour per test, with a clear name.
- **Fast & isolated.** No real database or network — use mocks.
- **Repeatable.** Same result every time; no dependence on today's date or random data.
- **Covers edges.** Not just the happy path — also empty input, wrong input, errors.
- **Reads like a sentence.** `test("login rejects a wrong password", ...)`.

### Common assertions you'll use
| Vitest / Jest | Node `assert` | Meaning |
|---------------|---------------|---------|
| `expect(x).toBe(5)` | `assert.equal(x, 5)` | equals |
| `expect(x).toEqual({...})` | `assert.deepEqual(x, {...})` | deep equals (objects/arrays) |
| `expect(fn).toThrow()` | `assert.throws(fn)` | throws an error |
| `expect(mock).toHaveBeenCalledWith(...)` | — | a mock was called with these args |

---

## 7. How Tests Fit Your Workflow

1. Write (or change) a function.
2. Write/adjust its test.
3. Run `npm test`.
4. Green ✅ → keep going. Red ❌ → read the message, fix, re-run.
5. Run tests before every commit/push so you never ship a broken function.

---

## 8. Practice 🏋️

1. Run the example: `cd examples && node --test` (should pass 4).
2. Add a `multiply(a, b)` function to `examples/sum.js` and write two tests for it.
3. Add an edge-case test: `discountPrice(100, -5)` should throw.
4. Open the backend tests in `blog (frontend + backend)/backend/tests/` and run `npm test` there.
5. Open the frontend tests in `blog (frontend + backend)/frontend/tests/` and run `npm test` there.
6. Break something on purpose (change a URL in `lib/cards.ts`) and watch the test fail — then fix it.

---

**Summary:** a unit test = *given this input, expect this output*, following Arrange → Act → Assert. Backend: `node --test` (built-in) or Jest, mock the database. Frontend: Vitest, mock axios (and React Testing Library for components). Keep tests fast, isolated, and run them often. The `blog (frontend + backend)` project already has working tests you can learn from.
