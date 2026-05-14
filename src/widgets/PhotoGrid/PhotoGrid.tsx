"use client";

import { useState, useCallback, useEffect, useRef, useMemo } from "react";
import { useIntersectionObserver } from "@/shared/hooks/useIntersectionObserver";
import { Lightbox } from "@/shared/ui/lightbox";
import type { Photo } from "@/entities/photo/types";

const TARGET_ROW_HEIGHT_MOBILE = 120;
const TARGET_ROW_HEIGHT_DESKTOP = 180;
const GAP = 4; // gap-1

type Row = { photos: Photo[]; height: number };

function buildRows(
  photos: Photo[],
  ratios: Map<string, number>,
  containerWidth: number,
  targetHeight: number,
): Row[] {
  if (containerWidth === 0 || photos.length === 0) return [];
  const rows: Row[] = [];
  let i = 0;
  while (i < photos.length) {
    let sumAR = 0;
    let j = i;
    while (j < photos.length) {
      sumAR += ratios.get(photos[j].id) ?? 4 / 3;
      const n = j - i + 1;
      j++;
      if ((containerWidth - (n - 1) * GAP) / sumAR <= targetHeight) break;
    }
    const rowPhotos = photos.slice(i, j);
    const rowSumAR = rowPhotos.reduce(
      (s, p) => s + (ratios.get(p.id) ?? 4 / 3),
      0,
    );
    const n = rowPhotos.length;
    const isLastRow = j >= photos.length;
    const height = Math.min(
      (containerWidth - (n - 1) * GAP) / rowSumAR,
      isLastRow ? targetHeight : Infinity,
    );
    rows.push({ photos: rowPhotos, height });
    i = j;
  }
  return rows;
}

type Props = {
  initialPhotos: Photo[];
  fetchMore?: (page: number) => Promise<Photo[]>;
};

export function PhotoGrid({ initialPhotos, fetchMore }: Props) {
  const [photos, setPhotos] = useState<Photo[]>(initialPhotos);
  const [ratios, setRatios] = useState<Map<string, number>>(new Map());
  const [containerWidth, setContainerWidth] = useState(0);
  const [targetHeight, setTargetHeight] = useState(TARGET_ROW_HEIGHT_DESKTOP);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(
    !!fetchMore && initialPhotos.length === 24,
  );
  const [loading, setLoading] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    setContainerWidth(el.clientWidth);
    const ro = new ResizeObserver((entries) => {
      setContainerWidth(entries[0]?.contentRect.width ?? 0);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    function update() {
      setTargetHeight(
        window.innerWidth < 640
          ? TARGET_ROW_HEIGHT_MOBILE
          : TARGET_ROW_HEIGHT_DESKTOP,
      );
    }
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const handleLoad = useCallback((id: string, w: number, h: number) => {
    if (!w || !h) return;
    setRatios((prev) => {
      const ar = w / h;
      if (prev.get(id) === ar) return prev;
      const next = new Map(prev);
      next.set(id, ar);
      return next;
    });
  }, []);

  const loadMore = useCallback(async () => {
    if (!fetchMore || loading || !hasMore) return;
    setLoading(true);
    try {
      const next = await fetchMore(page);
      if (next.length < 24) setHasMore(false);
      setPhotos((prev) => [...prev, ...next]);
      setPage((p) => p + 1);
    } finally {
      setLoading(false);
    }
  }, [fetchMore, loading, hasMore, page]);

  const sentinelRef = useIntersectionObserver(loadMore, { threshold: 0.1 });

  const rows = useMemo(
    () => buildRows(photos, ratios, containerWidth, targetHeight),
    [photos, ratios, containerWidth, targetHeight],
  );

  const photoIndexMap = useMemo(
    () => new Map(photos.map((p, i) => [p.id, i])),
    [photos],
  );

  return (
    <div ref={containerRef}>
      <div className="space-y-1">
        {rows.map((row) => (
          <div key={row.photos[0]?.id} className="flex gap-1">
            {row.photos.map((photo) => {
              const ar = ratios.get(photo.id) ?? 4 / 3;
              return (
                <img
                  key={photo.id}
                  src={photo.r2_url}
                  alt=""
                  loading="lazy"
                  className="block cursor-pointer transition-opacity hover:opacity-90"
                  style={{
                    width: ar * row.height,
                    height: row.height,
                    flexShrink: 0,
                  }}
                  onClick={() =>
                    setLightboxIndex(photoIndexMap.get(photo.id) ?? 0)
                  }
                  onLoad={(e) =>
                    handleLoad(
                      photo.id,
                      e.currentTarget.naturalWidth,
                      e.currentTarget.naturalHeight,
                    )
                  }
                />
              );
            })}
          </div>
        ))}
      </div>

      {hasMore && (
        <div
          ref={sentinelRef}
          className="py-8 text-center text-sm text-zinc-400"
        >
          {loading ? "読み込み中..." : ""}
        </div>
      )}
      {!hasMore && photos.length > 0 && fetchMore && (
        <p className="py-8 text-center text-sm text-zinc-400">
          全て表示しました
        </p>
      )}

      {lightboxIndex !== null && (
        <Lightbox
          photos={photos}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onPrev={() =>
            setLightboxIndex((prev) =>
              prev !== null ? Math.max(0, prev - 1) : 0,
            )
          }
          onNext={() =>
            setLightboxIndex((prev) =>
              prev !== null ? Math.min(photos.length - 1, prev + 1) : 0,
            )
          }
        />
      )}
    </div>
  );
}
