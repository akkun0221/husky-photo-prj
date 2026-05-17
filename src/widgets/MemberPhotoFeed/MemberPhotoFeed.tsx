"use client";

import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { PhotoListProvider } from "@/entities/photo/PhotoListContext";
import { PhotoGrid } from "@/widgets/PhotoGrid/PhotoGrid";
import type { PhotosGroupedByLive } from "@/entities/photo/api";

const WEEKDAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"] as const;

function calcWeekday(dateStr: string): string {
  const [y, m, d] = dateStr.split(".").map(Number);
  return WEEKDAYS[new Date(y, m - 1, d).getDay()];
}

export function MemberPhotoFeed() {
  const searchParams = useSearchParams();
  const memberId = searchParams.get("member");

  const { data: groups = [], isLoading } = useQuery<PhotosGroupedByLive[]>({
    queryKey: ["member-photo-feed", memberId],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (memberId) params.set("memberId", memberId);
      const res = await fetch(`/api/members/photo-feed?${params.toString()}`);
      if (!res.ok) throw new Error("写真の取得に失敗しました");
      return res.json();
    },
  });

  if (isLoading) {
    return (
      <p
        className="py-16 text-center font-mono text-[11px] tracking-[0.3em] uppercase"
        style={{ color: "var(--memorial-sub)" }}
      >
        loading...
      </p>
    );
  }

  if (groups.length === 0) {
    return (
      <p
        className="py-16 text-center font-mono text-[11px] tracking-[0.3em] uppercase"
        style={{ color: "var(--memorial-sub)" }}
      >
        no photos found
      </p>
    );
  }

  return (
    <div className="space-y-14">
      {groups.map(({ live, photos }) => (
        <section key={live.id}>
          <div
            className="mb-4 px-0"
            style={{
              borderBottom: "1px solid var(--memorial-rule)",
              paddingBottom: 8,
            }}
          >
            <div
              className="font-mono text-[10px] tracking-[0.35em] uppercase"
              style={{ color: "var(--memorial-accent)" }}
            >
              {calcWeekday(live.date)} · {live.date}
            </div>
            <h2
              className="mt-1 text-base font-medium sm:text-lg"
              style={{ color: "var(--memorial-fg)" }}
            >
              {live.title || live.venue}
            </h2>
            <div
              className="mt-0.5 font-mono text-[10px] tracking-[0.2em]"
              style={{ color: "var(--memorial-sub)" }}
            >
              {live.venue}
            </div>
          </div>
          <PhotoListProvider photos={photos} hasMore={false}>
            <PhotoGrid />
          </PhotoListProvider>
        </section>
      ))}
    </div>
  );
}
