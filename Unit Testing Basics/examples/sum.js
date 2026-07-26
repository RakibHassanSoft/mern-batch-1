// A tiny function we want to test.
export const sum = (a, b) => a + b;

// A slightly bigger one, to show testing edge cases.
export const discountPrice = (price, percent) => {
  if (percent < 0 || percent > 100) {
    throw new Error("percent must be between 0 and 100");
  }
  return price - (price * percent) / 100;
};
