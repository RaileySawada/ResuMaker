import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
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
  HandIcon,
  MaximizeIcon,
  MinimizeIcon,
  MinusIcon,
  PlusIcon,
  RefreshCwIcon,
  SparklesIcon,
  MoonIcon,
  SunIcon,
  XIcon,
} from "./components/Icons";

const TEMPLATES: { id: TemplateType; label: string; accent: string }[] = [
  { id: "classic", label: "Classic", accent: "#dc2626" },
  { id: "modern", label: "Modern", accent: "#111827" },
  { id: "minimal", label: "Minimal", accent: "#111827" },
];

const A4_WIDTH_PX = 794;
const A4_HEIGHT_PX = 1123;
const PREVIEW_MIN_SCALE = 0.5;
const PREVIEW_MAX_SCALE = 2;
const PREVIEW_SCALE_STEP = 0.1;
const PREVIEW_SCALE_STORAGE_KEY = "resumakr_preview_scale";

type PreviewPoint = { x: number; y: number };

type PreviewGesture = {
  pointers: Map<number, PreviewPoint>;
  mode: "idle" | "pan" | "pinch";
  startPan: PreviewPoint;
  startPoint: PreviewPoint;
  startCenter: PreviewPoint;
  startDistance: number;
  startScale: number;
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const distanceBetween = (a: PreviewPoint, b: PreviewPoint) =>
  Math.hypot(a.x - b.x, a.y - b.y);

const centerBetween = (a: PreviewPoint, b: PreviewPoint): PreviewPoint => ({
  x: (a.x + b.x) / 2,
  y: (a.y + b.y) / 2,
});

const loadStoredPreviewScale = (): number | null => {
  if (typeof window === "undefined") return null;

  let raw: string | null;
  try {
    raw = localStorage.getItem(PREVIEW_SCALE_STORAGE_KEY);
  } catch {
    return null;
  }

  if (!raw) return null;

  const scale = Number(raw);
  return Number.isFinite(scale)
    ? clamp(scale, PREVIEW_MIN_SCALE, PREVIEW_MAX_SCALE)
    : null;
};

const savePreviewScale = (scale: number) => {
  try {
    localStorage.setItem(
      PREVIEW_SCALE_STORAGE_KEY,
      String(clamp(scale, PREVIEW_MIN_SCALE, PREVIEW_MAX_SCALE)),
    );
  } catch {
    // Storage can be unavailable in restricted browser modes.
  }
};

export default function App() {
  const resume = useResume();
  const { data } = resume;

  const [openSection, setOpenSection] = useState<string | null>("personal");
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("resu-theme");
      return (
        saved === "dark" ||
        (!saved && window.matchMedia("(prefers-color-scheme: dark)").matches)
      );
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
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
    isClosing: boolean;
  } | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [isPreviewFullscreen, setIsPreviewFullscreen] = useState(false);
  const [previewScale, setPreviewScale] = useState(
    () => loadStoredPreviewScale() ?? 1,
  );
  const [previewPan, setPreviewPan] = useState<PreviewPoint>({ x: 0, y: 0 });
  const [isPanMode, setIsPanMode] = useState(false);
  const [isDraggingPreview, setIsDraggingPreview] = useState(false);
  const previewPanelRef = useRef<HTMLElement | null>(null);
  const previewViewportRef = useRef<HTMLDivElement | null>(null);
  const previewCanvasRef = useRef<HTMLDivElement | null>(null);
  const previewScaleRef = useRef(previewScale);
  const previewPanRef = useRef<PreviewPoint>({ x: 0, y: 0 });
  const hasInitializedPreviewScaleRef = useRef(false);
  const storedPreviewScaleRef = useRef<number | null>(loadStoredPreviewScale());
  const previewGestureRef = useRef<PreviewGesture>({
    pointers: new Map(),
    mode: "idle",
    startPan: { x: 0, y: 0 },
    startPoint: { x: 0, y: 0 },
    startCenter: { x: 0, y: 0 },
    startDistance: 0,
    startScale: 1,
  });
  const toastHideTimeoutRef = useRef<number | null>(null);
  const toastRemoveTimeoutRef = useRef<number | null>(null);

  const clearToastTimers = () => {
    if (toastHideTimeoutRef.current !== null) {
      window.clearTimeout(toastHideTimeoutRef.current);
      toastHideTimeoutRef.current = null;
    }

    if (toastRemoveTimeoutRef.current !== null) {
      window.clearTimeout(toastRemoveTimeoutRef.current);
      toastRemoveTimeoutRef.current = null;
    }
  };

  const closeToast = () => {
    if (toastHideTimeoutRef.current !== null) {
      window.clearTimeout(toastHideTimeoutRef.current);
      toastHideTimeoutRef.current = null;
    }

    setToast((current) =>
      current && !current.isClosing ? { ...current, isClosing: true } : current,
    );

    if (toastRemoveTimeoutRef.current !== null) {
      window.clearTimeout(toastRemoveTimeoutRef.current);
    }

    toastRemoveTimeoutRef.current = window.setTimeout(() => {
      setToast(null);
      toastRemoveTimeoutRef.current = null;
    }, 220);
  };

  const showToast = (
    message: string,
    type: "success" | "error" = "success",
  ) => {
    clearToastTimers();
    setToast({ message, type, isClosing: false });
    toastHideTimeoutRef.current = window.setTimeout(closeToast, 2800);
  };

  useEffect(() => () => clearToastTimers(), []);

  useEffect(() => {
    previewScaleRef.current = previewScale;
  }, [previewScale]);

  useEffect(() => {
    previewPanRef.current = previewPan;
  }, [previewPan]);

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
    } catch {
      showToast("Export failed", "error");
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsPreviewFullscreen(
        document.fullscreenElement === previewPanelRef.current,
      );
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const clampPanToViewport = useCallback(
    (
      pan: PreviewPoint,
      scale = previewScaleRef.current,
    ): PreviewPoint => {
      const canvas = previewCanvasRef.current;
      if (!canvas) return pan;

      const maxX = Math.max(0, (A4_WIDTH_PX * scale - canvas.clientWidth) / 2);
      const maxY = Math.max(
        0,
        (A4_HEIGHT_PX * scale - canvas.clientHeight) / 2,
      );

      return {
        x: clamp(pan.x, -maxX, maxX),
        y: clamp(pan.y, -maxY, maxY),
      };
    },
    [],
  );

  const applyPreviewPan = useCallback(
    (pan: PreviewPoint, scale?: number) => {
      const nextPan = clampPanToViewport(pan, scale);
      previewPanRef.current = nextPan;
      setPreviewPan(nextPan);
    },
    [clampPanToViewport],
  );

  useEffect(() => {
    const canvas = previewCanvasRef.current;
    if (!canvas) return;

    const updateFitScale = () => {
      if (!canvas.clientWidth || !canvas.clientHeight) return;

      const nextFitScale = Math.min(
        1,
        Math.max(
          PREVIEW_MIN_SCALE,
          Math.min(
            canvas.clientWidth / A4_WIDTH_PX,
            canvas.clientHeight / A4_HEIGHT_PX,
          ),
        ),
      );

      const nextVisibleScale = clamp(
        hasInitializedPreviewScaleRef.current
          ? previewScaleRef.current
          : (storedPreviewScaleRef.current ?? nextFitScale),
        PREVIEW_MIN_SCALE,
        PREVIEW_MAX_SCALE,
      );

      hasInitializedPreviewScaleRef.current = true;
      previewScaleRef.current = nextVisibleScale;
      setPreviewScale((current) =>
        Math.abs(current - nextVisibleScale) > 0.001
          ? nextVisibleScale
          : current,
      );
      applyPreviewPan(previewPanRef.current, nextVisibleScale);
    };

    updateFitScale();

    const observer = new ResizeObserver(updateFitScale);
    observer.observe(canvas);
    window.addEventListener("resize", updateFitScale);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateFitScale);
    };
  }, [applyPreviewPan, view, isPreviewFullscreen]);

  const togglePreviewFullscreen = async () => {
    const panel = previewPanelRef.current;
    if (!panel) return;

    try {
      if (document.fullscreenElement === panel) {
        await document.exitFullscreen();
      } else {
        await panel.requestFullscreen();
      }
    } catch {
      showToast("Fullscreen is unavailable", "error");
    }
  };

  const getCanvasPoint = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>): PreviewPoint | null => {
      const canvas = previewCanvasRef.current;
      if (!canvas) return null;

      const rect = canvas.getBoundingClientRect();
      return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      };
    },
    [],
  );

  const getCenteredPoint = useCallback((point: PreviewPoint): PreviewPoint => {
    const canvas = previewCanvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    return {
      x: point.x - canvas.clientWidth / 2,
      y: point.y - canvas.clientHeight / 2,
    };
  }, []);

  const zoomPreviewTo = useCallback(
    (nextScaleValue: number, anchor: PreviewPoint = { x: 0, y: 0 }) => {
      const currentScale = previewScaleRef.current;
      const nextScale = clamp(
        nextScaleValue,
        PREVIEW_MIN_SCALE,
        PREVIEW_MAX_SCALE,
      );
      const currentPan = previewPanRef.current;
      const pagePoint =
        currentScale > 0
          ? {
              x: (anchor.x - currentPan.x) / currentScale,
              y: (anchor.y - currentPan.y) / currentScale,
            }
          : { x: 0, y: 0 };
      const nextPan = {
        x: anchor.x - pagePoint.x * nextScale,
        y: anchor.y - pagePoint.y * nextScale,
      };

      previewScaleRef.current = nextScale;
      setPreviewScale(nextScale);
      savePreviewScale(nextScale);
      applyPreviewPan(nextPan, nextScale);
    },
    [applyPreviewPan],
  );

  const startPinchGesture = useCallback(
    (points: PreviewPoint[]) => {
      if (points.length < 2) return;

      const gesture = previewGestureRef.current;
      const center = centerBetween(points[0], points[1]);
      gesture.mode = "pinch";
      gesture.startCenter = getCenteredPoint(center);
      gesture.startDistance = distanceBetween(points[0], points[1]);
      gesture.startPan = previewPanRef.current;
      gesture.startScale = previewScaleRef.current;
      setIsDraggingPreview(true);
    },
    [getCenteredPoint],
  );

  const handlePreviewPointerDown = (
    event: ReactPointerEvent<HTMLDivElement>,
  ) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;

    const point = getCanvasPoint(event);
    if (!point) return;

    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);

    const gesture = previewGestureRef.current;
    gesture.pointers.set(event.pointerId, point);
    const points = Array.from(gesture.pointers.values());

    if (points.length >= 2) {
      startPinchGesture(points);
      return;
    }

    if (event.pointerType === "touch" || isPanMode) {
      gesture.mode = "pan";
      gesture.startPoint = point;
      gesture.startPan = previewPanRef.current;
      setIsDraggingPreview(true);
    }
  };

  const handlePreviewPointerMove = (
    event: ReactPointerEvent<HTMLDivElement>,
  ) => {
    const gesture = previewGestureRef.current;
    if (!gesture.pointers.has(event.pointerId)) return;

    const point = getCanvasPoint(event);
    if (!point) return;

    event.preventDefault();
    gesture.pointers.set(event.pointerId, point);

    const points = Array.from(gesture.pointers.values());
    if (points.length >= 2) {
      if (gesture.mode !== "pinch" || !gesture.startDistance) {
        startPinchGesture(points);
      }

      const center = getCenteredPoint(centerBetween(points[0], points[1]));
      const nextScale = clamp(
        gesture.startScale *
          (distanceBetween(points[0], points[1]) / gesture.startDistance),
        PREVIEW_MIN_SCALE,
        PREVIEW_MAX_SCALE,
      );
      const pagePoint =
        gesture.startScale > 0
          ? {
              x:
                (gesture.startCenter.x - gesture.startPan.x) /
                gesture.startScale,
              y:
                (gesture.startCenter.y - gesture.startPan.y) /
                gesture.startScale,
            }
          : { x: 0, y: 0 };
      const nextPan = {
        x: center.x - pagePoint.x * nextScale,
        y: center.y - pagePoint.y * nextScale,
      };

      previewScaleRef.current = nextScale;
      setPreviewScale(nextScale);
      savePreviewScale(nextScale);
      applyPreviewPan(nextPan, nextScale);
      return;
    }

    if (gesture.mode !== "pan") return;

    applyPreviewPan({
      x: gesture.startPan.x + point.x - gesture.startPoint.x,
      y: gesture.startPan.y + point.y - gesture.startPoint.y,
    });
  };

  const handlePreviewPointerEnd = (
    event: ReactPointerEvent<HTMLDivElement>,
  ) => {
    const gesture = previewGestureRef.current;
    gesture.pointers.delete(event.pointerId);

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    const points = Array.from(gesture.pointers.values());
    if (points.length >= 2) {
      startPinchGesture(points);
      return;
    }

    if (points.length === 1 && (event.pointerType === "touch" || isPanMode)) {
      gesture.mode = "pan";
      gesture.startPoint = points[0];
      gesture.startPan = previewPanRef.current;
      setIsDraggingPreview(true);
      return;
    }

    gesture.mode = "idle";
    setIsDraggingPreview(false);
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

  const previewCursorClass = isPanMode
    ? isDraggingPreview
      ? "cursor-grabbing"
      : "cursor-grab"
    : "";

  return (
    <div className={`${isDarkMode ? "dark" : ""} h-full`}>
      <div className="flex h-full min-h-full bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-200 overflow-hidden font-sans selection:bg-zinc-900/15 dark:selection:bg-white/20 flex-col lg:flex-row relative">
        {/* ── Left Panel: Editor ── */}
        <aside
          className={`w-full lg:w-[400px] lg:flex-none lg:flex-shrink-0 flex-1 min-h-0 flex flex-col border-r border-zinc-200 dark:border-zinc-800/60 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl relative z-20 shadow-2xl print:hidden ${view === "edit" ? "flex" : "hidden lg:flex"}`}
        >
          {/* Header */}
          <div className="px-6 py-5 border-b border-zinc-200 dark:border-zinc-800/60 bg-gradient-to-b from-zinc-100/50 dark:from-zinc-900/50 to-transparent">
            <div className="flex items-center gap-3">
              <img
                src="/images/logo.png"
                alt=""
                className="brand-logo -my-4 -ml-3 h-16 w-16 flex-none object-contain"
              />
              <div className="-ml-1 min-w-0 leading-tight">
                <h1 className="text-2xl font-black tracking-tight text-zinc-950 dark:text-white">
                  Resumakr
                </h1>
                <p className="mt-0.5 text-[11px] font-semibold text-zinc-500 dark:text-zinc-400">
                  Build your resume live.
                </p>
              </div>
            </div>
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
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-500/5 to-transparent pointer-events-none" />
            <button
              onClick={handlePrint}
              className="flex-1 flex items-center justify-center gap-2 bg-zinc-950 hover:bg-zinc-800 active:scale-[0.98] text-white text-[13px] font-bold py-3 rounded-xl transition-all shadow-lg shadow-zinc-900/20 ring-1 ring-zinc-900/10 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200 dark:ring-white/10"
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
        <main
          ref={previewPanelRef}
          className={`flex-1 overflow-hidden bg-zinc-100 dark:bg-zinc-900/50 flex flex-col relative scrollbar-thin ${view === "preview" ? "flex" : "hidden lg:flex"}`}
          id="preview-panel"
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-200/50 via-zinc-100 to-zinc-50 dark:from-zinc-800/20 dark:via-zinc-900/50 dark:to-zinc-950/80 pointer-events-none print:hidden" />

          <button
            onClick={togglePreviewFullscreen}
            title={
              isPreviewFullscreen ? "Exit fullscreen" : "Fullscreen preview"
            }
            aria-label={
              isPreviewFullscreen
                ? "Exit fullscreen preview"
                : "Open fullscreen preview"
            }
            className="absolute right-4 top-4 z-30 flex h-11 w-11 items-center justify-center rounded-xl border border-zinc-200/80 bg-white/95 text-zinc-700 shadow-xl shadow-zinc-900/10 backdrop-blur-xl transition hover:bg-zinc-50 hover:text-zinc-950 active:scale-95 dark:border-zinc-700/80 dark:bg-zinc-900/95 dark:text-zinc-200 dark:hover:bg-zinc-800 dark:hover:text-white lg:hidden print:hidden"
          >
            {isPreviewFullscreen ? (
              <MinimizeIcon size={18} />
            ) : (
              <MaximizeIcon size={18} />
            )}
          </button>

          <div className="absolute right-3 top-1/2 z-30 hidden -translate-y-1/2 flex-col items-center gap-2 rounded-2xl border border-zinc-200/80 bg-white/95 p-1.5 text-zinc-700 shadow-xl shadow-zinc-900/10 backdrop-blur-xl dark:border-zinc-700/80 dark:bg-zinc-900/95 dark:text-zinc-200 lg:flex print:hidden">
            <button
              onClick={() => zoomPreviewTo(previewScale + PREVIEW_SCALE_STEP)}
              disabled={previewScale >= PREVIEW_MAX_SCALE - 0.001}
              title="Zoom in"
              aria-label="Zoom in"
              className="flex h-10 w-10 items-center justify-center rounded-xl transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-40 dark:hover:bg-zinc-800"
            >
              <PlusIcon size={18} />
            </button>
            <span className="min-w-11 select-none py-1 text-center text-[11px] font-black tabular-nums text-zinc-600 dark:text-zinc-300">
              {Math.round(previewScale * 100)}%
            </span>
            <button
              onClick={() => zoomPreviewTo(previewScale - PREVIEW_SCALE_STEP)}
              disabled={previewScale <= PREVIEW_MIN_SCALE + 0.001}
              title="Zoom out"
              aria-label="Zoom out"
              className="flex h-10 w-10 items-center justify-center rounded-xl transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-40 dark:hover:bg-zinc-800"
            >
              <MinusIcon size={18} />
            </button>
            <div className="h-px w-6 bg-zinc-200 dark:bg-zinc-700" />
            <button
              onClick={() => setIsPanMode((current) => !current)}
              title={isPanMode ? "Disable hand tool" : "Enable hand tool"}
              aria-label={isPanMode ? "Disable hand tool" : "Enable hand tool"}
              className={`flex h-10 w-10 items-center justify-center rounded-xl transition ${
                isPanMode
                  ? "bg-zinc-950 text-white shadow-sm dark:bg-white dark:text-zinc-950"
                  : "hover:bg-zinc-100 dark:hover:bg-zinc-800"
              }`}
            >
              <HandIcon size={18} />
            </button>
            <div className="h-px w-6 bg-zinc-200 dark:bg-zinc-700" />
            <button
              onClick={togglePreviewFullscreen}
              title={
                isPreviewFullscreen ? "Exit fullscreen" : "Fullscreen preview"
              }
              aria-label={
                isPreviewFullscreen
                  ? "Exit fullscreen preview"
                  : "Open fullscreen preview"
              }
              className="flex h-10 w-10 items-center justify-center rounded-xl transition hover:bg-zinc-100 hover:text-zinc-950 active:scale-95 dark:hover:bg-zinc-800 dark:hover:text-white"
            >
              {isPreviewFullscreen ? (
                <MinimizeIcon size={18} />
              ) : (
                <MaximizeIcon size={18} />
              )}
            </button>
          </div>

          {/* The resume paper */}
          <div
            className={`resume-preview-scroll ${previewCursorClass}`}
            ref={previewViewportRef}
            onPointerDown={handlePreviewPointerDown}
            onPointerMove={handlePreviewPointerMove}
            onPointerUp={handlePreviewPointerEnd}
            onPointerCancel={handlePreviewPointerEnd}
          >
            <div className="resume-canvas" ref={previewCanvasRef}>
              <div
                id="resume-preview"
                className="resume-paper"
                style={{
                  transform: `translate(-50%, -50%) translate(${previewPan.x}px, ${previewPan.y}px) scale(${previewScale})`,
                }}
              >
                {renderTemplate()}
              </div>
            </div>
          </div>
        </main>

        {/* Mobile Navigation */}
        <div
          className="lg:hidden fixed bottom-0 left-0 right-0 h-20 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-2xl border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-around z-50 print:hidden"
          style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        >
          <button
            onClick={() => setView("edit")}
            className={`flex flex-col items-center gap-1.5 px-4 py-2 rounded-2xl transition-all ${view === "edit" ? "text-zinc-950 dark:text-white bg-zinc-100 dark:bg-zinc-800" : "text-zinc-400"}`}
          >
            <FileTextIcon size={20} />
            <span className="text-[10px] font-bold uppercase tracking-wider">
              Edit
            </span>
          </button>

          <button
            onClick={toggleTheme}
            className="flex flex-col items-center gap-1.5 px-4 py-2 rounded-2xl text-zinc-400 transition-all active:scale-95"
          >
            {isDarkMode ? <SunIcon size={20} /> : <MoonIcon size={20} />}
            <span className="text-[10px] font-bold uppercase tracking-wider">
              Theme
            </span>
          </button>

          <div className="relative -top-6">
            <button
              onClick={handlePrint}
              className="w-14 h-14 rounded-full bg-zinc-950 text-white flex items-center justify-center shadow-xl shadow-zinc-900/30 active:scale-90 transition-all border-4 border-white dark:bg-white dark:text-zinc-950 dark:border-zinc-950"
            >
              <DownloadIcon size={24} />
            </button>
          </div>

          <button
            onClick={handleReset}
            className="flex flex-col items-center gap-1.5 px-4 py-2 rounded-2xl text-zinc-400 hover:text-red-500 transition-all active:scale-95"
          >
            <RefreshCwIcon size={20} />
            <span className="text-[10px] font-bold uppercase tracking-wider">
              Reset
            </span>
          </button>

          <button
            onClick={() => setView("preview")}
            className={`flex flex-col items-center gap-1.5 px-4 py-2 rounded-2xl transition-all ${view === "preview" ? "text-zinc-950 dark:text-white bg-zinc-100 dark:bg-zinc-800" : "text-zinc-400"}`}
          >
            <SparklesIcon size={20} />
            <span className="text-[10px] font-bold uppercase tracking-wider">
              Preview
            </span>
          </button>
        </div>

        {/* Toast Notification */}
        {toast && (
          <div
            className="fixed bottom-24 left-0 right-0 z-[300] px-4 lg:bottom-10 lg:left-1/2 lg:right-auto lg:w-auto lg:-translate-x-1/2 lg:px-0"
            aria-live="polite"
          >
            <div
              className={`toast-pop-${toast.isClosing ? "out" : "in"} w-full rounded-2xl px-4 py-3 shadow-2xl backdrop-blur-xl border flex items-center gap-3 lg:min-w-[320px] lg:px-5 ${
                toast.type === "success"
                  ? "bg-zinc-950/90 border-zinc-800/30 text-white dark:bg-white/90 dark:border-white/30 dark:text-zinc-950"
                  : "bg-red-600/90 border-red-400/30 text-white"
              }`}
            >
              <div className="w-5 h-5 flex-none rounded-full bg-white/20 flex items-center justify-center">
                {toast.type === "success" ? (
                  <SparklesIcon size={12} />
                ) : (
                  <XIcon size={12} />
                )}
              </div>
              <p className="min-w-0 flex-1 text-sm font-bold tracking-wide">
                {toast.message}
              </p>
              <button
                type="button"
                onClick={closeToast}
                aria-label="Dismiss notification"
                className={`flex h-8 w-8 flex-none items-center justify-center rounded-xl transition active:scale-95 ${
                  toast.type === "success"
                    ? "bg-white/15 text-white hover:bg-white/25 dark:bg-zinc-900/10 dark:text-zinc-950 dark:hover:bg-zinc-900/20"
                    : "bg-white/15 text-white hover:bg-white/25"
                }`}
              >
                <XIcon size={15} />
              </button>
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
                This will permanently clear all your progress. This action
                cannot be undone.
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
