"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import type { Member } from "@/entities/member/types";

type Props = {
  members: Member[];
};

const ALL_VALUE = "all";

export function MemorialMemberFilter({ members }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const current = searchParams.get("member") ?? ALL_VALUE;

  const sorted = [...members].sort((a, b) => {
    if (a.name === "全体") return 1;
    if (b.name === "全体") return -1;
    return 0;
  });

  function handleSelect(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === ALL_VALUE) {
      params.delete("member");
    } else {
      params.set("member", value);
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }

  return (
    <div
      className="flex items-center gap-2 overflow-x-auto pb-1"
      style={{ scrollbarWidth: "none" }}
    >
      <button
        type="button"
        onClick={() => handleSelect(ALL_VALUE)}
        className="flex flex-shrink-0 items-center px-3 py-2.5 font-mono text-[11px] tracking-[0.2em] uppercase transition-opacity hover:opacity-70"
        style={{
          border: "1px solid",
          borderColor:
            current === ALL_VALUE
              ? "var(--memorial-accent)"
              : "var(--memorial-rule)",
          background:
            current === ALL_VALUE ? "var(--memorial-accent)" : "transparent",
          color: current === ALL_VALUE ? "#fff" : "var(--memorial-fg)",
          cursor: "pointer",
          fontFamily: "inherit",
          touchAction: "manipulation",
        }}
      >
        全て
      </button>

      {sorted.map((m) => (
        <button
          key={m.id}
          type="button"
          onClick={() => handleSelect(m.id)}
          className="flex flex-shrink-0 items-center gap-1.5 py-2.5 pr-3 pl-2 font-mono text-[11px] tracking-[0.2em] transition-opacity hover:opacity-70"
          style={{
            border: "1px solid",
            borderColor:
              current === m.id
                ? "var(--memorial-accent)"
                : "var(--memorial-rule)",
            background:
              current === m.id ? "var(--memorial-surface)" : "transparent",
            color:
              current === m.id ? "var(--memorial-fg)" : "var(--memorial-sub)",
            cursor: "pointer",
            fontFamily: "inherit",
            touchAction: "manipulation",
          }}
        >
          <span
            className="h-3 w-3 flex-shrink-0"
            style={{ background: m.color }}
          />
          {m.name}
        </button>
      ))}
    </div>
  );
}
