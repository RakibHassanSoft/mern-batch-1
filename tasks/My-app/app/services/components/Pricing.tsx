const plans = [
  {
    name: "Basic",
    price: "$99",
    features: [
      "1 Page Website",
      "Responsive Design",
      "Basic SEO",
      "Email Support",
    ],
  },
  {
    name: "Standard",
    price: "$249",
    features: [
      "5 Page Website",
      "Responsive Design",
      "SEO Optimization",
      "Priority Support",
    ],
  },
  {
    name: "Premium",
    price: "$499",
    features: [
      "Unlimited Pages",
      "Modern UI/UX",
      "Advanced SEO",
      "24/7 Support",
    ],
  },
];

export default function Pricing() {
  return (
    <section className="bg-slate-900 px-6 py-24">
      <div className="mx-auto max-w-7xl">

        <div className="text-center">
          <p className="font-semibold uppercase tracking-[5px] text-blue-400">
            Pricing
          </p>

          <h2 className="mt-3 text-4xl font-bold md:text-5xl">
            Choose Your Plan
          </h2>

          <p className="mt-4 text-gray-400">
            Select the package that best fits your business.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">

          {plans.map((plan, index) => (
            <div
              key={index}
              className="rounded-2xl border border-white/10 bg-slate-950 p-8 transition duration-300 hover:scale-105 hover:border-blue-500"
            >
              <h3 className="text-2xl font-bold">
                {plan.name}
              </h3>

              <p className="mt-4 text-5xl font-extrabold text-blue-400">
                {plan.price}
              </p>

              <ul className="mt-8 space-y-4">
                {plan.features.map((feature, i) => (
                  <li key={i} className="text-gray-300">
                    ✅ {feature}
                  </li>
                ))}
              </ul>

              <button className="mt-10 w-full rounded-lg bg-blue-600 py-3 font-semibold transition hover:bg-blue-700">
                Choose Plan
              </button>
            </div>
          ))}

        </div>

      </div>
    </section>
  );
}