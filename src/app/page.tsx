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

const YT_VIDEO_ID = "08JiOyg4moY";

export default async function HomePage() {
  const [lives, members] = await Promise.all([
    getLivesWithPhotoCount(),
    getMembersWithPhotoCount(),
  ]);

  const totalPhotos = lives.reduce((sum, l) => sum + l.photoCount, 0);
  const slideshowPhotos = [...lives]
    .reverse()
    .filter((l) => l.thumbnailUrl)
    .map((l) => ({ url: l.thumbnailUrl!, label: `${l.date} · ${l.venue}` }));

  return (
    <>
      {/* 全画面固定 YouTube 背景 */}
      <div
        className="pointer-events-none fixed inset-0 overflow-hidden"
        style={{ zIndex: -1, background: "var(--memorial-bg)" }}
        aria-hidden="true"
      >
        <iframe
          src={`https://www.youtube.com/embed/${YT_VIDEO_ID}?autoplay=1&mute=1&loop=1&playlist=${YT_VIDEO_ID}&controls=0&disablekb=1&modestbranding=1&playsinline=1&rel=0`}
          allow="autoplay; encrypted-media"
          className="absolute"
          style={{
            top: "50%",
            left: "50%",
            width: "177.78vh",
            height: "56.25vw",
            minWidth: "100%",
            minHeight: "100%",
            transform: "translate(-50%, -50%) scale(1.1)",
            filter: "blur(10px)",
            opacity: 0.2,
            border: "none",
          }}
          title=""
        />
      </div>

      {/* コンテンツ */}
      <div style={{ minHeight: "100dvh", position: "relative" }}>
        <MemorialHeader />
        <OpeningMonument
          showCount={lives.length}
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
    </>
  );
}
