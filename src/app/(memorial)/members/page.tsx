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
    <div>
      <MemorialHeader />
      <main className="pb-24">
        {/* ── ヘッダー ── */}
        <div
          className="px-4 pt-14 pb-8 sm:px-16"
          style={{ borderBottom: "1px solid var(--memorial-rule)" }}
        >
          <div
            style={{
              fontFamily: "var(--mono)",
              fontSize: 10,
              letterSpacing: "0.45em",
              textTransform: "uppercase",
              color: "var(--memorial-sub)",
              marginBottom: 12,
            }}
          >
            gallery
          </div>

          <h1
            style={{
              fontFamily: "var(--serif)",
              fontStyle: "italic",
              fontWeight: 700,
              fontSize: "clamp(40px, 8vw, 80px)",
              lineHeight: 0.92,
              letterSpacing: "-0.03em",
              color: "var(--memorial-fg)",
              margin: "0 0 28px",
            }}
          >
            Members
          </h1>

          {/* Member filter */}
          <Suspense>
            <MemorialMemberFilter members={members} />
          </Suspense>
        </div>

        {/* ── Photo feed ── */}
        <Suspense
          fallback={
            <div
              className="py-16 text-center"
              style={{
                fontFamily: "var(--mono)",
                fontSize: 10,
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: "var(--memorial-sub)",
              }}
            >
              loading...
            </div>
          }
        >
          <MemberPhotoFeed />
        </Suspense>
      </main>
      <MemorialFooter />
    </div>
  );
}
