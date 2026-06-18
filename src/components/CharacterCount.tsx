export default function CharacterCount({
  value,
  max,
}: {
  value: string;
  max: number;
}) {
  const isOver = value.length > max;

  return (
    <span
      className={`text-[10px] font-semibold tabular-nums ${
        isOver
          ? "text-red-600 dark:text-red-400"
          : "text-zinc-500 dark:text-zinc-400"
      }`}
    >
      {value.length}/{max}
    </span>
  );
}
