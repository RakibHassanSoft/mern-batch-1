"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import BlogCard from "@/components/BlogCard";
import Button from "@/components/Button";
import { authApi } from "@/lib/api";

// DASHBOARD — শুধু লগইন করা user-এর নিজের কার্ড দেখায় (protected)।
export default function DashboardPage() {
  const router = useRouter();
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);

  // নিজের কার্ড আনি — সরাসরি authApi.get (cookie যায়)।
  // লগইন না থাকলে server 401 দেয় → আমরা /login-এ পাঠাই।
  useEffect(() => {
    authApi
      .get("/api/cards/mine")
      .then((res) => setCards(res.data))
      .catch(() => router.push("/login"))
      .finally(() => setLoading(false));
  }, [router]);

  // Delete — সরাসরি authApi.delete, তারপর স্ক্রিন থেকেও বাদ দিই।
  const handleDelete = async (id) => {
    if (!confirm("এই পোস্টটি মুছে ফেলবেন?")) return;
    await authApi.delete(`/api/cards/${id}`);
    setCards((prev) => prev.filter((c) => c.id !== id));
  };

  if (loading) return <p className="max-w-6xl mx-auto px-4 py-16 text-slate-500">Loading your posts...</p>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Posts</h1>
          <p className="mt-1 text-sm text-slate-500">আপনার তৈরি করা পোস্টগুলো ম্যানেজ করুন।</p>
        </div>
        <Button href="/dashboard/create" variant="primary">+ New Post</Button>
      </div>

      {cards.length === 0 ? (
        <div className="mt-10 text-center bg-white border border-dashed border-slate-300 rounded-xl p-12">
          <p className="text-slate-500">আপনি এখনো কোনো পোস্ট বানাননি।</p>
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
