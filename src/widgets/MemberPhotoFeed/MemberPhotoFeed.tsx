"use client";

import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { PhotoListProvider } from "@/entities/photo/PhotoListContext";
import { PhotoGrid } from "@/widgets/PhotoGrid/PhotoGrid";
import type { PhotosGroupedByLive } from "@/entities/photo/api";

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
          <PhotoListProvider photos={photos} hasMore={false}>
            <PhotoGrid />
          </PhotoListProvider>
        </section>
      ))}
    </div>
  );
}
