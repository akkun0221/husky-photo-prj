import { createClient } from "@/shared/lib/supabase/server";
import { createAdminClient } from "@/shared/lib/supabase/admin";
import type {
  Live,
  LiveSummary,
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

// マーキー用：全ライブの軽量メタデータ（SSGで全件取得）
export async function getLiveMarqueeItems(): Promise<LiveSummary[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("lives")
    .select("id, title, date, venue")
    .is("deleted_at", null)
    .order("date", { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
}

// 年タブ用：写真があるライブの年別公演数マップ（SSGで取得）
export async function getLiveYearCounts(): Promise<Record<string, number>> {
  const supabase = createClient();
  const [
    { data: lives, error: livesError },
    { data: photos, error: photosError },
  ] = await Promise.all([
    supabase.from("lives").select("id, date").is("deleted_at", null),
    supabase.from("photos").select("live_id"),
  ]);
  if (livesError) throw new Error(livesError.message);
  if (photosError) throw new Error(photosError.message);

  const liveIdsWithPhotos = new Set(photos?.map((p) => p.live_id) ?? []);
  const counts: Record<string, number> = {};
  for (const live of lives ?? []) {
    if (!liveIdsWithPhotos.has(live.id)) continue;
    const year = live.date.slice(0, 4);
    counts[year] = (counts[year] ?? 0) + 1;
  }
  return counts;
}

// タイムライン無限スクロール用：年単位フェッチ（APIルートとSSG兼用）
const FEED_SLIDESHOW_PER_LIVE = 5;

export async function getLivesFeedYear(
  year: string,
  dir: "forward" | "reverse" = "reverse",
): Promise<{ lives: LiveWithPhotoCount[]; year: string }> {
  const supabase = createAdminClient();
  const ascending = dir === "forward";

  // 全ライブ取得（最大400行 = 軽量）し、JS側で年フィルタリング
  // ※ "date" 列名が PostgreSQL 予約語と衝突するため LIKE を使わず JS でフィルタ
  const { data: allLivesData, error: livesError } = await supabase
    .from("lives")
    .select("*")
    .is("deleted_at", null)
    .order("date", { ascending });
  if (livesError) throw new Error(livesError.message);

  const lives = (allLivesData ?? []).filter((l) => l.date.startsWith(year));

  if (lives.length === 0) return { lives: [], year };

  // この年のライブの写真のみ取得（全件ではなく年内のみ = 大幅に軽量）
  const liveIds = lives.map((l) => l.id);
  const [{ data: photos, error: photosError }] = await Promise.all([
    supabase
      .from("photos")
      .select("id, live_id, r2_url")
      .in("live_id", liveIds),
  ]);
  if (photosError) throw new Error(photosError.message);

  const countByLive = new Map<string, number>();
  const urlById = new Map<string, string>();
  const urlsByLive = new Map<string, string[]>();
  for (const p of photos ?? []) {
    countByLive.set(p.live_id, (countByLive.get(p.live_id) ?? 0) + 1);
    urlById.set(p.id, p.r2_url);
    const arr = urlsByLive.get(p.live_id) ?? [];
    if (arr.length < FEED_SLIDESHOW_PER_LIVE) {
      arr.push(p.r2_url);
      urlsByLive.set(p.live_id, arr);
    }
  }

  return {
    lives: lives
      .filter((live) => (countByLive.get(live.id) ?? 0) > 0)
      .map((live) => ({
        ...live,
        hasPhotos: true,
        photoCount: countByLive.get(live.id) ?? 0,
        weekday: calcWeekday(live.date),
        thumbnailUrl: live.thumbnail_photo_id
          ? (urlById.get(live.thumbnail_photo_id) ?? null)
          : null,
        photoUrls: urlsByLive.get(live.id) ?? [],
      })),
    year,
  };
}

// ヒーロー統計用：写真の総枚数（COUNTクエリ = データ転送なし）
export async function getTotalPhotoCount(): Promise<number> {
  const supabase = createClient();
  const { count, error } = await supabase
    .from("photos")
    .select("id", { count: "exact", head: true });
  if (error) throw new Error(error.message);
  return count ?? 0;
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
