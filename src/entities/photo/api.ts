import { createClient } from "@/shared/lib/supabase/server";
import { createAdminClient } from "@/shared/lib/supabase/admin";
import type { Photo, CreatePhotoInput, PhotoWithLiveDate } from "./types";
import type { Live } from "@/entities/live/types";

export type PhotosGroupedByLive = { live: Live; photos: Photo[] };

export async function getPhotosByLiveId(liveId: string): Promise<Photo[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("photos")
    .select("*")
    .eq("live_id", liveId);

  if (error) throw new Error(error.message);
  return data;
}

// memberId が null のとき全写真、指定時は絞り込み
export async function getPhotosByLiveAndMember(
  liveId: string,
  memberId: string | null,
  { limit, page }: { limit: number; page: number },
): Promise<Photo[]> {
  const supabase = createClient();
  let query = supabase
    .from("photos")
    .select("*")
    .eq("live_id", liveId)
    .range(page * limit, (page + 1) * limit - 1);

  if (memberId !== null) {
    query = query.eq("member_id", memberId);
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data;
}

export async function getPhotosByMemberId(
  memberId: string,
  { limit, offset }: { limit: number; offset: number },
): Promise<PhotoWithLiveDate[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("photos")
    .select("*, lives(date)")
    .eq("member_id", memberId)
    .order("date", { ascending: false, referencedTable: "lives" })
    .range(offset, offset + limit - 1);

  if (error) throw new Error(error.message);
  return data;
}

export async function createPhoto(input: CreatePhotoInput): Promise<Photo> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("photos")
    .insert(input)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function deletePhoto(id: string): Promise<void> {
  const supabase = createAdminClient();
  const { error } = await supabase.from("photos").delete().eq("id", id);

  if (error) throw new Error(error.message);
}

// memberId null = 全メンバー、指定時はそのメンバーのみ
export async function getPhotosGroupedByLive(
  memberId: string | null,
): Promise<PhotosGroupedByLive[]> {
  const supabase = createClient();

  let photosQuery = supabase.from("photos").select("*");
  if (memberId !== null) {
    photosQuery = photosQuery.eq("member_id", memberId);
  }
  const { data: photos, error: photosError } = await photosQuery;
  if (photosError) throw new Error(photosError.message);
  if (!photos || photos.length === 0) return [];

  const liveIds = [...new Set(photos.map((p) => p.live_id))];
  const { data: lives, error: livesError } = await supabase
    .from("lives")
    .select("*")
    .in("id", liveIds)
    .order("date", { ascending: false });
  if (livesError) throw new Error(livesError.message);

  return (lives ?? []).map((live) => ({
    live,
    photos: photos.filter((p) => p.live_id === live.id),
  }));
}
