const ALLOWED: Record<string, string[]> = {
  "application/pdf": [".pdf"],
  "image/png": [".png"],
  "image/jpeg": [".jpg", ".jpeg"],
  "image/tiff": [".tif", ".tiff"],
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [
    ".docx",
  ],
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
    ".xlsx",
  ],
  "text/csv": [".csv"],
  "application/csv": [".csv"],
};

const FORBIDDEN_EXTENSIONS = [
  ".exe",
  ".bat",
  ".cmd",
  ".ps1",
  ".sh",
  ".js",
  ".mjs",
  ".vbs",
  ".dll",
  ".msi",
  ".jar",
  ".zip",
  ".rar",
  ".7z",
];

export function getExtension(filename: string): string {
  const i = filename.lastIndexOf(".");
  if (i < 0) return "";
  return filename.slice(i).toLowerCase();
}

export function sanitizeFilename(filename: string): string {
  const base = filename.split(/[/\\]/).pop() || "document";
  return base
    .normalize("NFKD")
    .replace(/[^\w.\- ()[\]]+/g, "_")
    .replace(/\s+/g, "_")
    .slice(0, 180);
}

export function isForbiddenExtension(filename: string): boolean {
  return FORBIDDEN_EXTENSIONS.includes(getExtension(filename));
}

export function isAllowedMimeAndExtension(
  mimeType: string,
  filename: string,
): boolean {
  if (isForbiddenExtension(filename)) return false;
  const ext = getExtension(filename);
  const allowedExts = ALLOWED[mimeType.toLowerCase()];
  if (!allowedExts) return false;
  return allowedExts.includes(ext);
}

export function isTextBearingMime(mimeType: string): boolean {
  return (
    mimeType === "application/pdf" ||
    mimeType.includes("wordprocessingml") ||
    mimeType.includes("spreadsheetml") ||
    mimeType === "text/csv" ||
    mimeType === "application/csv"
  );
}

export function isImageMime(mimeType: string): boolean {
  return mimeType.startsWith("image/");
}
