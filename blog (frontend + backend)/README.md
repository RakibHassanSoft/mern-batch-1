# DevBlog — Full Stack (Next.js frontend + Node.js backend, connected with axios)

This repository contains a complete blog project with two parts:

- `backend/` — a Node.js + Express + MongoDB API.
- `frontend/` — a Next.js app that talks to the backend using axios.

The frontend shows public blog posts, and registered users can log in to create, edit, and delete their own posts. The login is cookie-based: the backend sets an httpOnly auth cookie, and the frontend sends it automatically when it uses the protected axios client.

---

## 1. What this README explains

This README tells you:

- how to start the backend and frontend correctly,
- how the frontend connects to the backend,
- what each important file does,
- where to change values if your backend URL or routes are different,
- how the public and protected axios clients work.

This is written for beginners, so every important connection is shown clearly.

---

## 2. Prerequisites

Before you start, install:

- Node.js (16+ is recommended),
- npm (comes with Node.js),
- MongoDB locally or a MongoDB Atlas cluster.

If you use MongoDB Atlas, replace the `MONGO_URI` value in the backend `.env` file with your Atlas connection string.

---

## 3. Running the backend

The backend lives in `backend/`.

### Step 1 — install backend dependencies

```bash
cd backend
npm install
```

### Step 2 — copy `.env.example` to `.env`

```bash
cp .env.example .env
```

On Windows, use:

```powershell
Copy-Item .env.example .env
```

### Step 3 — edit `backend/.env`

Open `backend/.env` and set your values:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/devblog
JWT_SECRET=some_long_random_secret
CLIENT_URL=http://localhost:3000
NODE_ENV=development
```

- `PORT` is the backend port.
- `MONGO_URI` is the MongoDB connection string.
- `JWT_SECRET` signs auth tokens. Use a long random string.
- `CLIENT_URL` must match your frontend URL exactly.
- `NODE_ENV=development` is fine for local use.

### Step 4 — start the backend

```bash
npm run dev
```

You should see messages like:

- `✅ MongoDB connected`
- `🚀 Server running on http://localhost:5000`

If the backend fails to start, check the `.env` values and make sure MongoDB is reachable.

---

## 4. Running the frontend

The frontend lives in `frontend/`.

### Step 1 — install frontend dependencies

```bash
cd frontend
npm install
```

### Step 2 — make sure frontend knows the backend URL

The frontend reads the backend URL from `frontend/.env.local`.

Create or update `frontend/.env.local` with:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

If your backend runs on a different URL, update this value to match.

### Step 3 — start the frontend

```bash
npm run dev
```

Open the app at:

```text
http://localhost:3000
```

---

## 5. How the frontend connects to the backend

The connection logic is in `frontend/lib/api.ts`.

### `frontend/lib/api.ts`

```ts
import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

export const api = axios.create({ baseURL });
export const authApi = axios.create({ baseURL, withCredentials: true });
```

- `api` is for public routes. It does not send a cookie.
- `authApi` is for protected routes. It sends the auth cookie because of `withCredentials: true`.
- `baseURL` comes from `NEXT_PUBLIC_API_URL`.

### Why two clients?

The backend has both open routes and protected routes.

Use `api` for read-only public data:

- `GET /api/cards`
- `GET /api/cards/:id`

Use `authApi` for actions that require login or the auth cookie:

- `POST /api/users/register`
- `POST /api/users/login`
- `POST /api/users/logout`
- `GET /api/users/me`
- `GET /api/cards/mine`
- `POST /api/cards`
- `PUT /api/cards/:id`
- `DELETE /api/cards/:id`

If you do not use `authApi` on protected calls, the browser will not send the cookie and the backend will return 401.

---

## 6. What each frontend file does

Below is the show-and-tell mapping between the frontend route files and the backend calls they make.

### Public pages

- `frontend/app/page.tsx` — home page
  - uses `api.get("/api/cards")`
  - shows all posts

- `frontend/app/blog/[id]/page.tsx` — single post page
  - uses `api.get(`/api/cards/${id}`)`
  - shows one full post by id

### Auth pages

- `frontend/app/register/page.tsx`
  - uses `authApi.post("/api/users/register", { name, email, password })`
  - creates a user account and sets the auth cookie

- `frontend/app/login/page.tsx`
  - uses `authApi.post("/api/users/login", { email, password })`
  - logs in and sets the auth cookie

### Dashboard pages

- `frontend/app/dashboard/page.tsx`
  - uses `authApi.get("/api/cards/mine")`
  - shows only the logged-in user's posts
  - deletes posts with `authApi.delete(`/api/cards/${id}`)`

- `frontend/app/dashboard/create/page.tsx`
  - renders `CardForm` for creating a new post

- `frontend/app/dashboard/edit/[id]/page.tsx`
  - uses `api.get(`/api/cards/${id}`)` to load the existing post
  - renders `CardForm` for editing

### Form component

- `frontend/components/CardForm.tsx`
  - creates a new post with `authApi.post("/api/cards", data)`
  - edits an existing post with `authApi.put(`/api/cards/${card.id}`, data)`

### Navbar component

- `frontend/components/Navbar.tsx`
  - checks login state with `authApi.get("/api/users/me")`
  - logs out with `authApi.post("/api/users/logout")`

---

## 7. How to change the backend connection

### Change the backend URL

If your backend runs on a different host or port, update this file:

- `frontend/.env.local`

Example:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

If you change the backend port or host, restart the frontend server after updating `.env.local`.

### Update the allowed frontend URL on the backend

In `backend/.env`, make sure `CLIENT_URL` matches the frontend address exactly:

```env
CLIENT_URL=http://localhost:3000
```

If the frontend runs on another port or domain, update `CLIENT_URL` accordingly.

### Change backend route paths

This frontend is written so the request URLs are visible in each page/component.

For example, if your backend uses a different card route, change the request inside the relevant file:

- `frontend/app/page.tsx`
- `frontend/app/blog/[id]/page.tsx`
- `frontend/app/register/page.tsx`
- `frontend/app/login/page.tsx`
- `frontend/components/CardForm.tsx`
- `frontend/app/dashboard/page.tsx`
- `frontend/components/Navbar.tsx`

If you change a route, update only the URL in the one place where that request is made.

### Change response data shape

Each page expects certain fields from the backend response. If your backend returns a different object shape, update the page's local types and the fields used in JSX.

Common fields used in the frontend:

- card: `id`, `title`, `excerpt`, `content`, `author`, `date`, `category`, `image`
- user: `id`, `name`, `email`

If your backend returns different field names, update the frontend code where it reads `res.data` and where it renders the card fields.

---

## 8. Backend API endpoints this frontend expects

The frontend is built to work with these endpoints:

### Auth endpoints

- `POST /api/users/register`
  - body: `{ name, email, password }`
  - response: should set the auth cookie and return user data

- `POST /api/users/login`
  - body: `{ email, password }`
  - response: should set the auth cookie and return user data

- `POST /api/users/logout`
  - body: none
  - response: should clear the auth cookie

- `GET /api/users/me`
  - body: none
  - response: should return the current user if logged in

### Card endpoints

- `GET /api/cards`
  - returns all cards

- `GET /api/cards/:id`
  - returns one card by id

- `GET /api/cards/mine`
  - returns the current user's cards
  - requires the auth cookie

- `POST /api/cards`
  - body: `{ title, category, image, excerpt, content }`
  - creates a new card for the logged-in user

- `PUT /api/cards/:id`
  - body: `{ title, category, image, excerpt, content }`
  - updates the card with the given id

- `DELETE /api/cards/:id`
  - deletes the card with the given id

If your backend does not support these endpoints, update the frontend request URLs and request bodies to match your server.

---

## 9. Troubleshooting

### The frontend shows a network or 401 error

- Make sure the backend is running.
- Check `frontend/.env.local` and `backend/.env` for the correct URLs.
- Restart the frontend server after changing `.env.local`.
- Protected requests must use `authApi`, and the backend must allow credentials from the frontend URL.

### The login or register request does not set a cookie

- The backend must send an httpOnly cookie.
- The frontend must use `authApi` with `withCredentials: true`.
- The backend `CLIENT_URL` must exactly match the frontend origin.

### The dashboard is empty or redirects to login

- That means `authApi.get("/api/cards/mine")` returned 401.
- Check your login flow and confirm the cookie is present.

### The app builds successfully but data is wrong

- Open the page file and compare the expected card fields with your backend response.
- Update the frontend fields or response shape as needed.

---

## 10. File structure for the current frontend

```text
frontend/
├── .env.local                     ← backend URL for axios
├── lib/
│   └── api.ts                     ← public + protected axios clients
├── app/
│   ├── layout.tsx
│   ├── globals.css
│   ├── page.tsx                   ← home page, loads all cards
│   ├── blog/[id]/page.tsx         ← single post page
│   ├── login/page.tsx             ← login form
│   ├── register/page.tsx          ← register form
│   └── dashboard/
│       ├── page.tsx               ← user dashboard
│       ├── create/page.tsx        ← create card page
│       └── edit/[id]/page.tsx     ← edit card page
├── components/
│   ├── Navbar.tsx                 ← login/logout state
│   ├── Footer.tsx
│   ├── Button.tsx
│   ├── BlogCard.tsx               ← card UI
│   └── CardForm.tsx               ← create/edit form
├── tests/
│   ├── cards.test.ts
│   └── auth.test.ts
└── vitest.config.ts
```

---

## 11. How to update the code for your backend

1. Set the backend URL in `frontend/.env.local`.
2. Make sure `backend/.env CLIENT_URL` matches the frontend origin.
3. If your backend has different route names, edit the request URLs in the page/component files listed above.
4. If your backend returns different JSON shapes, update the fields used in the frontend JSX and local types.

That is the full connection path: the frontend gets the backend URL from `.env.local`, sends requests through `frontend/lib/api.ts`, and uses the response data directly in pages and components.

---

## 12. Project Task Document

A beginner-friendly task plan and deadline is available at `project-task/ProjectTask.md`.