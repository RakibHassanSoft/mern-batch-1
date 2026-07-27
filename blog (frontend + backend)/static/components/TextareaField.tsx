// A labelled multi-line text area, used for the blog card content.

type TextareaFieldProps = {
  label: string;
  name: string;
  placeholder?: string;
  defaultValue?: string;
  rows?: number;
};

export default function TextareaField({
  label,
  name,
  placeholder,
  defaultValue,
  rows = 6,
}: TextareaFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={name} className="text-sm font-medium text-slate-700">
        {label}
      </label>
      <textarea
        id={name}
        name={name}
        rows={rows}
        placeholder={placeholder}
        defaultValue={defaultValue}
        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm resize-y
                   focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
      />
    </div>
  );
}
