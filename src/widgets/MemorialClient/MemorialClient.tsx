"use client";

import {
  useMemo,
  useRef,
  useCallback,
  useState,
  useEffect,
  startTransition,
} from "react";
import Link from "next/link";
import { useInfiniteQuery } from "@tanstack/react-query";
import type { LiveWithPhotoCount, LiveSummary } from "@/entities/live/types";
import type { MemberWithPhotoCount } from "@/entities/member/types";
import { useDirection } from "@/shared/hooks/useDirection";
import { useActiveYear } from "@/shared/hooks/useActiveYear";
import { useIntersectionObserver } from "@/shared/hooks/useIntersectionObserver";
import { PhotoMarquee } from "@/widgets/Memorial/PhotoMarquee";
import { StickyBarScrapbook } from "@/widgets/Memorial/StickyBarScrapbook";
import { StickyYearBand } from "@/widgets/Memorial/StickyYearBand";
import { PhotoStage } from "@/widgets/Memorial/PhotoStage";
import { TapeStrip } from "@/widgets/Memorial/TapeStrip";

const ALL_YEARS = ["2022", "2023", "2024", "2025", "2026"];

type PageResult = { lives: LiveWithPhotoCount[]; year: string };

type Props = {
  initialYearData: { lives: LiveWithPhotoCount[]; year: string };
  yearCounts: Record<string, number>;
  marqueeItems: LiveSummary[];
  members: MemberWithPhotoCount[];
  totalPhotos: number;
};

function hashTilt(id: string): number {
  const v = parseInt(id.replace(/-/g, "")[0], 16);
  return ((v % 13) - 6) * 0.4;
}

export function MemorialClient({
  initialYearData,
  yearCounts,
  marqueeItems,
  members,
  totalPhotos,
}: Props) {
  const [dir, setDir] = useDirection();

  // getNextPageParam のクロージャで参照するため useInfiniteQuery より先に計算
  const renderedYears = useMemo(() => {
    const ys = Object.keys(yearCounts).filter((y) => (yearCounts[y] ?? 0) > 0);
    return dir === "forward" ? ys.sort() : ys.sort().reverse();
  }, [yearCounts, dir]);

  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useInfiniteQuery<PageResult>({
      queryKey: ["lives-feed", dir],
      queryFn: async ({ pageParam }) => {
        const res = await fetch(`/api/lives/feed?year=${pageParam}&dir=${dir}`);
        if (!res.ok) throw new Error("ライブの取得に失敗しました");
        return res.json();
      },
      initialPageParam: renderedYears[0] ?? ALL_YEARS[ALL_YEARS.length - 1],
      getNextPageParam: (lastPage) => {
        const idx = renderedYears.indexOf(lastPage.year);
        return idx >= 0 && idx < renderedYears.length - 1
          ? renderedYears[idx + 1]
          : undefined;
      },
      // SIDE B（新しい順）がデフォルト。SSGの最新年データをそのまま使う
      initialData:
        dir === "reverse" && initialYearData.year
          ? {
              pages: [initialYearData],
              pageParams: [initialYearData.year],
            }
          : undefined,
    });

  const allLives = data?.pages.flatMap((p) => p.lives) ?? [];

  // 読み込み済みライブを年別にグループ化
  const groups = useMemo(() => {
    const map = new Map<string, LiveWithPhotoCount[]>();
    for (const l of allLives) {
      const y = l.date.slice(0, 4);
      if (!map.has(y)) map.set(y, []);
      map.get(y)!.push(l);
    }
    return map;
  }, [allLives]);

  const totalLives = useMemo(
    () => Object.values(yearCounts).reduce((s, c) => s + c, 0),
    [yearCounts],
  );

  // 年セクションのDOMノードへの安定したrefマップ
  const sectionNodeMap = useRef<Record<string, HTMLElement | null>>({});

  const activeYear = useActiveYear(
    sectionNodeMap,
    renderedYears[0] ?? ALL_YEARS[0],
  );

  // 年タブクリック時の「ロードされるまでフェッチし続けてからスクロール」ロジック
  const [pendingScrollYear, setPendingScrollYear] = useState<string | null>(
    null,
  );

  useEffect(() => {
    if (!pendingScrollYear) return;
    if (isFetchingNextPage) return;

    if (allLives.some((l) => l.date.startsWith(pendingScrollYear))) {
      const target = pendingScrollYear;
      requestAnimationFrame(() => {
        const el = document.getElementById(`y${target}`);
        if (!el) return;
        const top = el.getBoundingClientRect().top + window.scrollY - 120;
        window.scrollTo({ top, behavior: "smooth" });
      });
      startTransition(() => setPendingScrollYear(null));
      return;
    }

    if (hasNextPage) {
      fetchNextPage();
    } else {
      startTransition(() => setPendingScrollYear(null));
    }
  }, [
    pendingScrollYear,
    allLives,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  ]);

  const handleYearClick = useCallback(
    (year: string) => {
      if (allLives.some((l) => l.date.startsWith(year))) {
        const el = document.getElementById(`y${year}`);
        if (!el) return;
        const top = el.getBoundingClientRect().top + window.scrollY - 120;
        window.scrollTo({ top, behavior: "smooth" });
        return;
      }
      setPendingScrollYear(year);
    },
    [allLives],
  );

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const sentinelRef = useIntersectionObserver(handleLoadMore, {
    threshold: 0.1,
  });

  const stats: Array<[string, number]> = [
    ["nights", totalLives],
    ["frames", totalPhotos],
    ["voices", members.length],
  ];

  return (
    <>
      <PhotoMarquee lives={marqueeItems} />

      <StickyBarScrapbook
        dir={dir}
        onToggle={setDir}
        years={ALL_YEARS}
        counts={yearCounts}
        activeYear={activeYear}
        members={members}
        onYearClick={handleYearClick}
        loadingYear={pendingScrollYear}
      />

      {/* ── Hero ── */}
      <div
        className="relative overflow-hidden px-4 sm:px-16"
        style={{ paddingTop: 72, paddingBottom: 64 }}
      >
        <TapeStrip top={20} left={90} rot={-9} width={200} />
        <TapeStrip top={56} left="78%" rot={6} width={140} />

        <div
          style={{
            fontFamily: "var(--mono)",
            fontSize: 11,
            letterSpacing: "0.45em",
            textTransform: "uppercase",
            color: "var(--memorial-sub)",
            marginBottom: 16,
          }}
        >
          in memoriam · 2022.12.10 — 2026.04.27
        </div>

        <h1
          style={{
            fontFamily: "var(--serif)",
            fontStyle: "italic",
            fontWeight: 700,
            fontSize: "clamp(48px, 8vw, 96px)",
            lineHeight: 0.92,
            letterSpacing: "-0.03em",
            color: "var(--memorial-fg)",
            margin: "0 0 28px",
          }}
        >
          a long howl,
          <br />
          for husky.
        </h1>

        <div
          style={{
            borderLeft: "3px solid var(--memorial-accent)",
            paddingLeft: 16,
            maxWidth: 480,
            marginBottom: 40,
          }}
        >
          <p
            style={{
              fontFamily: "var(--jp)",
              fontWeight: 400,
              fontSize: 14,
              lineHeight: 2,
              color: "var(--memorial-fg)",
              opacity: 0.8,
              margin: 0,
            }}
          >
            2022年12月10日に池袋SOUND
            PEACEでhuskyと出会い、気づけば解散まで追い続けていました。
            <br />
            上がっている{totalLives}
            公演の写真は参戦したライブの記録です。まったりアップロードしていくのでゆるりとご覧ください。
          </p>
        </div>

        <div style={{ display: "flex", gap: 40, flexWrap: "wrap" }}>
          {stats.map(([label, val]) => (
            <div key={label}>
              <div
                style={{
                  fontFamily: "var(--serif)",
                  fontStyle: "italic",
                  fontWeight: 700,
                  fontSize: 36,
                  lineHeight: 1,
                  color: "var(--memorial-fg)",
                }}
              >
                {val}
              </div>
              <div
                style={{
                  fontFamily: "var(--mono)",
                  fontSize: 9,
                  letterSpacing: "0.4em",
                  textTransform: "uppercase",
                  color: "var(--memorial-sub)",
                  marginTop: 4,
                }}
              >
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Year-grouped Timeline ── */}
      <div style={{ paddingBottom: 120 }}>
        {!data ? (
          <p
            className="py-16 text-center"
            style={{
              fontFamily: "var(--mono)",
              fontSize: 10,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "var(--memorial-sub)",
            }}
          >
            loading...
          </p>
        ) : (
          renderedYears.map((year, gi) => {
            const yearLives = groups.get(year) ?? [];
            return (
              <section
                key={year}
                id={`y${year}`}
                ref={(el) => {
                  sectionNodeMap.current[year] = el;
                }}
              >
                {yearLives.length > 0 && (
                  <>
                    <StickyYearBand
                      year={year}
                      count={yearCounts[year] ?? 0}
                      chapterIdx={ALL_YEARS.indexOf(year)}
                      active={activeYear === year}
                    />
                    <div style={{ paddingBottom: 16 }}>
                      {yearLives.map((live, i) => (
                        <ScrapbookSpread
                          key={live.id}
                          live={live}
                          flip={(gi * 100 + i) % 2 === 1}
                          tilt={hashTilt(live.id)}
                        />
                      ))}
                    </div>
                  </>
                )}
              </section>
            );
          })
        )}
      </div>

      {/* 無限スクロール用センチネル */}
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
    </>
  );
}

type SpreadProps = {
  live: LiveWithPhotoCount;
  flip: boolean;
  tilt: number;
};

function ScrapbookSpread({ live, flip, tilt }: SpreadProps) {
  const stampRot = tilt * 2.5;

  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2"
      style={{
        gap: 24,
        padding: "28px 16px",
        borderTop: "1px solid var(--memorial-faint)",
      }}
    >
      {/* Photo side */}
      <div
        className={flip ? "sm:order-2" : "sm:order-1"}
        style={{
          transform: `rotate(${tilt}deg)`,
          transformOrigin: "center center",
        }}
      >
        <PhotoStage
          urls={live.photoUrls}
          aspect="4/3"
          shape="rect"
          filter="mem-photo"
        />
      </div>

      {/* Text side */}
      <div
        className={`relative flex flex-col justify-center gap-3 px-4 py-5 sm:px-6 ${flip ? "sm:order-1" : "sm:order-2"}`}
      >
        {/* Hand-stamp circle */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: 10,
            right: flip ? "auto" : 12,
            left: flip ? 12 : "auto",
            width: 68,
            height: 68,
            borderRadius: "50%",
            border: "2px solid var(--memorial-accent)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transform: `rotate(${stampRot}deg)`,
            opacity: 0.45,
            pointerEvents: "none",
            flexShrink: 0,
          }}
        >
          <span
            style={{
              fontFamily: "var(--mono)",
              fontSize: 8,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "var(--memorial-accent)",
              textAlign: "center",
              lineHeight: 1.6,
            }}
          >
            {live.date.slice(0, 4)}
            <br />
            husky
          </span>
        </div>

        <div
          style={{
            fontFamily: "var(--mono)",
            fontSize: 10,
            letterSpacing: "0.35em",
            textTransform: "uppercase",
            color: "var(--memorial-sub)",
          }}
        >
          {live.weekday} · {live.date}
        </div>

        <div
          style={{
            fontFamily: "var(--serif)",
            fontStyle: "italic",
            fontWeight: 700,
            fontSize: "clamp(22px, 3vw, 34px)",
            lineHeight: 1.05,
            letterSpacing: "-0.02em",
            color: "var(--memorial-fg)",
          }}
        >
          {live.title || live.venue}
        </div>

        {live.title && (
          <div
            style={{
              fontFamily: "var(--type)",
              fontSize: 11,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "var(--memorial-sub)",
            }}
          >
            {live.venue}
          </div>
        )}

        <Link
          href={`/lives/${live.id}`}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            fontFamily: "var(--mono)",
            fontSize: 10,
            letterSpacing: "0.35em",
            textTransform: "uppercase",
            color: "var(--memorial-accent)",
            textDecoration: "none",
            marginTop: 4,
          }}
        >
          <span
            style={{
              display: "inline-block",
              width: 20,
              height: 1,
              background: "var(--memorial-accent)",
              flexShrink: 0,
            }}
          />
          view {live.photoCount} photos
        </Link>
      </div>
    </div>
  );
}
