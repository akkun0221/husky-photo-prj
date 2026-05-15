"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/shared/lib/supabase/admin";
import {
  getKeyFromUrl,
  deleteR2Object,
  logR2DeletionFailure,
} from "@/shared/lib/r2";

export async function deletePhotosAction(
  ids: string[],
  liveId: string,
): Promise<void> {
  if (ids.length === 0) return;
  const supabase = createAdminClient();

  const { data: photos, error: fetchError } = await supabase
    .from("photos")
    .select("id, r2_url, member_id")
    .in("id", ids);

  if (fetchError) throw new Error(fetchError.message);

  const { error: deleteError } = await supabase
    .from("photos")
    .delete()
    .in("id", ids);
  if (deleteError) throw new Error(deleteError.message);

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
        await logR2DeletionFailure(photo.id, liveId, memberName, photo.r2_url);
      }
    }
  }

  revalidatePath(`/admin/lives/${liveId}/photos`);
  revalidatePath(`/lives/${liveId}`);
}

export async function updatePhotosMemberAction(
  ids: string[],
  memberId: string,
  liveId: string,
): Promise<void> {
  if (ids.length === 0) return;
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("photos")
    .update({ member_id: memberId })
    .in("id", ids);
  if (error) throw new Error(error.message);
  revalidatePath(`/admin/lives/${liveId}/photos`);
  revalidatePath(`/lives/${liveId}`);
}
