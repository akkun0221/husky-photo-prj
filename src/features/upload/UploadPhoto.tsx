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
import { compressImage, generateThumbnail } from "./compressImage";
import { createPhotoAction } from "./actions";

type UploadFile = {
  id: string;
  file: File;
  preview: string;
  memberId: string;
  status: "pending" | "uploading" | "done" | "error";
  errorMessage?: string;
  checked: boolean;
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
  const [memberError, setMemberError] = useState(false);
  const [bulkMemberId, setBulkMemberId] = useState("");
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
      checked: false,
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
    setMemberError(false);
    setFiles((prev) =>
      prev.map((f) => (f.id === fileId ? { ...f, memberId } : f)),
    );
  };

  const toggleCheck = (fileId: string) => {
    setFiles((prev) =>
      prev.map((f) => (f.id === fileId ? { ...f, checked: !f.checked } : f)),
    );
  };

  const applyBulkMember = () => {
    if (!bulkMemberId) return;
    setMemberError(false);
    setFiles((prev) =>
      prev.map((f) =>
        f.checked && f.status === "pending"
          ? { ...f, memberId: bulkMemberId, checked: false }
          : f,
      ),
    );
  };

  const removeFile = (fileId: string) => {
    setFiles((prev) => {
      const target = prev.find((f) => f.id === fileId);
      if (target) URL.revokeObjectURL(target.preview);
      return prev.filter((f) => f.id !== fileId);
    });
  };

  async function uploadToR2(blob: Blob, key: string): Promise<string> {
    const formData = new FormData();
    formData.append("file", blob);
    formData.append("key", key);
    const res = await fetch("/api/upload", { method: "POST", body: formData });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error((body as { error?: string }).error ?? "アップロード失敗");
    }
    const { url } = (await res.json()) as { url: string };
    return url;
  }

  const handleUpload = async () => {
    if (!liveId || files.length === 0) return;

    const unassigned = files.filter(
      (f) => f.status === "pending" && !f.memberId,
    );
    if (unassigned.length > 0) {
      setMemberError(true);
      return;
    }
    setMemberError(false);
    setIsUploading(true);

    for (const uploadFile of files) {
      if (uploadFile.status !== "pending") continue;

      setFiles((prev) =>
        prev.map((f) =>
          f.id === uploadFile.id ? { ...f, status: "uploading" } : f,
        ),
      );

      try {
        const base = `${Date.now()}-${uploadFile.id}`;
        const [{ blob, width, height }, thumbnailBlob] = await Promise.all([
          compressImage(uploadFile.file),
          generateThumbnail(uploadFile.file),
        ]);

        const [r2_url, thumbnail_url] = await Promise.all([
          uploadToR2(blob, `lives/${liveId}/${base}.webp`),
          uploadToR2(thumbnailBlob, `thumbnails/${liveId}/${base}.webp`),
        ]);

        await createPhotoAction({
          live_id: liveId,
          member_id: uploadFile.memberId,
          r2_url,
          thumbnail_url,
          width,
          height,
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

      {/* 一括メンバー設定 */}
      {files.some((f) => f.status === "pending") && (
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground text-sm">一括設定:</span>
          <Select
            value={bulkMemberId}
            onValueChange={(v) => setBulkMemberId(v ?? "")}
          >
            <SelectTrigger size="sm" className="w-36">
              <span
                className={`flex flex-1 text-left text-xs ${!bulkMemberId ? "text-muted-foreground" : ""}`}
              >
                {bulkMemberId
                  ? members.find((m) => m.id === bulkMemberId)?.name
                  : "メンバーを選択"}
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
            size="sm"
            onClick={applyBulkMember}
            disabled={
              !bulkMemberId ||
              !files.some((f) => f.checked && f.status === "pending")
            }
          >
            チェック済みに適用
          </Button>
        </div>
      )}

      {/* 写真プレビューグリッド */}
      {files.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {files.map((f) => (
            <div key={f.id} className="relative space-y-1.5">
              {/* サムネイル */}
              <div
                className={`bg-muted relative aspect-square overflow-hidden rounded-md ${
                  f.status === "pending" && !f.memberId
                    ? "ring-2 ring-red-400"
                    : ""
                }`}
              >
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
                {/* チェックボックス（左上） */}
                {f.status === "pending" && (
                  <input
                    type="checkbox"
                    checked={f.checked}
                    onChange={() => toggleCheck(f.id)}
                    onClick={(e) => e.stopPropagation()}
                    className="absolute top-1 left-1 h-4 w-4 cursor-pointer"
                  />
                )}
                {/* 削除ボタン（右上） */}
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

      {/* メンバー未設定エラー */}
      {memberError && (
        <p className="text-sm text-red-500">
          メンバーが設定されていない画像があります。全ての画像にメンバーを設定してください。
        </p>
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
