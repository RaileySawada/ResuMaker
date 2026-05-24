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
    <div className="form-section-card rounded-2xl overflow-hidden border border-white/70 dark:border-white/10 bg-white/70 dark:bg-zinc-900/55 backdrop-blur-sm transition-all duration-300 shadow-sm">
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-white/70 dark:hover:bg-white/[0.04] transition-colors group"
      >
        <span className="flex h-9 w-9 flex-none items-center justify-center rounded-xl bg-cyan-50 text-cyan-700 ring-1 ring-cyan-100 transition-colors group-hover:bg-cyan-100 dark:bg-cyan-400/10 dark:text-cyan-200 dark:ring-cyan-300/10">
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
        <span className={`text-zinc-500 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}>
          <ChevronDownIcon size={16} />
        </span>
      </button>

      <div
        className={`transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden ${
          isOpen ? "max-h-[9999px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="section-content px-5 pb-5 pt-3 border-t border-zinc-200/70 dark:border-white/10 space-y-4">
          {children}
        </div>
      </div>
    </div>
  );
}
