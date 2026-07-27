import { describe, it, expect } from "vitest";
import { authApi } from "@/lib/api";

describe("authApi client", () => {
  it("creates a protected axios client with credentials", () => {
    expect(authApi.defaults.withCredentials).toBe(true);
    expect(authApi.post).toBeDefined();
    expect(authApi.get).toBeDefined();
  });
});
