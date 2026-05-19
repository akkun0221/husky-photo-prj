import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
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

  const [live, members] = await Promise.all([getLiveById(id), getMembers()]);
  const weekday = calcWeekday(live.date);

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

          {/* Weekday + venue */}
          <div
            style={{
              fontFamily: "var(--mono)",
              fontSize: 10,
              letterSpacing: "0.35em",
              textTransform: "uppercase",
              color: "var(--memorial-sub)",
              marginBottom: 10,
            }}
          >
            {weekday} · {live.venue}
          </div>

          {/* Date — giant serif italic */}
          <h1
            style={{
              fontFamily: "var(--serif)",
              fontStyle: "italic",
              fontWeight: 700,
              fontSize: "clamp(40px, 7vw, 80px)",
              lineHeight: 0.95,
              letterSpacing: "-0.03em",
              color: "var(--memorial-fg)",
              margin: "0 0 14px",
            }}
          >
            {live.date}
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

          {live.description && (
            <p
              style={{
                fontFamily: "var(--jp)",
                fontSize: 13,
                lineHeight: 1.9,
                color: "var(--memorial-sub)",
                maxWidth: 480,
                margin: 0,
              }}
            >
              {live.description}
            </p>
          )}

          {/* Member filter */}
          <div style={{ marginTop: 28 }}>
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
