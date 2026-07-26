// Unit tests for the auth API helpers.
// The axios client is mocked — we check the right URL is called and
// that the returned user is unwrapped from res.data.user.
//   npm test
import { describe, it, expect, vi, beforeEach } from "vitest";
import { authApi } from "@/lib/api";
import { registerUser, loginUser, logoutUser, getMe } from "@/lib/auth";

vi.mock("@/lib/api", () => ({
  authApi: { get: vi.fn(), post: vi.fn() },
}));

const user = { id: "u1", name: "Sara", email: "sara@x.com" };

beforeEach(() => {
  vi.clearAllMocks();
});

describe("auth helpers (all use the PROTECTED `authApi`)", () => {
  it("registerUser → POST /api/users/register and returns res.data.user", async () => {
    (authApi.post as any).mockResolvedValue({ data: { user } });
    const result = await registerUser("Sara", "sara@x.com", "123456");
    expect(authApi.post).toHaveBeenCalledWith("/api/users/register", {
      name: "Sara",
      email: "sara@x.com",
      password: "123456",
    });
    expect(result).toEqual(user);
  });

  it("loginUser → POST /api/users/login and returns the user", async () => {
    (authApi.post as any).mockResolvedValue({ data: { user } });
    const result = await loginUser("sara@x.com", "123456");
    expect(authApi.post).toHaveBeenCalledWith("/api/users/login", {
      email: "sara@x.com",
      password: "123456",
    });
    expect(result).toEqual(user);
  });

  it("logoutUser → POST /api/users/logout", async () => {
    (authApi.post as any).mockResolvedValue({ data: { message: "Logged out" } });
    await logoutUser();
    expect(authApi.post).toHaveBeenCalledWith("/api/users/logout");
  });

  it("getMe → GET /api/users/me", async () => {
    (authApi.get as any).mockResolvedValue({ data: user });
    const result = await getMe();
    expect(authApi.get).toHaveBeenCalledWith("/api/users/me");
    expect(result).toEqual(user);
  });
});
