// Static sample data so the design has something to show.
// Later you will replace this with data from your Node.js backend.

export type BlogCard = {
  id: number;
  title: string;
  excerpt: string;   // short preview text
  content: string;   // full text (used on the single-post page)
  author: string;
  date: string;
  category: string;
  image: string;     // any image URL
};

export const blogCards: BlogCard[] = [
  {
    id: 1,
    title: "Getting Started with Next.js",
    excerpt:
      "Next.js makes building React apps simple with file-based routing and zero config.",
    content:
      "Next.js is a React framework that gives you routing, optimisation, and a great developer experience out of the box. In this post we walk through creating your first app, adding pages, and understanding the App Router.",
    author: "Sara Khan",
    date: "Jul 20, 2026",
    category: "Next.js",
    image: "https://picsum.photos/seed/next/600/400",
  },
  {
    id: 2,
    title: "Understanding Tailwind CSS",
    excerpt:
      "Style your app quickly using utility classes instead of writing custom CSS files.",
    content:
      "Tailwind CSS is a utility-first framework. Instead of writing CSS, you compose small classes like flex, p-4, and text-center directly in your markup. This post explains the mindset and the most useful classes.",
    author: "Aman Verma",
    date: "Jul 18, 2026",
    category: "CSS",
    image: "https://picsum.photos/seed/tailwind/600/400",
  },
  {
    id: 3,
    title: "REST APIs with Node.js",
    excerpt:
      "Learn how to build a clean CRUD API using Express and MongoDB with Mongoose.",
    content:
      "A REST API exposes your data over HTTP methods: GET, POST, PUT, and DELETE. Using Express and Mongoose you can build a full CRUD backend quickly. Here is how the pieces fit together.",
    author: "Priya Singh",
    date: "Jul 15, 2026",
    category: "Node.js",
    image: "https://picsum.photos/seed/node/600/400",
  },
  {
    id: 4,
    title: "TypeScript for Beginners",
    excerpt:
      "Add types to your JavaScript to catch bugs early and get better autocomplete.",
    content:
      "TypeScript is JavaScript with types. It catches mistakes before you run your code and makes large projects safer to change. This post covers the basics every React developer needs.",
    author: "Sara Khan",
    date: "Jul 12, 2026",
    category: "TypeScript",
    image: "https://picsum.photos/seed/ts/600/400",
  },
  {
    id: 5,
    title: "Git & GitHub Essentials",
    excerpt:
      "Track your code, collaborate with others, and never lose your work again.",
    content:
      "Git is a version control system and GitHub hosts your repositories online. Together they let you save snapshots of your project and work with a team. Learn the core commands here.",
    author: "Aman Verma",
    date: "Jul 09, 2026",
    category: "Git",
    image: "https://picsum.photos/seed/git/600/400",
  },
  {
    id: 6,
    title: "How the Web Works",
    excerpt:
      "From typing a URL to seeing a page — understand the request/response cycle.",
    content:
      "When you visit a website, your browser asks DNS for an IP address, connects to a server, sends an HTTP request, and renders the response. Understanding this makes everything else easier.",
    author: "Priya Singh",
    date: "Jul 05, 2026",
    category: "Web",
    image: "https://picsum.photos/seed/web/600/400",
  },
];
