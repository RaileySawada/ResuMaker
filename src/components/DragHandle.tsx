import { GripVerticalIcon } from "./Icons";

export default function DragHandle() {
  return (
    <span
      className="item-drag-handle flex h-8 w-5 flex-none cursor-grab select-none items-center justify-center rounded-md text-slate-400 transition hover:bg-cyan-500/10 hover:text-cyan-700 active:cursor-grabbing dark:text-slate-500 dark:hover:text-cyan-300"
      title="Drag to reorder"
      aria-label="Drag to reorder"
    >
      <GripVerticalIcon size={16} />
    </span>
  );
}
