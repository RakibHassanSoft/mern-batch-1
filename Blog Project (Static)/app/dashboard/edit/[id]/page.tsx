import Link from "next/link";
import CardForm from "@/components/CardForm";
import { blogCards } from "@/lib/data";

// EDIT CARD PAGE — reuses CardForm in "edit" mode (fields pre-filled).
// Static: find the card by id and pass it into the form.
export default async function EditCardPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const card = blogCards.find((c) => c.id === Number(id));

  if (!card) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-slate-900">Post not found</h1>
        <Link
          href="/dashboard"
          className="mt-4 inline-block text-indigo-600 hover:underline"
        >
          ← Back to dashboard
        </Link>
      </div>
    );
  }

  return (
    <CardForm card={card} heading="Edit post" submitLabel="Save Changes" />
  );
}
