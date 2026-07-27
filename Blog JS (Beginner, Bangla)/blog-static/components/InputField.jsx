// InputField = লেবেল সহ একটি input বক্স। সব ফর্মে ব্যবহার হয়।
export default function InputField({ label, name, type = "text", placeholder, defaultValue }) {
  return (
    <div className="flex flex-col gap-1.5">
      {/* লেবেল — উপরে ফিল্ডের নাম দেখায় */}
      <label htmlFor={name} className="text-sm font-medium text-slate-700">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        defaultValue={defaultValue}
        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm
                   focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
      />
    </div>
  );
}
