import Button from "./Button";
import type { BlogCard } from "@/lib/data";

// Shared form for BOTH creating and editing a card.
// If `card` is passed, the fields are pre-filled (edit mode).

type CardFormProps = {
  card?: BlogCard;       // undefined = create mode, provided = edit mode
  heading: string;
  submitLabel: string;
};

export default function CardForm({ card, heading, submitLabel }: CardFormProps) {
  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-slate-900">{heading}</h1>
      <p className="mt-1 text-sm text-slate-500">
        Fill in the details below. (Static form — no saving yet.)
      </p>

      {/* Card container */}
      <form className="mt-6 bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="title" className="text-sm font-medium text-slate-700">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            id="title"
            name="title"
            type="text"
            placeholder="Enter a catchy title"
            defaultValue={card?.title}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          <p className="text-xs text-slate-500">Give your post a clear title so readers know what to expect.</p>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="category" className="text-sm font-medium text-slate-700">
            Category <span className="text-red-500">*</span>
          </label>
          <input
            id="category"
            name="category"
            type="text"
            placeholder="e.g. Next.js"
            defaultValue={card?.category}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          <p className="text-xs text-slate-500">Pick one category such as Next.js, React, or Node.js.</p>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="image" className="text-sm font-medium text-slate-700">
            Cover Image URL
          </label>
          <input
            id="image"
            name="image"
            type="url"
            placeholder="https://..."
            defaultValue={card?.image}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          <p className="text-xs text-slate-500">Optional: paste an image URL to show a cover image for your post.</p>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="excerpt" className="text-sm font-medium text-slate-700">
            Short Excerpt <span className="text-red-500">*</span>
          </label>
          <input
            id="excerpt"
            name="excerpt"
            type="text"
            placeholder="One-line summary shown on the card"
            defaultValue={card?.excerpt}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          <p className="text-xs text-slate-500">Write a short summary that explains the main idea.</p>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="content" className="text-sm font-medium text-slate-700">
            Content <span className="text-red-500">*</span>
          </label>
          <textarea
            id="content"
            name="content"
            rows={6}
            placeholder="Write your full post here..."
            defaultValue={card?.content}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm resize-y focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          <p className="text-xs text-slate-500">Share your full post content here. Use paragraphs and headings if needed.</p>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3 pt-2">
          <Button type="submit" variant="primary">
            {submitLabel}
          </Button>
          <Button href="/dashboard" variant="outline">
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
