export const dynamic = "force-static";

import type { Metadata } from "next";
import { Suspense } from "react";
import { getMembers } from "@/entities/member/api";
import { MemorialHeader } from "@/widgets/MemorialHeader/MemorialHeader";
import { MemorialFooter } from "@/widgets/MemorialFooter/MemorialFooter";
import { MemorialMemberFilter } from "@/features/filter-photos/MemorialMemberFilter";
import { MemberPhotoFeed } from "@/widgets/MemberPhotoFeed/MemberPhotoFeed";

export const metadata: Metadata = {
  title: "MEMBERS",
  description: "メンバー別のライブ写真一覧",
};

export default async function MembersPage() {
  const members = await getMembers();

  return (
    <div
      style={{
        minHeight: "100dvh",
        color: "var(--memorial-fg)",
        background: "var(--memorial-bg)",
      }}
    >
      <MemorialHeader />
      <main className="px-4 pt-20 pb-24 sm:px-16">
        {/* タイトル */}
        <div className="mb-8 pt-4">
          <div
            className="mb-3 font-mono text-[10px] tracking-[0.5em] uppercase"
            style={{ color: "var(--memorial-accent)" }}
          >
            gallery
          </div>
          <h1
            style={{
              fontFamily: "var(--font-playfair), 'Noto Serif JP', serif",
              fontWeight: 300,
              fontStyle: "italic",
              fontSize: "clamp(40px, 8vw, 80px)",
              lineHeight: 1,
              letterSpacing: "-0.02em",
            }}
          >
            Members
          </h1>
        </div>

        {/* フィルター */}
        <div
          className="mb-10"
          style={{
            borderBottom: "1px solid var(--memorial-rule)",
            paddingBottom: 16,
          }}
        >
          <Suspense>
            <MemorialMemberFilter members={members} />
          </Suspense>
        </div>

        {/* フォトフィード */}
        <Suspense
          fallback={
            <p
              className="py-16 text-center font-mono text-[11px] tracking-[0.3em] uppercase"
              style={{ color: "var(--memorial-sub)" }}
            >
              loading...
            </p>
          }
        >
          <MemberPhotoFeed />
        </Suspense>
      </main>
      <MemorialFooter />
    </div>
  );
}
