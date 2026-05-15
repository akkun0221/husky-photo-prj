export const dynamic = "force-static";

import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "メンバー別",
  description: "メンバー別のライブ写真一覧",
};
import { getMembers } from "@/entities/member/api";
import { Header } from "@/widgets/Header/Header";
import { MemberDropdown } from "@/features/filter-photos/MemberDropdown";
import { MemberPhotoFeed } from "@/widgets/MemberPhotoFeed/MemberPhotoFeed";

export default async function MembersPage() {
  const members = await getMembers();

  return (
    <>
      <Header />
      <main className="space-y-6 py-8">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4">
          <h1 className="text-2xl font-bold">メンバー別</h1>
          <Suspense>
            <MemberDropdown members={members} />
          </Suspense>
        </div>

        {/* 写真フィードはmax-w-5xl幅 */}
        <div className="mx-auto max-w-5xl">
          <Suspense
            fallback={
              <p className="py-8 text-center text-sm text-zinc-400">
                読み込み中...
              </p>
            }
          >
            <MemberPhotoFeed />
          </Suspense>
        </div>
      </main>
    </>
  );
}
