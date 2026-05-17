"use client";

import { useCallback, useMemo, useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
    const asc = [...lives].reverse(); // DB は descending で来るので昇順に直す
    return direction === "forward" ? asc : [...asc].reverse();
  }, [lives, direction]);

  const years = ["2022", "2023", "2024", "2025", "2026"];

  const byYear = useMemo(() => {
    const m: Record<string, number> = {};
    for (const l of lives) {
      const y = l.date.slice(0, 4);
      m[y] = (m[y] ?? 0) + 1;
    }
    return m;
  }, [lives]);

  return (
    <>
      {/* ── Sticky Jump Bar ── */}
      <div
        className="sticky top-0 z-10 flex flex-nowrap items-center gap-4 overflow-x-auto px-4 py-3.5 sm:gap-6 sm:px-10"
        style={{
          background: "rgba(10,8,7,0.88)",
          backdropFilter: "blur(14px)",
          borderTop: "1px solid var(--memorial-rule)",
          borderBottom: "1px solid var(--memorial-rule)",
        }}
      >
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
                className="inline-flex items-baseline gap-1 px-2 py-1.5 font-mono text-[11px] font-semibold tracking-[0.05em] no-underline transition-opacity hover:opacity-70 sm:gap-1.5 sm:px-3"
                style={{
                  border: "1px solid var(--memorial-rule)",
                  color: "var(--memorial-fg)",
                }}
              >
                {y}
                <span
                  className="text-[9px] tracking-[0.1em]"
                  style={{ color: "var(--memorial-sub)" }}
                >
                  {byYear[y] ?? 0}
                </span>
              </a>
            ))}
          </div>
        </div>

        <div
          className="h-6 w-px flex-shrink-0"
          style={{ background: "var(--memorial-rule)" }}
        />

        {/* member shortcuts */}
        <div className="flex flex-shrink-0 items-center gap-2">
          <span
            className="hidden font-mono text-[10px] tracking-[0.3em] uppercase sm:inline"
            style={{ color: "var(--memorial-sub)" }}
          >
            by member
          </span>
          <div className="flex gap-1">
            {members.map((m) => (
              <a
                key={m.id}
                href={`/members?member=${m.id}`}
                className="flex flex-shrink-0 cursor-pointer items-center gap-1.5 py-1 pr-2 pl-1 no-underline transition-opacity hover:opacity-70"
                style={{
                  border: "1px solid var(--memorial-rule)",
                  color: "var(--memorial-fg)",
                }}
              >
                <div
                  className="h-5 w-5 flex-shrink-0 sm:h-6 sm:w-6"
                  style={{ background: m.color }}
                />
                <span
                  className="hidden font-mono text-[10px] font-semibold tracking-[0.15em] sm:inline"
                  style={{ color: "var(--memorial-fg)" }}
                >
                  {m.name}
                </span>
              </a>
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

      {/* ── Memorial Timeline ── */}
      <section className="relative px-4 pt-10 pb-20 sm:px-16 sm:pt-15">
        {/* central spine (desktop only) */}
        <div
          className="pointer-events-none absolute top-0 bottom-0 left-1/2 hidden w-px -translate-x-1/2 sm:block"
          style={{ background: "var(--memorial-faint)" }}
        />

        <div className="relative">
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

          {sorted.map((live, i) => {
            const isLeft = i % 2 === 0;
            const year = live.date.slice(0, 4);
            const isYearAnchor =
              i === 0 || sorted[i - 1].date.slice(0, 4) !== year;

            return (
              <div key={live.id}>
                {/* 年マーカー */}
                {isYearAnchor && (
                  <div
                    id={`y${year}`}
                    className="relative mb-6 flex justify-center"
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

                {/* モバイル: 縦並びカード */}
                <div
                  className="mb-8 border-l-2 pl-4 sm:hidden"
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

                {/* デスクトップ: 3列グリッド */}
                <div
                  className="relative mb-14 hidden items-center sm:grid"
                  style={{ gridTemplateColumns: "1fr 60px 1fr" }}
                >
                  {/* spine node */}
                  <div
                    className="relative z-10"
                    style={{
                      gridColumn: 2,
                      justifySelf: "center",
                      width: 12,
                      height: 12,
                      background: "var(--memorial-fg)",
                    }}
                  />

                  {/* テキストカード */}
                  <a
                    href={`/lives/${live.id}`}
                    className="block no-underline transition-opacity hover:opacity-75"
                    style={{
                      gridColumn: isLeft ? 1 : 3,
                      textAlign: isLeft ? "right" : "left",
                      color: "var(--memorial-fg)",
                      paddingRight: isLeft ? 32 : 0,
                      paddingLeft: isLeft ? 0 : 32,
                    }}
                  >
                    <div
                      className="font-mono text-[11px] tracking-[0.3em] uppercase"
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
                        fontSize: "clamp(36px, 4vw, 56px)",
                        lineHeight: 1.0,
                        letterSpacing: "-0.02em",
                        color: "var(--memorial-fg)",
                        marginTop: 6,
                      }}
                    >
                      {live.date}
                    </div>
                    <div className="mt-2.5 text-lg font-medium">
                      {live.title || live.venue}
                    </div>
                    <div
                      className="mt-3.5 inline-flex items-center gap-2.5 font-mono text-[10px] tracking-[0.3em] uppercase"
                      style={{
                        color: "var(--memorial-sub)",
                        flexDirection: isLeft ? "row-reverse" : "row",
                      }}
                    >
                      <svg
                        width="24"
                        height="12"
                        viewBox="0 0 24 12"
                        fill="none"
                        aria-hidden="true"
                      >
                        <path
                          d="M0 6h22M16 1l6 5-6 5"
                          stroke="var(--memorial-accent)"
                          strokeWidth="1.2"
                        />
                      </svg>
                      view {live.photoCount} photos
                    </div>
                  </a>

                  {/* 写真エリア */}
                  <div
                    style={{
                      gridColumn: isLeft ? 3 : 1,
                      paddingLeft: isLeft ? 32 : 0,
                      paddingRight: isLeft ? 0 : 32,
                    }}
                  >
                    <LivePhotoSlideshow live={live} />
                  </div>
                </div>
              </div>
            );
          })}

          {/* end marker */}
          <div className="relative flex justify-center pt-3">
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

    const observer = new IntersectionObserver(
      ([e]) => {
        inView = e.isIntersecting;
      },
      { threshold: 0.1 },
    );
    if (containerRef.current) observer.observe(containerRef.current);

    const id = setInterval(() => {
      if (!inView) return;
      // src は変えず opacity だけを切り替えるのでフラッシュなし
      setIndex((i) => (i + 1) % live.photoUrls.length);
    }, 3000);

    return () => {
      clearInterval(id);
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
