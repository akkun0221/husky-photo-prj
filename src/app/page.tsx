export const revalidate = false;

import { Suspense } from "react";
import { getLivesWithPhotoCount } from "@/entities/live/api";
import { getMembersWithPhotoCount } from "@/entities/member/api";
import { MemorialHeader } from "@/widgets/MemorialHeader/MemorialHeader";
import { OpeningMonument } from "@/widgets/OpeningMonument/OpeningMonument";
import { MemorialClient } from "@/widgets/MemorialClient/MemorialClient";
import { MembersRail } from "@/widgets/MembersRail/MembersRail";
import { MemorialFooter } from "@/widgets/MemorialFooter/MemorialFooter";
import { PhotoSlideshow } from "@/widgets/PhotoSlideshow/PhotoSlideshow";

export default async function HomePage() {
  const [lives, members] = await Promise.all([
    getLivesWithPhotoCount(),
    getMembersWithPhotoCount(),
  ]);

  const totalPhotos = lives.reduce((sum, l) => sum + l.photoCount, 0);
  const livesWithPhotosCount = lives.filter((l) => l.photoCount > 0).length;
  const slideshowPhotos = [...lives]
    .reverse()
    .filter((l) => l.thumbnailUrl)
    .map((l) => ({ url: l.thumbnailUrl!, label: `${l.date} · ${l.venue}` }));

  return (
    <div
      style={{
        minHeight: "100dvh",
        position: "relative",
        background: "var(--memorial-bg)",
      }}
    >
      <MemorialHeader />
      <OpeningMonument
        showCount={livesWithPhotosCount}
        photoCount={totalPhotos}
        voiceCount={members.length}
      />
      <PhotoSlideshow photos={slideshowPhotos} />
      <Suspense>
        <MemorialClient lives={lives} members={members} />
      </Suspense>
      <MembersRail members={members} />
      <MemorialFooter />
    </div>
  );
}
