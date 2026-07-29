import ServiceList from "./components/ServiceList";
import Pricing from "./components/Pricing";

export default function ServicesPage() {
  return (
    <main className="bg-slate-950 text-white">
      <ServiceList />
      <Pricing />
    </main>
  );
}