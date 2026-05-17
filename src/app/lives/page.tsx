export const revalidate = false;

import type { Metadata } from "next";
import Link from "next/link";
import { getLivesWithPhotoFlag } from "@/entities/live/api";
import { MemorialHeader } from "@/widgets/MemorialHeader/MemorialHeader";
import { MemorialFooter } from "@/widgets/MemorialFooter/MemorialFooter";

export const metadata: Metadata = {
  title: "LIVES",
  description: "huskyのライブ一覧",
};

const WEEKDAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"] as const;

function calcWeekday(dateStr: string): string {
  const [y, m, d] = dateStr.split(".").map(Number);
  return WEEKDAYS[new Date(y, m - 1, d).getDay()];
}

export default async function LivesPage() {
  const allLives = await getLivesWithPhotoFlag();
  const lives = allLives.filter((l) => l.hasPhotos);

  const byYear = new Map<string, typeof lives>();
  for (const live of lives) {
    const y = live.date.slice(0, 4);
    if (!byYear.has(y)) byYear.set(y, []);
    byYear.get(y)!.push(live);
  }
  const years = [...byYear.keys()].sort((a, b) => Number(b) - Number(a));

  return (
    <div style={{ minHeight: "100dvh", color: "var(--memorial-fg)" }}>
      <MemorialHeader />
      <main className="px-4 pt-20 pb-24 sm:px-16">
        {/* タイトル — YouTube が透けて見えるエリア */}
        <div className="mb-14 pt-4">
          <div
            className="mb-3 font-mono text-[10px] tracking-[0.5em] uppercase"
            style={{ color: "var(--memorial-accent)" }}
          >
            archive
          </div>
          <h1
            style={{
              fontFamily: "var(--font-playfair), 'Noto Serif JP', serif",
              fontWeight: 300,
              fontStyle: "italic",
              fontSize: "clamp(40px, 8vw, 80px)",
              lineHeight: 1,
              letterSpacing: "-0.02em",
            }}
          >
            Lives
          </h1>
          <div
            className="mt-3 font-mono text-[11px] tracking-[0.3em]"
            style={{ color: "var(--memorial-sub)" }}
          >
            {lives.length} shows documented
          </div>
        </div>

        {/* 年別リスト — 年ラベルはパネル外、リスト行は半透明パネルで可読性を確保 */}
        <div className="space-y-12">
          {years.map((year) => (
            <section key={year}>
              {/* 年ラベル: YouTube が透けて見えるギャップ */}
              <div
                className="mb-2 font-mono text-[11px] tracking-[0.4em] uppercase"
                style={{ color: "var(--memorial-accent)" }}
              >
                {year}
              </div>

              <ul style={{ borderTop: "1px solid var(--memorial-rule)" }}>
                {byYear.get(year)!.map((live) => (
                  <li
                    key={live.id}
                    style={{ borderBottom: "1px solid var(--memorial-faint)" }}
                  >
                    <Link
                      href={`/lives/${live.id}`}
                      className="flex items-baseline gap-3 px-0 py-4 no-underline transition-opacity hover:opacity-60 sm:gap-6"
                      style={{ color: "var(--memorial-fg)" }}
                    >
                      <span
                        className="w-8 flex-shrink-0 font-mono text-[10px] tracking-[0.2em] uppercase"
                        style={{ color: "var(--memorial-sub)" }}
                      >
                        {calcWeekday(live.date)}
                      </span>
                      <span
                        className="w-24 flex-shrink-0 font-mono text-[11px] tracking-[0.05em]"
                        style={{ color: "var(--memorial-sub)" }}
                      >
                        {live.date}
                      </span>
                      <span className="flex-1 text-sm font-medium sm:text-base">
                        {live.title || live.venue}
                      </span>
                      <span
                        className="hidden flex-shrink-0 font-mono text-[11px] tracking-[0.1em] sm:inline"
                        style={{ color: "var(--memorial-sub)" }}
                      >
                        {live.venue}
                      </span>
                      <span
                        className="flex-shrink-0 font-mono text-[10px] tracking-[0.2em]"
                        style={{ color: "var(--memorial-accent)" }}
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

        {lives.length === 0 && (
          <p
            className="py-16 text-center font-mono text-[11px] tracking-[0.3em] uppercase"
            style={{ color: "var(--memorial-sub)" }}
          >
            no shows documented yet
          </p>
        )}
      </main>
      <MemorialFooter />
    </div>
  );
}
