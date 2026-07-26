// Unit tests for the auth controller (register + login).
// We MOCK the User model, bcrypt, and jwt so no real database is needed.
//   node --test tests/authController.test.js
import { test } from "node:test";
import assert from "node:assert/strict";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../user/user.model.js";
import { register, login } from "../user/user.controller.js";

// Fake response that also records cookies
function mockRes() {
  return {
    statusCode: 200,
    body: undefined,
    cookies: {},
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      return this;
    },
    cookie(name, value) {
      this.cookies[name] = value;
      return this;
    },
  };
}

// ---------- REGISTER ----------
test("register → hashes password, sets cookie, returns safe user (201)", async (t) => {
  t.mock.method(bcrypt, "hash", async () => "hashed_pw");
  t.mock.method(User, "create", async (doc) => ({ _id: "u1", ...doc }));
  t.mock.method(jwt, "sign", () => "fake.jwt.token");

  const req = { body: { name: "Sara", email: "sara@x.com", password: "123456" } };
  const res = mockRes();
  await register(req, res);

  assert.equal(res.statusCode, 201);
  assert.equal(res.body.user.name, "Sara");
  assert.equal(res.body.user.password, undefined);   // password is NOT returned
  assert.equal(res.cookies.token, "fake.jwt.token"); // cookie was set
});

// ---------- LOGIN success ----------
test("login → correct password sets cookie and returns user", async (t) => {
  t.mock.method(User, "findOne", async () => ({
    _id: "u1",
    name: "Sara",
    email: "sara@x.com",
    password: "hashed_pw",
  }));
  t.mock.method(bcrypt, "compare", async () => true); // password matches
  t.mock.method(jwt, "sign", () => "fake.jwt.token");

  const req = { body: { email: "sara@x.com", password: "123456" } };
  const res = mockRes();
  await login(req, res);

  assert.equal(res.statusCode, 200);
  assert.equal(res.body.user.email, "sara@x.com");
  assert.equal(res.cookies.token, "fake.jwt.token");
});

// ---------- LOGIN wrong password ----------
test("login → wrong password returns 401", async (t) => {
  t.mock.method(User, "findOne", async () => ({
    _id: "u1",
    email: "sara@x.com",
    password: "hashed_pw",
  }));
  t.mock.method(bcrypt, "compare", async () => false); // password does NOT match

  const req = { body: { email: "sara@x.com", password: "wrong" } };
  const res = mockRes();
  await login(req, res);

  assert.equal(res.statusCode, 401);
  assert.equal(res.body.message, "Invalid email or password");
});
