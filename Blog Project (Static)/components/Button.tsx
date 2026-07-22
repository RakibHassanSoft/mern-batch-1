import Link from "next/link";

// A reusable button that can render as a real <button> or a <Link>.
// variant controls the color style.

type ButtonProps = {
  children: React.ReactNode;
  href?: string;                          // if given, renders a Link
  variant?: "primary" | "outline" | "danger";
  type?: "button" | "submit";
  className?: string;
};

// Base classes shared by all variants
const base =
  "inline-flex items-center justify-center text-sm font-medium px-4 py-2 rounded-lg transition";

// Different color styles
const styles = {
  primary: "bg-indigo-600 text-white hover:bg-indigo-700",
  outline: "border border-slate-300 text-slate-700 hover:bg-slate-100",
  danger: "bg-red-600 text-white hover:bg-red-700",
};

export default function Button({
  children,
  href,
  variant = "primary",
  type = "button",
  className = "",
}: ButtonProps) {
  const classes = `${base} ${styles[variant]} ${className}`;

  // If href is passed, render a navigation link that looks like a button
  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={classes}>
      {children}
    </button>
  );
}
