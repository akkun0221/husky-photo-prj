"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { PhotoGrid } from "@/widgets/PhotoGrid/PhotoGrid";
import type { Photo } from "@/entities/photo/types";
import type { Live } from "@/entities/live/types";

type LiveGroup = { live: Live; photos: Photo[] };

export function MemberPhotoFeed() {
  const searchParams = useSearchParams();
  const memberId = searchParams.get("member");

  const [groups, setGroups] = useState<LiveGroup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    const params = new URLSearchParams();
    if (memberId) params.set("memberId", memberId);

    fetch(`/api/members/photo-feed?${params.toString()}`)
      .then((r) => r.json())
      .then((data: LiveGroup[]) => {
        setGroups(data);
        setLoading(false);
      });
  }, [memberId]);

  if (loading) {
    return (
      <p className="py-8 text-center text-sm text-zinc-400">読み込み中...</p>
    );
  }

  if (groups.length === 0) {
    return (
      <p className="py-16 text-center text-sm text-zinc-400">
        写真がありません
      </p>
    );
  }

  return (
    <div className="space-y-10">
      {groups.map(({ live, photos }) => (
        <section key={live.id}>
          <div className="mb-3 px-4">
            <p className="text-xs text-zinc-400">{live.date}</p>
            <h2 className="text-lg font-semibold">{live.title}</h2>
            <p className="text-xs text-zinc-400">{live.venue}</p>
          </div>
          <PhotoGrid initialPhotos={photos} />
        </section>
      ))}
    </div>
  );
}
