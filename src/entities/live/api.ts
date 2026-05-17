import { createClient } from "@/shared/lib/supabase/server";
import { createAdminClient } from "@/shared/lib/supabase/admin";
import type {
  Live,
  LiveWithPhotoFlag,
  LiveWithPhotoCount,
  CreateLiveInput,
  UpdateLiveInput,
} from "./types";

const WEEKDAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"] as const;

function calcWeekday(dateStr: string): string {
  const [y, m, d] = dateStr.split(".").map(Number);
  return WEEKDAYS[new Date(y, m - 1, d).getDay()];
}

export async function getLives(): Promise<Live[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("lives")
    .select("*")
    .is("deleted_at", null)
    .order("date", { ascending: false });

  if (error) throw new Error(error.message);
  return data;
}

export async function getLivesWithPhotoFlag(): Promise<LiveWithPhotoFlag[]> {
  const supabase = createClient();
  const [
    { data: lives, error: livesError },
    { data: photos, error: photosError },
  ] = await Promise.all([
    supabase
      .from("lives")
      .select("*")
      .is("deleted_at", null)
      .order("date", { ascending: false }),
    supabase.from("photos").select("live_id").limit(10000),
  ]);
  if (livesError) throw new Error(livesError.message);
  if (photosError) throw new Error(photosError.message);
  const liveIdsWithPhotos = new Set(photos?.map((p) => p.live_id) ?? []);
  return (lives ?? []).map((live) => ({
    ...live,
    hasPhotos: liveIdsWithPhotos.has(live.id),
  }));
}

export async function getLivesWithPhotoCount(): Promise<LiveWithPhotoCount[]> {
  const supabase = createClient();
  const [
    { data: lives, error: livesError },
    { data: photos, error: photosError },
  ] = await Promise.all([
    supabase
      .from("lives")
      .select("*")
      .is("deleted_at", null)
      .order("date", { ascending: false }),
    supabase.from("photos").select("id, live_id, r2_url").limit(10000),
  ]);
  if (livesError) throw new Error(livesError.message);
  if (photosError) throw new Error(photosError.message);

  const SLIDESHOW_PER_LIVE = 5;
  const countByLive = new Map<string, number>();
  const urlById = new Map<string, string>();
  const urlsByLive = new Map<string, string[]>();
  for (const p of photos ?? []) {
    countByLive.set(p.live_id, (countByLive.get(p.live_id) ?? 0) + 1);
    urlById.set(p.id, p.r2_url);
    const arr = urlsByLive.get(p.live_id) ?? [];
    if (arr.length < SLIDESHOW_PER_LIVE) {
      arr.push(p.r2_url);
      urlsByLive.set(p.live_id, arr);
    }
  }

  return (lives ?? []).map((live) => {
    const count = countByLive.get(live.id) ?? 0;
    return {
      ...live,
      hasPhotos: count > 0,
      photoCount: count,
      weekday: calcWeekday(live.date),
      thumbnailUrl: live.thumbnail_photo_id
        ? (urlById.get(live.thumbnail_photo_id) ?? null)
        : null,
      photoUrls: urlsByLive.get(live.id) ?? [],
    };
  });
}

export async function getLivesAdmin(): Promise<LiveWithPhotoFlag[]> {
  const supabase = createAdminClient();
  const [
    { data: lives, error: livesError },
    { data: photos, error: photosError },
  ] = await Promise.all([
    supabase
      .from("lives")
      .select("*")
      .is("deleted_at", null)
      .order("date", { ascending: false }),
    supabase.from("photos").select("live_id").limit(10000),
  ]);
  if (livesError) throw new Error(livesError.message);
  if (photosError) throw new Error(photosError.message);
  const liveIdsWithPhotos = new Set(photos?.map((p) => p.live_id) ?? []);
  return (lives ?? []).map((live) => ({
    ...live,
    hasPhotos: liveIdsWithPhotos.has(live.id),
  }));
}

export async function getLiveById(id: string): Promise<Live> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("lives")
    .select("*")
    .eq("id", id)
    .is("deleted_at", null)
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function createLive(input: CreateLiveInput): Promise<Live> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("lives")
    .insert(input)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function updateLive(
  id: string,
  input: UpdateLiveInput,
): Promise<Live> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("lives")
    .update(input)
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function deleteLive(id: string): Promise<void> {
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("lives")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id);

  if (error) throw new Error(error.message);
}

export async function getR2DeletionFailures(): Promise<
  Array<{
    id: string;
    live_id: string | null;
    photo_id: string | null;
    member_name: string;
    r2_url: string;
    failed_at: string;
  }>
> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("r2_deletion_failures")
    .select("*")
    .order("failed_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data ?? [];
}
