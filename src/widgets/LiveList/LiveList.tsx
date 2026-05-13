"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";
import { Button } from "@/shared/ui/button";
import type { Live } from "@/entities/live/types";
import { LiveFormDialog } from "@/features/live/LiveFormDialog";
import { DeleteLiveButton } from "@/features/live/DeleteLiveButton";

type Props = {
  initialLives: Live[];
};

export function LiveList({ initialLives }: Props) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">ライブ一覧</h2>
        <LiveFormDialog trigger={<Button>新規追加</Button>} />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>日付</TableHead>
            <TableHead>会場</TableHead>
            <TableHead>タイトル</TableHead>
            <TableHead className="text-right">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {initialLives.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={4}
                className="text-muted-foreground text-center"
              >
                ライブ情報がありません
              </TableCell>
            </TableRow>
          ) : (
            initialLives.map((live) => (
              <TableRow key={live.id}>
                <TableCell>{live.date}</TableCell>
                <TableCell>{live.venue}</TableCell>
                <TableCell>{live.title}</TableCell>
                <TableCell className="space-x-2 text-right">
                  <LiveFormDialog
                    live={live}
                    trigger={
                      <Button variant="outline" size="sm">
                        編集
                      </Button>
                    }
                  />
                  <DeleteLiveButton liveId={live.id} liveTitle={live.title} />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
