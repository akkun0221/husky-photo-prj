"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { PhotoGrid } from "@/widgets/PhotoGrid/PhotoGrid";
import type { Photo } from "@/entities/photo/types";

type Props = {
  liveId: string;
};

export function LiveDetailPhotoGrid({ liveId }: Props) {
  const searchParams = useSearchParams();
  const memberId = searchParams.get("member");

  const [initialPhotos, setInitialPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    const params = new URLSearchParams({ liveId, page: "0" });
    if (memberId) params.set("memberId", memberId);

    fetch(`/api/photos/by-live?${params.toString()}`)
      .then((r) => r.json())
      .then((data: Photo[]) => {
        setInitialPhotos(data);
        setLoading(false);
      });
  }, [liveId, memberId]);

  const fetchMore = useCallback(
    async (page: number): Promise<Photo[]> => {
      const params = new URLSearchParams({ liveId, page: String(page) });
      if (memberId) params.set("memberId", memberId);
      const res = await fetch(`/api/photos/by-live?${params.toString()}`);
      return res.json();
    },
    [liveId, memberId],
  );

  if (loading) {
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
