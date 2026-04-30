import { useState } from "react";
import type { Project } from "../lib/types";
import { createProject } from "../lib/defaultData";
import { ChevronDownIcon, PlusIcon, XIcon } from "./Icons";

interface Props {
  items: Project[];
  onAdd: (p: Project) => void;
  onUpdate: (id: string, updates: Partial<Project>) => void;
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
        className="w-full bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-[13px] text-zinc-900 dark:text-zinc-200 placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900/10 dark:focus:border-zinc-500 dark:focus:ring-zinc-500/20 transition shadow-sm"
      />
    </div>
  );
}

function ProjectCard({
  project,
  onUpdate,
  onRemove,
}: {
  project: Project;
  onUpdate: (updates: Partial<Project>) => void;
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
            {project.name || "New Project"}
          </p>
          {project.technologies && (
            <p className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400 truncate">
              {project.technologies}
            </p>
          )}
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-colors p-1.5 rounded-md"
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
                label="Project Name *"
                value={project.name}
                onChange={(v) => onUpdate({ name: v })}
                placeholder="Personal Finance Tracker"
              />
            </div>
            <div className="col-span-2">
              <InputField
                label="Technologies Used"
                value={project.technologies}
                onChange={(v) => onUpdate({ technologies: v })}
                placeholder="React, Node.js, PostgreSQL, AWS"
              />
            </div>
            <InputField
              label="Start Date"
              value={project.startDate}
              onChange={(v) => onUpdate({ startDate: v })}
              type="month"
            />
            <InputField
              label="End Date"
              value={project.endDate}
              onChange={(v) => onUpdate({ endDate: v })}
              type="month"
            />
            <InputField
              label="Live URL"
              value={project.liveUrl}
              onChange={(v) => onUpdate({ liveUrl: v })}
              placeholder="https://myproject.com"
            />
            <InputField
              label="Repository URL"
              value={project.repoUrl}
              onChange={(v) => onUpdate({ repoUrl: v })}
              placeholder="https://github.com/..."
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1.5">
              Description
              <span className="text-zinc-600 ml-1 font-medium lowercase tracking-normal">
                (one achievement per line)
              </span>
            </label>
            <textarea
              value={project.description}
              onChange={(e) => onUpdate({ description: e.target.value })}
              rows={4}
              placeholder={
                "Developed a full-stack app to track personal budgets across multiple accounts\nImplemented real-time notifications using WebSockets\nDeployed on AWS with CI/CD pipeline via GitHub Actions"
              }
              className="w-full bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2.5 text-[13px] text-zinc-900 dark:text-zinc-200 placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900/10 dark:focus:border-zinc-500 dark:focus:ring-zinc-500/20 transition shadow-sm resize-none"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProjectsForm({
  items,
  onAdd,
  onUpdate,
  onRemove,
}: Props) {
  return (
    <div className="space-y-4">
      <p className="text-[12px] text-zinc-500 dark:text-zinc-400 leading-relaxed px-1">
        Showcase personal, academic, or open-source projects. Especially
        valuable for fresh graduates.
      </p>

      {items.length === 0 && (
        <p className="text-[12px] text-zinc-500 dark:text-zinc-400 text-center py-4 bg-zinc-50 dark:bg-zinc-900/30 rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800">
          No projects added yet.
        </p>
      )}

      <div className="space-y-3">
        {items.map((p) => (
          <ProjectCard
            key={p.id}
            project={p}
            onUpdate={(u) => onUpdate(p.id, u)}
            onRemove={() => onRemove(p.id)}
          />
        ))}
      </div>

      <button
        onClick={() => onAdd(createProject())}
        className="w-full flex items-center justify-center gap-2 border border-dashed border-zinc-300 dark:border-zinc-700/80 rounded-xl py-3 text-[13px] font-bold text-zinc-500 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:border-zinc-500/50 hover:bg-zinc-500/5 transition-all active:scale-[0.98]"
      >
        <PlusIcon size={16} />
        Add Project
      </button>
    </div>
  );
}
