export const dynamic = "force-dynamic";

import Link from "next/link";
import { getLiveById } from "@/entities/live/api";
import { getPhotosByLiveId } from "@/entities/photo/api";
import { getMembers } from "@/entities/member/api";
import { AdminPhotoGrid } from "@/widgets/AdminPhotoGrid/AdminPhotoGrid";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function AdminPhotosPage({ params }: Props) {
  const { id } = await params;
  const [live, photos, members] = await Promise.all([
    getLiveById(id),
    getPhotosByLiveId(id),
    getMembers(),
  ]);

  return (
    <main className="space-y-6 py-8">
      <div className="mx-auto max-w-5xl px-4">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-zinc-500">{live.date}</p>
            <h1 className="text-2xl font-bold">{live.title} — 写真管理</h1>
            <p className="text-sm text-zinc-400">{live.venue}</p>
          </div>
          <Link
            href="/admin"
            className="text-sm text-zinc-500 underline hover:text-zinc-700"
          >
            ← ライブ一覧に戻る
          </Link>
        </div>
        <AdminPhotoGrid photos={photos} members={members} liveId={id} />
      </div>
    </main>
  );
}
