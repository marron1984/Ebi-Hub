/**
 * Image upload utilities for Ebi-Hub.
 *
 * Strategy: compress client-side to Base64 JPEG, store directly in
 * the DB `photoUrl` column (TEXT). This keeps the stack self-contained
 * (no external service needed) and is fine for a small team.
 *
 * If migrating to Cloudinary later, swap `compressAndEncode` with
 * a fetch to /api/upload that proxies to Cloudinary.
 */

/** Max dimension for resizing (400px keeps file < 30KB typically) */
const MAX_DIM = 400;
/** JPEG quality (0-1) */
const QUALITY = 0.7;
/** Max raw file size we accept (5MB) */
const MAX_FILE_SIZE = 5 * 1024 * 1024;

export interface UploadResult {
  dataUrl: string;
  width: number;
  height: number;
  sizeBytes: number;
}

/**
 * Compress an image File to a Base64 data URL.
 * Runs entirely client-side via Canvas.
 */
export function compressAndEncode(file: File): Promise<UploadResult> {
  return new Promise((resolve, reject) => {
    if (file.size > MAX_FILE_SIZE) {
      reject(new Error(`ファイルサイズが大きすぎます (最大${MAX_FILE_SIZE / 1024 / 1024}MB)`));
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error("ファイルの読み込みに失敗しました"));
    reader.onload = (ev) => {
      const img = new Image();
      img.onerror = () => reject(new Error("画像の読み込みに失敗しました"));
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let w = img.width;
        let h = img.height;

        // Downscale if larger than MAX_DIM
        if (w > MAX_DIM || h > MAX_DIM) {
          const ratio = Math.min(MAX_DIM / w, MAX_DIM / h);
          w = Math.round(w * ratio);
          h = Math.round(h * ratio);
        }

        canvas.width = w;
        canvas.height = h;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Canvas context unavailable"));
          return;
        }

        ctx.drawImage(img, 0, 0, w, h);
        const dataUrl = canvas.toDataURL("image/jpeg", QUALITY);

        resolve({
          dataUrl,
          width: w,
          height: h,
          sizeBytes: Math.round((dataUrl.length * 3) / 4), // approximate
        });
      };
      img.src = ev.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Validate a Base64 data URL — basic sanity check.
 */
export function isValidDataUrl(url: string): boolean {
  return url.startsWith("data:image/") && url.includes("base64,");
}
