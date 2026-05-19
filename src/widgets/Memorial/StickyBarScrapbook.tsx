"use client";
import Link from "next/link";
import type { Direction } from "@/shared/hooks/useDirection";
import type { MemberWithPhotoCount } from "@/entities/member/types";

type Props = {
  dir: Direction;
  onToggle: (d: Direction) => void;
  years: string[];
  counts: Record<string, number>;
  activeYear: string;
  members: MemberWithPhotoCount[];
  onYearClick: (year: string) => void;
  loadingYear: string | null;
};

export function StickyBarScrapbook({
  dir,
  onToggle,
  years,
  counts,
  activeYear,
  members,
  onYearClick,
  loadingYear,
}: Props) {
  return (
    <div
      className="sticky top-0 z-[5]"
      style={{
        background: "rgba(18,10,6,0.88)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--memorial-rule)",
      }}
    >
      {/* ── デスクトップ: 1行 ── */}
      <div className="hidden flex-wrap items-center gap-5 px-16 py-3.5 sm:flex">
        {/* SIDE A / SIDE B */}
        <div className="flex flex-shrink-0 items-center gap-2.5">
          <span
            style={{
              fontFamily: "var(--type)",
              fontSize: 12,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "var(--memorial-sub)",
            }}
          >
            play it
          </span>
          <div className="flex">
            {(
              [
                ["forward", "SIDE A"],
                ["reverse", "SIDE B"],
              ] as const
            ).map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => onToggle(key)}
                style={{
                  border: `1px solid ${dir === key ? "var(--memorial-accent)" : "var(--memorial-rule)"}`,
                  background:
                    dir === key ? "var(--memorial-accent)" : "transparent",
                  color: dir === key ? "#1a120a" : "var(--memorial-fg)",
                  fontFamily: "var(--type)",
                  fontSize: 12,
                  letterSpacing: "0.16em",
                  padding: "5px 13px",
                  cursor: "pointer",
                  textTransform: "uppercase",
                  transform:
                    key === "forward" ? "rotate(-0.6deg)" : "rotate(0.6deg)",
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div
          className="h-6 w-px flex-shrink-0"
          style={{ background: "var(--memorial-rule)" }}
        />

        {/* 年タブ */}
        <div className="flex flex-shrink-0 gap-1">
          {years.map((y, i) => (
            <button
              key={y}
              type="button"
              onClick={() => onYearClick(y)}
              style={{
                position: "relative",
                padding: "7px 13px",
                background:
                  activeYear === y
                    ? "var(--memorial-accent)"
                    : "rgba(240,227,200,0.07)",
                color: activeYear === y ? "#1a120a" : "var(--memorial-fg)",
                fontFamily: "var(--type)",
                fontSize: 13,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                transform: `rotate(${((i % 2 === 0 ? -1 : 1) * (0.5 + i * 0.2)).toFixed(2)}deg)`,
                display: "inline-flex",
                alignItems: "baseline",
                gap: 6,
                transition: "background .25s, opacity .25s",
                opacity: loadingYear === y ? 0.5 : 1,
                cursor: loadingYear === y ? "wait" : "pointer",
                border: "none",
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
                {loadingYear === y ? "…" : `×${counts[y] ?? 0}`}
              </span>
            </button>
          ))}
        </div>

        <div className="flex-1" />

        {/* メンバーチップ */}
        <div className="flex flex-shrink-0 items-center gap-2.5">
          <span
            style={{
              fontFamily: "var(--type)",
              fontSize: 12,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "var(--memorial-sub)",
            }}
          >
            by
          </span>
          <div className="flex gap-1">
            {members.map((m, i) => (
              <Link
                key={m.id}
                href={`/members?member=${m.id}`}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 5,
                  padding: "4px 8px 4px 4px",
                  border: "1px solid var(--memorial-rule)",
                  color: "var(--memorial-fg)",
                  textDecoration: "none",
                  transform: `rotate(${((i % 2 === 0 ? -1 : 1) * 0.5).toFixed(2)}deg)`,
                  transition: "opacity .2s",
                }}
                title={m.name}
              >
                <span
                  style={{
                    width: 13,
                    height: 13,
                    background: m.color,
                    boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.35)",
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    fontFamily: "var(--type)",
                    fontSize: 11,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                  }}
                >
                  {m.name}
                </span>
              </Link>
            ))}
          </div>
        </div>

        <div
          className="h-6 w-px flex-shrink-0"
          style={{ background: "var(--memorial-rule)" }}
        />

        {/* REC */}
        <span
          className="mem-pulse-dot flex-shrink-0"
          style={{
            fontFamily: "var(--type)",
            fontSize: 11,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "var(--memorial-sub)",
          }}
        >
          rec
        </span>
      </div>

      {/* ── モバイル: 2行 ── */}
      <div className="sm:hidden">
        {/* Row 1: SIDE A/B + メンバー色スウォッチ */}
        <div className="flex items-center gap-2 px-4 py-2">
          <div className="flex gap-1">
            {(
              [
                ["forward", "A"],
                ["reverse", "B"],
              ] as const
            ).map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => onToggle(key)}
                style={{
                  border: `1px solid ${dir === key ? "var(--memorial-accent)" : "var(--memorial-rule)"}`,
                  background:
                    dir === key ? "var(--memorial-accent)" : "transparent",
                  color: dir === key ? "#1a120a" : "var(--memorial-fg)",
                  fontFamily: "var(--type)",
                  fontSize: 11,
                  letterSpacing: "0.14em",
                  padding: "3px 9px",
                  cursor: "pointer",
                }}
              >
                SIDE {label}
              </button>
            ))}
          </div>
          <div className="flex-1" />
          <div className="flex gap-1">
            {members.map((m, i) => (
              <Link
                key={m.id}
                href={`/members?member=${m.id}`}
                title={m.name}
                style={{
                  width: 17,
                  height: 17,
                  background: m.color,
                  border: "1px solid rgba(0,0,0,0.35)",
                  transform: `rotate(${((i % 2 === 0 ? -1 : 1) * 1.5).toFixed(1)}deg)`,
                  display: "block",
                  flexShrink: 0,
                }}
              />
            ))}
          </div>
        </div>
        {/* Row 2: 年タブ */}
        <div
          className="flex flex-wrap gap-1 px-4 pt-2 pb-2"
          style={{ borderTop: "1px solid var(--memorial-rule)" }}
        >
          {years.map((y, i) => (
            <button
              key={y}
              type="button"
              onClick={() => onYearClick(y)}
              style={{
                flex: 1,
                padding: "4px 3px",
                background:
                  activeYear === y
                    ? "var(--memorial-accent)"
                    : "rgba(240,227,200,0.07)",
                color: activeYear === y ? "#1a120a" : "var(--memorial-fg)",
                fontFamily: "var(--type)",
                fontSize: 11,
                letterSpacing: "0.05em",
                textAlign: "center",
                transform: `rotate(${((i % 2 === 0 ? -1 : 1) * 0.5).toFixed(2)}deg)`,
                textTransform: "uppercase",
                display: "flex",
                alignItems: "baseline",
                justifyContent: "center",
                gap: 3,
                transition: "opacity .25s",
                opacity: loadingYear === y ? 0.5 : 1,
                cursor: loadingYear === y ? "wait" : "pointer",
                border: "none",
              }}
            >
              {y}
              <span
                style={{ fontFamily: "var(--mono)", fontSize: 8, opacity: 0.6 }}
              >
                {loadingYear === y ? "…" : `×${counts[y] ?? 0}`}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
