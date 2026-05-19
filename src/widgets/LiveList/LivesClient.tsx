"use client";

import { useMemo, useRef } from "react";
import Link from "next/link";
import type { LiveWithPhotoCount } from "@/entities/live/types";
import { useActiveYear } from "@/shared/hooks/useActiveYear";
import { StickyYearBand } from "@/widgets/Memorial/StickyYearBand";

const ALL_YEARS = ["2022", "2023", "2024", "2025", "2026"];

type Props = {
  lives: LiveWithPhotoCount[];
};

export function LivesClient({ lives }: Props) {
  const groups = useMemo(() => {
    const map = new Map<string, LiveWithPhotoCount[]>();
    // lives comes DB-descending — keep that order (newest year first)
    for (const l of lives) {
      if (!l.hasPhotos) continue;
      const y = l.date.slice(0, 4);
      if (!map.has(y)) map.set(y, []);
      map.get(y)!.push(l);
    }
    return [...map.entries()];
  }, [lives]);

  const years = useMemo(() => groups.map(([y]) => y), [groups]);

  const counts = useMemo(() => {
    const m: Record<string, number> = {};
    for (const [y, ls] of groups) m[y] = ls.length;
    return m;
  }, [groups]);

  const sectionNodeMap = useRef<Record<string, HTMLElement | null>>({});

  const activeYear = useActiveYear(sectionNodeMap, years[0] ?? ALL_YEARS[0]);

  return (
    <>
      {/* Sticky year-tab bar */}
      <div
        className="sticky top-0 z-[5]"
        style={{
          background: "rgba(18,10,6,0.88)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid var(--memorial-rule)",
        }}
      >
        <div className="flex items-center gap-1 overflow-x-auto px-4 py-3 sm:gap-1.5 sm:px-16">
          {ALL_YEARS.map((y, i) => (
            <a
              key={y}
              href={`#y${y}`}
              style={{
                flexShrink: 0,
                padding: "6px 12px",
                background:
                  activeYear === y
                    ? "var(--memorial-accent)"
                    : "rgba(240,227,200,0.07)",
                color: activeYear === y ? "#1a120a" : "var(--memorial-fg)",
                fontFamily: "var(--type)",
                fontSize: 13,
                letterSpacing: "0.06em",
                textDecoration: "none",
                textTransform: "uppercase",
                transform: `rotate(${((i % 2 === 0 ? -1 : 1) * (0.5 + i * 0.15)).toFixed(2)}deg)`,
                display: "inline-flex",
                alignItems: "baseline",
                gap: 5,
                transition: "background .25s",
              }}
            >
              {y}
              <span
                style={{
                  fontFamily: "var(--mono)",
                  fontSize: 9,
                  opacity: 0.6,
                }}
              >
                ×{counts[y] ?? 0}
              </span>
            </a>
          ))}
        </div>
      </div>

      {/* Year sections */}
      <div style={{ paddingBottom: 100 }}>
        {groups.map(([year, yearLives]) => (
          <section
            key={year}
            ref={(el) => {
              sectionNodeMap.current[year] = el;
            }}
          >
            <StickyYearBand
              year={year}
              count={yearLives.length}
              chapterIdx={ALL_YEARS.indexOf(year)}
              active={activeYear === year}
            />

            <ul
              className="px-4 sm:px-16"
              style={{
                borderTop: "1px solid var(--memorial-rule)",
                listStyle: "none",
                margin: 0,
                padding: "0 16px",
              }}
            >
              {yearLives.map((live) => (
                <li
                  key={live.id}
                  style={{ borderBottom: "1px solid var(--memorial-faint)" }}
                >
                  <Link
                    href={`/lives/${live.id}`}
                    className="flex items-baseline gap-3 py-4 no-underline transition-opacity hover:opacity-60 sm:gap-6"
                    style={{ color: "var(--memorial-fg)" }}
                  >
                    <span
                      className="flex-shrink-0"
                      style={{
                        fontFamily: "var(--mono)",
                        fontSize: 10,
                        letterSpacing: "0.22em",
                        textTransform: "uppercase",
                        color: "var(--memorial-sub)",
                        width: 32,
                      }}
                    >
                      {live.weekday}
                    </span>

                    <span
                      className="flex-shrink-0"
                      style={{
                        fontFamily: "var(--mono)",
                        fontSize: 11,
                        letterSpacing: "0.05em",
                        color: "var(--memorial-sub)",
                        width: 90,
                      }}
                    >
                      {live.date}
                    </span>

                    <span
                      className="flex-1"
                      style={{
                        fontFamily: "var(--serif)",
                        fontStyle: "italic",
                        fontWeight: 700,
                        fontSize: "clamp(15px, 2vw, 20px)",
                        letterSpacing: "-0.01em",
                        color: "var(--memorial-fg)",
                      }}
                    >
                      {live.title || live.venue}
                    </span>

                    <span
                      className="hidden flex-shrink-0 sm:inline"
                      style={{
                        fontFamily: "var(--type)",
                        fontSize: 11,
                        letterSpacing: "0.14em",
                        textTransform: "uppercase",
                        color: "var(--memorial-sub)",
                      }}
                    >
                      {live.venue}
                    </span>

                    <span
                      className="flex-shrink-0"
                      style={{
                        fontFamily: "var(--mono)",
                        fontSize: 10,
                        letterSpacing: "0.22em",
                        color: "var(--memorial-sub)",
                        opacity: 0.55,
                      }}
                    >
                      {live.photoCount}枚
                    </span>

                    <span
                      className="flex-shrink-0"
                      style={{
                        fontFamily: "var(--mono)",
                        fontSize: 13,
                        color: "var(--memorial-accent)",
                      }}
                    >
                      →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </>
  );
}
