// Unit tests for the card API helpers.
// We MOCK the axios clients so no real network/server is needed —
// we just check each function calls the RIGHT method and URL, and
// uses the correct client (public `api` vs protected `authApi`).
//   npm test
import { describe, it, expect, vi, beforeEach } from "vitest";
import { api, authApi } from "@/lib/api";
import {
  getCards,
  getCard,
  getMyCards,
  createCard,
  updateCard,
  deleteCard,
} from "@/lib/cards";

// Replace the real axios clients with fake functions.
vi.mock("@/lib/api", () => ({
  api: { get: vi.fn() },
  authApi: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));

const sample = { id: "1", title: "Hello" };

beforeEach(() => {
  vi.clearAllMocks();
});

describe("PUBLIC card helpers (use `api`)", () => {
  it("getCards → GET /api/cards", async () => {
    (api.get as any).mockResolvedValue({ data: [sample] });
    const result = await getCards();
    expect(api.get).toHaveBeenCalledWith("/api/cards");
    expect(result).toEqual([sample]);
  });

  it("getCard → GET /api/cards/:id", async () => {
    (api.get as any).mockResolvedValue({ data: sample });
    const result = await getCard("1");
    expect(api.get).toHaveBeenCalledWith("/api/cards/1");
    expect(result).toEqual(sample);
  });
});

describe("PROTECTED card helpers (use `authApi`)", () => {
  it("getMyCards → GET /api/cards/mine", async () => {
    (authApi.get as any).mockResolvedValue({ data: [sample] });
    const result = await getMyCards();
    expect(authApi.get).toHaveBeenCalledWith("/api/cards/mine");
    expect(result).toEqual([sample]);
  });

  it("createCard → POST /api/cards with the data", async () => {
    (authApi.post as any).mockResolvedValue({ data: sample });
    const input = { title: "T", excerpt: "E", content: "C", category: "Next.js", image: "img" };
    const result = await createCard(input);
    expect(authApi.post).toHaveBeenCalledWith("/api/cards", input);
    expect(result).toEqual(sample);
  });

  it("updateCard → PUT /api/cards/:id with the data", async () => {
    (authApi.put as any).mockResolvedValue({ data: sample });
    const input = { title: "New", excerpt: "E", content: "C", category: "Next.js", image: "img" };
    await updateCard("1", input);
    expect(authApi.put).toHaveBeenCalledWith("/api/cards/1", input);
  });

  it("deleteCard → DELETE /api/cards/:id", async () => {
    (authApi.delete as any).mockResolvedValue({ data: { message: "Card deleted" } });
    await deleteCard("1");
    expect(authApi.delete).toHaveBeenCalledWith("/api/cards/1");
  });
});
