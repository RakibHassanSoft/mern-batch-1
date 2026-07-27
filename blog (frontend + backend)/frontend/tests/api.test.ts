// Unit test for the two axios clients in lib/api.ts.
// We now call axios directly in components (no wrapper functions),
// so the thing worth testing is that the clients are configured right:
//   - both point at NEXT_PUBLIC_API_URL
//   - authApi sends credentials (the cookie), api does not
//   npm test
import { describe, it, expect, beforeAll } from "vitest";

beforeAll(() => {
  // Set the env var BEFORE importing lib/api.ts (it reads it at import time).
  process.env.NEXT_PUBLIC_API_URL = "http://localhost:5000";
});

describe("axios clients (lib/api.ts)", () => {
  it("api is public (no credentials) and uses the API base URL", async () => {
    const { api } = await import("@/lib/api");
    expect(api.defaults.baseURL).toBe("http://localhost:5000");
    expect(api.defaults.withCredentials).toBeFalsy(); // public → no cookie
  });

  it("authApi is protected (sends the cookie)", async () => {
    const { authApi } = await import("@/lib/api");
    expect(authApi.defaults.baseURL).toBe("http://localhost:5000");
    expect(authApi.defaults.withCredentials).toBe(true); // protected → cookie
  });
});
