import Link from "next/link";
import InputField from "@/components/InputField";
import Button from "@/components/Button";

// LOGIN PAGE — static form. No auth logic; just the design.
export default function LoginPage() {
  return (
    // Center the card vertically and horizontally
    <div className="flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
          <h1 className="text-2xl font-bold text-slate-900 text-center">
            Welcome back
          </h1>
          <p className="mt-1 text-sm text-slate-500 text-center">
            Log in to manage your posts.
          </p>

          <form className="mt-6 flex flex-col gap-4">
            <InputField
              label="Email"
              type="email"
              name="email"
              placeholder="you@example.com"
            />
            <InputField
              label="Password"
              type="password"
              name="password"
              placeholder="••••••••"
            />

            <Button type="submit" variant="primary" className="w-full">
              Log In
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-indigo-600 font-medium hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
