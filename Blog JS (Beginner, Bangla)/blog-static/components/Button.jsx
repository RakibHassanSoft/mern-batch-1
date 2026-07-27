import Link from "next/link";

// Button = একটি reusable বাটন। variant দিয়ে রঙ ঠিক হয়।
// href দিলে এটি Link হয়ে যায়, নাহলে সাধারণ button।

const base =
  "inline-flex items-center justify-center text-sm font-medium px-4 py-2 rounded-lg transition disabled:opacity-60";

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
  onClick,
  disabled,
  className = "",
}) {
  const classes = `${base} ${styles[variant]} ${className}`;

  // href থাকলে Link রিটার্ন করি (এক পেজ থেকে আরেক পেজে যাওয়ার জন্য)
  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={classes}>
      {children}
    </button>
  );
}
