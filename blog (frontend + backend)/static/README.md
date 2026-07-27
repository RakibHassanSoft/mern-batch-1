# static/ — the Design-Only Version (for comparison)

This is the **starting point**: the blog UI with **fake data** and **no backend**. It's here so you can compare it, file by file, with the connected `../frontend/` version.

- Data comes from `lib/data.ts` (a hard-coded array).
- Forms don't submit; the Delete button does nothing.
- Nothing talks to a server.

## Compare with the connected version

Open the **same file** in both folders and see what changed:

| Open this (static) | …and this (connected) | What differs |
|--------------------|-----------------------|--------------|
| `static/app/page.tsx` | `../frontend/app/page.tsx` | `blogCards` array → `api.get("/api/cards")` |
| `static/app/blog/[id]/page.tsx` | `../frontend/app/blog/[id]/page.tsx` | `.find()` → `api.get("/api/cards/:id")` |
| `static/components/CardForm.tsx` | `../frontend/components/CardForm.tsx` | static form → controlled form with `authApi.post` / `authApi.put` |
| `static/app/dashboard/page.tsx` | `../frontend/app/dashboard/page.tsx` | fake slice → `authApi.get("/api/cards/mine")` + `authApi.delete` |
| `static/lib/data.ts` | *(gone — `lib/` now has only `api.ts`)* | fake data removed |

## The full step-by-step change list

See **`../STATIC-TO-CONNECTED.md`** — it shows every file's BEFORE → AFTER with the exact code and why.

## Run this static version (optional)
It uses the same Next.js + Tailwind setup. Drop it into a `create-next-app` project (TypeScript + Tailwind + App Router), or copy these `app/`, `components/`, `lib/` folders into one, then `npm run dev`.
