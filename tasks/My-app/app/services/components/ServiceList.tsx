import {
  Globe,
  Smartphone,
  Palette,
  Code,
  Search,
  ShieldCheck,
} from "lucide-react";

const services = [
  {
    title: "Web Development",
    description:
      "Build fast, secure and responsive websites using modern technologies.",
    icon: Globe,
  },
  {
    title: "Mobile Friendly Design",
    description:
      "Websites optimized for desktop, tablet and mobile devices.",
    icon: Smartphone,
  },
  {
    title: "UI / UX Design",
    description:
      "Modern and user-friendly interfaces with smooth user experience.",
    icon: Palette,
  },
  {
    title: "Frontend Development",
    description:
      "Interactive websites built with Next.js, React and Tailwind CSS.",
    icon: Code,
  },
  {
    title: "SEO Optimization",
    description:
      "Improve search engine ranking and website visibility.",
    icon: Search,
  },
  {
    title: "Website Security",
    description:
      "Protect your website with secure coding practices.",
    icon: ShieldCheck,
  },
];

export default function ServiceList() {
  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-7xl">

        <div className="text-center">
          <p className="font-semibold uppercase tracking-[5px] text-blue-400">
            Our Services
          </p>

          <h2 className="mt-3 text-4xl font-bold md:text-5xl">
            What We Offer
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-gray-400">
            We provide modern digital solutions to help businesses grow online.
          </p>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">

          {services.map((service, index) => {
            const Icon = service.icon;

            return (
              <div
                key={index}
                className="rounded-2xl border border-white/10 bg-slate-900 p-8 transition duration-300 hover:-translate-y-2 hover:border-blue-500"
              >
                <div className="mb-6 inline-flex rounded-xl bg-blue-500/20 p-4">
                  <Icon size={32} className="text-blue-400" />
                </div>

                <h3 className="text-2xl font-semibold">
                  {service.title}
                </h3>

                <p className="mt-4 leading-7 text-gray-400">
                  {service.description}
                </p>
              </div>
            );
          })}

        </div>

      </div>
    </section>
  );
}