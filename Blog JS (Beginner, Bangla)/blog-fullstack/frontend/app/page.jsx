"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import BlogCard from "@/components/BlogCard";
import { api } from "@/lib/api";

// HOME পেজ — সব কার্ড দেখায় (public)।
export default function HomePage() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);

  // পেজ লোড হলে সরাসরি api.get দিয়ে সব কার্ড আনি (public, cookie লাগে না)।
  useEffect(() => {
    api
      .get("/api/cards")
      .then((res) => setCards(res.data)) // res.data = কার্ডের array
      .catch(() => setCards([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* hero */}
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 py-16 text-center">
          <span className="inline-block bg-indigo-50 text-indigo-600 text-xs font-medium px-3 py-1 rounded-full">Welcome to DevBlog</span>
          <h1 className="mt-4 text-4xl sm:text-5xl font-bold text-slate-900 tracking-tight">
            Share what you <span className="text-indigo-600">learn</span>
          </h1>
          <p className="mt-4 max-w-xl mx-auto text-slate-600">পোস্ট পড়ুন, অথবা sign up করে নিজের পোস্ট লিখুন।</p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <Link href="/register" className="bg-indigo-600 text-white text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-indigo-700 transition">Start Writing</Link>
            <Link href="#posts" className="border border-slate-300 text-slate-700 text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-slate-100 transition">Browse Posts</Link>
          </div>
        </div>
      </section>

      {/* কার্ড grid */}
      <section id="posts" className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-900">Latest Posts</h2>
          <span className="text-sm text-slate-500">{cards.length} posts</span>
        </div>

        {loading ? (
          <p className="text-slate-500">Loading posts...</p>
        ) : cards.length === 0 ? (
          <p className="text-slate-500">এখনো কোনো পোস্ট নেই। প্রথম পোস্টটি আপনি লিখুন!</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {cards.map((card) => (
              <BlogCard key={card.id} card={card} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
