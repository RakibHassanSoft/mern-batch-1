import BlogCard from "@/components/BlogCard";
import Button from "@/components/Button";
import { blogCards } from "@/lib/data";

// DASHBOARD — এখানে user-এর নিজের কার্ডগুলো Edit/Delete বাটন সহ দেখায়।
// static version-এ আমরা ধরে নিই প্রথম ৩টি কার্ড এই user-এর।
export default function DashboardPage() {
  const myCards = blogCards.slice(0, 3);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Posts</h1>
          <p className="mt-1 text-sm text-slate-500">আপনার তৈরি করা পোস্টগুলো ম্যানেজ করুন।</p>
        </div>
        <Button href="/dashboard/create" variant="primary">+ New Post</Button>
      </div>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {myCards.map((card) => (
          <BlogCard key={card.id} card={card} showActions />
        ))}
      </div>
    </div>
  );
}
