"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import BlogCard from "@/components/BlogCard";
import Button from "@/components/Button";
import { authApi } from "@/lib/api"; // protected client

type Card = {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  category: string;
  image: string;
};

// DASHBOARD — PROTECTED. Shows only the logged-in user's cards.
export default function DashboardPage() {
  const router = useRouter();
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Direct axios call — the cookie proves who you are.
    // If it fails (not logged in), send the user to /login.
    authApi
      .get("/api/cards/mine")
      .then((res) => setCards(res.data))
      .catch(() => router.push("/login"))
      .finally(() => setLoading(false));
  }, [router]);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this post?")) return;
    // Direct axios call — delete on the server, then remove from the screen.
    await authApi.delete(`/api/cards/${id}`);
    setCards((prev) => prev.filter((c) => c.id !== id));
  };

  if (loading) return <p className="max-w-6xl mx-auto px-4 py-16 text-slate-500">Loading your posts...</p>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Posts</h1>
          <p className="mt-1 text-sm text-slate-500">Manage the cards you have created.</p>
        </div>
        <Button href="/dashboard/create" variant="primary">+ New Post</Button>
      </div>

      {cards.length === 0 ? (
        <div className="mt-10 text-center bg-white border border-dashed border-slate-300 rounded-xl p-12">
          <p className="text-slate-500">You haven&apos;t created any posts yet.</p>
          <div className="mt-4">
            <Button href="/dashboard/create" variant="primary">Create your first post</Button>
          </div>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card) => (
            <BlogCard key={card.id} card={card} showActions onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}
