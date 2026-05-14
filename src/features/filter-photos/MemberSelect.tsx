"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import type { Member } from "@/entities/member/types";

type Props = {
  members: Member[];
  allMember: Member; // 「全体」メンバーのレコード
};

const ALL_VALUE = "all";

export function MemberSelect({ members, allMember }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const current = searchParams.get("member") ?? ALL_VALUE;

  function handleChange(value: string | null) {
    if (value === null) return;
    const params = new URLSearchParams(searchParams.toString());
    if (value === ALL_VALUE) {
      params.delete("member");
    } else {
      params.set("member", value);
    }
    router.push(`${pathname}?${params.toString()}`);
  }

  // 「全体」を除いた個人メンバー + 「全体」の順で並べる
  const individualMembers = members.filter((m) => m.id !== allMember.id);

  return (
    <Select value={current} onValueChange={handleChange}>
      <SelectTrigger className="w-40">
        <SelectValue placeholder="全て" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={ALL_VALUE}>全て</SelectItem>
        {individualMembers.map((m) => (
          <SelectItem key={m.id} value={m.id}>
            {m.name}
          </SelectItem>
        ))}
        <SelectItem value={allMember.id}>全体</SelectItem>
      </SelectContent>
    </Select>
  );
}
