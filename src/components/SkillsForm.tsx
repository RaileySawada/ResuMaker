import type { SkillGroup } from "../lib/types";
import { createSkillGroup } from "../lib/defaultData";
import { PlusIcon, XIcon } from "./Icons";

interface Props {
  items: SkillGroup[];
  onAdd: (sg: SkillGroup) => void;
  onUpdate: (id: string, updates: Partial<SkillGroup>) => void;
  onRemove: (id: string) => void;
}

export default function SkillsForm({
  items,
  onAdd,
  onUpdate,
  onRemove,
}: Props) {
  return (
    <div className="space-y-4">
      <p className="text-[12px] text-zinc-500 dark:text-zinc-400 leading-relaxed px-1">
        Group your skills by category. Separate individual skills with commas.
      </p>

      {items.length === 0 && (
        <p className="text-[12px] text-zinc-500 dark:text-zinc-400 text-center py-4 bg-zinc-50 dark:bg-zinc-900/30 rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800">
          No skills added yet.
        </p>
      )}

      <div className="space-y-3">
        {items.map((sg) => (
          <div
            key={sg.id}
            className="border border-zinc-200 dark:border-zinc-800/80 rounded-xl p-4 space-y-3 bg-white/50 dark:bg-zinc-900/30 shadow-sm transition-all hover:border-zinc-300 dark:hover:border-zinc-700/80 group"
          >
            <div className="flex items-center gap-3">
              <input
                value={sg.category}
                onChange={(e) => onUpdate(sg.id, { category: e.target.value })}
                placeholder="Category (e.g. Programming Languages)"
                className="flex-1 bg-transparent border-b border-zinc-200 dark:border-zinc-700/50 pb-1.5 text-[13px] font-bold text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:border-zinc-900 dark:focus:border-zinc-500 transition-colors"
              />
              <button
                onClick={() => onRemove(sg.id)}
                className="text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-colors p-1.5 rounded-md"
              >
                <XIcon size={16} />
              </button>
            </div>
            <input
              value={sg.items}
              onChange={(e) => onUpdate(sg.id, { items: e.target.value })}
              placeholder="JavaScript, TypeScript, Python, Go"
              className="w-full bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2.5 text-[13px] text-zinc-900 dark:text-zinc-200 placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900/10 dark:focus:border-zinc-500 dark:focus:ring-zinc-500/20 transition shadow-sm"
            />
            {sg.items && (
              <div className="flex flex-wrap gap-2 pt-1.5">
                {sg.items
                  .split(",")
                  .map((s) => s.trim())
                  .filter(Boolean)
                  .map((skill, i) => (
                    <span
                      key={i}
                      className="text-[11px] font-semibold bg-zinc-100 dark:bg-zinc-800/70 text-zinc-700 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700 px-2.5 py-1 rounded-md"
                    >
                      {skill}
                    </span>
                  ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <button
        onClick={() => onAdd(createSkillGroup())}
        className="w-full flex items-center justify-center gap-2 border border-dashed border-zinc-300 dark:border-zinc-700/80 rounded-xl py-3 text-[13px] font-bold text-zinc-500 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:border-zinc-500/50 hover:bg-zinc-500/5 transition-all active:scale-[0.98]"
      >
        <PlusIcon size={16} />
        Add Skill Group
      </button>
    </div>
  );
}
