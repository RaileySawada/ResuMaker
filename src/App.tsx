import { useState } from "react";
import { useResume } from "./lib/useResume";
import { printResume } from "./lib/exportPdf";
import type { TemplateType } from "./lib/types";

import FormSection from "./components/FormSection";
import PersonalInfoForm from "./components/PersonalInfoForm";
import SummaryForm from "./components/SummaryForm";
import ExperienceForm from "./components/ExperienceForm";
import EducationForm from "./components/EducationForm";
import SkillsForm from "./components/SkillsForm";
import ProjectsForm from "./components/ProjectsForm";
import CertificationsForm from "./components/CertificationsForm";
import ExtrasForm from "./components/ExtrasForm";

import ClassicTemplate from "./components/templates/ClassicTemplate";
import ModernTemplate from "./components/templates/ModernTemplate";
import MinimalTemplate from "./components/templates/MinimalTemplate";

import {
  UserIcon,
  FileTextIcon,
  BriefcaseIcon,
  GraduationCapIcon,
  ZapIcon,
  RocketIcon,
  AwardIcon,
  StarIcon,
  DownloadIcon,
  RefreshCwIcon,
  SparklesIcon,
  MoonIcon,
  SunIcon,
  XIcon,
} from "./components/Icons";

const TEMPLATES: { id: TemplateType; label: string; accent: string }[] = [
  { id: "classic", label: "Classic", accent: "#7c3aed" },
  { id: "modern", label: "Modern", accent: "#1b2d55" },
  { id: "minimal", label: "Minimal", accent: "#111827" },
];

export default function App() {
  const resume = useResume();
  const { data } = resume;

  const [openSection, setOpenSection] = useState<string | null>("personal");
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("resu-theme");
      return saved === "dark" || (!saved && window.matchMedia("(prefers-color-scheme: dark)").matches);
    }
    return false;
  });

  const toggleTheme = () => {
    setIsDarkMode((prev) => {
      const next = !prev;
      localStorage.setItem("resu-theme", next ? "dark" : "light");
      return next;
    });
  };

  const toggle = (key: string) =>
    setOpenSection((prev) => (prev === key ? null : key));

  const [view, setView] = useState<"edit" | "preview">("edit");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleReset = () => {
    setShowResetConfirm(true);
  };

  const confirmReset = () => {
    resume.resetResume();
    setShowResetConfirm(false);
    showToast("Data cleared successfully", "success");
  };

  const handlePrint = () => {
    try {
      printResume(data.personal.fullName);
      showToast("PDF Exported successfully");
    } catch (e) {
      showToast("Export failed", "error");
    }
  };

  function renderTemplate() {
    switch (data.template) {
      case "modern":
        return <ModernTemplate data={data} />;
      case "minimal":
        return <MinimalTemplate data={data} />;
      default:
        return <ClassicTemplate data={data} />;
    }
  }

  return (
    <div className={`${isDarkMode ? "dark" : ""} h-full`}>
      <div className="flex h-full min-h-full bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-200 overflow-hidden font-sans selection:bg-indigo-500/30 flex-col lg:flex-row relative">
        {/* ── Left Panel: Editor ── */}
        <aside className={`w-full lg:w-[400px] lg:flex-shrink-0 flex-1 min-h-0 flex flex-col border-r border-zinc-200 dark:border-zinc-800/60 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl relative z-20 shadow-2xl print:hidden ${view === "edit" ? "flex" : "hidden lg:flex"}`}>
          {/* Header */}
          <div className="px-6 py-5 border-b border-zinc-200 dark:border-zinc-800/60 bg-gradient-to-b from-zinc-100/50 dark:from-zinc-900/50 to-transparent">
            <div className="flex items-center gap-2.5 mb-1.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
                <SparklesIcon size={18} />
              </div>
              <h1 className="text-xl font-extrabold tracking-tight text-zinc-800 dark:text-white bg-clip-text dark:text-transparent dark:bg-gradient-to-r dark:from-white dark:to-zinc-400">
                ResuMaker
              </h1>
            </div>
            <p className="text-xs text-zinc-500 font-medium ml-10">
              Build your resume live in real-time.
            </p>
          </div>

          {/* Template Picker */}
          <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800/60 bg-zinc-50/50 dark:bg-zinc-900/20">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">
                Template
              </p>
            </div>
            <div className="flex gap-2 bg-zinc-100/50 dark:bg-zinc-900/50 p-1 rounded-xl border border-zinc-200 dark:border-zinc-800/50">
              {TEMPLATES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => resume.setTemplate(t.id)}
                  className={`flex-1 py-2 rounded-lg text-[13px] font-semibold transition-all duration-200 ${
                    data.template === t.id
                      ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm ring-1 ring-zinc-200 dark:ring-zinc-700"
                      : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

        {/* Form Sections (scrollable) */}
        <div className="flex-1 min-h-0 overflow-y-auto px-4 py-4 space-y-3 pb-48 lg:pb-12 scrollbar-thin">
          <FormSection
            title="Personal Info"
            icon={<UserIcon size={18} />}
            isOpen={openSection === "personal"}
            onToggle={() => toggle("personal")}
          >
            <PersonalInfoForm
              data={data.personal}
              onChange={resume.updatePersonal}
            />
          </FormSection>

          <FormSection
            title="Summary"
            icon={<FileTextIcon size={18} />}
            isOpen={openSection === "summary"}
            onToggle={() => toggle("summary")}
          >
            <SummaryForm
              value={data.summary}
              onChange={resume.updateSummary}
            />
          </FormSection>

          <FormSection
            title="Experience"
            icon={<BriefcaseIcon size={18} />}
            isOpen={openSection === "experience"}
            onToggle={() => toggle("experience")}
            count={data.experience.length}
          >
            <ExperienceForm
              items={data.experience}
              onAdd={resume.addExperience}
              onUpdate={resume.updateExperience}
              onRemove={resume.removeExperience}
            />
          </FormSection>

          <FormSection
            title="Education"
            icon={<GraduationCapIcon size={18} />}
            isOpen={openSection === "education"}
            onToggle={() => toggle("education")}
            count={data.education.length}
          >
            <EducationForm
              items={data.education}
              onAdd={resume.addEducation}
              onUpdate={resume.updateEducation}
              onRemove={resume.removeEducation}
            />
          </FormSection>

          <FormSection
            title="Skills"
            icon={<ZapIcon size={18} />}
            isOpen={openSection === "skills"}
            onToggle={() => toggle("skills")}
            count={data.skills.length}
          >
            <SkillsForm
              items={data.skills}
              onAdd={resume.addSkillGroup}
              onUpdate={resume.updateSkillGroup}
              onRemove={resume.removeSkillGroup}
            />
          </FormSection>

          <FormSection
            title="Projects"
            icon={<RocketIcon size={18} />}
            isOpen={openSection === "projects"}
            onToggle={() => toggle("projects")}
            count={data.projects.length}
          >
            <ProjectsForm
              items={data.projects}
              onAdd={resume.addProject}
              onUpdate={resume.updateProject}
              onRemove={resume.removeProject}
            />
          </FormSection>

          <FormSection
            title="Certifications"
            icon={<AwardIcon size={18} />}
            isOpen={openSection === "certifications"}
            onToggle={() => toggle("certifications")}
            count={data.certifications.length}
          >
            <CertificationsForm
              items={data.certifications}
              onAdd={resume.addCertification}
              onUpdate={resume.updateCertification}
              onRemove={resume.removeCertification}
            />
          </FormSection>

          <FormSection
            title="Extras"
            icon={<StarIcon size={18} />}
            isOpen={openSection === "extras"}
            onToggle={() => toggle("extras")}
            count={
              data.languages.length +
              data.awards.length +
              data.volunteer.length
            }
          >
            <ExtrasForm
              languages={data.languages}
              awards={data.awards}
              volunteer={data.volunteer}
              onAddLanguage={resume.addLanguage}
              onUpdateLanguage={resume.updateLanguage}
              onRemoveLanguage={resume.removeLanguage}
              onAddAward={resume.addAward}
              onUpdateAward={resume.updateAward}
              onRemoveAward={resume.removeAward}
              onAddVolunteer={resume.addVolunteer}
              onUpdateVolunteer={resume.updateVolunteer}
              onRemoveVolunteer={resume.removeVolunteer}
            />
          </FormSection>
        </div>

        {/* Footer Actions */}
        <div className="hidden lg:flex px-5 py-4 border-t border-zinc-200 dark:border-zinc-800/60 bg-zinc-50 dark:bg-zinc-950 gap-3 relative">
          <div className="absolute inset-0 bg-gradient-to-t from-indigo-500/5 to-transparent pointer-events-none" />
          <button
            onClick={handlePrint}
            className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] text-white text-[13px] font-bold py-3 rounded-xl transition-all shadow-lg shadow-indigo-500/25 ring-1 ring-white/10"
          >
            <DownloadIcon size={16} />
            Export PDF
          </button>
          <button
            onClick={toggleTheme}
            title="Toggle theme"
            className="w-12 flex items-center justify-center bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 active:scale-[0.98] border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-500 transition-all"
          >
            {isDarkMode ? <SunIcon size={16} /> : <MoonIcon size={16} />}
          </button>
          <button
            onClick={handleReset}
            title="Reset resume"
            className="w-12 flex items-center justify-center bg-white dark:bg-zinc-900 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-500 dark:hover:text-red-400 active:scale-[0.98] border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-500 transition-all hover:border-red-200 dark:hover:border-red-500/30"
          >
            <RefreshCwIcon size={16} />
          </button>
        </div>
      </aside>

      {/* ── Right Panel: Live Preview ── */}
      <main className={`flex-1 overflow-auto bg-zinc-100 dark:bg-zinc-900/50 flex flex-col relative scrollbar-thin ${view === "preview" ? "flex" : "hidden lg:flex"}`} id="preview-panel">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-200/50 via-zinc-100 to-zinc-50 dark:from-zinc-800/20 dark:via-zinc-900/50 dark:to-zinc-950/80 pointer-events-none print:hidden" />
        


        {/* The resume paper */}
        <div className="flex-1 flex items-start justify-center p-8 overflow-auto relative z-10">
          <div
            id="resume-preview"
            className="resume-paper"
            style={{
              width: "794px",
              display: "flex",
              flexDirection: "column",
              boxShadow:
                "0 20px 25px -5px rgba(0,0,0,0.3), 0 8px 10px -6px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.05)",
              borderRadius: "4px",
              overflow: "hidden",
            }}
          >
            {renderTemplate()}
          </div>
        </div>
      </main>

      {/* Mobile Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 h-20 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-2xl border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-around z-50 print:hidden" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        <button
          onClick={() => setView("edit")}
          className={`flex flex-col items-center gap-1.5 px-4 py-2 rounded-2xl transition-all ${view === "edit" ? "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10" : "text-zinc-400"}`}
        >
          <FileTextIcon size={20} />
          <span className="text-[10px] font-bold uppercase tracking-wider">Edit</span>
        </button>

        <button
          onClick={toggleTheme}
          className="flex flex-col items-center gap-1.5 px-4 py-2 rounded-2xl text-zinc-400 transition-all active:scale-95"
        >
          {isDarkMode ? <SunIcon size={20} /> : <MoonIcon size={20} />}
          <span className="text-[10px] font-bold uppercase tracking-wider">Theme</span>
        </button>
        
        <div className="relative -top-6">
          <button
            onClick={handlePrint}
            className="w-14 h-14 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-500 text-white flex items-center justify-center shadow-xl shadow-indigo-500/40 active:scale-90 transition-all border-4 border-white dark:border-zinc-950"
          >
            <DownloadIcon size={24} />
          </button>
        </div>

        <button
          onClick={handleReset}
          className="flex flex-col items-center gap-1.5 px-4 py-2 rounded-2xl text-zinc-400 hover:text-red-500 transition-all active:scale-95"
        >
          <RefreshCwIcon size={20} />
          <span className="text-[10px] font-bold uppercase tracking-wider">Reset</span>
        </button>

        <button
          onClick={() => setView("preview")}
          className={`flex flex-col items-center gap-1.5 px-4 py-2 rounded-2xl transition-all ${view === "preview" ? "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10" : "text-zinc-400"}`}
        >
          <SparklesIcon size={20} />
          <span className="text-[10px] font-bold uppercase tracking-wider">Preview</span>
        </button>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-24 lg:bottom-10 left-1/2 -translate-x-1/2 z-[300] animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className={`px-5 py-3 rounded-2xl shadow-2xl backdrop-blur-xl border flex items-center gap-3 ${
            toast.type === "success" 
              ? "bg-emerald-500/90 border-emerald-400/30 text-white" 
              : "bg-red-500/90 border-red-400/30 text-white"
          }`}>
            <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
              {toast.type === "success" ? <SparklesIcon size={12} /> : <XIcon size={12} />}
            </div>
            <p className="text-sm font-bold tracking-wide">{toast.message}</p>
          </div>
        </div>
      )}

      {/* Custom Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-[400] flex items-center justify-center p-6 bg-zinc-950/40 backdrop-blur-md animate-in fade-in duration-300">
          <div className="w-full max-w-[380px] bg-white dark:bg-zinc-900 rounded-[2rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] border border-zinc-200 dark:border-zinc-800 p-8 text-center animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 rounded-3xl bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center text-red-500 mb-6 mx-auto shadow-inner">
              <RefreshCwIcon size={28} />
            </div>
            
            <h3 className="text-xl font-extrabold text-zinc-900 dark:text-white mb-3 tracking-tight">
              Reset everything?
            </h3>
            
            <p className="text-[14px] text-zinc-500 dark:text-zinc-400 mb-8 leading-relaxed px-2">
              This will permanently clear all your progress. This action cannot be undone.
            </p>
            
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-6 py-3.5 rounded-2xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-sm font-bold text-zinc-600 dark:text-zinc-300 transition-all active:scale-[0.98]"
              >
                Cancel
              </button>
              <button
                onClick={confirmReset}
                className="px-6 py-3.5 rounded-2xl bg-zinc-900 dark:bg-white dark:text-zinc-900 text-white text-sm font-bold shadow-lg transition-all active:scale-[0.98] hover:opacity-90"
              >
                Clear Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  </div>
);
}
