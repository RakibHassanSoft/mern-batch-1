import Biography from "./components/Biography";
import Team from "./components/Team";

export default function AboutPage() {
  return (
    <main className="bg-slate-950 text-white">
      <Biography />
      <Team />
    </main>
  );
}