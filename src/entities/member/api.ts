import { createClient } from "@/shared/lib/supabase/server";
import type { Member } from "./types";

export async function getMembers(): Promise<Member[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("members")
    .select("*")
    .order("name");

  if (error) throw new Error(error.message);
  return data;
}
