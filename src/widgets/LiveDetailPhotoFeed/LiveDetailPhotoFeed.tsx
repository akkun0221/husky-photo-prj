"use client";

import { useSearchParams } from "next/navigation";
import { useInfiniteQuery } from "@tanstack/react-query";
import { PhotoListProvider } from "@/entities/photo/PhotoListContext";
import { PhotoGrid } from "@/widgets/PhotoGrid/PhotoGrid";
import type { Photo } from "@/entities/photo/types";

type Props = {
  liveId: string;
};

export function LiveDetailPhotoFeed({ liveId }: Props) {
  const searchParams = useSearchParams();
  const memberId = searchParams.get("member");

  const { data, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useInfiniteQuery<Photo[]>({
      queryKey: ["photos-by-live", liveId, memberId],
      queryFn: async ({ pageParam }) => {
        const params = new URLSearchParams({ liveId, page: String(pageParam) });
        if (memberId) params.set("memberId", memberId);
        const res = await fetch(`/api/photos/by-live?${params.toString()}`);
        if (!res.ok) throw new Error("写真の取得に失敗しました");
        return res.json();
      },
      initialPageParam: 0,
      getNextPageParam: (lastPage, _allPages, lastPageParam) =>
        lastPage.length === 24 ? (lastPageParam as number) + 1 : undefined,
    });

  const photos = data?.pages.flat() ?? [];

  if (isLoading) {
    return (
      <p className="py-8 text-center text-sm text-zinc-400">読み込み中...</p>
    );
  }

  if (photos.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-zinc-400">写真がありません</p>
    );
  }

  return (
    <PhotoListProvider
      key={memberId ?? "all"}
      photos={photos}
      hasMore={hasNextPage ?? false}
    >
      <PhotoGrid
        onLoadMore={fetchNextPage}
        isFetchingNext={isFetchingNextPage}
      />
    </PhotoListProvider>
  );
}
