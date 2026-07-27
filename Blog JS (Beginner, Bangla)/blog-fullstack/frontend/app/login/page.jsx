"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import InputField from "@/components/InputField";
import Button from "@/components/Button";
import { authApi } from "@/lib/api";

// LOGIN পেজ।
export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      // সরাসরি authApi.post — সফল হলে server cookie সেট করে দেয়।
      await authApi.post("/api/users/login", { email, password });
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError("ইমেইল বা পাসওয়ার্ড ভুল।");
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
          <h1 className="text-2xl font-bold text-slate-900 text-center">Welcome back</h1>
          <p className="mt-1 text-sm text-slate-500 text-center">পোস্ট ম্যানেজ করতে লগইন করুন।</p>

          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
            {error && <p className="bg-red-50 text-red-700 text-sm px-3 py-2 rounded-lg">{error}</p>}
            <InputField label="Email" name="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
            <InputField label="Password" name="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
            <Button type="submit" variant="primary" className="w-full" disabled={loading}>{loading ? "Logging in..." : "Log In"}</Button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            অ্যাকাউন্ট নেই?{" "}
            <Link href="/register" className="text-indigo-600 font-medium hover:underline">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
