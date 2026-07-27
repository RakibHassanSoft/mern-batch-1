import CardForm from "@/components/CardForm";

// CREATE CARD PAGE — reuses the shared CardForm in "create" mode (empty fields).
export default function CreateCardPage() {
  return <CardForm heading="Create a new post" submitLabel="Publish Post" />;
}
