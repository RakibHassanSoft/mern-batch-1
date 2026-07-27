"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "./Button";
import { createCard, updateCard } from "@/lib/cards";
import type { Card } from "@/lib/types";

// Shared form for BOTH creating and editing a card.
// If `card` is passed -> edit mode (PUT). Otherwise -> create mode (POST).

type CardFormProps = {
  card?: Card;
  heading: string;
  submitLabel: string;
};

export default function CardForm({ card, heading, submitLabel }: CardFormProps) {
  const router = useRouter();

  // Pre-fill the fields in edit mode, empty in create mode
  const [title, setTitle] = useState(card?.title ?? "");
  const [category, setCategory] = useState(card?.category ?? "");
  const [image, setImage] = useState(card?.image ?? "");
  const [excerpt, setExcerpt] = useState(card?.excerpt ?? "");
  const [content, setContent] = useState(card?.content ?? "");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!title || !category || !excerpt || !content) {
      setError("Please fill in all required fields before saving.");
      return;
    }

    setSaving(true);
    const data = { title, category, image, excerpt, content };

    try {
      if (card) {
        await updateCard(card.id, data); // PROTECTED axios (PUT)
      } else {
        await createCard(data); // PROTECTED axios (POST)
      }
      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Could not save. Are you logged in?");
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-slate-900">{heading}</h1>
      <p className="mt-1 text-sm text-slate-500">Fill in the details below.</p>

      <form
        onSubmit={handleSubmit}
        className="mt-6 bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col gap-5"
      >
        {error && (
          <p className="bg-red-50 text-red-700 text-sm px-3 py-2 rounded-lg">{error}</p>
        )}

        <div className="flex flex-col gap-1.5">
          <label htmlFor="title" className="text-sm font-medium text-slate-700">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            id="title"
            name="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter a catchy title"
            required
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
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="e.g. Next.js"
            required
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
            value={image}
            onChange={(e) => setImage(e.target.value)}
            placeholder="https://..."
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
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder="One-line summary"
            required
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
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={6}
            placeholder="Write your full post here..."
            required
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm resize-y focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          <p className="text-xs text-slate-500">Share your full post content here. Use paragraphs and headings if needed.</p>
        </div>

        <div className="flex gap-3 pt-2">
          <Button type="submit" variant="primary" disabled={saving}>
            {saving ? "Saving..." : submitLabel}
          </Button>
          <Button href="/dashboard" variant="outline">
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
