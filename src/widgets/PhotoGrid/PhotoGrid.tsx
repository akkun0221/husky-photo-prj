"use client";

import { useState, useCallback, useEffect, useRef, useMemo } from "react";
import { useWindowVirtualizer } from "@tanstack/react-virtual";
import { useIntersectionObserver } from "@/shared/hooks/useIntersectionObserver";
import { Lightbox } from "@/shared/ui/lightbox";
import { usePhotoListStore } from "@/entities/photo/PhotoListContext";
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
  fetchMore?: (page: number) => Promise<Photo[]>;
};

export function PhotoGrid({ fetchMore }: Props) {
  const photos = usePhotoListStore((s) => s.photos);
  const page = usePhotoListStore((s) => s.page);
  const hasMore = usePhotoListStore((s) => s.hasMore);
  const loading = usePhotoListStore((s) => s.loading);
  const append = usePhotoListStore((s) => s.append);
  const nextPage = usePhotoListStore((s) => s.nextPage);
  const setLoading = usePhotoListStore((s) => s.setLoading);
  const setHasMore = usePhotoListStore((s) => s.setHasMore);

  // onLoad で取得した実測アスペクト比
  const [loadedRatios, setLoadedRatios] = useState<Map<string, number>>(
    new Map(),
  );

  // DBのwidth/heightを優先し、onLoadの実測値で上書き
  const ratios = useMemo(() => {
    const map = new Map<string, number>();
    for (const p of photos) {
      if (p.width && p.height) map.set(p.id, p.width / p.height);
    }
    for (const [id, ar] of loadedRatios) {
      map.set(id, ar);
    }
    return map;
  }, [photos, loadedRatios]);

  const [containerWidth, setContainerWidth] = useState(0);
  const [scrollMargin, setScrollMargin] = useState(0);
  const [targetHeight, setTargetHeight] = useState(TARGET_ROW_HEIGHT_DESKTOP);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const updateScrollMargin = () => {
      setScrollMargin(
        Math.round(el.getBoundingClientRect().top + window.scrollY),
      );
    };

    updateScrollMargin();
    setContainerWidth(el.clientWidth);

    const containerRo = new ResizeObserver((entries) => {
      setContainerWidth(entries[0]?.contentRect.width ?? 0);
    });
    containerRo.observe(el);

    // 他セクションのコンテンツロードでページ高さが変わったときにscrollMarginを再計算
    const docRo = new ResizeObserver(updateScrollMargin);
    docRo.observe(document.documentElement);

    return () => {
      containerRo.disconnect();
      docRo.disconnect();
    };
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
    setLoadedRatios((prev) => {
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
      append(next);
      nextPage();
    } finally {
      setLoading(false);
    }
  }, [
    fetchMore,
    loading,
    hasMore,
    page,
    append,
    nextPage,
    setLoading,
    setHasMore,
  ]);

  const sentinelRef = useIntersectionObserver(loadMore, { threshold: 0.1 });

  const rows = useMemo(
    () => buildRows(photos, ratios, containerWidth, targetHeight),
    [photos, ratios, containerWidth, targetHeight],
  );

  const photoIndexMap = useMemo(
    () => new Map(photos.map((p, i) => [p.id, i])),
    [photos],
  );

  const virtualizer = useWindowVirtualizer({
    count: rows.length,
    // 行の高さ + GAP 分を見積もることで行間スペースを確保
    estimateSize: (i) => (rows[i]?.height ?? TARGET_ROW_HEIGHT_DESKTOP) + GAP,
    overscan: 3,
    scrollMargin,
  });

  return (
    <div ref={containerRef}>
      {/* 仮想スクロール：全行の合計高さを確保しつつ表示行のみDOMに置く */}
      <div style={{ height: virtualizer.getTotalSize(), position: "relative" }}>
        {virtualizer.getVirtualItems().map((virtualRow) => {
          const row = rows[virtualRow.index];
          if (!row) return null;
          return (
            <div
              key={virtualRow.key}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                transform: `translateY(${virtualRow.start - virtualizer.options.scrollMargin}px)`,
              }}
            >
              <div className="flex gap-1" style={{ height: row.height }}>
                {row.photos.map((photo) => {
                  const ar = ratios.get(photo.id) ?? 4 / 3;
                  return (
                    <img
                      key={photo.id}
                      src={photo.thumbnail_url}
                      alt="ライブ写真"
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
            </div>
          );
        })}
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
