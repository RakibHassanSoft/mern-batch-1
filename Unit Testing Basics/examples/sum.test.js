// A runnable unit test using Node's BUILT-IN test runner.
// No libraries to install. Run it with:
//   node --test
import { test } from "node:test";
import assert from "node:assert/strict";
import { sum, discountPrice } from "./sum.js";

// ---- The "Arrange, Act, Assert" pattern ----
test("sum adds two numbers", () => {
  // Arrange: set up inputs
  const a = 2;
  const b = 3;

  // Act: run the function
  const result = sum(a, b);

  // Assert: check the output is what we expect
  assert.equal(result, 5);
});

test("sum works with negative numbers", () => {
  assert.equal(sum(-4, 1), -3);
});

// ---- Testing a normal case ----
test("discountPrice takes 20% off correctly", () => {
  assert.equal(discountPrice(100, 20), 80);
});

// ---- Testing an EDGE case (an error should be thrown) ----
test("discountPrice rejects a percent above 100", () => {
  assert.throws(() => discountPrice(100, 150), /between 0 and 100/);
});
