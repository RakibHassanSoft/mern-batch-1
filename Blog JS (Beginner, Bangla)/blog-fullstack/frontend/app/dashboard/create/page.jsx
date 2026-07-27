import CardForm from "@/components/CardForm";

// CREATE পেজ — CardForm খালি অবস্থায় দেখায় (নতুন পোস্ট, POST হবে)।
export default function CreateCardPage() {
  return <CardForm heading="Create a new post" submitLabel="Publish Post" />;
}
