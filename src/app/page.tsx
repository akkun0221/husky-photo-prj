export const revalidate = false;

import { getLives } from "@/entities/live/api";
import { Header } from "@/widgets/Header/Header";
import { LiveCalendar } from "@/widgets/LiveCalendar/LiveCalendar";

export default async function HomePage() {
  const lives = await getLives();

  return (
    <>
      <Header />
      <main className="space-y-12 py-8">
        {/* ダイジェストMV */}
        <section>
          <div className="mx-auto mb-3 max-w-5xl px-4">
            <p className="text-xs text-zinc-400">2026.04.27 BIGCAT</p>
            <h2 className="text-lg font-semibold">
              husky 解散ワンマンライブ　ダイジェストMV
            </h2>
            <p className="text-sm text-zinc-400">最後の新曲　『ECHO』</p>
          </div>
          <div className="mx-auto max-w-5xl px-4">
            <div className="relative aspect-video">
              <iframe
                src="https://www.youtube.com/embed/08JiOyg4moY"
                title="husky 解散ワンマンライブ ダイジェストMV 最後の新曲 ECHO"
                className="absolute inset-0 h-full w-full rounded-lg"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </section>

        {/* カレンダー */}
        <section className="mx-auto max-w-5xl px-4">
          <h2 className="mb-3 text-lg font-semibold">ライブカレンダー</h2>
          <LiveCalendar lives={lives} />
        </section>
      </main>
    </>
  );
}
