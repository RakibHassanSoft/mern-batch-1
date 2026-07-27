# Blog Static (JavaScript, Bangla comments)

শুধু **ডিজাইন** — কোনো server বা database নেই। ডেটা আসে `lib/data.js` থেকে (fake)। সব কোড **JavaScript (JSX)**, প্রতিটি ফাইলে ছোট **Bangla comment**।

Design-only version. No backend. Data comes from `lib/data.js`. Pure JavaScript (`.jsx`) with Bangla comments.

## চালানো (Run)
```bash
npm install
npm run dev
```
খুলুন **http://localhost:3000**।

## ফাইল কাঠামো (Structure)
```
blog-static/
├── app/
│   ├── layout.jsx              ← Navbar + Footer wrapper
│   ├── page.jsx                ← হোম (সব কার্ড)
│   ├── blog/[id]/page.jsx      ← একটি পোস্ট
│   ├── login/page.jsx
│   ├── register/page.jsx
│   └── dashboard/
│       ├── page.jsx            ← আমার পোস্ট (Edit/Delete বাটন)
│       ├── create/page.jsx
│       └── edit/[id]/page.jsx
├── components/                 ← Navbar, Footer, Button, BlogCard, CardForm, InputField, TextareaField
└── lib/data.js                 ← fake ডেটা
```

## কী শিখবেন
- Next.js পেজ ও routing (folder = URL)
- component ও props
- `.map()` দিয়ে লিস্ট দেখানো
- Tailwind দিয়ে স্টাইল

এই ডিজাইন বোঝার পর `../blog-fullstack/` দেখুন — সেখানে এই ডিজাইনটাই আসল server-এর সাথে যুক্ত হয়েছে (axios দিয়ে)।
