import type { ResumeData } from "./types";

/**
 * Converts a blob URL or data URL photo to a base64 data URL so it can
 * be embedded in the JSON export.
 */
async function photoToBase64(photoUrl: string): Promise<string> {
  if (!photoUrl) return "";
  // Already a data URL — no conversion needed
  if (photoUrl.startsWith("data:")) return photoUrl;
  // Convert blob URL to base64
  if (photoUrl.startsWith("blob:")) {
    try {
      const res = await fetch(photoUrl);
      const blob = await res.blob();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch {
      return "";
    }
  }
  return photoUrl;
}

/**
 * Exports all resume data (including photo as base64) as a downloadable JSON file.
 */
export const exportResumeData = async (data: ResumeData): Promise<void> => {
  const exportData: ResumeData = {
    ...data,
    personal: {
      ...data.personal,
      photo: await photoToBase64(data.personal.photo),
    },
  };

  const json = JSON.stringify(exportData, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  const name = data.personal.fullName?.trim() || "resume";
  a.href = url;
  a.download = `${name}-data.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

/**
 * Opens a file picker and imports resume data from a JSON file.
 * Returns the parsed ResumeData or null if the user cancels / file is invalid.
 */
export const importResumeData = (): Promise<ResumeData | null> => {
  return new Promise((resolve) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/json,.json";

    input.onchange = () => {
      const file = input.files?.[0];
      if (!file) return resolve(null);

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const parsed = JSON.parse(e.target?.result as string) as ResumeData;
          resolve(parsed);
        } catch {
          resolve(null);
        }
      };
      reader.onerror = () => resolve(null);
      reader.readAsText(file);
    };

    // Cancelled — no file selected
    input.oncancel = () => resolve(null);

    document.body.appendChild(input);
    input.click();
    document.body.removeChild(input);
  });
};
