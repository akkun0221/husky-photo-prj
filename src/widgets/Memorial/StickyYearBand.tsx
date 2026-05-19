import { forwardRef } from "react";
import { PhotoStage } from "@/widgets/Memorial/PhotoStage";
import { TapeStrip } from "@/widgets/Memorial/TapeStrip";

type Props = {
  year: string;
  count: number;
  chapterIdx: number;
  active: boolean;
  subLabel?: string;
  polaroidUrl?: string;
};

const CHAPTERS = ["Ⅰ", "Ⅱ", "Ⅲ", "Ⅳ", "Ⅴ", "Ⅵ", "Ⅶ", "Ⅷ"];

const YEAR_LABELS: Record<string, string> = {
  "2022": "出会いの年。",
  "2023": "通うようになった年。",
  "2024": "転換点の年。",
  "2025": "走り抜けた年。",
  "2026": "終演の年 — 4.27 解散。",
};

function hashTilt(year: string): number {
  const v = parseInt(year, 10) % 7;
  return (v % 2 === 0 ? -1 : 1) * ((v % 3) + 1) * 0.6;
}

export const StickyYearBand = forwardRef<HTMLDivElement, Props>(
  ({ year, count, chapterIdx, active, subLabel, polaroidUrl }, ref) => {
    const label = subLabel ?? YEAR_LABELS[year] ?? "";
    const chapter = CHAPTERS[chapterIdx] ?? String(chapterIdx + 1);
    const tilt = hashTilt(year);

    return (
      <div
        ref={ref}
        id={`y${year}`}
        // デスクトップ: StickyBar 1行(~52px) 下。モバイル: 2行(~90px) 下。
        className="sticky top-[90px] z-[4] flex items-center gap-4 sm:top-[52px] sm:gap-6"
        style={{
          background: "rgba(18,10,6,0.88)",
          backdropFilter: "blur(12px) saturate(120%)",
          borderTop: "1px solid var(--memorial-rule)",
          borderBottom: "1px solid var(--memorial-rule)",
          padding: "12px 16px",
        }}
      >
        {/* テープ風年号バッジ */}
        <div
          style={{
            position: "relative",
            display: "inline-block",
            padding: "2px 16px 4px",
            background: "rgba(240,227,200,0.92)",
            color: "#1a120a",
            boxShadow: "0 6px 14px rgba(0,0,0,0.45)",
            transform: "rotate(-1.4deg)",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              fontFamily: "var(--serif)",
              fontStyle: "italic",
              fontWeight: 700,
              fontSize: "clamp(40px, 6vw, 64px)",
              lineHeight: 0.85,
              letterSpacing: "-0.04em",
            }}
          >
            {year}
          </div>
          {/* マスキングテープ */}
          <div
            style={{
              position: "absolute",
              top: -8,
              left: -14,
              width: 60,
              height: 18,
              background: "rgba(232,162,92,0.55)",
              mixBlendMode: "screen",
              transform: "rotate(-10deg)",
              backgroundImage:
                "repeating-linear-gradient(90deg, rgba(255,255,255,0.08) 0 2px, transparent 2px 5px)",
              boxShadow: "0 2px 4px rgba(0,0,0,0.4)",
              pointerEvents: "none",
            }}
          />
        </div>

        {/* 章・サブ文言 */}
        <div className="flex-1">
          <div
            style={{
              fontFamily: "var(--type)",
              fontSize: 10,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: active
                ? "var(--memorial-accent-hot)"
                : "var(--memorial-sub)",
              transition: "color .4s",
            }}
          >
            chapter {chapter} · {count} {count === 1 ? "night" : "nights"}
          </div>
          {label && (
            <div
              className="hidden sm:block"
              style={{
                fontFamily: "var(--jp)",
                fontWeight: 400,
                fontSize: 13,
                color: "var(--memorial-fg)",
                marginTop: 3,
              }}
            >
              {label}
            </div>
          )}
        </div>

        {/* ポラロイド写真（ライブ一覧ページでのみ表示） */}
        {polaroidUrl && (
          <div
            className="hidden sm:block"
            style={{
              width: 64,
              transform: `rotate(${tilt}deg)`,
              flexShrink: 0,
              position: "relative",
            }}
          >
            <PhotoStage
              urls={[polaroidUrl]}
              aspect="4/5"
              shape="polaroid"
              filter="mem-photo-warm"
            >
              <TapeStrip top={-6} left="50%" rot={-6} width={60} />
            </PhotoStage>
          </div>
        )}
      </div>
    );
  },
);
StickyYearBand.displayName = "StickyYearBand";
