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
    <div className="rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800/50 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm transition-all duration-300">
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-zinc-100/50 dark:hover:bg-zinc-800/50 transition-colors group"
      >
        <span className="text-zinc-500 dark:text-zinc-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
          {icon}
        </span>
        <span className="flex-1 text-[13px] font-bold text-zinc-800 dark:text-zinc-200 tracking-widest uppercase">
          {title}
        </span>
        {count !== undefined && count > 0 && (
          <span className="text-[10px] bg-indigo-100 dark:bg-indigo-500/20 border border-indigo-200 dark:border-indigo-500/30 text-indigo-600 dark:text-indigo-300 px-2 py-0.5 rounded-full font-bold">
            {count}
          </span>
        )}
        <span className={`text-zinc-500 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}>
          <ChevronDownIcon size={16} />
        </span>
      </button>

      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen ? "max-h-[9999px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-5 pb-5 pt-2 border-t border-zinc-200 dark:border-zinc-800/50 space-y-4">
          {children}
        </div>
      </div>
    </div>
  );
}
