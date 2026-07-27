import Link from "next/link";
import InputField from "@/components/InputField";
import Button from "@/components/Button";

// REGISTER PAGE — static form. Same design language as login.
export default function RegisterPage() {
  return (
    <div className="flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
          <h1 className="text-2xl font-bold text-slate-900 text-center">
            Create your account
          </h1>
          <p className="mt-1 text-sm text-slate-500 text-center">
            Start writing and sharing your posts.
          </p>

          <form className="mt-6 flex flex-col gap-4">
            <InputField
              label="Full Name"
              name="name"
              placeholder="Sara Khan"
            />
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
              placeholder="At least 6 characters"
            />

            <Button type="submit" variant="primary" className="w-full">
              Create Account
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link href="/login" className="text-indigo-600 font-medium hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
