"use client";

import { useCallback, useMemo, useState, useEffect } from "react";
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
  const [direction, setDirection] = useState<Direction>(() =>
    searchParams.get("dir") === "reverse" ? "reverse" : "forward",
  );

  // URL クエリを direction に同期
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (direction === "reverse") {
      params.set("dir", "reverse");
    } else {
      params.delete("dir");
    }
    router.replace(`?${params.toString()}`, { scroll: false });
  }, [direction, router, searchParams]);

  const sorted = useMemo(() => {
    const asc = [...lives].reverse(); // DB は descending で来るので昇順に直す
    return direction === "forward" ? asc : [...asc].reverse();
  }, [lives, direction]);

  const handleToggle = useCallback((d: Direction) => setDirection(d), []);

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
        className="sticky top-0 z-10 flex flex-wrap items-center gap-6 px-10 py-3.5"
        style={{
          background: "rgba(10,8,7,0.85)",
          backdropFilter: "blur(14px)",
          borderTop: "1px solid var(--memorial-rule)",
          borderBottom: "1px solid var(--memorial-rule)",
        }}
      >
        {/* direction toggle */}
        <div className="flex items-center gap-2">
          <span
            className="font-mono text-[10px] tracking-[0.3em] uppercase"
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
                className="flex cursor-pointer items-center gap-1.5 border-none px-3 py-1.5 text-[11px] font-semibold transition-colors"
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
                <span className="font-mono text-[9px] tracking-[0.1em] opacity-55">
                  {sub}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div
          className="h-6 w-px"
          style={{ background: "var(--memorial-rule)" }}
        />

        {/* 年 pills */}
        <div className="flex items-center gap-2">
          <span
            className="font-mono text-[10px] tracking-[0.3em] uppercase"
            style={{ color: "var(--memorial-sub)" }}
          >
            jump to year
          </span>
          <div className="flex gap-1">
            {years.map((y) => (
              <a
                key={y}
                href={`#y${y}`}
                className="inline-flex items-baseline gap-1.5 px-3 py-1.5 font-mono text-[11px] font-semibold tracking-[0.05em] no-underline transition-opacity hover:opacity-70"
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
          className="h-6 w-px"
          style={{ background: "var(--memorial-rule)" }}
        />

        {/* member shortcuts */}
        <div className="flex items-center gap-2">
          <span
            className="font-mono text-[10px] tracking-[0.3em] uppercase"
            style={{ color: "var(--memorial-sub)" }}
          >
            by member
          </span>
          <div className="flex gap-1">
            {members.map((m) => (
              <a
                key={m.id}
                href={`/members?member=${m.id}`}
                className="flex cursor-pointer items-center gap-1.5 py-1 pr-2 pl-1 no-underline transition-opacity hover:opacity-70"
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
              </a>
            ))}
          </div>
        </div>

        <div className="flex-1" />
        <span
          className="font-mono text-[10px] tracking-[0.3em] uppercase"
          style={{ color: "var(--memorial-sub)" }}
        >
          ↓ scroll to walk through
        </span>
      </div>

      {/* ── Memorial Timeline ── */}
      <section
        className="relative px-16 pt-15 pb-20"
        style={{ background: "var(--memorial-bg)" }}
      >
        {/* central spine */}
        <div
          className="pointer-events-none absolute top-0 bottom-0 left-1/2 w-px -translate-x-1/2"
          style={{ background: "var(--memorial-faint)" }}
        />

        <div className="relative">
          {/* 方向インジケーター */}
          <div className="mb-10 text-center">
            <div
              className="inline-block px-4 py-1.5 font-mono text-[10px] tracking-[0.4em] uppercase"
              style={{
                background: "var(--memorial-bg)",
                color: "var(--memorial-accent)",
              }}
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

                {/* カード行 */}
                <div
                  className="relative mb-14 grid items-center"
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
                    <PhotoCell live={live} />
                  </div>
                </div>
              </div>
            );
          })}

          {/* end marker */}
          <div className="relative flex justify-center pt-3">
            <div
              className="px-4 py-2 font-mono text-[10px] tracking-[0.5em] uppercase"
              style={{
                background: "var(--memorial-bg)",
                color: "var(--memorial-accent)",
              }}
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

function PhotoCell({ live }: { live: LiveWithPhotoCount }) {
  if (!live.thumbnailUrl) {
    return <PhotoFallback label={`${live.venue} ${live.date}`} />;
  }

  return (
    <div
      className="relative overflow-hidden"
      style={{
        aspectRatio: "3/2",
        boxShadow: "0 12px 30px rgba(0,0,0,0.4)",
        height: 200,
      }}
    >
      <Image
        src={live.thumbnailUrl}
        alt={`${live.venue} - ${live.date}`}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 50vw, 33vw"
      />
    </div>
  );
}

function PhotoFallback({ label }: { label: string }) {
  return (
    <div
      className="flex items-center justify-center font-mono text-[10px] tracking-[0.1em] uppercase"
      style={{
        height: 200,
        aspectRatio: "3/2",
        backgroundColor: "#1a1614",
        backgroundImage:
          "repeating-linear-gradient(135deg, transparent 0 14px, rgba(255,255,255,.035) 14px 15px)",
        color: "rgba(255,255,255,.45)",
        boxShadow: "0 12px 30px rgba(0,0,0,0.4)",
      }}
    >
      [ {label} ]
    </div>
  );
}
