"use client";

import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { PhotoGrid } from "@/widgets/PhotoGrid/PhotoGrid";
import type { Photo } from "@/entities/photo/types";

type Props = {
  liveId: string;
};

export function LiveDetailPhotoGrid({ liveId }: Props) {
  const searchParams = useSearchParams();
  const memberId = searchParams.get("member");

  const { data: initialPhotos = [], isLoading } = useQuery<Photo[]>({
    queryKey: ["photos-by-live", liveId, memberId],
    queryFn: async () => {
      const params = new URLSearchParams({ liveId, page: "0" });
      if (memberId) params.set("memberId", memberId);
      const res = await fetch(`/api/photos/by-live?${params.toString()}`);
      if (!res.ok) throw new Error("写真の取得に失敗しました");
      return res.json();
    },
  });

  const fetchMore = async (page: number): Promise<Photo[]> => {
    const params = new URLSearchParams({ liveId, page: String(page) });
    if (memberId) params.set("memberId", memberId);
    const res = await fetch(`/api/photos/by-live?${params.toString()}`);
    if (!res.ok) throw new Error("写真の取得に失敗しました");
    return res.json();
  };

  if (isLoading) {
    return (
      <p className="py-8 text-center text-sm text-zinc-400">読み込み中...</p>
    );
  }

  if (initialPhotos.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-zinc-400">写真がありません</p>
    );
  }

  // memberId 変更時に PhotoGrid を再マウントして状態をリセット
  return (
    <PhotoGrid
      key={memberId ?? "all"}
      initialPhotos={initialPhotos}
      fetchMore={fetchMore}
    />
  );
}
