export const revalidate = false;

import { Suspense } from "react";
import { getLivesWithPhotoCount } from "@/entities/live/api";
import { getMembersWithPhotoCount } from "@/entities/member/api";
import { MemorialHeader } from "@/widgets/MemorialHeader/MemorialHeader";
import { OpeningMonument } from "@/widgets/OpeningMonument/OpeningMonument";
import { MemorialClient } from "@/widgets/MemorialClient/MemorialClient";
import { MembersRail } from "@/widgets/MembersRail/MembersRail";
import { MemorialFooter } from "@/widgets/MemorialFooter/MemorialFooter";

export default async function HomePage() {
  const [lives, members] = await Promise.all([
    getLivesWithPhotoCount(),
    getMembersWithPhotoCount(),
  ]);

  const totalPhotos = lives.reduce((sum, l) => sum + l.photoCount, 0);

  return (
    <div style={{ background: "var(--memorial-bg)", minHeight: "100dvh" }}>
      <MemorialHeader />
      <OpeningMonument
        showCount={lives.length}
        photoCount={totalPhotos}
        voiceCount={members.length}
      />
      <Suspense>
        <MemorialClient lives={lives} members={members} />
      </Suspense>
      <MembersRail members={members} />
      <MemorialFooter />
    </div>
  );
}
