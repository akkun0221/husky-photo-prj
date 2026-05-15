"use server";

import { revalidatePath } from "next/cache";
import { createLive, updateLive, deleteLive } from "@/entities/live/api";
import { createAdminClient } from "@/shared/lib/supabase/admin";
import {
  getKeyFromUrl,
  deleteR2Object,
  logR2DeletionFailure,
} from "@/shared/lib/r2";
import type { CreateLiveInput, UpdateLiveInput } from "@/entities/live/types";

export async function createLiveAction(input: CreateLiveInput) {
  await createLive(input);
  revalidatePath("/lives");
  revalidatePath("/");
}

export async function updateLiveAction(id: string, input: UpdateLiveInput) {
  await updateLive(id, input);
  revalidatePath("/lives");
  revalidatePath(`/lives/${id}`);
  revalidatePath("/");
}

export async function deleteLiveAction(id: string) {
  const supabase = createAdminClient();

  const { data: photos, error: photosError } = await supabase
    .from("photos")
    .select("id, r2_url, member_id")
    .eq("live_id", id);

  if (photosError) throw new Error(photosError.message);

  // ライブを先に論理削除する（失敗時はphotos削除もしない → 一貫した状態を保つ）
  await deleteLive(id);

  // photos を物理削除（論理削除では ON DELETE CASCADE が発動しないため明示的に）
  if (photos && photos.length > 0) {
    const photoIds = photos.map((p) => p.id);
    const { error: deletePhotosError } = await supabase
      .from("photos")
      .delete()
      .in("id", photoIds);
    if (deletePhotosError) throw new Error(deletePhotosError.message);
  }

  if (photos && photos.length > 0) {
    const membersMap = new Map<string, string>();
    const memberIds = [...new Set(photos.map((p) => p.member_id))];
    if (memberIds.length > 0) {
      const { data: members } = await supabase
        .from("members")
        .select("id, name")
        .in("id", memberIds);

      if (members) {
        members.forEach((m) => membersMap.set(m.id, m.name));
      }
    }

    for (const photo of photos) {
      try {
        await deleteR2Object(getKeyFromUrl(photo.r2_url));
      } catch {
        const memberName = membersMap.get(photo.member_id) ?? "不明";
        await logR2DeletionFailure(photo.id, id, memberName, photo.r2_url);
      }
    }
  }

  revalidatePath("/lives");
  revalidatePath("/");
}

export async function importLivesAction(csv: string): Promise<void> {
  const lines = csv
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  // 先頭が年（数字4桁）で始まらない場合はヘッダー行としてスキップ
  const dataLines = /^\d{4}/.test(lines[0] ?? "") ? lines : lines.slice(1);

  const inputs = dataLines.flatMap((line) => {
    const [date, title, venue] = line.split(",").map((s) => s.trim());
    if (!date || !title || !venue) return [];
    return [
      { date, title, venue, description: null, thumbnail_photo_id: null },
    ];
  });

  if (inputs.length === 0) return;

  const supabase = createAdminClient();
  const { error } = await supabase.from("lives").insert(inputs);
  if (error) throw new Error(error.message);

  revalidatePath("/admin");
  revalidatePath("/lives");
  revalidatePath("/");
}
