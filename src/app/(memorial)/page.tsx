export const revalidate = false;

import { Suspense } from "react";
import {
  getLivesFeedYear,
  getLiveYearCounts,
  getLiveMarqueeItems,
  getTotalPhotoCount,
} from "@/entities/live/api";
import { getMembersWithPhotoCount } from "@/entities/member/api";
import { MemorialHeader } from "@/widgets/MemorialHeader/MemorialHeader";
import { MemorialClient } from "@/widgets/MemorialClient/MemorialClient";
import { MemorialFooter } from "@/widgets/MemorialFooter/MemorialFooter";

export default async function HomePage() {
  // yearCounts を先に取得して最新年を特定してから残りを並列フェッチ
  const yearCounts = await getLiveYearCounts();
  const mostRecentYear = Object.keys(yearCounts)
    .filter((y) => (yearCounts[y] ?? 0) > 0)
    .sort()
    .reverse()[0];

  const [initialYearData, marqueeItems, members, totalPhotos] =
    await Promise.all([
      mostRecentYear
        ? getLivesFeedYear(mostRecentYear, "reverse")
        : Promise.resolve({ lives: [], year: "" }),
      getLiveMarqueeItems(),
      getMembersWithPhotoCount(),
      getTotalPhotoCount(),
    ]);

  return (
    <div style={{ position: "relative" }}>
      <MemorialHeader />
      <Suspense>
        <MemorialClient
          initialYearData={initialYearData}
          yearCounts={yearCounts}
          marqueeItems={marqueeItems}
          members={members}
          totalPhotos={totalPhotos}
        />
      </Suspense>
      <MemorialFooter />
    </div>
  );
}
