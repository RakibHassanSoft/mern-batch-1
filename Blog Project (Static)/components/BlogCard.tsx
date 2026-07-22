import Link from "next/link";
import Image from "next/image";
import type { BlogCard as BlogCardType } from "@/lib/data";

// A single blog card in the grid.
// showActions = true adds Edit/Delete buttons (used on the Dashboard).

type BlogCardProps = {
  card: BlogCardType;
  showActions?: boolean;
};

export default function BlogCard({ card, showActions = false }: BlogCardProps) {
  return (
    <article className="group bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition">
      {/* Cover image */}
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={card.image}
          alt={card.title}
          fill
          className="object-cover group-hover:scale-105 transition duration-300"
        />
        {/* Category pill floating on top of the image */}
        <span className="absolute top-3 left-3 bg-indigo-600 text-white text-xs font-medium px-2.5 py-1 rounded-full">
          {card.category}
        </span>
      </div>

      {/* Text content */}
      <div className="p-5">
        <h3 className="text-lg font-semibold text-slate-900 line-clamp-1">
          {card.title}
        </h3>
        <p className="mt-2 text-sm text-slate-600 line-clamp-2">{card.excerpt}</p>

        {/* Author + date row */}
        <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
          <span>{card.author}</span>
          <span>{card.date}</span>
        </div>

        {/* Read more link */}
        <Link
          href={`/blog/${card.id}`}
          className="mt-4 inline-block text-sm font-medium text-indigo-600 hover:text-indigo-800"
        >
          Read more →
        </Link>

        {/* Optional Edit / Delete actions (Dashboard only) */}
        {showActions && (
          <div className="mt-4 flex gap-2 border-t border-slate-100 pt-4">
            <Link
              href={`/dashboard/edit/${card.id}`}
              className="flex-1 text-center text-sm font-medium border border-slate-300 text-slate-700 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition"
            >
              Edit
            </Link>
            <button
              className="flex-1 text-sm font-medium bg-red-600 text-white px-3 py-1.5 rounded-lg hover:bg-red-700 transition"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </article>
  );
}
