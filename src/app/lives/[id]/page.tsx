import type { Metadata } from "next";
import { Suspense } from "react";
import { getLiveById } from "@/entities/live/api";
import { getMembers } from "@/entities/member/api";
import { createAdminClient } from "@/shared/lib/supabase/admin";
import { Header } from "@/widgets/Header/Header";
import { MemberSelect } from "@/features/filter-photos/MemberSelect";
import { LiveDetailPhotoFeed } from "@/widgets/LiveDetailPhotoFeed/LiveDetailPhotoFeed";

type Props = {
  params: Promise<{ id: string }>;
};

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

  const allMember = members.find((m) => m.name === "全体");
  if (!allMember) throw new Error("「全体」メンバーが見つかりません");

  return (
    <>
      <Header />
      <main className="space-y-6 py-8">
        <div className="mx-auto max-w-5xl px-4">
          <p className="text-sm text-zinc-500">{live.date}</p>
          <h1 className="text-2xl font-bold">{live.title}</h1>
          <p className="text-sm text-zinc-400">{live.venue}</p>
        </div>

        <div className="mx-auto flex max-w-5xl justify-end px-4">
          <Suspense>
            <MemberSelect members={members} allMember={allMember} />
          </Suspense>
        </div>

        {/* 写真グリッドはmax-w-5xl幅 */}
        <div className="mx-auto max-w-5xl">
          <Suspense
            fallback={
              <p className="py-8 text-center text-sm text-zinc-400">
                読み込み中...
              </p>
            }
          >
            <LiveDetailPhotoFeed liveId={id} />
          </Suspense>
        </div>
      </main>
    </>
  );
}
