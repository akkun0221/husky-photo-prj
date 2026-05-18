"use client";

import { useCallback, useMemo, useState, useEffect, useRef } from "react";
import type { CSSProperties } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { LiveWithPhotoCount } from "@/entities/live/types";
import type { MemberWithPhotoCount } from "@/entities/member/types";

type Direction = "forward" | "reverse";

type Props = {
  lives: LiveWithPhotoCount[];
  members: MemberWithPhotoCount[];
};

export function MemorialClient({ lives, members }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL を単一の情報源として direction を導出（useState + useEffect による同期バグを回避）
  const direction: Direction =
    searchParams.get("dir") === "reverse" ? "reverse" : "forward";

  const handleToggle = useCallback(
    (d: Direction) => {
      const params = new URLSearchParams(searchParams.toString());
      if (d === "reverse") {
        params.set("dir", "reverse");
      } else {
        params.delete("dir");
      }
      router.replace(`?${params.toString()}`, { scroll: false });
    },
    [router, searchParams],
  );

  const sorted = useMemo(() => {
    // DB は descending で来るので昇順に直し、写真があるライブだけに絞る
    const asc = [...lives].reverse().filter((l) => l.hasPhotos);
    return direction === "forward" ? asc : [...asc].reverse();
  }, [lives, direction]);

  const years = ["2022", "2023", "2024", "2025", "2026"];

  const byYear = useMemo(() => {
    const m: Record<string, number> = {};
    for (const l of lives) {
      if (!l.hasPhotos) continue;
      const y = l.date.slice(0, 4);
      m[y] = (m[y] ?? 0) + 1;
    }
    return m;
  }, [lives]);

  const groupedByMonth = useMemo(() => {
    const map = new Map<string, LiveWithPhotoCount[]>();
    for (const live of sorted) {
      const ym = live.date.slice(0, 7); // "YYYY.MM"
      if (!map.has(ym)) map.set(ym, []);
      map.get(ym)!.push(live);
    }

    let globalGroupIdx = 0;
    const result: Array<{
      ym: string;
      year: string;
      shows: LiveWithPhotoCount[];
      bentoGroups: Array<{ shows: LiveWithPhotoCount[]; isLargeLeft: boolean }>;
      isFirstOfYear: boolean;
    }> = [];

    for (const [ym, shows] of map) {
      const year = ym.slice(0, 4);
      const isFirstOfYear =
        result.length === 0 || result[result.length - 1].year !== year;

      const bentoGroups: Array<{
        shows: LiveWithPhotoCount[];
        isLargeLeft: boolean;
      }> = [];
      for (let i = 0; i < shows.length; i += 3) {
        bentoGroups.push({
          shows: shows.slice(i, i + 3),
          isLargeLeft: globalGroupIdx % 2 === 0,
        });
        globalGroupIdx++;
      }

      result.push({ ym, year, shows, bentoGroups, isFirstOfYear });
    }
    return result;
  }, [sorted]);

  return (
    <>
      {/* ── Sticky Jump Bar ── */}
      <div
        className="sticky top-0 z-10"
        style={{
          background: "rgba(10,8,7,0.88)",
          backdropFilter: "blur(14px)",
          borderTop: "1px solid var(--memorial-rule)",
          borderBottom: "1px solid var(--memorial-rule)",
        }}
      >
        {/* 1行目: 方向トグル + 年ピル（全デバイス）/ メンバー + ヒント（デスクトップのみ） */}
        <div className="flex items-center gap-3 px-4 py-2.5 sm:gap-6 sm:px-10 sm:py-3.5">
          {/* direction toggle */}
          <div className="flex flex-shrink-0 items-center gap-2">
            <span
              className="hidden font-mono text-[10px] tracking-[0.3em] uppercase sm:inline"
              style={{ color: "var(--memorial-sub)" }}
            >
              direction
            </span>
            <div
              className="flex"
              style={{ border: "1px solid var(--memorial-rule)" }}
            >
              {(
                [
                  ["forward", "▶ 追体験", "2022→2026"],
                  ["reverse", "◀ 振り返り", "2026→2022"],
                ] as const
              ).map(([key, label, sub]) => (
                <button
                  key={key}
                  onClick={() => handleToggle(key)}
                  className="flex flex-shrink-0 cursor-pointer items-center gap-1.5 border-none px-3 py-1.5 text-[11px] font-semibold transition-colors"
                  style={{
                    background:
                      direction === key
                        ? "var(--memorial-accent)"
                        : "transparent",
                    color: direction === key ? "#fff" : "var(--memorial-fg)",
                    fontFamily: "inherit",
                  }}
                >
                  <span>{label}</span>
                  <span className="hidden font-mono text-[9px] tracking-[0.1em] opacity-55 sm:inline">
                    {sub}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div
            className="h-6 w-px flex-shrink-0"
            style={{ background: "var(--memorial-rule)" }}
          />

          {/* 年 pills */}
          <div className="flex flex-shrink-0 items-center gap-2">
            <span
              className="hidden font-mono text-[10px] tracking-[0.3em] uppercase sm:inline"
              style={{ color: "var(--memorial-sub)" }}
            >
              jump to year
            </span>
            <div className="flex gap-1">
              {years.map((y) => (
                <a
                  key={y}
                  href={`#y${y}`}
                  className="inline-flex items-baseline gap-0.5 px-2 py-1 font-mono text-[11px] font-semibold tracking-[0.05em] no-underline transition-opacity hover:opacity-70 sm:gap-1.5 sm:px-3 sm:py-1.5"
                  style={{
                    border: "1px solid var(--memorial-rule)",
                    color: "var(--memorial-fg)",
                  }}
                >
                  {y}
                  <span
                    className="hidden text-[9px] tracking-[0.1em] sm:inline"
                    style={{ color: "var(--memorial-sub)" }}
                  >
                    {byYear[y] ?? 0}
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* デスクトップのみ: セパレーター + メンバーショートカット + ヒント */}
          <div
            className="hidden h-6 w-px flex-shrink-0 sm:block"
            style={{ background: "var(--memorial-rule)" }}
          />
          <div className="hidden flex-shrink-0 items-center gap-2 sm:flex">
            <span
              className="font-mono text-[10px] tracking-[0.3em] uppercase"
              style={{ color: "var(--memorial-sub)" }}
            >
              by member
            </span>
            <div className="flex gap-1">
              {members.map((m) => (
                <Link
                  key={m.id}
                  href={`/members?member=${m.id}`}
                  className="flex flex-shrink-0 cursor-pointer items-center gap-1.5 py-1 pr-2 pl-1 no-underline transition-opacity hover:opacity-70"
                  style={{
                    border: "1px solid var(--memorial-rule)",
                    color: "var(--memorial-fg)",
                  }}
                >
                  <div
                    className="h-6 w-6 flex-shrink-0"
                    style={{ background: m.color }}
                  />
                  <span
                    className="font-mono text-[10px] font-semibold tracking-[0.15em]"
                    style={{ color: "var(--memorial-fg)" }}
                  >
                    {m.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
          <div className="hidden flex-1 sm:block" />
          <span
            className="hidden flex-shrink-0 font-mono text-[10px] tracking-[0.3em] uppercase sm:inline"
            style={{ color: "var(--memorial-sub)" }}
          >
            ↓ scroll to walk through
          </span>
        </div>
        {/* end 1行目 */}

        {/* 2行目: スマホのみ - メンバーカラースウォッチ */}
        <div
          className="flex items-center gap-3 px-4 py-2 sm:hidden"
          style={{ borderTop: "1px solid var(--memorial-rule)" }}
        >
          <span
            className="flex-shrink-0 font-mono text-[9px] tracking-[0.25em] uppercase"
            style={{ color: "var(--memorial-sub)" }}
          >
            member
          </span>
          <div className="flex gap-1.5">
            {members.map((m) => (
              <Link
                key={m.id}
                href={`/members?member=${m.id}`}
                className="block h-7 w-7 flex-shrink-0 transition-opacity hover:opacity-70"
                style={{ background: m.color }}
                title={m.name}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ── Memorial Timeline ── */}
      <section className="relative px-4 pt-10 pb-20 sm:px-16 sm:pt-15">
        {/* 方向インジケーター */}
        <div className="mb-8 text-center sm:mb-10">
          <div
            className="inline-block px-4 py-1.5 font-mono text-[10px] tracking-[0.4em] uppercase"
            style={{ color: "var(--memorial-accent)" }}
          >
            ──{" "}
            {direction === "forward"
              ? "first frame · 2022.12.10"
              : "last frame · 2026.04.27"}{" "}
            ──
          </div>
        </div>

        {/* モバイル: 縦並びカード */}
        <div className="sm:hidden">
          {sorted.map((live, i) => {
            const year = live.date.slice(0, 4);
            const isYearAnchor =
              i === 0 || sorted[i - 1].date.slice(0, 4) !== year;
            return (
              <div key={live.id}>
                {isYearAnchor && (
                  <div
                    id={`y${year}`}
                    className="relative mb-4 flex justify-center"
                    style={{ marginTop: i === 0 ? 0 : 8 }}
                  >
                    <div
                      className="px-4 py-1"
                      style={{
                        background: "var(--memorial-surface)",
                        border: "1px solid var(--memorial-rule)",
                        fontFamily:
                          "var(--font-playfair), 'Noto Serif JP', serif",
                        fontWeight: 700,
                        fontStyle: "italic",
                        fontSize: 22,
                        color: "var(--memorial-fg)",
                        letterSpacing: "-0.01em",
                      }}
                    >
                      {year}
                    </div>
                  </div>
                )}
                <div
                  className="mb-8 border-l-2 pl-4"
                  style={{ borderColor: "var(--memorial-faint)" }}
                >
                  <a
                    href={`/lives/${live.id}`}
                    className="block no-underline transition-opacity hover:opacity-75"
                    style={{ color: "var(--memorial-fg)" }}
                  >
                    <LivePhotoSlideshow live={live} />
                    <div className="mt-3">
                      <div
                        className="font-mono text-[10px] tracking-[0.3em] uppercase"
                        style={{ color: "var(--memorial-sub)" }}
                      >
                        {live.weekday} · {live.venue}
                      </div>
                      <div
                        style={{
                          fontFamily:
                            "var(--font-playfair), 'Noto Serif JP', serif",
                          fontWeight: 300,
                          fontStyle: "italic",
                          fontSize: "clamp(28px, 5vw, 40px)",
                          lineHeight: 1.0,
                          letterSpacing: "-0.02em",
                          color: "var(--memorial-fg)",
                          marginTop: 4,
                        }}
                      >
                        {live.date}
                      </div>
                      <div className="mt-1.5 text-base font-medium">
                        {live.title || live.venue}
                      </div>
                      <div
                        className="mt-2 font-mono text-[10px] tracking-[0.3em] uppercase"
                        style={{ color: "var(--memorial-sub)" }}
                      >
                        view {live.photoCount} photos →
                      </div>
                    </div>
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* デスクトップ: ベントグリッド（月別マイルストーン） */}
        <div className="hidden sm:block">
          <div className="space-y-20">
            {groupedByMonth.map(
              ({ ym, year, shows, bentoGroups, isFirstOfYear }) => (
                <section key={ym} id={isFirstOfYear ? `y${year}` : undefined}>
                  {/* 年が変わるタイミングで年ラベルを表示 */}
                  {isFirstOfYear && (
                    <div className="mt-2 mb-5">
                      <span
                        style={{
                          fontFamily:
                            "var(--font-playfair), 'Noto Serif JP', serif",
                          fontWeight: 700,
                          fontStyle: "italic",
                          fontSize: "clamp(32px, 4vw, 48px)",
                          color: "var(--memorial-fg)",
                          letterSpacing: "-0.02em",
                          lineHeight: 1,
                        }}
                      >
                        {year}
                      </span>
                    </div>
                  )}

                  {/* 月マイルストーンマーカー */}
                  <div className="mb-3 flex items-center gap-3">
                    <div
                      style={{
                        width: 7,
                        height: 7,
                        background: "var(--memorial-accent)",
                        transform: "rotate(45deg)",
                        flexShrink: 0,
                      }}
                    />
                    <span
                      className="font-mono text-[11px] tracking-[0.2em]"
                      style={{ color: "var(--memorial-fg)" }}
                    >
                      {ym}
                    </span>
                    <div
                      className="flex-1"
                      style={{
                        height: 1,
                        background: "var(--memorial-faint)",
                      }}
                    />
                    <span
                      className="font-mono text-[10px] tracking-[0.25em] uppercase"
                      style={{ color: "var(--memorial-sub)" }}
                    >
                      {shows.length} {shows.length === 1 ? "show" : "shows"}
                    </span>
                  </div>

                  {/* ベントグループ */}
                  <div className="space-y-5">
                    {bentoGroups.map(
                      ({ shows: groupShows, isLargeLeft }, gi) => (
                        <BentoGroup
                          key={gi}
                          shows={groupShows}
                          isLargeLeft={isLargeLeft}
                        />
                      ),
                    )}
                  </div>
                </section>
              ),
            )}
          </div>
        </div>

        {/* end marker */}
        <div className="relative mt-10 flex justify-center">
          <div
            className="px-4 py-2 font-mono text-[10px] tracking-[0.5em] uppercase"
            style={{ color: "var(--memorial-accent)" }}
          >
            ──{" "}
            {direction === "forward"
              ? "fade to black · 2026.04.27"
              : "first shutter · 2022.12.10"}{" "}
            ──
          </div>
        </div>
      </section>
    </>
  );
}

function LivePhotoSlideshow({ live }: { live: LiveWithPhotoCount }) {
  const [index, setIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (live.photoUrls.length <= 1) return;
    let inView = false;
    let intervalId: ReturnType<typeof setInterval> | undefined;

    const observer = new IntersectionObserver(
      ([e]) => {
        inView = e.isIntersecting;
      },
      { threshold: 0.1 },
    );
    if (containerRef.current) observer.observe(containerRef.current);

    const timeoutId = setTimeout(() => {
      intervalId = setInterval(() => {
        if (!inView) return;
        setIndex((i) => (i + 1) % live.photoUrls.length);
      }, 3000);
    }, Math.random() * 3000);

    return () => {
      clearTimeout(timeoutId);
      clearInterval(intervalId);
      observer.disconnect();
    };
  }, [live.photoUrls.length]);

  if (!live.photoUrls.length) {
    return <ComingSoon label={`${live.venue} ${live.date}`} />;
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden"
      style={{
        aspectRatio: "3/2",
        boxShadow: "0 12px 30px rgba(0,0,0,0.4)",
      }}
    >
      {live.photoUrls.map((url, i) => (
        <Image
          key={i}
          src={url}
          alt={i === 0 ? `${live.venue} - ${live.date}` : ""}
          fill
          className="object-cover"
          style={{
            opacity: i === index ? 1 : 0,
            transition: "opacity 0.6s ease",
          }}
          sizes="(max-width: 640px) 100vw, 33vw"
        />
      ))}
    </div>
  );
}

function ComingSoon({ label }: { label: string }) {
  return (
    <div
      className="relative w-full overflow-hidden"
      style={{
        aspectRatio: "3/2",
        boxShadow: "0 12px 30px rgba(0,0,0,0.4)",
      }}
    >
      <Image
        src="/comingsoon.jpeg"
        alt="Coming Soon"
        fill
        className="object-cover"
        style={{ opacity: 0.4 }}
        sizes="(max-width: 640px) 100vw, 33vw"
      />
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{ background: "rgba(10,8,7,0.35)" }}
      >
        <span
          className="font-mono text-[11px] tracking-[0.3em] uppercase"
          style={{ color: "rgba(236,230,216,0.75)" }}
        >
          Coming Soon...?
        </span>
      </div>
      <div
        className="absolute right-3 bottom-2 font-mono text-[9px] tracking-[0.15em] uppercase opacity-40"
        style={{ color: "rgba(236,230,216,0.6)" }}
      >
        {label}
      </div>
    </div>
  );
}

// ── ベントグリッド用コンポーネント ──────────────────────────────

const CELL_H = 220;

function BentoGroup({
  shows,
  isLargeLeft,
}: {
  shows: LiveWithPhotoCount[];
  isLargeLeft: boolean;
}) {
  if (shows.length === 1) {
    return (
      <div style={{ height: CELL_H * 2 + 8 }}>
        <BentoCard live={shows[0]} style={{ height: "100%" }} large />
      </div>
    );
  }

  if (shows.length === 2) {
    return (
      <div
        className="grid gap-5"
        style={{
          gridTemplateColumns: "repeat(2, 1fr)",
          height: CELL_H * 2 + 8,
        }}
      >
        <BentoCard live={shows[0]} style={{}} large />
        <BentoCard live={shows[1]} style={{}} large />
      </div>
    );
  }

  const [a, b, c] = shows;

  return (
    <div
      className="grid gap-5"
      style={{
        gridTemplateColumns: "repeat(3, 1fr)",
        gridTemplateRows: `${CELL_H}px ${CELL_H}px`,
      }}
    >
      {isLargeLeft ? (
        <>
          <BentoCard
            live={a}
            style={{ gridColumn: "1 / 3", gridRow: "1 / 3" }}
            large
          />
          <BentoCard live={b} style={{ gridColumn: 3, gridRow: 1 }} />
          <BentoCard live={c} style={{ gridColumn: 3, gridRow: 2 }} />
        </>
      ) : (
        <>
          <BentoCard live={a} style={{ gridColumn: 1, gridRow: 1 }} />
          <BentoCard live={b} style={{ gridColumn: 1, gridRow: 2 }} />
          <BentoCard
            live={c}
            style={{ gridColumn: "2 / 4", gridRow: "1 / 3" }}
            large
          />
        </>
      )}
    </div>
  );
}

function BentoCard({
  live,
  style,
  large,
}: {
  live: LiveWithPhotoCount;
  style: CSSProperties;
  large?: boolean;
}) {
  return (
    <a
      href={`/lives/${live.id}`}
      className="group relative block overflow-hidden no-underline"
      style={{ ...style, color: "var(--memorial-fg)" }}
    >
      <BentoPhoto live={live} large={large} />

      {/* グラデーションオーバーレイ */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, rgba(10,8,7,0.92) 0%, rgba(10,8,7,0.35) 40%, transparent 70%)",
        }}
      />

      {/* ホバー時の薄い明転 */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: "rgba(255,255,255,0.06)" }}
      />

      {/* テキスト */}
      <div className="absolute right-0 bottom-0 left-0 p-3 sm:p-4">
        <div
          className="font-mono text-[9px] tracking-[0.3em] uppercase"
          style={{ color: "var(--memorial-sub)" }}
        >
          {live.weekday} · {live.venue}
        </div>
        <div
          style={{
            fontFamily: "var(--font-playfair), 'Noto Serif JP', serif",
            fontStyle: "italic",
            fontSize: large
              ? "clamp(22px, 2.5vw, 38px)"
              : "clamp(14px, 1.5vw, 22px)",
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            color: "var(--memorial-fg)",
            marginTop: 2,
          }}
        >
          {live.date}
        </div>
        {large && (
          <div
            className="mt-1 text-sm font-medium"
            style={{ color: "var(--memorial-fg)" }}
          >
            {live.title || live.venue}
          </div>
        )}
        <div
          className="mt-2 font-mono text-[9px] tracking-[0.25em] uppercase"
          style={{ color: "var(--memorial-sub)" }}
        >
          {live.photoCount} photos →
        </div>
      </div>
    </a>
  );
}

function BentoPhoto({
  live,
  large,
}: {
  live: LiveWithPhotoCount;
  large?: boolean;
}) {
  const [index, setIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (live.photoUrls.length <= 1) return;
    let inView = false;
    let intervalId: ReturnType<typeof setInterval> | undefined;

    const observer = new IntersectionObserver(
      ([e]) => {
        inView = e.isIntersecting;
      },
      { threshold: 0.1 },
    );
    if (containerRef.current) observer.observe(containerRef.current);

    const timeoutId = setTimeout(() => {
      intervalId = setInterval(() => {
        if (!inView) return;
        setIndex((i) => (i + 1) % live.photoUrls.length);
      }, 3000);
    }, Math.random() * 3000);

    return () => {
      clearTimeout(timeoutId);
      clearInterval(intervalId);
      observer.disconnect();
    };
  }, [live.photoUrls.length]);

  if (!live.photoUrls.length) {
    return (
      <div className="absolute inset-0">
        <Image
          src="/comingsoon.jpeg"
          alt="Coming Soon"
          fill
          className="object-cover"
          style={{ opacity: 0.3 }}
          sizes="(max-width: 1280px) 66vw, 800px"
        />
      </div>
    );
  }

  return (
    <div ref={containerRef} className="absolute inset-0">
      {live.photoUrls.map((url, i) => (
        <Image
          key={i}
          src={url}
          alt={i === 0 ? `${live.venue} - ${live.date}` : ""}
          fill
          className="object-cover"
          style={{
            opacity: i === index ? 1 : 0,
            transition: "opacity 0.6s ease",
          }}
          sizes={
            large
              ? "(max-width: 1280px) 66vw, 800px"
              : "(max-width: 1280px) 33vw, 400px"
          }
        />
      ))}
    </div>
  );
}
