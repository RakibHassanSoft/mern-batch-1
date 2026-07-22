import BlogCard from "@/components/BlogCard";
import Button from "@/components/Button";
import { blogCards } from "@/lib/data";

// DASHBOARD — the logged-in user's own cards, with Edit/Delete actions.
// Static: we just reuse the sample data and pretend it belongs to the user.
export default function DashboardPage() {
  // Pretend the logged-in user owns the first 3 posts
  const myCards = blogCards.slice(0, 3);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* Header row: title + "Create" button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Posts</h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage the cards you have created.
          </p>
        </div>
        <Button href="/dashboard/create" variant="primary">
          + New Post
        </Button>
      </div>

      {/* Empty-state example (shown only if there are no cards) */}
      {myCards.length === 0 ? (
        <div className="mt-10 text-center bg-white border border-dashed border-slate-300 rounded-xl p-12">
          <p className="text-slate-500">You haven&apos;t created any posts yet.</p>
          <div className="mt-4">
            <Button href="/dashboard/create" variant="primary">
              Create your first post
            </Button>
          </div>
        </div>
      ) : (
        // Grid of the user's cards WITH edit/delete actions
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {myCards.map((card) => (
            <BlogCard key={card.id} card={card} showActions />
          ))}
        </div>
      )}
    </div>
  );
}
