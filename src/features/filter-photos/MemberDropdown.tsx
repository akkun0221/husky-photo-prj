"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { SlidersHorizontal, Check } from "lucide-react";
import { Button } from "@/shared/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import type { Member } from "@/entities/member/types";

type Props = {
  members: Member[];
};

const ALL_VALUE = "all";

export function MemberDropdown({ members }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const current = searchParams.get("member") ?? ALL_VALUE;

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
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="outline"
            className="h-11 gap-2 px-4 text-base md:h-8 md:px-2.5 md:text-sm"
          >
            <SlidersHorizontal className="h-4 w-4" />
            {currentLabel}
          </Button>
        }
      />
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          className="px-3 py-3 text-base md:px-1.5 md:py-1 md:text-sm"
          onClick={() => handleSelect(ALL_VALUE)}
        >
          <span className="flex-1">全て</span>
          {current === ALL_VALUE && <Check className="h-4 w-4" />}
        </DropdownMenuItem>
        {members.map((m) => (
          <DropdownMenuItem
            key={m.id}
            className="px-3 py-3 text-base md:px-1.5 md:py-1 md:text-sm"
            onClick={() => handleSelect(m.id)}
          >
            <span className="flex-1">{m.name}</span>
            {current === m.id && <Check className="h-4 w-4" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
