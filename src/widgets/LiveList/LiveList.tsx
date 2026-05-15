"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";
import { Button, buttonVariants } from "@/shared/ui/button";
import type { LiveWithPhotoFlag } from "@/entities/live/types";
import { LiveFormDialog } from "@/features/live/LiveFormDialog";
import { DeleteLiveButton } from "@/features/live/DeleteLiveButton";
import { ImportLivesDialog } from "@/features/live/ImportLivesDialog";

type Props = {
  initialLives: LiveWithPhotoFlag[];
};

const INITIAL_DISPLAY = 10;

export function LiveList({ initialLives }: Props) {
  const [importOpen, setImportOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const displayedLives = expanded
    ? initialLives
    : initialLives.slice(0, INITIAL_DISPLAY);
  const hasMore = initialLives.length > INITIAL_DISPLAY;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">ライブ一覧</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setImportOpen(true)}>
            一括インポート
          </Button>
          <LiveFormDialog trigger={<Button>新規追加</Button>} />
        </div>
      </div>
      <ImportLivesDialog open={importOpen} onOpenChange={setImportOpen} />
      <Table className="table-fixed">
        <TableHeader>
          <TableRow>
            <TableHead className="w-28">日付</TableHead>
            <TableHead className="w-1/4">会場</TableHead>
            <TableHead>タイトル</TableHead>
            <TableHead className="w-44 text-right">操作</TableHead>
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
            displayedLives.map((live) => (
              <TableRow key={live.id}>
                <TableCell className="overflow-hidden">{live.date}</TableCell>
                <TableCell className="overflow-hidden">{live.venue}</TableCell>
                <TableCell className="overflow-hidden">{live.title}</TableCell>
                <TableCell className="space-x-2 text-right">
                  {live.hasPhotos && (
                    <Link
                      href={`/admin/lives/${live.id}/photos`}
                      className={buttonVariants({
                        variant: "outline",
                        size: "sm",
                      })}
                    >
                      写真
                    </Link>
                  )}
                  <LiveFormDialog
                    live={live}
                    trigger={
                      <Button variant="outline" size="sm">
                        編集
                      </Button>
                    }
                  />
                  <DeleteLiveButton
                    liveId={live.id}
                    liveTitle={live.title}
                    hasPhotos={live.hasPhotos}
                  />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      {hasMore && !expanded && (
        <div className="flex justify-center">
          <Button variant="outline" onClick={() => setExpanded(true)}>
            もっと見る
          </Button>
        </div>
      )}
    </div>
  );
}
