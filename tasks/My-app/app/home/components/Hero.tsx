import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 px-6">

      {/* Background Blur */}
      <div className="absolute left-20 top-20 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl"></div>
      <div className="absolute bottom-10 right-20 h-80 w-80 rounded-full bg-purple-500/20 blur-3xl"></div>

      <div className="relative z-10 mx-auto max-w-4xl text-center">

        <p className="mb-4 text-sm font-semibold uppercase tracking-[6px] text-blue-400">
          Welcome to Aurex
        </p>

        <h1 className="text-5xl font-extrabold leading-tight text-white md:text-7xl">
          Build Modern
          <span className="block bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
            Websites Easily
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-300">
          We create beautiful, responsive and modern websites using the latest web technologies.
        </p>

        <div className="mt-10 flex justify-center gap-5">

          <Link
            href="/services"
            className="rounded-full bg-blue-600 px-8 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            Get Started
          </Link>

          <Link
            href="/about"
            className="rounded-full border border-gray-500 px-8 py-3 font-semibold text-white transition hover:bg-white/10"
          >
            Learn More
          </Link>

        </div>

      </div>

    </section>
  );
}