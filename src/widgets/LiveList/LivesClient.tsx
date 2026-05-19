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

  const totalCount = useMemo(
    () => groups.reduce((s, [, ls]) => s + ls.length, 0),
    [groups],
  );

  const sectionNodeMap = useRef<Record<string, HTMLElement | null>>({});

  const activeYear = useActiveYear(sectionNodeMap, years[0] ?? ALL_YEARS[0]);

  return (
    <>
      {/* ── Page Header ── */}
      <div
        className="px-4 sm:px-16"
        style={{ paddingTop: 80, paddingBottom: 40 }}
      >
        <div
          style={{
            fontFamily: "var(--type)",
            fontSize: 12,
            letterSpacing: "0.5em",
            textTransform: "uppercase",
            color: "var(--memorial-accent)",
            marginBottom: 12,
          }}
        >
          archive · index
        </div>
        <h1
          style={{
            fontFamily: "var(--serif)",
            fontStyle: "italic",
            fontWeight: 300,
            fontSize: "clamp(96px, 12vw, 200px)",
            lineHeight: 0.9,
            letterSpacing: "-0.035em",
            margin: 0,
          }}
        >
          Lives
          <span style={{ color: "var(--memorial-accent)" }}>.</span>
        </h1>
        <div
          style={{
            marginTop: 18,
            display: "flex",
            alignItems: "baseline",
            gap: 18,
            flexWrap: "wrap",
            fontFamily: "var(--mono)",
            fontSize: 11,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: "var(--memorial-sub)",
          }}
        >
          <span style={{ color: "var(--memorial-fg)" }}>
            <span
              style={{
                fontFamily: "var(--serif)",
                fontStyle: "italic",
                fontWeight: 700,
                fontSize: 24,
                color: "var(--memorial-accent)",
                verticalAlign: "-2px",
                marginRight: 4,
              }}
            >
              {totalCount}
            </span>
            shows documented
          </span>
          <span style={{ opacity: 0.5 }}>·</span>
          <span>2022.12.10 — 2026.04.27</span>
          <span style={{ opacity: 0.5 }}>·</span>
          <span
            style={{ color: "var(--memorial-accent)" }}
            className="mem-pulse-dot"
          >
            disbanded
          </span>
        </div>
      </div>

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
              polaroidUrl={yearLives[0]?.photoUrls[0]}
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
              {yearLives.map((live, i) => (
                <LivesRow
                  key={live.id}
                  live={live}
                  trackNo={i + 1}
                  yearTotal={yearLives.length}
                />
              ))}
            </ul>

            <div
              style={{
                paddingTop: 16,
                paddingBottom: 8,
                textAlign: "center",
                fontFamily: "var(--mono)",
                fontSize: 10,
                letterSpacing: "0.4em",
                textTransform: "uppercase",
                color: "var(--memorial-sub)",
                opacity: 0.4,
              }}
            >
              ── {year} ──
            </div>
          </section>
        ))}

        <div
          style={{
            marginTop: 24,
            paddingTop: 24,
            borderTop: "1px solid var(--memorial-rule)",
            textAlign: "center",
            fontFamily: "var(--mono)",
            fontSize: 11,
            letterSpacing: "0.5em",
            textTransform: "uppercase",
            color: "var(--memorial-accent)",
          }}
        >
          ── end of index ──
        </div>
      </div>
    </>
  );
}

type RowProps = {
  live: LiveWithPhotoCount;
  trackNo: number;
  yearTotal: number;
};

function LivesRow({ live, trackNo, yearTotal }: RowProps) {
  return (
    <li style={{ borderBottom: "1px dashed var(--memorial-faint)" }}>
      <Link
        href={`/lives/${live.id}`}
        style={{
          display: "grid",
          gridTemplateColumns: "60px 50px 1fr auto 30px",
          alignItems: "baseline",
          gap: 18,
          padding: "14px 4px",
          textDecoration: "none",
          color: "var(--memorial-fg)",
          transition: "opacity .2s",
        }}
        className="hover:opacity-60"
      >
        {/* track # */}
        <span
          style={{
            fontFamily: "var(--mono)",
            fontSize: 10,
            letterSpacing: "0.2em",
            color: "var(--memorial-sub)",
          }}
        >
          TR.{String(trackNo).padStart(2, "0")}/
          {String(yearTotal).padStart(2, "0")}
        </span>

        {/* weekday */}
        <span
          style={{
            fontFamily: "var(--mono)",
            fontSize: 10,
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            color: "var(--memorial-sub)",
          }}
        >
          {live.weekday}
        </span>

        {/* title + date (stacked on mobile, date italic serif on desktop) */}
        <span>
          <span
            className="hidden sm:inline"
            style={{
              fontFamily: "var(--serif)",
              fontStyle: "italic",
              fontWeight: 400,
              fontSize: 22,
              letterSpacing: "-0.01em",
              marginRight: 18,
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
              letterSpacing: "-0.01em",
              color: "var(--memorial-fg)",
            }}
          >
            {live.title || live.venue}
          </span>
        </span>

        {/* venue */}
        <span
          className="hidden sm:inline"
          style={{
            fontFamily: "var(--mono)",
            fontSize: 11,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "var(--memorial-sub)",
          }}
        >
          @ {live.venue}
        </span>

        {/* arrow */}
        <span
          style={{
            fontFamily: "var(--mono)",
            fontSize: 14,
            color: "var(--memorial-accent)",
            justifySelf: "end",
          }}
        >
          →
        </span>
      </Link>
    </li>
  );
}
