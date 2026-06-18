import CharacterCount from "./CharacterCount";
import { CONTENT_LIMITS } from "../lib/contentLimits";

interface Props {
  value: string;
  onChange: (v: string) => void;
}

export default function SummaryForm({ value, onChange }: Props) {
  return (
    <div className="space-y-3">
      <p className="text-[12px] leading-relaxed text-zinc-500 dark:text-zinc-400">
        Write 2–4 sentences tailored to the target role. Include your
        experience, strongest job-relevant skills, and a measurable result.
      </p>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        maxLength={CONTENT_LIMITS.summary}
        rows={5}
        placeholder="Customer service professional with 3+ years of experience resolving high-volume inquiries and improving customer satisfaction. Skilled in CRM tools, documentation, and cross-functional support, with a record of reducing response time by 20%."
        className="w-full bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-lg px-4 py-3 text-[13px] text-zinc-900 dark:text-zinc-200 placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900/10 dark:focus:border-zinc-500 dark:focus:ring-zinc-500/20 transition shadow-sm resize-none"
      />
      <div className="flex justify-end">
        <CharacterCount value={value} max={CONTENT_LIMITS.summary} />
      </div>
    </div>
  );
}
