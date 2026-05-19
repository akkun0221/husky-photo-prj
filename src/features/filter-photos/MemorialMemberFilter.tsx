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
      style={{
        marginTop: 36,
        paddingBottom: 18,
        borderBottom: "1px solid var(--memorial-rule)",
        display: "flex",
        alignItems: "center",
        gap: 12,
        flexWrap: "wrap",
        scrollbarWidth: "none",
      }}
    >
      <div
        style={{
          fontFamily: "var(--type)",
          fontSize: 12,
          letterSpacing: "0.3em",
          textTransform: "uppercase",
          color: "var(--memorial-sub)",
          marginRight: 8,
        }}
      >
        filter
      </div>

      {/* 全て */}
      <button
        type="button"
        onClick={() => handleSelect(ALL_VALUE)}
        style={{
          position: "relative",
          padding: "8px 16px",
          background:
            current === ALL_VALUE
              ? "var(--memorial-accent)"
              : "rgba(240,227,200,0.06)",
          color: current === ALL_VALUE ? "#1a120a" : "var(--memorial-fg)",
          border:
            "1px solid " +
            (current === ALL_VALUE
              ? "var(--memorial-accent)"
              : "var(--memorial-rule)"),
          fontFamily: "var(--type)",
          fontSize: 13,
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          cursor: "pointer",
          transform: "rotate(-0.8deg)",
          touchAction: "manipulation",
        }}
      >
        全て
      </button>

      {sorted.map((m, i) => {
        const active = current === m.id;
        return (
          <button
            key={m.id}
            type="button"
            onClick={() => handleSelect(m.id)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "7px 14px 7px 8px",
              background: active ? "rgba(240,227,200,0.12)" : "transparent",
              color: active ? "var(--memorial-fg)" : "var(--memorial-sub)",
              border:
                "1px solid " + (active ? m.color : "var(--memorial-rule)"),
              fontFamily: "var(--type)",
              fontSize: 13,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              cursor: "pointer",
              transform: `rotate(${(i % 2 === 0 ? -1 : 1) * (0.6 + i * 0.2)}deg)`,
              boxShadow: active ? `0 4px 14px ${m.color}40` : "none",
              transition: "background .2s, color .2s, box-shadow .2s",
              touchAction: "manipulation",
            }}
          >
            <span
              style={{
                width: 16,
                height: 16,
                background: m.color,
                boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.4)",
                flexShrink: 0,
              }}
            />
            {m.name}
          </button>
        );
      })}
    </div>
  );
}
