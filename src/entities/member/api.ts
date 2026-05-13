import { createAdminClient } from "@/shared/lib/supabase/admin";
import type { Member } from "./types";

export async function getMembers(): Promise<Member[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("members")
    .select("*")
    .order("name");

  if (error) throw new Error(error.message);
  return data;
}
