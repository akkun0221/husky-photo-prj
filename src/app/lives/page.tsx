export const revalidate = false;

import Link from "next/link";
import { getLives } from "@/entities/live/api";
import { Header } from "@/widgets/Header/Header";

const ROW_COLORS = [
  { base: "bg-yellow-50", hover: "hover:bg-yellow-100" },
  { base: "bg-emerald-50", hover: "hover:bg-emerald-100" },
  { base: "bg-blue-50", hover: "hover:bg-blue-100" },
  { base: "bg-purple-50", hover: "hover:bg-purple-100" },
  { base: "bg-white", hover: "hover:bg-zinc-50" },
] as const;

export default async function LivesPage() {
  const lives = await getLives();

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
    </>
  );
}
