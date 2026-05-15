"use client";

import { useTransition } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/shared/ui/alert-dialog";
import { Button } from "@/shared/ui/button";
import { deleteLiveAction } from "./actions";

type Props = {
  liveId: string;
  liveTitle: string;
  hasPhotos: boolean;
};

export function DeleteLiveButton({ liveId, liveTitle, hasPhotos }: Props) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      await deleteLiveAction(liveId);
    });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger
        render={
          <Button variant="destructive" size="sm" disabled={isPending}>
            削除
          </Button>
        }
      />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>ライブを削除しますか？</AlertDialogTitle>
          <AlertDialogDescription>
            {hasPhotos ? (
              <>
                <strong className="text-destructive">
                  写真が紐づいています。写真も同時に削除しますがよろしいでしょうか？
                </strong>
                <br />
              </>
            ) : null}
            「{liveTitle}」を削除します。この操作は取り消せません。
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>キャンセル</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={isPending}>
            削除する
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
