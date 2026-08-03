import {
  MapPin,
  Phone,
  Mail,
} from "lucide-react";

export default function ContactInfo() {
  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-7xl">

        <div className="text-center">

          <p className="font-semibold uppercase tracking-[5px] text-blue-400">
            Contact Us
          </p>

          <h2 className="mt-3 text-4xl font-bold md:text-5xl">
            Get In Touch
          </h2>

          <p className="mt-4 text-gray-400">
            We would love to hear from you.
          </p>

        </div>

        <div className="mt-16 grid gap-10 lg:grid-cols-2">

          {/* Contact Information */}

          <div className="space-y-8 rounded-2xl border border-white/10 bg-slate-900 p-8">

            <div className="flex items-center gap-5">

              <div className="rounded-xl bg-blue-500/20 p-4">
                <MapPin className="text-blue-400" />
              </div>

              <div>
                <h3 className="text-xl font-semibold">
                  Address
                </h3>

                <p className="text-gray-400">
                  123 Business Street, Dhaka, Bangladesh
                </p>
              </div>

            </div>

            <div className="flex items-center gap-5">

              <div className="rounded-xl bg-blue-500/20 p-4">
                <Phone className="text-blue-400" />
              </div>

              <div>
                <h3 className="text-xl font-semibold">
                  Phone
                </h3>

                <p className="text-gray-400">
                  +880 1234-567890
                </p>
              </div>

            </div>

            <div className="flex items-center gap-5">

              <div className="rounded-xl bg-blue-500/20 p-4">
                <Mail className="text-blue-400" />
              </div>

              <div>
                <h3 className="text-xl font-semibold">
                  Email
                </h3>

                <p className="text-gray-400">
                  contact@aurex.com
                </p>
              </div>

            </div>

          </div>

          {/* Dummy Map */}

          <div className="flex h-96 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-blue-600/20 to-purple-600/20">

            <div className="text-center">

              <MapPin
                size={60}
                className="mx-auto text-blue-400"
              />

              <h3 className="mt-4 text-2xl font-bold">
                Google Map
              </h3>

              <p className="mt-2 text-gray-300">
                Map Placeholder
              </p>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}