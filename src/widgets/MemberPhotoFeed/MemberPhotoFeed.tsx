"use client";

import { useCallback } from "react";
import Link from "next/link";
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
      {groups.map(({ live, photos }, index) => (
        <section
          key={live.id}
          style={{ borderBottom: "1px solid var(--memorial-faint)" }}
        >
          {/* グループヘッダー — 3カラムgrid */}
          <header
            className="px-4 py-5 sm:px-16"
            style={{
              borderBottom: "1px solid var(--memorial-faint)",
              display: "grid",
              gridTemplateColumns: "auto 1fr auto",
              alignItems: "baseline",
              gap: 24,
            }}
          >
            {/* entry番号 + weekday */}
            <div
              style={{
                fontFamily: "var(--mono)",
                fontSize: 10,
                letterSpacing: "0.32em",
                textTransform: "uppercase",
                color: "var(--memorial-sub)",
                flexShrink: 0,
              }}
            >
              entry №{String(index + 1).padStart(3, "0")} ·{" "}
              {calcWeekday(live.date)}
            </div>

            {/* 日付 + タイトル + 会場 */}
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: 22,
                flexWrap: "wrap",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--serif)",
                  fontStyle: "italic",
                  fontWeight: 400,
                  fontSize: "clamp(20px, 3vw, 38px)",
                  lineHeight: 0.95,
                  letterSpacing: "-0.025em",
                  color: "var(--memorial-fg)",
                }}
              >
                {live.date}
              </span>
              <span
                style={{
                  fontFamily: "var(--serif)",
                  fontStyle: "italic",
                  fontWeight: 700,
                  fontSize: "clamp(15px, 2vw, 20px)",
                  lineHeight: 1.2,
                  color: "var(--memorial-fg)",
                }}
              >
                {live.title || live.venue}
              </span>
              {live.title && (
                <span
                  className="hidden sm:inline"
                  style={{
                    fontFamily: "var(--mono)",
                    fontSize: 11,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: "var(--memorial-sub)",
                  }}
                >
                  @ {live.venue}
                </span>
              )}
            </div>

            {/* all photos → */}
            <Link
              href={`/lives/${live.id}`}
              style={{
                textDecoration: "none",
                fontFamily: "var(--mono)",
                fontSize: 10,
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: "var(--memorial-accent)",
                flexShrink: 0,
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              all photos →
            </Link>
          </header>

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
