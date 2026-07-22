import InputField from "./InputField";
import TextareaField from "./TextareaField";
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
        <InputField
          label="Title"
          name="title"
          placeholder="Enter a catchy title"
          defaultValue={card?.title}
        />

        <InputField
          label="Category"
          name="category"
          placeholder="e.g. Next.js"
          defaultValue={card?.category}
        />

        <InputField
          label="Cover Image URL"
          name="image"
          placeholder="https://..."
          defaultValue={card?.image}
        />

        <InputField
          label="Short Excerpt"
          name="excerpt"
          placeholder="One-line summary shown on the card"
          defaultValue={card?.excerpt}
        />

        <TextareaField
          label="Content"
          name="content"
          placeholder="Write your full post here..."
          defaultValue={card?.content}
        />

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
