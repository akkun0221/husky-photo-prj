"use client";

import { useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/shared/ui/select";
import type { Member } from "@/entities/member/types";

type Props = {
  members: Member[];
  allMember: Member;
};

const ALL_VALUE = "all";

export function MemberSelect({ members, allMember }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const current = searchParams.get("member") ?? ALL_VALUE;
  const [open, setOpen] = useState(false);

  const currentLabel =
    current === ALL_VALUE
      ? "全て"
      : (members.find((m) => m.id === current)?.name ?? "全て");

  function handleSelect(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === ALL_VALUE) {
      params.delete("member");
    } else {
      params.set("member", value);
    }
    router.push(`${pathname}?${params.toString()}`);
    setOpen(false);
  }

  const individualMembers = members.filter((m) => m.id !== allMember.id);

  // モバイル用リスト: 選択中なら × 付きで先頭に、残りを以下に並べる
  const mobileItems: { id: string; label: string; value: string }[] = [];
  if (current !== ALL_VALUE) {
    mobileItems.push({
      id: "__current__",
      label: `× ${currentLabel}`,
      value: ALL_VALUE,
    });
  }
  individualMembers.forEach((m) => {
    if (m.id !== current)
      mobileItems.push({ id: m.id, label: m.name, value: m.id });
  });
  if (allMember.id !== current) {
    mobileItems.push({
      id: allMember.id,
      label: allMember.name,
      value: allMember.id,
    });
  }

  return (
    <>
      {/* デスクトップ (md以上) */}
      <div className="hidden md:block">
        <Select
          value={current}
          onValueChange={(v) => handleSelect(v ?? ALL_VALUE)}
        >
          <SelectTrigger className="w-40">
            <span
              data-slot="select-value"
              className="flex flex-1 text-left text-sm"
            >
              {currentLabel}
            </span>
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
      </div>

      {/* モバイル (md未満) */}
      <div className="relative md:hidden">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-2 px-1 py-2 text-base"
        >
          <span className="text-xl leading-none">≡</span>
          <span>{currentLabel}</span>
        </button>
        {open && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setOpen(false)}
            />
            <div className="bg-background border-border absolute top-full right-0 z-50 mt-1 min-w-36 overflow-hidden rounded-lg border shadow-lg">
              {mobileItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className="hover:bg-muted block w-full px-5 py-4 text-left text-base"
                  onClick={() => handleSelect(item.value)}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}
