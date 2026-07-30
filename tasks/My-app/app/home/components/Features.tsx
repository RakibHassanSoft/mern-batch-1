import { Code, Globe, Smartphone, Palette } from "lucide-react";

const features = [
  {
    title: "Web Development",
    description: "Modern and responsive websites built with the latest technologies.",
    icon: Code,
  },
  {
    title: "UI / UX Design",
    description: "Beautiful user interfaces with a great user experience.",
    icon: Palette,
  },
  {
    title: "Responsive Design",
    description: "Looks perfect on desktop, tablet and mobile devices.",
    icon: Smartphone,
  },
  {
    title: "Global Reach",
    description: "Helping businesses build their online presence worldwide.",
    icon: Globe,
  },
];

export default function Features() {
  return (
    <section className="bg-slate-950 px-6 py-24">

      <div className="mx-auto max-w-7xl">

        <div className="text-center">
          <h2 className="text-4xl font-bold text-white">
            Our Features
          </h2>

          <p className="mt-4 text-gray-400">
            Everything you need to build a modern website.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">

          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <div
                key={index}
                className="rounded-2xl border border-white/10 bg-white/5 p-8 transition duration-300 hover:-translate-y-2 hover:border-blue-500 hover:bg-white/10"
              >
                <div className="mb-6 inline-flex rounded-xl bg-blue-500/20 p-4">
                  <Icon className="text-blue-400" size={32} />
                </div>

                <h3 className="text-2xl font-semibold text-white">
                  {feature.title}
                </h3>

                <p className="mt-4 text-gray-400">
                  {feature.description}
                </p>
              </div>
            );
          })}

        </div>

      </div>

    </section>
  );
}