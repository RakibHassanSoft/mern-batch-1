import { defineConfig } from "vitest/config";
import path from "path";

// Vitest config. The alias makes "@/..." imports work in tests,
// just like in the Next.js app.
export default defineConfig({
  resolve: {
    alias: { "@": path.resolve(__dirname, ".") },
  },
  test: {
    environment: "node",
  },
});
