"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authApi } from "@/lib/api";

// Navbar — লগইন করা থাকলে Dashboard/Logout, নাহলে Login/Sign Up দেখায়।
export default function Navbar() {
  const [loggedIn, setLoggedIn] = useState(false);
  const router = useRouter();

  // পেজ লোড হলে চেক করি user লগইন করা আছে কিনা।
  // সরাসরি authApi.get কল করছি — কোনো আলাদা ফাংশন নেই।
  useEffect(() => {
    authApi
      .get("/api/users/me")
      .then(() => setLoggedIn(true))   // সফল হলে লগইন করা আছে
      .catch(() => setLoggedIn(false)); // ব্যর্থ হলে লগইন করা নেই
  }, []);

  // Logout — সরাসরি authApi.post দিয়ে cookie মুছে ফেলি।
  const handleLogout = async () => {
    await authApi.post("/api/users/logout");
    setLoggedIn(false);
    router.push("/login");
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200">
      <nav className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-indigo-600">
          Dev<span className="text-slate-900">Blog</span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-4">
          <Link href="/" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition">Home</Link>

          {loggedIn ? (
            <>
              <Link href="/dashboard" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition">Dashboard</Link>
              <button onClick={handleLogout} className="text-sm font-medium bg-slate-100 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-200 transition">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition">Login</Link>
              <Link href="/register" className="text-sm font-medium bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition">Sign Up</Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
