import { describe, it, expect } from "vitest";
import { api, authApi } from "@/lib/api";

describe("axios API clients", () => {
  it("creates the public api client without credentials", () => {
    expect(api.defaults.withCredentials).toBeUndefined();
    expect(api.get).toBeDefined();
  });

  it("creates the protected authApi client with credentials", () => {
    expect(authApi.defaults.withCredentials).toBe(true);
    expect(authApi.post).toBeDefined();
    expect(authApi.get).toBeDefined();
  });
});
