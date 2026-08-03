import ContactForm from "./components/ContactForm";
import ContactInfo from "./components/ContactInfo";

export default function ContactPage() {
  return (
    <main className="bg-slate-950 text-white">
      <ContactInfo />
      <ContactForm />
    </main>
  );
}