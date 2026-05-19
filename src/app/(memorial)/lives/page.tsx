export const revalidate = false;

import type { Metadata } from "next";
import { Suspense } from "react";
import { getLivesWithPhotoCount } from "@/entities/live/api";
import { MemorialHeader } from "@/widgets/MemorialHeader/MemorialHeader";
import { MemorialFooter } from "@/widgets/MemorialFooter/MemorialFooter";
import { PhotoMarquee } from "@/widgets/Memorial/PhotoMarquee";
import { LivesClient } from "@/widgets/LiveList/LivesClient";

export const metadata: Metadata = {
  title: "LIVES",
  description: "huskyのライブ一覧",
};

export default async function LivesPage() {
  const lives = await getLivesWithPhotoCount();

  return (
    <div>
      <MemorialHeader />
      <PhotoMarquee lives={lives} />
      <Suspense>
        <LivesClient lives={lives} />
      </Suspense>
      <MemorialFooter />
    </div>
  );
}
