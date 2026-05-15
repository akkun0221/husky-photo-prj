const MAX_SIDE = 2000;
const THUMBNAIL_MAX_SIDE = 400;
const TARGET_MIN_BYTES = 500 * 1024;
const TARGET_MAX_BYTES = 800 * 1024;

function toBlob(canvas: HTMLCanvasElement, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("toBlob failed"))),
      "image/webp",
      quality,
    );
  });
}

export type CompressResult = {
  blob: Blob;
  width: number;
  height: number;
};

export async function compressImage(file: File): Promise<CompressResult> {
  const bitmap = await createImageBitmap(file);

  let { width, height } = bitmap;
  if (Math.max(width, height) > MAX_SIDE) {
    const scale = MAX_SIDE / Math.max(width, height);
    width = Math.round(width * scale);
    height = Math.round(height * scale);
  }

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  // 二分探索で 500〜800KB に収まる quality を探す
  let lo = 0.1;
  let hi = 0.95;
  let result = await toBlob(canvas, 0.85);

  for (let i = 0; i < 8; i++) {
    const mid = (lo + hi) / 2;
    const blob = await toBlob(canvas, mid);
    result = blob;

    if (blob.size >= TARGET_MIN_BYTES && blob.size <= TARGET_MAX_BYTES) break;
    if (blob.size > TARGET_MAX_BYTES) hi = mid;
    else lo = mid;
  }

  return { blob: result, width, height };
}

export async function generateThumbnail(file: File): Promise<Blob> {
  const bitmap = await createImageBitmap(file);

  let { width, height } = bitmap;
  if (Math.max(width, height) > THUMBNAIL_MAX_SIDE) {
    const scale = THUMBNAIL_MAX_SIDE / Math.max(width, height);
    width = Math.round(width * scale);
    height = Math.round(height * scale);
  }

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  return toBlob(canvas, 0.85);
}
