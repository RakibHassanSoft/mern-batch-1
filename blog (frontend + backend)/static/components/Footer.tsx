import Link from "next/link";

// Simple footer shown on every page (added in layout.tsx).
export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 mt-12">
      <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-slate-500">
          © 2026 DevBlog. Built with Next.js & Tailwind CSS.
        </p>
        <div className="flex gap-4">
          <Link href="/" className="text-sm text-slate-500 hover:text-indigo-600">
            Home
          </Link>
          <Link href="/dashboard" className="text-sm text-slate-500 hover:text-indigo-600">
            Dashboard
          </Link>
        </div>
      </div>
    </footer>
  );
}
