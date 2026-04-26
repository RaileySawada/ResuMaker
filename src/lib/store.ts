import type { ResumeData } from "./types";

const STORAGE_KEY = "resumemaker_v1";

export const saveToStorage = (data: ResumeData): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error("[ResumeStore] Failed to save:", e);
  }
};

export const loadFromStorage = (): ResumeData | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ResumeData) : null;
  } catch {
    return null;
  }
};

export const clearStorage = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};
