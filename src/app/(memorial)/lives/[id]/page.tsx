import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { getLiveById, getLivesWithPhotoCount } from "@/entities/live/api";
import { getMembers } from "@/entities/member/api";
import { createAdminClient } from "@/shared/lib/supabase/admin";
import { MemorialHeader } from "@/widgets/MemorialHeader/MemorialHeader";
import { MemorialFooter } from "@/widgets/MemorialFooter/MemorialFooter";
import { MemorialMemberFilter } from "@/features/filter-photos/MemorialMemberFilter";
import { LiveDetailPhotoFeed } from "@/widgets/LiveDetailPhotoFeed/LiveDetailPhotoFeed";

type Props = {
  params: Promise<{ id: string }>;
};

const WEEKDAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"] as const;
const YEARS = ["2022", "2023", "2024", "2025", "2026"];
const CHAPTERS = ["Ⅰ", "Ⅱ", "Ⅲ", "Ⅳ", "Ⅴ"];

function calcWeekday(dateStr: string): string {
  const [y, m, d] = dateStr.split(".").map(Number);
  return WEEKDAYS[new Date(y, m - 1, d).getDay()];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const live = await getLiveById(id);
  return {
    title: live.title || live.venue,
    description: `${live.date} · ${live.venue}`,
    openGraph: {
      title: live.title || live.venue,
      description: `${live.date} · ${live.venue}`,
      type: "article",
    },
  };
}

export async function generateStaticParams() {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("lives")
    .select("id")
    .is("deleted_at", null);
  return (data ?? []).map((row) => ({ id: row.id }));
}

export default async function LiveDetailPage({ params }: Props) {
  const { id } = await params;

  const [live, members, allLives] = await Promise.all([
    getLiveById(id),
    getMembers(),
    getLivesWithPhotoCount(),
  ]);

  const weekday = calcWeekday(live.date);
  const yearStr = live.date.slice(0, 4);
  const chapterStr = CHAPTERS[YEARS.indexOf(yearStr)] ?? "";

  // 写真ありのライブを日付昇順でソートし、通し番号を算出
  const livesWithPhotos = [...allLives]
    .filter((l) => l.hasPhotos)
    .sort((a, b) => a.date.localeCompare(b.date));
  const entryIdx = livesWithPhotos.findIndex((l) => l.id === id);
  const entryNo = entryIdx >= 0 ? entryIdx + 1 : null;

  // 日付を「年.月.日」に分割してアクセントカラー適用
  const dateParts = live.date.split(".");

  return (
    <div>
      <MemorialHeader />
      <main className="pb-24">
        {/* ── ヘッダー ── */}
        <div
          className="px-4 pt-14 pb-10 sm:px-16"
          style={{ borderBottom: "1px solid var(--memorial-rule)" }}
        >
          {/* Back link */}
          <Link
            href="/lives"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              fontFamily: "var(--mono)",
              fontSize: 10,
              letterSpacing: "0.35em",
              textTransform: "uppercase",
              color: "var(--memorial-sub)",
              textDecoration: "none",
              marginBottom: 28,
            }}
          >
            ← lives
          </Link>

          {/* Header grid: 情報 + 赤スタンプ */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr auto",
              alignItems: "end",
              gap: 32,
              paddingBottom: 32,
            }}
          >
            <div>
              {/* サブタイトル: live · chapter Ⅰ · entry N */}
              <div
                style={{
                  fontFamily: "var(--type)",
                  fontSize: 12,
                  letterSpacing: "0.4em",
                  textTransform: "uppercase",
                  color: "var(--memorial-accent)",
                  marginBottom: 12,
                }}
              >
                live · chapter {chapterStr}
                {entryNo !== null && (
                  <> · entry {String(entryNo).padStart(2, "0")}</>
                )}
              </div>

              {/* 日付 — 「日」部分をアクセントカラー */}
              <h1
                style={{
                  fontFamily: "var(--serif)",
                  fontStyle: "italic",
                  fontWeight: 300,
                  fontSize: "clamp(40px, 7vw, 80px)",
                  lineHeight: 0.95,
                  letterSpacing: "-0.03em",
                  margin: "0 0 14px",
                }}
              >
                {dateParts.map((p, i, arr) => (
                  <span
                    key={i}
                    style={{
                      color:
                        i === arr.length - 1
                          ? "var(--memorial-accent)"
                          : "var(--memorial-fg)",
                    }}
                  >
                    {p}
                    {i < arr.length - 1 ? "." : ""}
                  </span>
                ))}
              </h1>

              {/* Title */}
              <div
                style={{
                  fontFamily: "var(--type)",
                  fontSize: 14,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "var(--memorial-fg)",
                  marginBottom: live.description ? 12 : 0,
                }}
              >
                {live.title || live.venue}
              </div>

              {/* Weekday + venue */}
              <div
                style={{
                  fontFamily: "var(--mono)",
                  fontSize: 10,
                  letterSpacing: "0.35em",
                  textTransform: "uppercase",
                  color: "var(--memorial-sub)",
                  marginTop: 8,
                }}
              >
                {weekday} · @ {live.venue}
              </div>

              {live.description && (
                <p
                  style={{
                    fontFamily: "var(--jp)",
                    fontSize: 13,
                    lineHeight: 1.9,
                    color: "var(--memorial-sub)",
                    maxWidth: 480,
                    margin: "12px 0 0",
                  }}
                >
                  {live.description}
                </p>
              )}
            </div>

            {/* 赤スタンプ */}
            <div
              aria-hidden="true"
              style={{
                width: 150,
                height: 150,
                borderRadius: "50%",
                border: "3px double rgba(184,90,58,0.85)",
                color: "rgba(184,90,58,0.85)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                transform: "rotate(-6deg)",
                fontFamily: "var(--type)",
                textTransform: "uppercase",
                textAlign: "center",
                flexShrink: 0,
              }}
            >
              <div style={{ fontSize: 11, letterSpacing: "0.2em" }}>filed</div>
              <div
                style={{
                  fontFamily: "var(--serif)",
                  fontStyle: "italic",
                  fontWeight: 700,
                  fontSize: 34,
                  letterSpacing: "-0.02em",
                  margin: "2px 0",
                }}
              >
                {dateParts[1]}.{dateParts[2]}
              </div>
              <div style={{ fontSize: 11, letterSpacing: "0.2em" }}>
                {yearStr}
              </div>
            </div>
          </div>

          {/* Member filter */}
          <div style={{ marginTop: 4 }}>
            <Suspense>
              <MemorialMemberFilter members={members} />
            </Suspense>
          </div>
        </div>

        {/* ── Photo grid ── */}
        <Suspense
          fallback={
            <div
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
            </div>
          }
        >
          <LiveDetailPhotoFeed liveId={id} />
        </Suspense>
      </main>
      <MemorialFooter />
    </div>
  );
}
