# Mini E-Commerce Website Project Task

## Deadline

- **Due Date:** 29th, 11:59 PM
- Complete all tasks and submit the project before the deadline.

---

## Project Overview

এই প্রোজেক্টে একটি Beginner Friendly Mini E-Commerce Website তৈরি করতে হবে।

Frontend:
- Next.js 15 (App Router)
- Tailwind CSS
- Axios
- React Hook Form
- React Hot Toast

Backend:
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcrypt

---

## Main Goal

একটি ইউজার বেসড ফ্রন্টেন্ড ও ব্যাকএন্ড এপ্লিকেশন তৈরি করা, যেখানে একজন ইউজার রেজিস্টার, লগইন, প্রোডাক্ট ব্রাউজ, কার্ট ম্যানেজ ও প্রোফাইল আপডেট করতে পারবে।

---

## Key Features

### Authentication

- Register
- Login
- Logout
- Protected Routes

### Product

- Create Product
- View All Products
- View Single Product
- Update Product
- Delete Product

### Cart

- Add Product to Cart
- View Cart
- Remove Product from Cart

### Profile

- View Profile
- Update Profile

---

## Recommended Folder Structure

### Backend

```
src/
│
├── app.js
├── server.js
│
├── config/
│     └── db.js
│
├── middlewares/
│     ├── verifyToken.js
│     └── errorHandler.js
│
├── utils/
│     └── generateToken.js
│
├── user/
│     ├── user.model.js
│     ├── user.validation.js
│     ├── user.service.js
│     ├── user.controller.js
│     └── user.route.js
│
├── product/
│     ├── product.model.js
│     ├── product.validation.js
│     ├── product.service.js
│     ├── product.controller.js
│     └── product.route.js
│
└── cart/
      ├── cart.model.js
      ├── cart.validation.js
      ├── cart.service.js
      ├── cart.controller.js
      └── cart.route.js
```

### Frontend

```
src/
│
app/
│
├── page.jsx
│
├── login/
│      page.jsx
│
├── register/
│      page.jsx
│
├── products/
│      page.jsx
│
│      [id]/
│           page.jsx
│
├── cart/
│      page.jsx
│
├── profile/
│      page.jsx
│
components/
│
├── common/
│      Navbar.jsx
│      Footer.jsx
│      Button.jsx
│      Input.jsx
│      Loading.jsx
│
├── auth/
│      LoginForm.jsx
│      RegisterForm.jsx
│
├── product/
│      ProductCard.jsx
│      ProductGrid.jsx
│      ProductDetails.jsx
│
├── cart/
│      CartItem.jsx
│      CartSummary.jsx
│
└── profile/
       ProfileCard.jsx
       UpdateProfileForm.jsx

services/
hooks/
utils/
middleware.ts
```

---

## Backend Tasks

### Day 1

- Project setup and folder structure
- Install backend packages
- Connect MongoDB
- Create User module
- Create Product module
- Create Cart module
- Add JWT authentication
- Add middleware for protected routes
- Test backend routes with Postman or similar

### Backend API Endpoints

- `POST /api/users/register`
- `POST /api/users/login`
- `GET /api/users/profile`
- `PATCH /api/users/profile`
- `GET /api/products`
- `GET /api/products/:id`
- `POST /api/products`
- `PATCH /api/products/:id`
- `DELETE /api/products/:id`
- `GET /api/cart`
- `POST /api/cart`
- `DELETE /api/cart/:id`

---

## Frontend Tasks

### Day 2

- Project setup and install frontend packages
- Configure Tailwind CSS
- Build the public pages
- Build authentication pages
- Build products listing and product details pages
- Build cart page
- Build profile page
- Connect frontend pages to backend APIs
- Protect routes that require login
- Add Toast notifications for success and error states
- Final testing across flows

### Frontend Page List

- `/` — Home page
- `/register` — Register page
- `/login` — Login page
- `/products` — Products page
- `/products/[id]` — Product details page
- `/cart` — Cart page
- `/profile` — Profile page

---

## Important Notes

- Keep the code beginner-friendly.
- Prefer simple, clear component structure.
- Use local types and inline logic where it helps understanding.
- Keep API calls visible in pages/components instead of hiding them behind many small helpers.
- Write meaningful comments in code for beginners.

---

## Delivery Checklist

- [ ] Backend runs and connects to MongoDB.
- [ ] Authentication works.
- [ ] Products are CRUD-ready.
- [ ] Cart works for add/remove actions.
- [ ] Profile view and update works.
- [ ] Frontend uses direct axios calls clearly.
- [ ] README or project task doc explains how to run the app.
- [ ] Project is finished by 29th night 11:59 PM.
