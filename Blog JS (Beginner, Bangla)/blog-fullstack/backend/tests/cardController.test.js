// Unit tests for the card controller (GET / POST / PUT / DELETE).
// We MOCK the database model, so no real MongoDB is needed.
//   node --test tests/cardController.test.js
import { test } from "node:test";
import assert from "node:assert/strict";
import Card from "../card/card.model.js";
import {
  getCards,
  getCard,
  createCard,
  updateCard,
  deleteCard,
} from "../card/card.controller.js";

// A fake response object that records what the controller sends back.
function mockRes() {
  return {
    statusCode: 200,
    body: undefined,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      return this;
    },
  };
}

const sampleDoc = {
  _id: "card1",
  title: "Hello",
  excerpt: "Short",
  content: "Full",
  author: "Sara",
  category: "Next.js",
  image: "img.jpg",
  createdAt: "2026-07-24T10:05:00.000Z",
};

// ---------- GET ALL ----------
test("GET getCards → returns a formatted array", async (t) => {
  // Card.find().sort() should resolve to an array
  t.mock.method(Card, "find", () => ({ sort: () => [sampleDoc] }));

  const res = mockRes();
  await getCards({}, res);

  assert.equal(Array.isArray(res.body), true);
  assert.equal(res.body[0].id, "card1"); // formatted: _id -> id
  assert.equal(res.body[0].date, "Jul 24, 2026");
});

// ---------- GET ONE ----------
test("GET getCard → returns one formatted card", async (t) => {
  t.mock.method(Card, "findById", async () => sampleDoc);

  const res = mockRes();
  await getCard({ params: { id: "card1" } }, res);

  assert.equal(res.body.id, "card1");
  assert.equal(res.body.title, "Hello");
});

test("GET getCard → returns null when not found", async (t) => {
  t.mock.method(Card, "findById", async () => null);

  const res = mockRes();
  await getCard({ params: { id: "nope" } }, res);

  assert.equal(res.body, null);
});

// ---------- CREATE (POST) ----------
test("POST createCard → sets author from user and returns 201", async (t) => {
  t.mock.method(Card, "create", async (doc) => ({
    _id: "new1",
    ...doc,
    createdAt: "2026-07-24T10:05:00.000Z",
  }));

  const req = {
    body: { title: "T", excerpt: "E", content: "C", category: "Next.js", image: "img" },
    user: { _id: "u1", name: "Sara" },
  };
  const res = mockRes();
  await createCard(req, res);

  assert.equal(res.statusCode, 201);
  assert.equal(res.body.id, "new1");
  assert.equal(res.body.author, "Sara"); // author came from the logged-in user
  assert.equal(res.body.title, "T");
});

// ---------- UPDATE (PUT) ----------
test("PUT updateCard → returns the updated card", async (t) => {
  t.mock.method(Card, "findOneAndUpdate", async (filter) => {
    // the owner check must be in the filter
    assert.equal(filter.createdBy, "u1");
    return { ...sampleDoc, title: "Updated" };
  });

  const req = { params: { id: "card1" }, body: { title: "Updated" }, user: { _id: "u1" } };
  const res = mockRes();
  await updateCard(req, res);

  assert.equal(res.body.title, "Updated");
});

test("PUT updateCard → returns null if not the owner (no match)", async (t) => {
  t.mock.method(Card, "findOneAndUpdate", async () => null);

  const req = { params: { id: "card1" }, body: {}, user: { _id: "someoneElse" } };
  const res = mockRes();
  await updateCard(req, res);

  assert.equal(res.body, null);
});

// ---------- DELETE ----------
test("DELETE deleteCard → returns a success message", async (t) => {
  t.mock.method(Card, "findOneAndDelete", async (filter) => {
    assert.equal(filter.createdBy, "u1"); // owner check present
    return sampleDoc;
  });

  const req = { params: { id: "card1" }, user: { _id: "u1" } };
  const res = mockRes();
  await deleteCard(req, res);

  assert.deepEqual(res.body, { message: "Card deleted" });
});
