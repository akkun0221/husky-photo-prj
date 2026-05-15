export const dynamic = "force-dynamic";

import Link from "next/link";
import { getLivesAdmin, getR2DeletionFailures } from "@/entities/live/api";
import { LiveList } from "@/widgets/LiveList/LiveList";
import { Button, buttonVariants } from "@/shared/ui/button";
import { signOutAction } from "@/features/auth/actions";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";

export default async function AdminPage() {
  const [lives, failures] = await Promise.all([
    getLivesAdmin(),
    getR2DeletionFailures(),
  ]);

  return (
    <main className="container mx-auto space-y-6 p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">管理ダッシュボード</h1>
        <div className="flex items-center gap-2">
          <Link href="/admin/upload" className={buttonVariants()}>
            写真をアップロード
          </Link>
          <form action={signOutAction}>
            <Button variant="outline" type="submit">
              ログアウト
            </Button>
          </form>
        </div>
      </div>
      <LiveList initialLives={lives} />
      {failures.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">削除失敗ログ</h2>
          <Table className="table-fixed">
            <TableHeader>
              <TableRow>
                <TableHead className="w-32">写真ID</TableHead>
                <TableHead className="w-32">ライブID</TableHead>
                <TableHead className="w-28">メンバー名</TableHead>
                <TableHead>R2 URL</TableHead>
                <TableHead className="w-36">削除失敗日時</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {failures.map((failure) => (
                <TableRow key={failure.id}>
                  <TableCell className="truncate overflow-hidden text-xs">
                    {failure.photo_id ?? "-"}
                  </TableCell>
                  <TableCell className="truncate overflow-hidden text-xs">
                    {failure.live_id ?? "-"}
                  </TableCell>
                  <TableCell className="overflow-hidden">
                    {failure.member_name}
                  </TableCell>
                  <TableCell className="truncate overflow-hidden text-xs text-blue-600">
                    {failure.r2_url}
                  </TableCell>
                  <TableCell className="text-xs">
                    {new Date(failure.failed_at).toLocaleString("ja-JP")}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </main>
  );
}
