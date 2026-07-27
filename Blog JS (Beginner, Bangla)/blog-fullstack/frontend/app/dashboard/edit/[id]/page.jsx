"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import CardForm from "@/components/CardForm";
import { api } from "@/lib/api";

// EDIT পেজ — আগে কার্ডটি এনে, তারপর CardForm-এ পূরণ করে দেখাই (PUT হবে)।
export default function EditCardPage() {
  const params = useParams();
  const id = params.id;

  const [card, setCard] = useState(null);
  const [loading, setLoading] = useState(true);

  // সরাসরি api.get দিয়ে কার্ডটি আনি।
  useEffect(() => {
    api
      .get(`/api/cards/${id}`)
      .then((res) => setCard(res.data))
      .catch(() => setCard(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="max-w-2xl mx-auto px-4 py-16 text-slate-500">Loading...</p>;
  if (!card) return <p className="max-w-2xl mx-auto px-4 py-16 text-slate-500">Post not found.</p>;

  return <CardForm card={card} heading="Edit post" submitLabel="Save Changes" />;
}
