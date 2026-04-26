import { useState, useEffect, useCallback } from "react";
import type {
  ResumeData,
  PersonalInfo,
  WorkExperience,
  Education,
  SkillGroup,
  Project,
  Certification,
  Language,
  Award,
  VolunteerWork,
  TemplateType,
} from "./types";
import { saveToStorage, loadFromStorage, clearStorage } from "./store";
import { createEmptyResume } from "./defaultData";

export function useResume() {
  const [data, setData] = useState<ResumeData>(
    () => loadFromStorage() ?? createEmptyResume(),
  );

  useEffect(() => {
    saveToStorage(data);
  }, [data]);

  const setTemplate = useCallback(
    (template: TemplateType) => setData((prev) => ({ ...prev, template })),
    [],
  );

  const updatePersonal = useCallback(
    (field: keyof PersonalInfo, value: string) =>
      setData((prev) => ({
        ...prev,
        personal: { ...prev.personal, [field]: value },
      })),
    [],
  );

  const updateSummary = useCallback(
    (summary: string) => setData((prev) => ({ ...prev, summary })),
    [],
  );

  // ── Experience ─────────────────────────────────────────────────────────────
  const addExperience = useCallback(
    (exp: WorkExperience) =>
      setData((prev) => ({ ...prev, experience: [...prev.experience, exp] })),
    [],
  );

  const updateExperience = useCallback(
    (id: string, updates: Partial<WorkExperience>) =>
      setData((prev) => ({
        ...prev,
        experience: prev.experience.map((e) =>
          e.id === id ? { ...e, ...updates } : e,
        ),
      })),
    [],
  );

  const removeExperience = useCallback(
    (id: string) =>
      setData((prev) => ({
        ...prev,
        experience: prev.experience.filter((e) => e.id !== id),
      })),
    [],
  );

  // ── Education ──────────────────────────────────────────────────────────────
  const addEducation = useCallback(
    (edu: Education) =>
      setData((prev) => ({ ...prev, education: [...prev.education, edu] })),
    [],
  );

  const updateEducation = useCallback(
    (id: string, updates: Partial<Education>) =>
      setData((prev) => ({
        ...prev,
        education: prev.education.map((e) =>
          e.id === id ? { ...e, ...updates } : e,
        ),
      })),
    [],
  );

  const removeEducation = useCallback(
    (id: string) =>
      setData((prev) => ({
        ...prev,
        education: prev.education.filter((e) => e.id !== id),
      })),
    [],
  );

  // ── Skills ─────────────────────────────────────────────────────────────────
  const addSkillGroup = useCallback(
    (sg: SkillGroup) =>
      setData((prev) => ({ ...prev, skills: [...prev.skills, sg] })),
    [],
  );

  const updateSkillGroup = useCallback(
    (id: string, updates: Partial<SkillGroup>) =>
      setData((prev) => ({
        ...prev,
        skills: prev.skills.map((s) =>
          s.id === id ? { ...s, ...updates } : s,
        ),
      })),
    [],
  );

  const removeSkillGroup = useCallback(
    (id: string) =>
      setData((prev) => ({
        ...prev,
        skills: prev.skills.filter((s) => s.id !== id),
      })),
    [],
  );

  // ── Projects ───────────────────────────────────────────────────────────────
  const addProject = useCallback(
    (p: Project) =>
      setData((prev) => ({ ...prev, projects: [...prev.projects, p] })),
    [],
  );

  const updateProject = useCallback(
    (id: string, updates: Partial<Project>) =>
      setData((prev) => ({
        ...prev,
        projects: prev.projects.map((p) =>
          p.id === id ? { ...p, ...updates } : p,
        ),
      })),
    [],
  );

  const removeProject = useCallback(
    (id: string) =>
      setData((prev) => ({
        ...prev,
        projects: prev.projects.filter((p) => p.id !== id),
      })),
    [],
  );

  // ── Certifications ─────────────────────────────────────────────────────────
  const addCertification = useCallback(
    (c: Certification) =>
      setData((prev) => ({
        ...prev,
        certifications: [...prev.certifications, c],
      })),
    [],
  );

  const updateCertification = useCallback(
    (id: string, updates: Partial<Certification>) =>
      setData((prev) => ({
        ...prev,
        certifications: prev.certifications.map((c) =>
          c.id === id ? { ...c, ...updates } : c,
        ),
      })),
    [],
  );

  const removeCertification = useCallback(
    (id: string) =>
      setData((prev) => ({
        ...prev,
        certifications: prev.certifications.filter((c) => c.id !== id),
      })),
    [],
  );

  // ── Languages ──────────────────────────────────────────────────────────────
  const addLanguage = useCallback(
    (l: Language) =>
      setData((prev) => ({ ...prev, languages: [...prev.languages, l] })),
    [],
  );

  const updateLanguage = useCallback(
    (id: string, updates: Partial<Language>) =>
      setData((prev) => ({
        ...prev,
        languages: prev.languages.map((l) =>
          l.id === id ? { ...l, ...updates } : l,
        ),
      })),
    [],
  );

  const removeLanguage = useCallback(
    (id: string) =>
      setData((prev) => ({
        ...prev,
        languages: prev.languages.filter((l) => l.id !== id),
      })),
    [],
  );

  // ── Awards ─────────────────────────────────────────────────────────────────
  const addAward = useCallback(
    (a: Award) => setData((prev) => ({ ...prev, awards: [...prev.awards, a] })),
    [],
  );

  const updateAward = useCallback(
    (id: string, updates: Partial<Award>) =>
      setData((prev) => ({
        ...prev,
        awards: prev.awards.map((a) =>
          a.id === id ? { ...a, ...updates } : a,
        ),
      })),
    [],
  );

  const removeAward = useCallback(
    (id: string) =>
      setData((prev) => ({
        ...prev,
        awards: prev.awards.filter((a) => a.id !== id),
      })),
    [],
  );

  // ── Volunteer ──────────────────────────────────────────────────────────────
  const addVolunteer = useCallback(
    (v: VolunteerWork) =>
      setData((prev) => ({ ...prev, volunteer: [...prev.volunteer, v] })),
    [],
  );

  const updateVolunteer = useCallback(
    (id: string, updates: Partial<VolunteerWork>) =>
      setData((prev) => ({
        ...prev,
        volunteer: prev.volunteer.map((v) =>
          v.id === id ? { ...v, ...updates } : v,
        ),
      })),
    [],
  );

  const removeVolunteer = useCallback(
    (id: string) =>
      setData((prev) => ({
        ...prev,
        volunteer: prev.volunteer.filter((v) => v.id !== id),
      })),
    [],
  );

  const resetResume = useCallback(() => {
    clearStorage();
    setData(createEmptyResume());
  }, []);

  return {
    data,
    setTemplate,
    updatePersonal,
    updateSummary,
    addExperience,
    updateExperience,
    removeExperience,
    addEducation,
    updateEducation,
    removeEducation,
    addSkillGroup,
    updateSkillGroup,
    removeSkillGroup,
    addProject,
    updateProject,
    removeProject,
    addCertification,
    updateCertification,
    removeCertification,
    addLanguage,
    updateLanguage,
    removeLanguage,
    addAward,
    updateAward,
    removeAward,
    addVolunteer,
    updateVolunteer,
    removeVolunteer,
    resetResume,
  };
}
