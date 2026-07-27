"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import InputField from "./InputField";
import TextareaField from "./TextareaField";
import Button from "./Button";
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

type CardFormProps = {
  card?: Card; // if given -> edit mode (PUT); otherwise create mode (POST)
  heading: string;
  submitLabel: string;
};

export default function CardForm({ card, heading, submitLabel }: CardFormProps) {
  const router = useRouter();

  // One state per field. In edit mode they start with the card's values.
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
    setSaving(true);

    const data = { title, category, image, excerpt, content };

    try {
      if (card) {
        // Direct axios call — EDIT (PUT).
        await authApi.put(`/api/cards/${card.id}`, data);
      } else {
        // Direct axios call — CREATE (POST).
        await authApi.post("/api/cards", data);
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

      <form onSubmit={handleSubmit} className="mt-6 bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col gap-5">
        {error && <p className="bg-red-50 text-red-700 text-sm px-3 py-2 rounded-lg">{error}</p>}

        <InputField label="Title" name="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter a catchy title" />
        <InputField label="Category" name="category" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="e.g. Next.js" />
        <InputField label="Cover Image URL" name="image" value={image} onChange={(e) => setImage(e.target.value)} placeholder="https://..." />
        <InputField label="Short Excerpt" name="excerpt" value={excerpt} onChange={(e) => setExcerpt(e.target.value)} placeholder="One-line summary" />
        <TextareaField label="Content" name="content" value={content} onChange={(e) => setContent(e.target.value)} placeholder="Write your full post here..." />

        <div className="flex gap-3 pt-2">
          <Button type="submit" variant="primary" disabled={saving}>{saving ? "Saving..." : submitLabel}</Button>
          <Button href="/dashboard" variant="outline">Cancel</Button>
        </div>
      </form>
    </div>
  );
}
