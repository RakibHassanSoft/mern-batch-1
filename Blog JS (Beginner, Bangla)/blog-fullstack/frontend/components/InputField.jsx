// InputField = controlled input। value আর onChange parent থেকে আসে,
// তাই ফর্ম জানে user কী টাইপ করেছে।
export default function InputField({ label, name, value, onChange, type = "text", placeholder }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={name} className="text-sm font-medium text-slate-700">{label}</label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm
                   focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
      />
    </div>
  );
}
