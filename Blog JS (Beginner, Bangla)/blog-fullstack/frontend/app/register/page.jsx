"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import InputField from "@/components/InputField";
import Button from "@/components/Button";
import { authApi } from "@/lib/api";

// REGISTER পেজ।
export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      // সরাসরি authApi.post — নতুন অ্যাকাউন্ট বানায় ও cookie সেট করে।
      await authApi.post("/api/users/register", { name, email, password });
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError("রেজিস্টার করা যায়নি। ইমেইলটি হয়তো আগে থেকেই আছে।");
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
          <h1 className="text-2xl font-bold text-slate-900 text-center">Create your account</h1>
          <p className="mt-1 text-sm text-slate-500 text-center">নিজের পোস্ট লেখা শুরু করুন।</p>

          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
            {error && <p className="bg-red-50 text-red-700 text-sm px-3 py-2 rounded-lg">{error}</p>}
            <InputField label="Full Name" name="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Sara Khan" />
            <InputField label="Email" name="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
            <InputField label="Password" name="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="কমপক্ষে ৬ অক্ষর" />
            <Button type="submit" variant="primary" className="w-full" disabled={loading}>{loading ? "Creating..." : "Create Account"}</Button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            আগে থেকেই অ্যাকাউন্ট আছে?{" "}
            <Link href="/login" className="text-indigo-600 font-medium hover:underline">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
