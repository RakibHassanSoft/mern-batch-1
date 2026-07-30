export default function ContactForm() {
  return (
    <section className="bg-slate-900 px-6 py-24">

      <div className="mx-auto max-w-3xl">

        <div className="text-center">

          <p className="font-semibold uppercase tracking-[5px] text-blue-400">
            Send Message
          </p>

          <h2 className="mt-3 text-4xl font-bold">
            Contact Form
          </h2>

        </div>

        <form className="mt-12 space-y-6 rounded-2xl border border-white/10 bg-slate-950 p-8">

          <div>

            <label className="mb-2 block font-medium">
              Full Name
            </label>

            <input
              type="text"
              placeholder="Enter your name"
              className="w-full rounded-lg border border-white/10 bg-slate-900 p-4 outline-none transition focus:border-blue-500"
            />

          </div>

          <div>

            <label className="mb-2 block font-medium">
              Email Address
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              className="w-full rounded-lg border border-white/10 bg-slate-900 p-4 outline-none transition focus:border-blue-500"
            />

          </div>

          <div>

            <label className="mb-2 block font-medium">
              Message
            </label>

            <textarea
              rows={6}
              placeholder="Write your message..."
              className="w-full rounded-lg border border-white/10 bg-slate-900 p-4 outline-none transition focus:border-blue-500"
            />

          </div>

          <button
            className="w-full rounded-lg bg-blue-600 py-4 font-semibold transition hover:bg-blue-700"
          >
            Send Message
          </button>

        </form>

      </div>

    </section>
  );
}