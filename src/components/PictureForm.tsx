import { type ChangeEvent, useRef, useState } from "react";
import type { PersonalInfo } from "../lib/types";
import { ImageIcon, UploadIcon, XIcon } from "./Icons";

const PHOTO_MAX_SIZE = 900;
const PHOTO_QUALITY = 0.88;

interface Props {
  photo: string;
  onChange: (field: keyof PersonalInfo, value: string) => void;
}

const readFileAsDataUrl = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject(new Error("Invalid image file."));
      }
    };
    reader.onerror = () => reject(new Error("Unable to read image file."));
    reader.readAsDataURL(file);
  });

const resizeImageDataUrl = (source: string): Promise<string> =>
  new Promise((resolve, reject) => {
    const image = new Image();

    image.onload = () => {
      const longestSide = Math.max(image.naturalWidth, image.naturalHeight);
      const scale = longestSide > PHOTO_MAX_SIZE ? PHOTO_MAX_SIZE / longestSide : 1;
      const width = Math.max(1, Math.round(image.naturalWidth * scale));
      const height = Math.max(1, Math.round(image.naturalHeight * scale));
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const context = canvas.getContext("2d");
      if (!context) {
        resolve(source);
        return;
      }

      context.fillStyle = "#ffffff";
      context.fillRect(0, 0, width, height);
      context.drawImage(image, 0, 0, width, height);
      resolve(canvas.toDataURL("image/jpeg", PHOTO_QUALITY));
    };

    image.onerror = () => reject(new Error("Unable to load image file."));
    image.src = source;
  });

export default function PictureForm({ photo, onChange }: Props) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [error, setError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Choose an image file.");
      return;
    }

    setError("");
    setIsProcessing(true);

    try {
      const source = await readFileAsDataUrl(file);
      const resized = await resizeImageDataUrl(source);
      onChange("photo", resized);
    } catch {
      setError("The image could not be loaded.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-4">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      <div className="flex items-center gap-4 rounded-xl border border-zinc-200 bg-zinc-50 p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/40">
        <div className="flex h-24 w-20 flex-none items-center justify-center overflow-hidden rounded-lg border border-zinc-200 bg-white text-zinc-400 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-500">
          {photo ? (
            <img
              src={photo}
              alt=""
              className="h-full w-full object-cover"
              draggable={false}
            />
          ) : (
            <ImageIcon size={26} />
          )}
        </div>

        <div className="min-w-0 flex-1 space-y-3">
          <div>
            <p className="text-[13px] font-bold text-zinc-800 dark:text-zinc-200">
              CV Photo
            </p>
            <p className="mt-1 text-[12px] leading-relaxed text-zinc-500 dark:text-zinc-400">
              Appears in the upper-left of the CV template.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isProcessing}
              className="flex items-center justify-center gap-2 rounded-lg bg-zinc-950 px-3 py-2 text-[12px] font-bold text-white shadow-sm transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
            >
              <UploadIcon size={14} />
              {isProcessing ? "Processing" : photo ? "Replace" : "Upload"}
            </button>
            {photo && (
              <button
                type="button"
                onClick={() => onChange("photo", "")}
                className="flex items-center justify-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-[12px] font-bold text-zinc-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-red-500/30 dark:hover:bg-red-500/10 dark:hover:text-red-400"
              >
                <XIcon size={14} />
                Remove
              </button>
            )}
          </div>
        </div>
      </div>

      {error && (
        <p className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-[12px] font-semibold text-red-600 dark:text-red-300">
          {error}
        </p>
      )}
    </div>
  );
}
