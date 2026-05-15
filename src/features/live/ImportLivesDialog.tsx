"use client";

import { useState, useRef, useTransition } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/button";
import { importLivesAction } from "./actions";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function ImportLivesDialog({ open, onOpenChange }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (f: File | null | undefined) => {
    if (f && (f.type === "text/csv" || f.name.endsWith(".csv"))) {
      setFile(f);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleImport = () => {
    if (!file) return;
    startTransition(async () => {
      const text = await file.text();
      await importLivesAction(text);
      onOpenChange(false);
      setFile(null);
    });
  };

  const handleClose = (next: boolean) => {
    if (isPending) return;
    onOpenChange(next);
    if (!next) setFile(null);
  };

  return (
    <>
      {isPending && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60">
          <p className="text-lg font-medium text-white">インポート中...</p>
        </div>
      )}
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>CSVインポート</DialogTitle>
          </DialogHeader>
          <div
            className={`flex h-40 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed text-sm transition-colors ${
              isDragging
                ? "border-zinc-400 bg-zinc-50"
                : "border-zinc-300 text-zinc-500"
            }`}
            onDrop={handleDrop}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onClick={() => inputRef.current?.click()}
          >
            {file ? (
              <span className="font-medium text-zinc-700">{file.name}</span>
            ) : (
              <span>CSVファイルをドロップまたはクリックして選択</span>
            )}
          </div>
          <input
            ref={inputRef}
            type="file"
            accept=".csv"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => handleClose(false)}
              disabled={isPending}
            >
              キャンセル
            </Button>
            <Button disabled={!file || isPending} onClick={handleImport}>
              インポート
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
