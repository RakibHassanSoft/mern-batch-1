"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 z-50 w-full border-b border-white/10 bg-slate-950/80 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">

        {/* Logo */}
        <Link
          href="/"
          className="text-3xl font-extrabold text-blue-500"
        >
          Aurex
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden items-center gap-8 md:flex">
          <Link
            href="/"
            className="transition hover:text-blue-400"
          >
            Home
          </Link>

          <Link
            href="/about"
            className="transition hover:text-blue-400"
          >
            About
          </Link>

          <Link
            href="/services"
            className="transition hover:text-blue-400"
          >
            Services
          </Link>

          <Link
            href="/contact"
            className="transition hover:text-blue-400"
          >
            Contact
          </Link>
        </nav>

        {/* Desktop Button */}
        <Link
          href="/contact"
          className="hidden rounded-lg bg-blue-600 px-5 py-2 font-medium transition hover:bg-blue-700 md:block"
        >
          Contact Us
        </Link>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden"
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`overflow-hidden bg-slate-950 transition-all duration-300 md:hidden ${
          isOpen ? "max-h-96 border-t border-white/10" : "max-h-0"
        }`}
      >
        <nav className="flex flex-col px-6 py-4">

          <Link
            href="/"
            onClick={() => setIsOpen(false)}
            className="rounded-lg py-3 transition hover:bg-slate-800 hover:text-blue-400"
          >
            Home
          </Link>

          <Link
            href="/about"
            onClick={() => setIsOpen(false)}
            className="rounded-lg py-3 transition hover:bg-slate-800 hover:text-blue-400"
          >
            About
          </Link>

          <Link
            href="/services"
            onClick={() => setIsOpen(false)}
            className="rounded-lg py-3 transition hover:bg-slate-800 hover:text-blue-400"
          >
            Services
          </Link>

          <Link
            href="/contact"
            onClick={() => setIsOpen(false)}
            className="rounded-lg py-3 transition hover:bg-slate-800 hover:text-blue-400"
          >
            Contact
          </Link>

          <Link
            href="/contact"
            onClick={() => setIsOpen(false)}
            className="mt-4 rounded-lg bg-blue-600 py-3 text-center font-medium transition hover:bg-blue-700"
          >
            Contact Us
          </Link>

        </nav>
      </div>
    </header>
  );
}