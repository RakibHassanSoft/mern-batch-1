import InputField from "./InputField";
import TextareaField from "./TextareaField";
import Button from "./Button";

// CardForm = create আর edit দুই জায়গাতেই একই ফর্ম ব্যবহার হয়।
// card থাকলে ফিল্ডগুলো আগে থেকে পূরণ থাকে (edit mode)।
// (এই static version-এ ফর্ম কিছু save করে না, শুধু ডিজাইন দেখায়।)
export default function CardForm({ card, heading, submitLabel }) {
  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-slate-900">{heading}</h1>
      <p className="mt-1 text-sm text-slate-500">নিচের তথ্যগুলো পূরণ করুন।</p>

      <form className="mt-6 bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col gap-5">
        <InputField label="Title" name="title" placeholder="একটি সুন্দর টাইটেল দিন" defaultValue={card?.title} />
        <InputField label="Category" name="category" placeholder="যেমন: Next.js" defaultValue={card?.category} />
        <InputField label="Cover Image URL" name="image" placeholder="https://..." defaultValue={card?.image} />
        <InputField label="Short Excerpt" name="excerpt" placeholder="এক লাইনের সারাংশ" defaultValue={card?.excerpt} />
        <TextareaField label="Content" name="content" placeholder="পুরো লেখা এখানে লিখুন..." defaultValue={card?.content} />

        <div className="flex gap-3 pt-2">
          <Button type="submit" variant="primary">{submitLabel}</Button>
          <Button href="/dashboard" variant="outline">Cancel</Button>
        </div>
      </form>
    </div>
  );
}
