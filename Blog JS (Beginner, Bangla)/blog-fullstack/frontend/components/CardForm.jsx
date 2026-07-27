"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import InputField from "./InputField";
import TextareaField from "./TextareaField";
import Button from "./Button";
import { authApi } from "@/lib/api";

// CardForm = create আর edit দুই কাজেই এই ফর্ম।
// card থাকলে edit (PUT), না থাকলে create (POST)।
export default function CardForm({ card, heading, submitLabel }) {
  const router = useRouter();

  // প্রতিটি ফিল্ডের জন্য state। edit হলে আগের value দিয়ে শুরু হয়।
  const [title, setTitle] = useState(card?.title || "");
  const [category, setCategory] = useState(card?.category || "");
  const [image, setImage] = useState(card?.image || "");
  const [excerpt, setExcerpt] = useState(card?.excerpt || "");
  const [content, setContent] = useState(card?.content || "");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();       // পেজ reload বন্ধ করি
    setError("");
    setSaving(true);

    const data = { title, category, image, excerpt, content };

    try {
      if (card) {
        // edit — সরাসরি authApi.put কল (protected, cookie যায়)
        await authApi.put(`/api/cards/${card.id}`, data);
      } else {
        // create — সরাসরি authApi.post কল
        await authApi.post("/api/cards", data);
      }
      router.push("/dashboard");  // কাজ শেষে dashboard-এ ফেরত
      router.refresh();
    } catch (err) {
      setError("সেভ করা যায়নি। আপনি কি লগইন করা আছেন?");
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-slate-900">{heading}</h1>
      <p className="mt-1 text-sm text-slate-500">নিচের তথ্যগুলো পূরণ করুন।</p>

      <form onSubmit={handleSubmit} className="mt-6 bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col gap-5">
        {error && <p className="bg-red-50 text-red-700 text-sm px-3 py-2 rounded-lg">{error}</p>}

        <InputField label="Title" name="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="একটি সুন্দর টাইটেল" />
        <InputField label="Category" name="category" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="যেমন: Next.js" />
        <InputField label="Cover Image URL" name="image" value={image} onChange={(e) => setImage(e.target.value)} placeholder="https://..." />
        <InputField label="Short Excerpt" name="excerpt" value={excerpt} onChange={(e) => setExcerpt(e.target.value)} placeholder="এক লাইনের সারাংশ" />
        <TextareaField label="Content" name="content" value={content} onChange={(e) => setContent(e.target.value)} placeholder="পুরো লেখা এখানে..." />

        <div className="flex gap-3 pt-2">
          <Button type="submit" variant="primary" disabled={saving}>{saving ? "Saving..." : submitLabel}</Button>
          <Button href="/dashboard" variant="outline">Cancel</Button>
        </div>
      </form>
    </div>
  );
}
