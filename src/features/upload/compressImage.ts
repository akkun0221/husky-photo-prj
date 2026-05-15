const MAX_SIDE = 2000;
const THUMBNAIL_MAX_SIDE = 400;
const TARGET_MIN_BYTES = 500 * 1024;
const TARGET_MAX_BYTES = 800 * 1024;
const INITIAL_QUALITY = 0.85;
const MAX_BINARY_SEARCH_ITERATIONS = 3;

function toBlob(canvas: HTMLCanvasElement, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("toBlob failed"))),
      "image/webp",
      quality,
    );
  });
}

// 案①+②: デコード1回・二分探索を最大3回に削減
async function compressToRange(canvas: HTMLCanvasElement): Promise<Blob> {
  const result = await toBlob(canvas, INITIAL_QUALITY);
  if (result.size >= TARGET_MIN_BYTES && result.size <= TARGET_MAX_BYTES) {
    return result; // 0.85で範囲内なら1回で終了
  }

  let lo = result.size > TARGET_MAX_BYTES ? 0.1 : INITIAL_QUALITY;
  let hi = result.size > TARGET_MAX_BYTES ? INITIAL_QUALITY : 0.95;
  let best = result;

  for (let i = 0; i < MAX_BINARY_SEARCH_ITERATIONS; i++) {
    const mid = (lo + hi) / 2;
    const blob = await toBlob(canvas, mid);
    best = blob;
    if (blob.size >= TARGET_MIN_BYTES && blob.size <= TARGET_MAX_BYTES) break;
    if (blob.size > TARGET_MAX_BYTES) hi = mid;
    else lo = mid;
  }

  return best;
}

export type ProcessResult = {
  blob: Blob;
  thumbnailBlob: Blob;
  width: number;
  height: number;
};

// 案①: createImageBitmap を1回だけ呼び、本体・サムネイルを同一デコードから生成
export async function processImage(file: File): Promise<ProcessResult> {
  const bitmap = await createImageBitmap(file);
  const origW = bitmap.width;
  const origH = bitmap.height;

  // 本体サイズ
  let width = origW;
  let height = origH;
  if (Math.max(width, height) > MAX_SIDE) {
    const scale = MAX_SIDE / Math.max(width, height);
    width = Math.round(width * scale);
    height = Math.round(height * scale);
  }

  // サムネイルサイズ
  let thumbW = origW;
  let thumbH = origH;
  if (Math.max(thumbW, thumbH) > THUMBNAIL_MAX_SIDE) {
    const scale = THUMBNAIL_MAX_SIDE / Math.max(thumbW, thumbH);
    thumbW = Math.round(thumbW * scale);
    thumbH = Math.round(thumbH * scale);
  }

  const mainCanvas = document.createElement("canvas");
  mainCanvas.width = width;
  mainCanvas.height = height;
  mainCanvas.getContext("2d")!.drawImage(bitmap, 0, 0, width, height);

  const thumbCanvas = document.createElement("canvas");
  thumbCanvas.width = thumbW;
  thumbCanvas.height = thumbH;
  thumbCanvas.getContext("2d")!.drawImage(bitmap, 0, 0, thumbW, thumbH);

  bitmap.close();

  // 本体（品質調整あり）とサムネイル（固定品質）を並列エンコード
  const [blob, thumbnailBlob] = await Promise.all([
    compressToRange(mainCanvas),
    toBlob(thumbCanvas, INITIAL_QUALITY),
  ]);

  return { blob, thumbnailBlob, width, height };
}
