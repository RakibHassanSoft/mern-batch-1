import CardForm from "@/components/CardForm";

// CREATE PAGE — renders the shared form in create mode (empty fields).
export default function CreateCardPage() {
  return <CardForm heading="Create a new post" submitLabel="Publish Post" />;
}
