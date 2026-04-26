import { useState } from "react";
import type { Certification } from "../lib/types";
import { createCertification } from "../lib/defaultData";
import { ChevronDownIcon, PlusIcon, XIcon } from "./Icons";

interface Props {
  items: Certification[];
  onAdd: (c: Certification) => void;
  onUpdate: (id: string, updates: Partial<Certification>) => void;
  onRemove: (id: string) => void;
}

function InputField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>
      <label className="block text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1.5">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-[13px] text-zinc-900 dark:text-zinc-200 placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition shadow-sm"
      />
    </div>
  );
}

function CertCard({
  cert,
  onUpdate,
  onRemove,
}: {
  cert: Certification;
  onUpdate: (updates: Partial<Certification>) => void;
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
          <p className="text-[13px] font-bold text-zinc-800 dark:text-zinc-200 truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors">
            {cert.name || "New Certification"}
          </p>
          {cert.issuer && (
            <p className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400 truncate">{cert.issuer}</p>
          )}
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-colors p-1.5 rounded-md opacity-0 group-hover:opacity-100"
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
            <div className="col-span-2">
              <InputField
                label="Certification Name *"
                value={cert.name}
                onChange={(v) => onUpdate({ name: v })}
                placeholder="AWS Certified Solutions Architect"
              />
            </div>
            <div className="col-span-2">
              <InputField
                label="Issuing Organization *"
                value={cert.issuer}
                onChange={(v) => onUpdate({ issuer: v })}
                placeholder="Amazon Web Services"
              />
            </div>
            <InputField
              label="Issue Date"
              value={cert.issueDate}
              onChange={(v) => onUpdate({ issueDate: v })}
              type="month"
            />
            <InputField
              label="Expiry Date"
              value={cert.expiryDate}
              onChange={(v) => onUpdate({ expiryDate: v })}
              type="month"
            />
            <div className="col-span-2">
              <InputField
                label="Credential URL"
                value={cert.credentialUrl}
                onChange={(v) => onUpdate({ credentialUrl: v })}
                placeholder="https://www.credly.com/..."
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CertificationsForm({
  items,
  onAdd,
  onUpdate,
  onRemove,
}: Props) {
  return (
    <div className="space-y-4">
      {items.length === 0 && (
        <p className="text-[12px] text-zinc-500 dark:text-zinc-400 text-center py-4 bg-zinc-50 dark:bg-zinc-900/30 rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800">
          No certifications added yet.
        </p>
      )}

      <div className="space-y-3">
        {items.map((c) => (
          <CertCard
            key={c.id}
            cert={c}
            onUpdate={(u) => onUpdate(c.id, u)}
            onRemove={() => onRemove(c.id)}
          />
        ))}
      </div>

      <button
        onClick={() => onAdd(createCertification())}
        className="w-full flex items-center justify-center gap-2 border border-dashed border-zinc-300 dark:border-zinc-700/80 rounded-xl py-3 text-[13px] font-bold text-zinc-500 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-300 hover:border-indigo-300 dark:hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all active:scale-[0.98]"
      >
        <PlusIcon size={16} />
        Add Certification
      </button>
    </div>
  );
}
