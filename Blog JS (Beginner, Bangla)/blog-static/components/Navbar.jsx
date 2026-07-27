import Link from "next/link";

// Navbar = উপরের মেনু বার। প্রতিটি পেজে দেখা যাবে (layout থেকে আসে)।
export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200">
      <nav className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* লোগো / সাইটের নাম */}
        <Link href="/" className="text-xl font-bold text-indigo-600">
          Dev<span className="text-slate-900">Blog</span>
        </Link>

        {/* মেনু লিংকগুলো */}
        <div className="flex items-center gap-2 sm:gap-4">
          <Link href="/" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition">
            Home
          </Link>
          <Link href="/dashboard" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition">
            Dashboard
          </Link>
          <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition">
            Login
          </Link>
          <Link href="/register" className="text-sm font-medium bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition">
            Sign Up
          </Link>
        </div>
      </nav>
    </header>
  );
}
