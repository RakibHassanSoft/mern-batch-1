"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "@/lib/api"; // direct axios client

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

// SINGLE POST PAGE — public. Reads the :id from the URL and fetches that card.
export default function BlogPostPage() {
  const params = useParams();
  const id = params.id as string;

  const [card, setCard] = useState<Card | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Direct axios call — public route.
    api
      .get(`/api/cards/${id}`)
      .then((res) => setCard(res.data))
      .catch(() => setCard(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="max-w-3xl mx-auto px-4 py-20 text-slate-500">Loading...</p>;

  if (!card) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-slate-900">Post not found</h1>
        <Link href="/" className="mt-4 inline-block text-indigo-600 hover:underline">← Back to home</Link>
      </div>
    );
  }

  return (
    <article className="max-w-3xl mx-auto px-4 py-10">
      <Link href="/" className="text-sm text-slate-500 hover:text-indigo-600 transition">← Back to all posts</Link>

      <div className="mt-6 flex items-center gap-3">
        <span className="bg-indigo-600 text-white text-xs font-medium px-2.5 py-1 rounded-full">{card.category}</span>
        <span className="text-sm text-slate-500">{card.date}</span>
      </div>

      <h1 className="mt-4 text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">{card.title}</h1>

      <div className="mt-4 flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold">
          {card.author.charAt(0)}
        </div>
        <span className="text-sm font-medium text-slate-700">{card.author}</span>
      </div>

      <div className="relative h-64 sm:h-80 w-full mt-8 rounded-xl overflow-hidden">
        <Image src={card.image} alt={card.title} fill className="object-cover" />
      </div>

      <div className="mt-8 text-slate-700 leading-relaxed space-y-4">
        <p className="text-lg text-slate-800 font-medium">{card.excerpt}</p>
        <p>{card.content}</p>
      </div>
    </article>
  );
}
