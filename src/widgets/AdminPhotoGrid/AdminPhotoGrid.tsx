"use client";

import { useState, useTransition } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/shared/ui/select";
import type { Photo } from "@/entities/photo/types";
import type { Member } from "@/entities/member/types";
import {
  deletePhotosAction,
  updatePhotosMemberAction,
} from "@/features/photo/actions";

type Props = {
  photos: Photo[];
  members: Member[];
  liveId: string;
};

export function AdminPhotoGrid({ photos, members, liveId }: Props) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [targetMemberId, setTargetMemberId] = useState<string>("");
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleUpdate = () => {
    if (selected.size === 0 || !targetMemberId) return;
    startTransition(async () => {
      await updatePhotosMemberAction([...selected], targetMemberId, liveId);
      setSelected(new Set());
    });
  };

  const handleDelete = () => {
    if (selected.size === 0) return;
    startTransition(async () => {
      await deletePhotosAction([...selected], liveId);
      setSelected(new Set());
      setDeleteOpen(false);
    });
  };

  if (photos.length === 0) {
    return (
      <p className="py-16 text-center text-sm text-zinc-400">
        写真がありません
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {isPending && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <p className="text-lg font-medium text-white">処理中...</p>
        </div>
      )}
      <div className="flex items-center justify-end gap-2">
        <Select
          value={targetMemberId}
          onValueChange={(v) => setTargetMemberId(v ?? "")}
        >
          <SelectTrigger className="w-36">
            <span
              data-slot="select-value"
              className="flex flex-1 text-left text-sm"
            >
              {targetMemberId ? (
                members.find((m) => m.id === targetMemberId)?.name
              ) : (
                <span className="text-muted-foreground">メンバー選択</span>
              )}
            </span>
          </SelectTrigger>
          <SelectContent>
            {members.map((m) => (
              <SelectItem key={m.id} value={m.id}>
                {m.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          variant="outline"
          disabled={selected.size === 0 || !targetMemberId || isPending}
          onClick={handleUpdate}
        >
          更新
        </Button>
        <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
          <AlertDialogTrigger
            render={
              <Button
                variant="destructive"
                disabled={selected.size === 0 || isPending}
              >
                削除
              </Button>
            }
          />
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>写真を削除しますか？</AlertDialogTitle>
              <AlertDialogDescription>
                <strong className="text-destructive">
                  DBから物理削除になるのでこの操作は戻せません。
                </strong>
                <br />
                {selected.size}枚の写真を削除します。
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
      </div>
      <div className="grid grid-cols-3 gap-1 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
        {photos.map((photo) => {
          const isSelected = selected.has(photo.id);
          return (
            <div
              key={photo.id}
              className="relative cursor-pointer"
              onClick={() => toggle(photo.id)}
            >
              <img
                src={photo.r2_url}
                alt=""
                className={`aspect-square w-full object-cover transition-opacity ${
                  isSelected ? "opacity-60" : ""
                }`}
                loading="lazy"
              />
              <div className="absolute top-1 right-1">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => toggle(photo.id)}
                  onClick={(e) => e.stopPropagation()}
                  className="h-4 w-4 cursor-pointer accent-zinc-700"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
