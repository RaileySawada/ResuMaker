import { useState } from "react";
import type { WorkExperience } from "../lib/types";
import { createExperience } from "../lib/defaultData";
import { ChevronDownIcon, PlusIcon, XIcon } from "./Icons";

interface Props {
  items: WorkExperience[];
  onAdd: (exp: WorkExperience) => void;
  onUpdate: (id: string, updates: Partial<WorkExperience>) => void;
  onRemove: (id: string) => void;
}

function InputField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  disabled,
  required = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  disabled?: boolean;
  required?: boolean;
}) {
  return (
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
        disabled={disabled}
        className={`w-full bg-zinc-50 dark:bg-zinc-900/50 border rounded-lg px-3 py-2 text-[13px] text-zinc-900 dark:text-zinc-200 placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:ring-1 transition shadow-sm disabled:opacity-40 disabled:bg-zinc-100 dark:disabled:bg-zinc-900/50 ${required && !value
            ? "border-red-500/30 focus:border-zinc-900 focus:ring-zinc-900/10 dark:focus:border-zinc-500 dark:focus:ring-zinc-500/20"
            : "border-zinc-200 dark:border-zinc-800 focus:border-zinc-900 focus:ring-zinc-900/10 dark:focus:border-zinc-500 dark:focus:ring-zinc-500/20"
          }`}
      />
    </div>
  );
}

function ExperienceCard({
  exp,
  onUpdate,
  onRemove,
}: {
  exp: WorkExperience;
  onUpdate: (updates: Partial<WorkExperience>) => void;
  onRemove: () => void;
}) {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="border border-zinc-200 dark:border-zinc-800/80 rounded-xl overflow-hidden bg-white/50 dark:bg-zinc-900/30 shadow-sm transition-all hover:border-zinc-300 dark:hover:border-zinc-700/80">
      <div
        className="flex items-center gap-3 px-4 py-3 bg-zinc-50 dark:bg-zinc-900/50 cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-colors group"
        onClick={() => setExpanded((x) => !x)}
      >
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-bold text-zinc-800 dark:text-zinc-200 truncate group-hover:text-zinc-950 dark:group-hover:text-white transition-colors">
            {exp.position || exp.company || "New Experience"}
          </p>
          {exp.company && (
            <p className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400 truncate">{exp.company}</p>
          )}
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-colors p-1.5 rounded-md"
          title="Remove"
        >
          <XIcon size={16} />
        </button>
        <div className={`text-zinc-500 transition-transform duration-300 ${expanded ? "rotate-180" : ""}`}>
          <ChevronDownIcon size={16} />
        </div>
      </div>

      {expanded && (
        <div className="p-4 space-y-4 border-t border-zinc-200 dark:border-zinc-800/50">
          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="Company"
              value={exp.company}
              onChange={(v) => onUpdate({ company: v })}
              placeholder="Acme Corp"
              required
            />
            <InputField
              label="Title"
              value={exp.position}
              onChange={(v) => onUpdate({ position: v })}
              placeholder="Software Engineer"
              required
            />
            <InputField
              label="Location"
              value={exp.location}
              onChange={(v) => onUpdate({ location: v })}
              placeholder="Remote / New York, NY"
            />
            <div />
            <InputField
              label="Start Date"
              value={exp.startDate}
              onChange={(v) => onUpdate({ startDate: v })}
              type="month"
            />
            <InputField
              label="End Date"
              value={exp.endDate}
              onChange={(v) => onUpdate({ endDate: v, isCurrent: false })}
              type="month"
              disabled={exp.isCurrent}
            />
          </div>

          <label className="flex items-center gap-2 cursor-pointer w-fit group">
            <div className="relative flex items-center justify-center">
              <input
                type="checkbox"
                checked={exp.isCurrent}
                onChange={(e) =>
                  onUpdate({
                    isCurrent: e.target.checked,
                    endDate: e.target.checked ? "" : exp.endDate,
                  })
                }
                className="peer appearance-none w-4 h-4 border border-zinc-300 dark:border-zinc-600 rounded bg-white dark:bg-zinc-900/50 checked:bg-zinc-950 checked:border-zinc-950 dark:checked:bg-white dark:checked:border-white transition-colors cursor-pointer"
              />
              <svg className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
            <span className="text-[12px] font-medium text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-300 transition-colors">
              I currently work here
            </span>
          </label>

          <div>
            <label className="block text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1.5">
              Responsibilities & Achievements
              <span className="text-zinc-600 ml-1 font-medium lowercase tracking-normal">
                (one per line, use action verbs)
              </span>
            </label>
            <textarea
              value={exp.description}
              onChange={(e) => onUpdate({ description: e.target.value })}
              rows={5}
              placeholder={
                "Built RESTful APIs serving 50K+ daily users\nReduced page load time by 40% through code optimization\nMentored 2 junior developers and conducted code reviews"
              }
              className="w-full bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2.5 text-[13px] text-zinc-900 dark:text-zinc-200 placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900/10 dark:focus:border-zinc-500 dark:focus:ring-zinc-500/20 transition shadow-sm resize-none"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default function ExperienceForm({
  items,
  onAdd,
  onUpdate,
  onRemove,
}: Props) {
  return (
    <div className="space-y-4">
      {items.length === 0 && (
        <p className="text-[12px] text-zinc-500 dark:text-zinc-400 text-center py-4 bg-zinc-50 dark:bg-zinc-900/30 rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800">
          No experience added yet. Fresh graduates can add internships,
          part-time jobs, or on-campus roles.
        </p>
      )}

      <div className="space-y-3">
        {items.map((exp) => (
          <ExperienceCard
            key={exp.id}
            exp={exp}
            onUpdate={(updates) => onUpdate(exp.id, updates)}
            onRemove={() => onRemove(exp.id)}
          />
        ))}
      </div>

      <button
        onClick={() => onAdd(createExperience())}
        className="w-full flex items-center justify-center gap-2 border border-dashed border-zinc-300 dark:border-zinc-700/80 rounded-xl py-3 text-[13px] font-bold text-zinc-500 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:border-zinc-500/50 hover:bg-zinc-500/5 transition-all active:scale-[0.98]"
      >
        <PlusIcon size={16} />
        Add Experience
      </button>
    </div>
  );
}
