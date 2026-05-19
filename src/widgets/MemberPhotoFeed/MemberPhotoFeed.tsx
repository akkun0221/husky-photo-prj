"use client";

import { useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useIntersectionObserver } from "@/shared/hooks/useIntersectionObserver";
import { PhotoListProvider } from "@/entities/photo/PhotoListContext";
import { PhotoGrid } from "@/widgets/PhotoGrid/PhotoGrid";
import type { PhotosGroupedByLive } from "@/entities/photo/api";

type PageResult = { groups: PhotosGroupedByLive[]; hasMore: boolean };

const WEEKDAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"] as const;

function calcWeekday(dateStr: string): string {
  const [y, m, d] = dateStr.split(".").map(Number);
  return WEEKDAYS[new Date(y, m - 1, d).getDay()];
}

export function MemberPhotoFeed() {
  const searchParams = useSearchParams();
  const memberId = searchParams.get("member");

  const { data, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useInfiniteQuery<PageResult>({
      queryKey: ["member-photo-feed", memberId],
      queryFn: async ({ pageParam }) => {
        const params = new URLSearchParams({ page: String(pageParam) });
        if (memberId) params.set("memberId", memberId);
        const res = await fetch(`/api/members/photo-feed?${params.toString()}`);
        if (!res.ok) throw new Error("写真の取得に失敗しました");
        return res.json();
      },
      initialPageParam: 0,
      getNextPageParam: (lastPage, _allPages, lastPageParam) =>
        lastPage.hasMore ? (lastPageParam as number) + 1 : undefined,
    });

  const groups = data?.pages.flatMap((p) => p.groups) ?? [];

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // スクロール末尾で fetchNextPage を呼び出す
  const sentinelRef = useIntersectionObserver(handleLoadMore, {
    threshold: 0.1,
  });

  if (isLoading) {
    return (
      <p
        className="py-16 text-center font-mono text-[11px] tracking-[0.3em] uppercase"
        style={{ color: "var(--memorial-sub)" }}
      >
        loading...
      </p>
    );
  }

  if (groups.length === 0) {
    return (
      <p
        className="py-16 text-center font-mono text-[11px] tracking-[0.3em] uppercase"
        style={{ color: "var(--memorial-sub)" }}
      >
        no photos found
      </p>
    );
  }

  return (
    <div>
      {groups.map(({ live, photos }) => (
        <section
          key={live.id}
          style={{ borderBottom: "1px solid var(--memorial-faint)" }}
        >
          {/* グループヘッダー */}
          <div
            className="px-4 py-5 sm:px-16"
            style={{ borderBottom: "1px solid var(--memorial-faint)" }}
          >
            <div
              style={{
                fontFamily: "var(--mono)",
                fontSize: 10,
                letterSpacing: "0.35em",
                textTransform: "uppercase",
                color: "var(--memorial-sub)",
                marginBottom: 6,
              }}
            >
              {calcWeekday(live.date)} · {live.date}
            </div>
            <h2
              style={{
                fontFamily: "var(--serif)",
                fontStyle: "italic",
                fontWeight: 700,
                fontSize: "clamp(18px, 2.5vw, 26px)",
                lineHeight: 1.05,
                letterSpacing: "-0.01em",
                color: "var(--memorial-fg)",
                margin: "0 0 4px",
              }}
            >
              {live.title || live.venue}
            </h2>
            {live.title && (
              <div
                style={{
                  fontFamily: "var(--type)",
                  fontSize: 10,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "var(--memorial-sub)",
                }}
              >
                {live.venue}
              </div>
            )}
          </div>

          <PhotoListProvider photos={photos} hasMore={false}>
            <PhotoGrid />
          </PhotoListProvider>
        </section>
      ))}

      {/* 無限スクロール用センサー */}
      {hasNextPage && (
        <div
          ref={sentinelRef}
          className="py-10 text-center"
          style={{
            fontFamily: "var(--mono)",
            fontSize: 10,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: "var(--memorial-sub)",
          }}
        >
          {isFetchingNextPage ? "loading..." : ""}
        </div>
      )}
    </div>
  );
}
