import { createClient } from "@/shared/lib/supabase/server";
import type { Member, MemberWithPhotoCount } from "./types";

export async function getMembers(): Promise<Member[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("members")
    .select("*")
    .order("name");

  if (error) throw new Error(error.message);
  return data;
}

export async function getMembersWithPhotoCount(): Promise<
  MemberWithPhotoCount[]
> {
  const supabase = createClient();
  const [
    { data: members, error: membersError },
    { data: photos, error: photosError },
  ] = await Promise.all([
    supabase.from("members").select("*").order("name"),
    supabase.from("photos").select("member_id").limit(10000),
  ]);
  if (membersError) throw new Error(membersError.message);
  if (photosError) throw new Error(photosError.message);

  const countByMember = new Map<string, number>();
  for (const p of photos ?? []) {
    countByMember.set(p.member_id, (countByMember.get(p.member_id) ?? 0) + 1);
  }

  return (members ?? [])
    .map((m) => ({ ...m, photoCount: countByMember.get(m.id) ?? 0 }))
    .sort((a, b) => {
      // 「全体」は常に末尾
      if (a.name === "全体") return 1;
      if (b.name === "全体") return -1;
      return 0;
    });
}
