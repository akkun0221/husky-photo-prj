"use client";

import { useState, useCallback, useMemo } from "react";
import { useIntersectionObserver } from "@/shared/hooks/useIntersectionObserver";
import { Lightbox } from "@/shared/ui/lightbox";
import { usePhotoListStore } from "@/entities/photo/PhotoListContext";
import { GalleryPhoto } from "@/widgets/Memorial/GalleryPhoto";

type Props = {
  onLoadMore?: () => void;
  isFetchingNext?: boolean;
};

function hashTilt(id: string): number {
  const v = parseInt(id.replace(/-/g, "")[0], 16);
  return ((v % 9) - 4) * 0.35;
}

export function PhotoGrid({ onLoadMore, isFetchingNext = false }: Props) {
  const photos = usePhotoListStore((s) => s.photos);
  const hasMore = usePhotoListStore((s) => s.hasMore);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const loadMore = useCallback(() => {
    if (!onLoadMore || isFetchingNext || !hasMore) return;
    onLoadMore();
  }, [onLoadMore, isFetchingNext, hasMore]);

  const sentinelRef = useIntersectionObserver(loadMore, { threshold: 0.1 });

  const photoIndexMap = useMemo(
    () => new Map(photos.map((p, i) => [p.id, i])),
    [photos],
  );

  return (
    <div className="px-3 pt-4 pb-8 sm:px-6">
      <div className="columns-3 sm:columns-5" style={{ columnGap: 10 }}>
        {photos.map((photo) => {
          const ar =
            photo.width && photo.height
              ? `${photo.width}/${photo.height}`
              : "3/2";
          return (
            <GalleryPhoto
              key={photo.id}
              url={photo.thumbnail_url}
              tilt={hashTilt(photo.id)}
              aspectRatio={ar}
              onClick={() => setLightboxIndex(photoIndexMap.get(photo.id) ?? 0)}
            />
          );
        })}
      </div>

      {hasMore && (
        <div ref={sentinelRef} className="py-10 text-center">
          <span
            style={{
              fontFamily: "var(--mono)",
              fontSize: 10,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "var(--memorial-sub)",
            }}
          >
            {isFetchingNext ? "loading..." : ""}
          </span>
        </div>
      )}

      {!hasMore && photos.length > 0 && onLoadMore !== undefined && (
        <div
          className="py-8 text-center"
          style={{
            fontFamily: "var(--mono)",
            fontSize: 10,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: "var(--memorial-sub)",
          }}
        >
          — {photos.length} frames —
        </div>
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
