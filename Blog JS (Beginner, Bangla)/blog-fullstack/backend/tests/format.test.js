// Unit test for the pure `format` helper.
// Uses Node's built-in test runner (no libraries needed):
//   node --test tests/format.test.js
import { test } from "node:test";
import assert from "node:assert/strict";
import { format } from "../card/format.js";

// A fake card document, like Mongoose would give us
const fakeDoc = {
  _id: "abc123",
  title: "Hello",
  excerpt: "Short",
  content: "Full text",
  author: "Sara",
  category: "Next.js",
  image: "img.jpg",
  createdAt: "2026-07-24T10:05:00.000Z",
  updatedAt: "2026-07-24T10:05:00.000Z",
  __v: 0,
};

test("format() renames _id to id", () => {
  const out = format(fakeDoc);
  assert.equal(out.id, "abc123");
  assert.equal(out._id, undefined); // _id is gone
});

test("format() turns createdAt into a friendly date", () => {
  const out = format(fakeDoc);
  assert.equal(out.date, "Jul 24, 2026");
});

test("format() keeps the content fields", () => {
  const out = format(fakeDoc);
  assert.equal(out.title, "Hello");
  assert.equal(out.author, "Sara");
  assert.equal(out.category, "Next.js");
});

test("format() does NOT leak internal fields", () => {
  const out = format(fakeDoc);
  assert.equal(out.__v, undefined);
  assert.equal(out.updatedAt, undefined);
  assert.equal(out.createdBy, undefined);
});
