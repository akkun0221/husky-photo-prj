import { createClient } from "@/shared/lib/supabase/server";
import type { Photo, CreatePhotoInput } from "./types";

export async function getPhotosByLiveId(liveId: string): Promise<Photo[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("photos")
    .select("*")
    .eq("live_id", liveId);

  if (error) throw new Error(error.message);
  return data;
}

export async function getPhotosByMemberId(
  memberId: string,
  { limit, offset }: { limit: number; offset: number }
): Promise<Photo[]> {
  const supabase = await createClient();
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
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("photos")
    .insert(input)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function deletePhoto(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("photos").delete().eq("id", id);

  if (error) throw new Error(error.message);
}
