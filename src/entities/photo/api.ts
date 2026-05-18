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
    .select("*, lives!inner(date)")
    .eq("member_id", memberId)
    .is("lives.deleted_at", null)
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

const LIVE_GROUP_LIMIT = 5;

// useInfiniteQuery 用：ライブ単位でページネーション
export async function getPhotosGroupedByLivePaginated(
  memberId: string | null,
  page: number,
): Promise<{ groups: PhotosGroupedByLive[]; hasMore: boolean }> {
  const supabase = createClient();

  // 1. このメンバーの写真が存在するライブIDを全取得
  let photoIdsQuery = supabase.from("photos").select("live_id");
  if (memberId !== null)
    photoIdsQuery = photoIdsQuery.eq("member_id", memberId);
  const { data: photoSnap, error: e1 } = await photoIdsQuery;
  if (e1) throw new Error(e1.message);

  const allLiveIds = [...new Set((photoSnap ?? []).map((p) => p.live_id))];
  if (allLiveIds.length === 0) return { groups: [], hasMore: false };

  // 2. そのライブIDを日付降順でページネーション
  const { data: lives, error: e2 } = await supabase
    .from("lives")
    .select("*")
    .in("id", allLiveIds)
    .is("deleted_at", null)
    .order("date", { ascending: false })
    .range(page * LIVE_GROUP_LIMIT, (page + 1) * LIVE_GROUP_LIMIT - 1);
  if (e2) throw new Error(e2.message);
  if (!lives || lives.length === 0) return { groups: [], hasMore: false };

  // 3. このページのライブに属する写真を取得
  const pageLiveIds = lives.map((l) => l.id);
  let photosQuery = supabase
    .from("photos")
    .select("*")
    .in("live_id", pageLiveIds);
  if (memberId !== null) photosQuery = photosQuery.eq("member_id", memberId);
  const { data: photos, error: e3 } = await photosQuery;
  if (e3) throw new Error(e3.message);

  return {
    groups: lives.map((live) => ({
      live,
      photos: (photos ?? []).filter((p) => p.live_id === live.id),
    })),
    hasMore: (page + 1) * LIVE_GROUP_LIMIT < allLiveIds.length,
  };
}

// memberId null = 全メンバー、指定時はそのメンバーのみ
export async function getPhotosGroupedByLive(
  memberId: string | null,
): Promise<PhotosGroupedByLive[]> {
  const supabase = createClient();

  let photosQuery = supabase.from("photos").select("*").limit(10000);
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
    .is("deleted_at", null)
    .order("date", { ascending: false });
  if (livesError) throw new Error(livesError.message);

  return (lives ?? []).map((live) => ({
    live,
    photos: photos.filter((p) => p.live_id === live.id),
  }));
}
