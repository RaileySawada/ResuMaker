interface Props {
  value: string;
  onChange: (v: string) => void;
}

export default function SummaryForm({ value, onChange }: Props) {
  return (
    <div className="space-y-3">
      <p className="text-[12px] leading-relaxed text-zinc-500 dark:text-zinc-400">
        Write 2-4 sentences about your background, strengths, and career
        objectives.
      </p>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={5}
        placeholder="Motivated Computer Science graduate seeking an entry-level software development role. Eager to apply React, TypeScript, and Node.js skills to build reliable web applications. Committed to continuous learning and delivering meaningful user impact."
        className="w-full bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-lg px-4 py-3 text-[13px] text-zinc-900 dark:text-zinc-200 placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900/10 dark:focus:border-zinc-500 dark:focus:ring-zinc-500/20 transition shadow-sm resize-none"
      />
      <div className="flex justify-end">
        <span className="text-[10px] font-medium text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-900 px-2 py-1 rounded-md border border-zinc-200 dark:border-zinc-800">
          {value.length} chars
        </span>
      </div>
    </div>
  );
}
