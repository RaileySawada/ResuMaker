import type { PersonalInfo } from "../lib/types";

interface Props {
  data: PersonalInfo;
  onChange: (field: keyof PersonalInfo, value: string) => void;
}

const Field = ({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
}) => (
  <div>
    <div className="flex justify-between items-center mb-1.5">
      <label className="block text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
        {label}
      </label>
      {required && !value && (
        <span className="text-[9px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-tighter">
          Required
        </span>
      )}
    </div>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`w-full bg-zinc-50 dark:bg-zinc-900/50 border rounded-lg px-3 py-2.5 text-[13px] text-zinc-900 dark:text-zinc-200 placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:ring-1 transition shadow-sm ${
        required && !value
          ? "border-red-500/30 focus:border-zinc-900 focus:ring-zinc-900/10 dark:focus:border-zinc-500 dark:focus:ring-zinc-500/20"
          : "border-zinc-200 dark:border-zinc-800 focus:border-zinc-900 focus:ring-zinc-900/10 dark:focus:border-zinc-500 dark:focus:ring-zinc-500/20"
      }`}
    />
  </div>
);

export default function PersonalInfoForm({ data, onChange }: Props) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <Field
            label="Full Name"
            value={data.fullName}
            onChange={(v) => onChange("fullName", v)}
            placeholder="Jane Doe"
            required
          />
        </div>
        <div className="col-span-2">
          <Field
            label="Job Title / Desired Role"
            value={data.jobTitle}
            onChange={(v) => onChange("jobTitle", v)}
            placeholder="Software Engineer"
          />
        </div>
        <Field
          label="Email"
          value={data.email}
          onChange={(v) => onChange("email", v)}
          placeholder="jane@email.com"
          type="email"
          required
        />
        <Field
          label="Phone"
          value={data.phone}
          onChange={(v) => onChange("phone", v)}
          placeholder="+1 (555) 000-0000"
        />
        <div className="col-span-2">
          <Field
            label="Location"
            value={data.location}
            onChange={(v) => onChange("location", v)}
            placeholder="San Francisco, CA"
          />
        </div>
        <Field
          label="LinkedIn URL"
          value={data.linkedin}
          onChange={(v) => onChange("linkedin", v)}
          placeholder="linkedin.com/in/janedoe"
        />
        <Field
          label="GitHub URL"
          value={data.github}
          onChange={(v) => onChange("github", v)}
          placeholder="github.com/janedoe"
        />
        <div className="col-span-2">
          <Field
            label="Portfolio / Website"
            value={data.website}
            onChange={(v) => onChange("website", v)}
            placeholder="janedoe.dev"
          />
        </div>
      </div>
    </div>
  );
}
