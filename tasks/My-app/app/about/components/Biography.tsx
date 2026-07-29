export default function Biography() {
  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-7xl">

        <div className="grid items-center gap-12 lg:grid-cols-2">

          {/* Left Side */}
          <div>

            <p className="mb-3 text-sm font-semibold uppercase tracking-[5px] text-blue-400">
              About Us
            </p>

            <h2 className="text-4xl font-bold md:text-5xl">
              Our Journey
            </h2>

            <p className="mt-6 leading-8 text-gray-400">
              Aurex is a creative digital agency focused on building modern,
              responsive and user-friendly websites. We started with a simple
              goal of helping businesses create a strong online presence through
              clean design and high-quality development.
            </p>

            <p className="mt-4 leading-8 text-gray-400">
              Our team combines creativity and technology to deliver websites
              that are visually attractive, fast, and optimized for all devices.
            </p>

          </div>

          {/* Right Side */}

          <div className="flex justify-center">

            <div className="flex h-[420px] w-full max-w-md items-center justify-center rounded-3xl border border-white/10 bg-gradient-to-br from-blue-600/20 to-purple-600/20">

              <h1 className="text-6xl font-extrabold text-white/80">
                AUREX
              </h1>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}