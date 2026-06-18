import type { ReactNode } from "react";
import { ChevronDownIcon } from "./Icons";

interface FormSectionProps {
  title: string;
  icon: ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  children: ReactNode;
  count?: number;
}

export default function FormSection({
  title,
  icon,
  isOpen,
  onToggle,
  children,
  count,
}: FormSectionProps) {
  return (
    <div
      className={`form-section-card rounded-2xl overflow-hidden transition-all duration-300 ${
        isOpen ? "is-open" : ""
      }`}
    >
      <button
        onClick={onToggle}
        className="form-section-trigger w-full flex items-center gap-3 px-4 py-3.5 text-left transition-colors group"
      >
        <span className="form-section-icon flex h-9 w-9 flex-none items-center justify-center rounded-xl transition-all">
          {icon}
        </span>
        <span className="flex-1 text-[13px] font-bold text-zinc-800 dark:text-zinc-200 tracking-widest uppercase">
          {title}
        </span>
        {count !== undefined && count > 0 && (
          <span className="text-[10px] bg-amber-50 dark:bg-amber-400/10 border border-amber-100 dark:border-amber-300/10 text-amber-700 dark:text-amber-200 px-2 py-0.5 rounded-full font-bold">
            {count}
          </span>
        )}
        <span className={`form-section-chevron transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}>
          <ChevronDownIcon size={16} />
        </span>
      </button>

      <div
        className={`transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden ${
          isOpen ? "max-h-[9999px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="section-content px-4 pb-4 pt-4 space-y-4">
          {children}
        </div>
      </div>
    </div>
  );
}
