import Link from "next/link";
import BlogCard from "@/components/BlogCard";
import { blogCards } from "@/lib/data";

// PUBLIC HOME PAGE — anyone can see all the cards here.
export default function HomePage() {
  return (
    <div>
      {/* ---------- Hero section ---------- */}
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 py-16 text-center">
          <span className="inline-block bg-indigo-50 text-indigo-600 text-xs font-medium px-3 py-1 rounded-full">
            Welcome to DevBlog
          </span>
          <h1 className="mt-4 text-4xl sm:text-5xl font-bold text-slate-900 tracking-tight">
            Share what you <span className="text-indigo-600">learn</span>
          </h1>
          <p className="mt-4 max-w-xl mx-auto text-slate-600">
            Read posts from developers, or sign up to write and manage your own.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <Link
              href="/register"
              className="bg-indigo-600 text-white text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-indigo-700 transition"
            >
              Start Writing
            </Link>
            <Link
              href="#posts"
              className="border border-slate-300 text-slate-700 text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-slate-100 transition"
            >
              Browse Posts
            </Link>
          </div>
        </div>
      </section>

      {/* ---------- Cards grid ---------- */}
      <section id="posts" className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-900">Latest Posts</h2>
          <span className="text-sm text-slate-500">{blogCards.length} posts</span>
        </div>

        {/* Responsive grid: 1 column on mobile, 2 on tablet, 3 on desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogCards.map((card) => (
            <BlogCard key={card.id} card={card} />
          ))}
        </div>
      </section>
    </div>
  );
}
