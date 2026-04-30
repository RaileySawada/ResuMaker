import { useState } from "react";
import type {
  Language,
  Award,
  VolunteerWork,
  LanguageProficiency,
} from "../lib/types";
import {
  createLanguage,
  createAward,
  createVolunteer,
} from "../lib/defaultData";
import { ChevronDownIcon, PlusIcon, XIcon } from "./Icons";

const PROFICIENCY_LEVELS: LanguageProficiency[] = [
  "Native",
  "Fluent",
  "Advanced",
  "Intermediate",
  "Basic",
];

interface Props {
  languages: Language[];
  awards: Award[];
  volunteer: VolunteerWork[];
  onAddLanguage: (l: Language) => void;
  onUpdateLanguage: (id: string, u: Partial<Language>) => void;
  onRemoveLanguage: (id: string) => void;
  onAddAward: (a: Award) => void;
  onUpdateAward: (id: string, u: Partial<Award>) => void;
  onRemoveAward: (id: string) => void;
  onAddVolunteer: (v: VolunteerWork) => void;
  onUpdateVolunteer: (id: string, u: Partial<VolunteerWork>) => void;
  onRemoveVolunteer: (id: string) => void;
}

function SubSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-3">
      <h4 className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest border-b border-zinc-200 dark:border-zinc-800/80 pb-2">
        {title}
      </h4>
      {children}
    </div>
  );
}

function InputField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  disabled,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  disabled?: boolean;
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
        disabled={disabled}
        className="w-full bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-[13px] text-zinc-900 dark:text-zinc-200 placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900/10 dark:focus:border-zinc-500 dark:focus:ring-zinc-500/20 transition shadow-sm disabled:opacity-40 disabled:bg-zinc-100 dark:disabled:bg-zinc-900/50"
      />
    </div>
  );
}

export default function ExtrasForm(props: Props) {
  const [expandedVol, setExpandedVol] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      {/* Languages */}
      <SubSection title="Languages">
        <div className="space-y-3">
          {props.languages.length === 0 && (
            <p className="text-[12px] text-zinc-500 dark:text-zinc-400 text-center py-4 bg-zinc-50 dark:bg-zinc-900/30 rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800">
              No languages added.
            </p>
          )}
          {props.languages.map((l) => (
            <div
              key={l.id}
              className="flex items-center gap-3 bg-white/50 dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-800/80 rounded-xl p-2 pr-3 shadow-sm group hover:border-zinc-300 dark:hover:border-zinc-700/80 transition-colors"
            >
              <input
                value={l.name}
                onChange={(e) =>
                  props.onUpdateLanguage(l.id, { name: e.target.value })
                }
                placeholder="e.g. Spanish"
                className="flex-1 bg-transparent px-2 py-1 text-[13px] font-bold text-zinc-800 dark:text-zinc-200 placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none"
              />
              <select
                value={l.proficiency}
                onChange={(e) =>
                  props.onUpdateLanguage(l.id, {
                    proficiency: e.target.value as LanguageProficiency,
                  })
                }
                className="bg-zinc-100 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/50 text-[12px] font-medium text-zinc-700 dark:text-zinc-200 rounded-lg px-2 py-1.5 focus:outline-none focus:border-zinc-900 dark:focus:border-zinc-500 cursor-pointer"
              >
                {PROFICIENCY_LEVELS.map((p) => (
                  <option key={p} value={p} className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-200">
                    {p}
                  </option>
                ))}
              </select>
              <button
                onClick={() => props.onRemoveLanguage(l.id)}
                className="text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-colors p-1.5 rounded-md"
              >
                <XIcon size={16} />
              </button>
            </div>
          ))}
          <button
            onClick={() => props.onAddLanguage(createLanguage())}
            className="w-full flex items-center justify-center gap-2 border border-dashed border-zinc-300 dark:border-zinc-700/80 rounded-xl py-3 text-[13px] font-bold text-zinc-500 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:border-zinc-500/50 hover:bg-zinc-500/5 transition-all active:scale-[0.98]"
          >
            <PlusIcon size={16} />
            Add Language
          </button>
        </div>
      </SubSection>

      {/* Awards */}
      <SubSection title="Awards & Achievements">
        <div className="space-y-3">
          {props.awards.length === 0 && (
            <p className="text-[12px] text-zinc-500 dark:text-zinc-400 text-center py-4 bg-zinc-50 dark:bg-zinc-900/30 rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800">
              No awards added.
            </p>
          )}
          {props.awards.map((a) => (
            <div
              key={a.id}
              className="border border-zinc-200 dark:border-zinc-800/80 rounded-xl p-4 space-y-4 bg-white/50 dark:bg-zinc-900/30 shadow-sm relative group hover:border-zinc-300 dark:hover:border-zinc-700/80 transition-colors"
            >
              <button
                onClick={() => props.onRemoveAward(a.id)}
                className="absolute top-3 right-3 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-colors p-1.5 rounded-md"
              >
                <XIcon size={16} />
              </button>
              <div className="grid grid-cols-2 gap-4 pr-6">
                <div className="col-span-2">
                  <InputField
                    label="Award Title"
                    value={a.title}
                    onChange={(v) => props.onUpdateAward(a.id, { title: v })}
                    placeholder="Dean's List"
                  />
                </div>
                <InputField
                  label="Issuer"
                  value={a.issuer}
                  onChange={(v) => props.onUpdateAward(a.id, { issuer: v })}
                  placeholder="UC Berkeley"
                />
                <InputField
                  label="Date"
                  value={a.date}
                  onChange={(v) => props.onUpdateAward(a.id, { date: v })}
                  type="month"
                />
                <div className="col-span-2">
                  <InputField
                    label="Description (optional)"
                    value={a.description}
                    onChange={(v) =>
                      props.onUpdateAward(a.id, { description: v })
                    }
                    placeholder="Brief description"
                  />
                </div>
              </div>
            </div>
          ))}
          <button
            onClick={() => props.onAddAward(createAward())}
            className="w-full flex items-center justify-center gap-2 border border-dashed border-zinc-300 dark:border-zinc-700/80 rounded-xl py-3 text-[13px] font-bold text-zinc-500 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:border-zinc-500/50 hover:bg-zinc-500/5 transition-all active:scale-[0.98]"
          >
            <PlusIcon size={16} />
            Add Award
          </button>
        </div>
      </SubSection>

      {/* Volunteer */}
      <SubSection title="Volunteer Work">
        <div className="space-y-3">
          {props.volunteer.length === 0 && (
            <p className="text-[12px] text-zinc-500 dark:text-zinc-400 text-center py-4 bg-zinc-50 dark:bg-zinc-900/30 rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800">
              No volunteer work added.
            </p>
          )}
          {props.volunteer.map((v) => (
            <div
              key={v.id}
              className="border border-zinc-200 dark:border-zinc-800/80 rounded-xl overflow-hidden bg-white/50 dark:bg-zinc-900/30 shadow-sm transition-all hover:border-zinc-300 dark:hover:border-zinc-700/80"
            >
              <div
                className="flex items-center gap-3 px-4 py-3 bg-zinc-50 dark:bg-zinc-900/50 cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-colors group"
                onClick={() =>
                  setExpandedVol(expandedVol === v.id ? null : v.id)
                }
              >
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-bold text-zinc-800 dark:text-zinc-200 truncate group-hover:text-zinc-950 dark:group-hover:text-white transition-colors">
                    {v.role || v.organization || "New Volunteer Role"}
                  </p>
                  {v.organization && (
                    <p className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400 truncate">
                      {v.organization}
                    </p>
                  )}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    props.onRemoveVolunteer(v.id);
                  }}
                  className="text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-colors p-1.5 rounded-md"
                >
                  <XIcon size={16} />
                </button>
                <div className={`text-zinc-500 transition-transform duration-300 ${expandedVol === v.id ? "rotate-180" : ""}`}>
                  <ChevronDownIcon size={16} />
                </div>
              </div>
              {expandedVol === v.id && (
                <div className="p-4 space-y-4 border-t border-zinc-200 dark:border-zinc-800/50">
                  <div className="grid grid-cols-2 gap-4">
                    <InputField
                      label="Organization"
                      value={v.organization}
                      onChange={(val) =>
                        props.onUpdateVolunteer(v.id, { organization: val })
                      }
                      placeholder="Red Cross"
                    />
                    <InputField
                      label="Role"
                      value={v.role}
                      onChange={(val) =>
                        props.onUpdateVolunteer(v.id, { role: val })
                      }
                      placeholder="Event Coordinator"
                    />
                    <InputField
                      label="Start Date"
                      value={v.startDate}
                      onChange={(val) =>
                        props.onUpdateVolunteer(v.id, { startDate: val })
                      }
                      type="month"
                    />
                    <InputField
                      label="End Date"
                      value={v.endDate}
                      onChange={(val) =>
                        props.onUpdateVolunteer(v.id, { endDate: val })
                      }
                      type="month"
                      disabled={v.isCurrent}
                    />
                  </div>
                  <label className="flex w-fit max-w-full items-center gap-2 cursor-pointer group">
                    <div className="relative flex h-4 w-4 flex-none items-center justify-center">
                      <input
                        type="checkbox"
                        checked={v.isCurrent}
                        onChange={(e) =>
                          props.onUpdateVolunteer(v.id, {
                            isCurrent: e.target.checked,
                          })
                        }
                        className="peer appearance-none w-4 h-4 border border-zinc-300 dark:border-zinc-600 rounded bg-white dark:bg-zinc-900/50 checked:bg-zinc-950 checked:border-zinc-950 dark:checked:bg-white dark:checked:border-white transition-colors cursor-pointer"
                      />
                      <svg
                        className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 pointer-events-none peer-checked:opacity-100 dark:text-zinc-950"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                    <span className="text-[12px] font-medium text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-300 transition-colors">
                      Currently volunteering
                    </span>
                  </label>
                  <div>
                    <label className="block text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1.5">
                      Description
                    </label>
                    <textarea
                      value={v.description}
                      onChange={(e) =>
                        props.onUpdateVolunteer(v.id, {
                          description: e.target.value,
                        })
                      }
                      rows={3}
                      placeholder="Organized fundraising events for 200+ attendees..."
                      className="w-full bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2.5 text-[13px] text-zinc-900 dark:text-zinc-200 placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900/10 dark:focus:border-zinc-500 dark:focus:ring-zinc-500/20 transition shadow-sm resize-none"
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
          <button
            onClick={() => props.onAddVolunteer(createVolunteer())}
            className="w-full flex items-center justify-center gap-2 border border-dashed border-zinc-300 dark:border-zinc-700/80 rounded-xl py-3 text-[13px] font-bold text-zinc-500 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:border-zinc-500/50 hover:bg-zinc-500/5 transition-all active:scale-[0.98]"
          >
            <PlusIcon size={16} />
            Add Volunteer Work
          </button>
        </div>
      </SubSection>
    </div>
  );
}
