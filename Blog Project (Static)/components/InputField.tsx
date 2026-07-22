// A labelled text input, reused across the login/register/card forms.

type InputFieldProps = {
  label: string;
  type?: string;        // "text" | "email" | "password" ...
  name: string;
  placeholder?: string;
  defaultValue?: string;
};

export default function InputField({
  label,
  type = "text",
  name,
  placeholder,
  defaultValue,
}: InputFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
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
