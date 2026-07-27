import CardForm from "@/components/CardForm";

// CREATE পেজ — CardForm-কে খালি অবস্থায় দেখায় (নতুন পোস্ট)।
export default function CreateCardPage() {
  return <CardForm heading="Create a new post" submitLabel="Publish Post" />;
}
