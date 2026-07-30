import Link from "next/link";
import {
  FaFacebook,
  FaGithub,
  FaInstagram,
} from "react-icons/fa";
import { MdMail } from "react-icons/md";
export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-slate-950">

      <div className="mx-auto max-w-7xl px-6 py-12">

        <div className="grid gap-10 md:grid-cols-3">

          {/* Logo */}
          <div>

            <h2 className="text-3xl font-bold text-blue-500">
              Aurex
            </h2>

            <p className="mt-4 text-gray-400">
              We build modern, responsive and beautiful
              websites using Next.js and Tailwind CSS.
            </p>

          </div>

          {/* Quick Links */}

          <div>

            <h3 className="mb-4 text-xl font-semibold">
              Quick Links
            </h3>

            <div className="space-y-3">

              <Link
                href="/"
                className="block text-gray-400 transition hover:text-blue-400"
              >
                Home
              </Link>

              <Link
                href="/about"
                className="block text-gray-400 transition hover:text-blue-400"
              >
                About
              </Link>

              <Link
                href="/services"
                className="block text-gray-400 transition hover:text-blue-400"
              >
                Services
              </Link>

              <Link
                href="/contact"
                className="block text-gray-400 transition hover:text-blue-400"
              >
                Contact
              </Link>

            </div>

          </div>

          {/* Social */}

          <div>

            <h3 className="mb-4 text-xl font-semibold">
              Follow Us
            </h3>

            <div className="flex gap-4">

              <a
                href="#"
                className="rounded-lg bg-slate-800 p-3 transition hover:bg-blue-600"
              >
                <FaFacebook />
              </a>

              <a
                href="#"
                className="rounded-lg bg-slate-800 p-3 transition hover:bg-blue-600"
              >
                <FaGithub />
              </a>

              <a
                href="#"
                className="rounded-lg bg-slate-800 p-3 transition hover:bg-blue-600"
              >
                <FaInstagram />
              </a>

              <a
                href="#"
                className="rounded-lg bg-slate-800 p-3 transition hover:bg-blue-600"
              >
                <MdMail />
              </a>

            </div>

          </div>

        </div>

        {/* Bottom */}

        <div className="mt-10 border-t border-white/10 pt-6 text-center text-gray-500">

          © 2026 Aurex. All Rights Reserved.

        </div>

      </div>

    </footer>
  );
}