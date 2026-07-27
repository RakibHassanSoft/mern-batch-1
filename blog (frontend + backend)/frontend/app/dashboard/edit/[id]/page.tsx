"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import CardForm from "@/components/CardForm";
import { api } from "@/lib/api";

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

// EDIT PAGE — fetches the card, then renders the shared form pre-filled (edit mode).
export default function EditCardPage() {
  const params = useParams();
  const id = params.id as string;

  const [card, setCard] = useState<Card | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get(`/api/cards/${id}`)
      .then((res) => setCard(res.data))
      .catch(() => setCard(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <p className="max-w-2xl mx-auto px-4 py-16 text-slate-500">Loading...</p>;
  }

  if (!card) {
    return <p className="max-w-2xl mx-auto px-4 py-16 text-slate-500">Post not found.</p>;
  }

  return <CardForm card={card} heading="Edit post" submitLabel="Save Changes" />;
}
