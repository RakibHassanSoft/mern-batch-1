import Link from "next/link";

// Top navigation bar. Static links only — no login logic yet.
export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200">
      <nav className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo / brand */}
        <Link href="/" className="text-xl font-bold text-indigo-600">
          Dev<span className="text-slate-900">Blog</span>
        </Link>

        {/* Links */}
        <div className="flex items-center gap-2 sm:gap-4">
          <Link
            href="/"
            className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition"
          >
            Home
          </Link>
          <Link
            href="/dashboard"
            className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition"
          >
            Dashboard
          </Link>
          <Link
            href="/login"
            className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition"
          >
            Login
          </Link>
          {/* Primary button style */}
          <Link
            href="/register"
            className="text-sm font-medium bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            Sign Up
          </Link>
        </div>
      </nav>
    </header>
  );
}
