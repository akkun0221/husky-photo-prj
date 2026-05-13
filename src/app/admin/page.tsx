export const dynamic = "force-dynamic";

import { getLives } from "@/entities/live/api";
import { LiveList } from "@/widgets/LiveList/LiveList";
import { Button } from "@/shared/ui/button";
import { signOutAction } from "@/features/auth/actions";

export default async function AdminPage() {
  const lives = await getLives();

  return (
    <main className="container mx-auto space-y-6 p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">管理ダッシュボード</h1>
        <form action={signOutAction}>
          <Button variant="outline" type="submit">
            ログアウト
          </Button>
        </form>
      </div>
      <LiveList initialLives={lives} />
    </main>
  );
}
