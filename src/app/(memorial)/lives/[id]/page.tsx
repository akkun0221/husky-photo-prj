import type { Metadata } from "next";
import { Suspense } from "react";
import { getLiveById } from "@/entities/live/api";
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

function calcWeekday(dateStr: string): string {
  const [y, m, d] = dateStr.split(".").map(Number);
  return WEEKDAYS[new Date(y, m - 1, d).getDay()];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const live = await getLiveById(id);
  return {
    title: live.title,
    description: `${live.date} ${live.venue}`,
    openGraph: {
      title: live.title,
      description: `${live.date} ${live.venue}`,
      type: "article",
    },
  };
}

// generateStaticParams はビルド時実行のため cookies() を使わない adminClient を直接使う
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

  const [live, members] = await Promise.all([getLiveById(id), getMembers()]);
  const weekday = calcWeekday(live.date);

  return (
    <div>
      <MemorialHeader />
      <main className="pb-24">
        {/* ヒーローヘッダー */}
        <div
          className="px-4 pt-20 pb-10 sm:px-16"
          style={{ borderBottom: "1px solid var(--memorial-rule)" }}
        >
          <div
            className="mb-3 font-mono text-[10px] tracking-[0.4em] uppercase"
            style={{ color: "var(--memorial-accent)" }}
          >
            {weekday} · {live.venue}
          </div>
          <h1
            style={{
              fontFamily: "var(--font-playfair), 'Noto Serif JP', serif",
              fontWeight: 300,
              fontStyle: "italic",
              fontSize: "clamp(36px, 6vw, 72px)",
              lineHeight: 1,
              letterSpacing: "-0.02em",
            }}
          >
            {live.date}
          </h1>
          <p className="mt-3 text-base font-medium sm:text-xl">
            {live.title || live.venue}
          </p>
          {live.description && (
            <p
              className="mt-2 max-w-xl font-mono text-[12px] leading-relaxed"
              style={{ color: "var(--memorial-sub)" }}
            >
              {live.description}
            </p>
          )}

          {/* メンバーフィルター */}
          <div className="mt-8">
            <Suspense>
              <MemorialMemberFilter members={members} />
            </Suspense>
          </div>
        </div>

        {/* フォトグリッド */}
        <div className="mt-2">
          <Suspense
            fallback={
              <p
                className="py-16 text-center font-mono text-[11px] tracking-[0.3em] uppercase"
                style={{ color: "var(--memorial-sub)" }}
              >
                loading...
              </p>
            }
          >
            <LiveDetailPhotoFeed liveId={id} />
          </Suspense>
        </div>
      </main>
      <MemorialFooter />
    </div>
  );
}
