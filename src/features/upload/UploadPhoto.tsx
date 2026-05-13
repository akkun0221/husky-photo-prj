"use client";

import { useRef, useState, useCallback } from "react";
import { Button } from "@/shared/ui/button";
import { Label } from "@/shared/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/shared/ui/select";
import type { Live } from "@/entities/live/types";
import type { Member } from "@/entities/member/types";
import { compressImage } from "./compressImage";
import { createPhotoAction } from "./actions";

type UploadFile = {
  id: string;
  file: File;
  preview: string;
  memberId: string;
  status: "pending" | "uploading" | "done" | "error";
  errorMessage?: string;
};

type Props = {
  lives: Live[];
  members: Member[];
};

export function UploadPhoto({ lives, members }: Props) {
  const [liveId, setLiveId] = useState("");
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const selectedLive = lives.find((l) => l.id === liveId);

  const addFiles = useCallback((newFiles: File[]) => {
    const imageFiles = newFiles.filter((f) => f.type.startsWith("image/"));
    const uploadFiles: UploadFile[] = imageFiles.map((f) => ({
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      file: f,
      preview: URL.createObjectURL(f),
      memberId: "",
      status: "pending",
    }));
    setFiles((prev) => [...prev, ...uploadFiles]);
  }, []);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    addFiles(Array.from(e.dataTransfer.files));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    // ドロップゾーン内の子要素への移動では false にしない
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragging(false);
    }
  };

  const updateMemberId = (fileId: string, memberId: string) => {
    setFiles((prev) =>
      prev.map((f) => (f.id === fileId ? { ...f, memberId } : f)),
    );
  };

  const removeFile = (fileId: string) => {
    setFiles((prev) => {
      const target = prev.find((f) => f.id === fileId);
      if (target) URL.revokeObjectURL(target.preview);
      return prev.filter((f) => f.id !== fileId);
    });
  };

  const handleUpload = async () => {
    if (!liveId || files.length === 0) return;
    setIsUploading(true);

    for (const uploadFile of files) {
      if (uploadFile.status !== "pending") continue;

      setFiles((prev) =>
        prev.map((f) =>
          f.id === uploadFile.id ? { ...f, status: "uploading" } : f,
        ),
      );

      try {
        const blob = await compressImage(uploadFile.file);

        const key = `lives/${liveId}/${Date.now()}-${uploadFile.id}.webp`;
        const formData = new FormData();
        formData.append("file", blob);
        formData.append("key", key);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(
            (body as { error?: string }).error ?? "アップロード失敗",
          );
        }
        const { url } = (await res.json()) as { url: string };

        await createPhotoAction({
          live_id: liveId,
          member_id: uploadFile.memberId,
          r2_url: url,
          thumbnail_url: url,
        });

        setFiles((prev) =>
          prev.map((f) =>
            f.id === uploadFile.id ? { ...f, status: "done" } : f,
          ),
        );
      } catch (e) {
        setFiles((prev) =>
          prev.map((f) =>
            f.id === uploadFile.id
              ? {
                  ...f,
                  status: "error",
                  errorMessage:
                    e instanceof Error ? e.message : "エラーが発生しました",
                }
              : f,
          ),
        );
      }
    }

    setIsUploading(false);
  };

  const pendingCount = files.filter((f) => f.status === "pending").length;
  const doneCount = files.filter((f) => f.status === "done").length;
  const errorCount = files.filter((f) => f.status === "error").length;
  const canUpload = !isUploading && liveId !== "" && pendingCount > 0;

  return (
    <div className="space-y-6">
      {/* ライブ選択 */}
      <div className="space-y-2">
        <Label>アップロード先のライブ</Label>
        <Select value={liveId} onValueChange={(v) => setLiveId(v ?? "")}>
          <SelectTrigger className="w-72">
            <span
              className={`flex flex-1 text-left text-sm ${!selectedLive ? "text-muted-foreground" : ""}`}
            >
              {selectedLive
                ? `${selectedLive.date}　${selectedLive.title}`
                : "ライブを選択してください"}
            </span>
          </SelectTrigger>
          <SelectContent>
            {lives.map((live) => (
              <SelectItem key={live.id} value={live.id}>
                {live.date}　{live.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* ドロップゾーン */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
        className={`flex min-h-40 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors ${
          isDragging
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/30 hover:border-muted-foreground/60"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={(e) => addFiles(Array.from(e.target.files ?? []))}
        />
        <p className="text-muted-foreground text-sm">
          写真をここにドラッグ&ドロップ、またはクリックして選択
        </p>
        <p className="text-muted-foreground mt-1 text-xs">
          JPEG / PNG / HEIC など対応
        </p>
      </div>

      {/* 写真プレビューグリッド */}
      {files.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {files.map((f) => (
            <div key={f.id} className="relative space-y-1.5">
              {/* サムネイル */}
              <div className="bg-muted relative aspect-square overflow-hidden rounded-md">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={f.preview}
                  alt={f.file.name}
                  className="h-full w-full object-cover"
                />
                {/* ステータスオーバーレイ */}
                {f.status === "uploading" && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                    <span className="text-xs text-white">処理中...</span>
                  </div>
                )}
                {f.status === "done" && (
                  <div className="absolute inset-0 flex items-center justify-center bg-green-500/40">
                    <span className="text-xs font-bold text-white">完了</span>
                  </div>
                )}
                {f.status === "error" && (
                  <div className="absolute inset-0 flex items-center justify-center bg-red-500/40 p-1">
                    <span className="text-center text-xs text-white">
                      {f.errorMessage ?? "エラー"}
                    </span>
                  </div>
                )}
                {/* 削除ボタン */}
                {f.status === "pending" && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(f.id);
                    }}
                    className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"
                    aria-label="削除"
                  >
                    ×
                  </button>
                )}
              </div>

              {/* メンバー選択 */}
              <Select
                value={f.memberId}
                onValueChange={(v) => updateMemberId(f.id, v ?? "")}
              >
                <SelectTrigger
                  size="sm"
                  className="w-full text-xs"
                  disabled={f.status !== "pending"}
                >
                  <span
                    className={`flex flex-1 text-left ${!f.memberId ? "text-muted-foreground" : ""}`}
                  >
                    {f.memberId
                      ? members.find((m) => m.id === f.memberId)?.name
                      : "選択してください"}
                  </span>
                </SelectTrigger>
                <SelectContent
                  alignItemWithTrigger={false}
                  className="min-w-32"
                >
                  {members.map((m) => (
                    <SelectItem key={m.id} value={m.id}>
                      {m.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>
      )}

      {/* フッター：進捗 + アップロードボタン */}
      {files.length > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground text-sm">
            {doneCount > 0 && (
              <span className="text-green-600">{doneCount} 件完了　</span>
            )}
            {errorCount > 0 && (
              <span className="text-red-500">{errorCount} 件エラー　</span>
            )}
            {pendingCount > 0 && <span>{pendingCount} 件未処理</span>}
          </p>
          <Button onClick={handleUpload} disabled={!canUpload}>
            {isUploading ? "アップロード中..." : "アップロード開始"}
          </Button>
        </div>
      )}
    </div>
  );
}
