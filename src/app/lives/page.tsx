export const revalidate = false;

import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "ライブ一覧",
  description: "huskyのライブ一覧",
};
import { getLivesWithPhotoFlag } from "@/entities/live/api";
import { Header } from "@/widgets/Header/Header";
import { Footer } from "@/widgets/Footer/Footer";

const ROW_COLORS = [
  { base: "bg-yellow-50", hover: "hover:bg-yellow-100" },
  { base: "bg-emerald-50", hover: "hover:bg-emerald-100" },
  { base: "bg-blue-50", hover: "hover:bg-blue-100" },
  { base: "bg-purple-50", hover: "hover:bg-purple-100" },
  { base: "bg-white", hover: "hover:bg-zinc-50" },
] as const;

export default async function LivesPage() {
  const lives = await getLivesWithPhotoFlag();

  return (
    <>
      <Header />
      <main className="py-8">
        <div className="mx-auto max-w-5xl px-4">
          <h1 className="mb-6 text-2xl font-bold">ライブ一覧</h1>
        </div>
        <ul className="divide-y divide-zinc-100">
          {lives.map((live, i) => {
            const color = ROW_COLORS[i % ROW_COLORS.length];
            if (!live.hasPhotos) {
              return (
                <li key={live.id} className="bg-zinc-100">
                  <div className="mx-auto flex max-w-5xl items-baseline gap-4 px-4 py-4">
                    <span className="w-28 shrink-0 text-sm text-zinc-400">
                      {live.date}
                    </span>
                    <span className="font-medium text-zinc-400">
                      {live.title}
                    </span>
                    <span className="ml-auto shrink-0 text-sm text-zinc-300">
                      {live.venue}
                    </span>
                  </div>
                </li>
              );
            }
            return (
              <li key={live.id} className={color.base}>
                <Link
                  href={`/lives/${live.id}`}
                  className={`block ${color.hover}`}
                >
                  <div className="mx-auto flex max-w-5xl items-baseline gap-4 px-4 py-4">
                    <span className="w-28 shrink-0 text-sm text-zinc-500">
                      {live.date}
                    </span>
                    <span className="font-medium">{live.title}</span>
                    <span className="ml-auto shrink-0 text-sm text-zinc-400">
                      {live.venue}
                    </span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
        {lives.length === 0 && (
          <p className="mx-auto max-w-5xl px-4 text-zinc-400">
            ライブ情報がありません
          </p>
        )}
      </main>
      <Footer />
    </>
  );
}
