"use client";

import { useState, useTransition } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Textarea } from "@/shared/ui/textarea";
import type { Live } from "@/entities/live/types";
import { createLiveAction, updateLiveAction } from "./actions";

type Props = {
  live?: Live;
  trigger: React.ReactElement;
};

export function LiveFormDialog({ live, trigger }: Props) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const input = {
      date: formData.get("date") as string,
      venue: formData.get("venue") as string,
      title: formData.get("title") as string,
      description: (formData.get("description") as string) || null,
      thumbnail_photo_id: live?.thumbnail_photo_id ?? null,
    };

    startTransition(async () => {
      if (live) {
        await updateLiveAction(live.id, input);
      } else {
        await createLiveAction(input);
      }
      setOpen(false);
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={trigger} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{live ? "ライブ編集" : "ライブ追加"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="date">日付</Label>
            <Input
              id="date"
              name="date"
              type="date"
              defaultValue={live?.date}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="venue">会場</Label>
            <Input
              id="venue"
              name="venue"
              defaultValue={live?.venue}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="title">タイトル</Label>
            <Input
              id="title"
              name="title"
              defaultValue={live?.title}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">説明</Label>
            <Textarea
              id="description"
              name="description"
              defaultValue={live?.description ?? ""}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              キャンセル
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "保存中..." : "保存"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
